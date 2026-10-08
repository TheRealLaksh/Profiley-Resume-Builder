import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Save, Share2 } from 'lucide-react';

// Components
import EditorPanel from './components/Editor/EditorPanel';
import PreviewPanel from './components/Preview/PreviewPanel';
import ResumeDocument from './components/Preview/ResumeDocument';
import MobileLayout from './components/Mobile/MobileLayout';
import SEOFooter from './components/SEO/SEOFooter';

// New Clean Components
import GlobalStyles from './components/UI/GlobalStyles';
import Toast from './components/UI/Toast';
import ShareModal from './components/Modals/ShareModal';
import ZoomToolbar from './components/Layout/ZoomToolbar';
import ReadOnlyToolbar from './components/Layout/ReadOnlyToolbar';

// Utilities & Data
import { downloadResumePdf, printResume } from './utils/pdfManager';
import {
  normalizeResume,
  loadLocalResume,
  saveLocalResume,
  saveLocalDesignOnly
} from './utils/resumeData';
import { saveResumeToDB, saveResumeWithSlug, fetchResumeFromDB, makeSlug } from './firebase';
import {
  initialData,
  initialConfig,
  initialSections,
  templates
} from './data/constants';

const MAX_HISTORY = 50;

// Appends a snapshot unless it is the current one. State is updated immutably,
// so comparing references is enough to know nothing changed.
const pushSnapshot = (history, snapshot) => {
  const last = history.stack[history.index];
  if (last && last.data === snapshot.data && last.config === snapshot.config && last.sectionOrder === snapshot.sectionOrder) {
    return history;
  }
  const stack = [...history.stack.slice(0, history.index + 1), snapshot].slice(-MAX_HISTORY);
  return { stack, index: stack.length - 1 };
};

const App = () => {
  // --- STATE MANAGEMENT ---
  const [data, setData] = useState(initialData);
  const [config, setConfig] = useState(initialConfig);
  const [sectionOrder, setSectionOrder] = useState(initialSections);
  const [activeTab, setActiveTab] = useState('sections');
  const [activeTemplate, setActiveTemplate] = useState('modern'); 
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const [darkMode, setDarkMode] = useState(true);
  const [pdfQuality, setPdfQuality] = useState('screen'); 
  const [history, setHistory] = useState({ stack: [], index: -1 });
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Sharing State
  const [showShareModal, setShowShareModal] = useState(false);
  const [customSlug, setCustomSlug] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [shareError, setShareError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Notification State
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const toastTimerRef = useRef(null);
  const storageWarnedRef = useRef(false);

  // Zoom & Fullscreen State
  const [zoom, setZoom] = useState(0.8);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const previewContainerRef = useRef(null);
  const fullScreenContainerRef = useRef(null);

  // --- NEW: Accurate Zoom Layout State ---
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const contentRef = useRef(null);

  const notify = useCallback((message, variant = 'success') => {
    clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, variant });
    toastTimerRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3500);
  }, []);

  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  // --- EFFECTS ---

  // 1. Initialization
  useEffect(() => {
    let cancelled = false;

    const startEditing = (resume) => {
      setData(resume.data);
      setConfig(resume.config);
      setSectionOrder(resume.sectionOrder);
      // The first snapshot is the loaded state, so even the very first edit can be undone.
      setHistory({ stack: [resume], index: 0 });
      setIsLoading(false);
    };

    const init = async () => {
      setIsLoading(true);
      const params = new URLSearchParams(window.location.search);
      let resumeId = params.get('id');
      
      if (!resumeId) {
        const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
        if (path && path !== 'index.html') {
          resumeId = path;
        }
      }

      if (resumeId) {
        try {
          const fetched = await fetchResumeFromDB(resumeId);
          if (cancelled) return;
          if (fetched) {
            const resume = normalizeResume(fetched);
            setData(resume.data);
            setConfig(resume.config);
            setSectionOrder(resume.sectionOrder);
            setIsReadOnly(true); 
            if (resume.data.personal.name) {
              document.title = `${resume.data.personal.name} - Resume`;
            }
            setIsLoading(false);
            return;
          }
          notify('Resume not found. Opening the editor.', 'error');
          window.history.replaceState({}, document.title, "/");
        } catch (error) {
          if (cancelled) return;
          console.error("Error loading:", error);
          notify("Couldn't load that resume. Check your connection and refresh to retry.", 'error');
        }
      }

      if (cancelled) return;
      startEditing(loadLocalResume() ?? normalizeResume({ data: initialData, config: initialConfig, sectionOrder: initialSections }));
    };
    init();

    return () => { cancelled = true; };
  }, [notify]);

  // 2. Auto-save & History
  useEffect(() => {
    if (isLoading || isReadOnly) return; 

    let indicatorTimer;
    const timeoutId = setTimeout(() => {
      const saved = saveLocalResume({ data, config, sectionOrder });
      if (saved) {
        storageWarnedRef.current = false;
        setIsAutoSaving(true);
        indicatorTimer = setTimeout(() => setIsAutoSaving(false), 1000);
      } else if (!storageWarnedRef.current) {
        storageWarnedRef.current = true;
        notify("Couldn't save to this browser (storage full or blocked). Try removing the photo.", 'error');
      }

      setHistory((prev) => pushSnapshot(prev, { data, config, sectionOrder }));
    }, 1000); 

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(indicatorTimer);
    };
  }, [data, config, sectionOrder, isLoading, isReadOnly, notify]);

  // 3. Zoom via Ctrl+Scroll
  // The preview container only exists once loading has finished, so wait for that.
  useEffect(() => {
    if (isLoading) return;
    const container = previewContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.001; 
        setZoom(prev => Math.min(Math.max(prev + delta, 0.3), 1.5));
      }
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isLoading]);

  // 4. Fullscreen Listener
  useEffect(() => {
    const onFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
  }, []);

  // 5. Resize Observer to measure content height/width (the element only exists after loading)
  useLayoutEffect(() => {
    if (isLoading || !contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // offsetWidth/Height give the untransformed border-box size, which is what the zoom layout needs.
        const element = entry.target;
        setContentSize({
          width: element.offsetWidth,
          height: element.offsetHeight
        });
      }
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [isLoading]);

  // --- HANDLERS ---

  const applySnapshot = (snapshot) => {
    setData(snapshot.data);
    setConfig(snapshot.config);
    setSectionOrder(snapshot.sectionOrder);
  };

  const handleUndo = () => {
    // Record any edit still waiting for the autosave timer, so undo steps back from it.
    const base = pushSnapshot(history, { data, config, sectionOrder });
    const target = base.index - 1;
    if (target < 0) return;
    applySnapshot(base.stack[target]);
    setHistory({ ...base, index: target });
  };

  const handleRedo = () => {
    const base = pushSnapshot(history, { data, config, sectionOrder });
    const target = base.index + 1;
    if (target >= base.stack.length) return;
    applySnapshot(base.stack[target]);
    setHistory({ ...base, index: target });
  };

  const applyTemplate = (templateKey) => {
    setActiveTemplate(templateKey);
    const template = templates[templateKey];
    if (template) setConfig(prev => ({ ...prev, ...template.config }));
  };

  const openShareModal = () => {
    setShareError('');
    setShareUrl('');
    setLinkCopied(false);
    setShowShareModal(true);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);
    setShareError('');
    try {
      // Normalising drops unsafe links/photos before anything is published.
      const payload = normalizeResume({ data, config, sectionOrder });
      const slug = customSlug.trim() ? makeSlug(customSlug) : '';
      const resumeId = slug
        ? await saveResumeWithSlug(slug, payload)
        : await saveResumeToDB(payload);

      const url = `${window.location.origin}/${resumeId}`;
      setShareUrl(url);
      // The link already exists at this point, so a blocked clipboard must not read as a failure.
      setLinkCopied(await copyToClipboard(url));
    } catch (error) {
      setShareError(error.message || "Failed to generate link.");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyShareUrl = async () => {
    setLinkCopied(await copyToClipboard(shareUrl));
  };

  const handleCopyEmail = async () => {
    if (data.personal?.email && await copyToClipboard(data.personal.email)) {
      notify('Email copied to clipboard!');
    }
  };

  const handleDownloadPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      await downloadResumePdf({ name: data.personal?.name, quality: pdfQuality });
    } catch (error) {
      console.error('PDF export failed', error);
      notify('PDF export failed. Try again, or use Print / Save as PDF.', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const handleResetZoom = () => setZoom(0.8);
  const handleFitWidth = () => setZoom(1.0);
  
  const toggleFullScreen = () => {
    if (!document.fullscreenElement && fullScreenContainerRef.current) {
        fullScreenContainerRef.current.requestFullscreen().catch(console.error);
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
  };

  const handleDragStart = (e, index) => { setDraggedItemIndex(index); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const updated = [...sectionOrder];
    const item = updated.splice(draggedItemIndex, 1)[0];
    updated.splice(index, 0, item);
    setSectionOrder(updated);
    setDraggedItemIndex(index);
  };
  const handleDragEnd = () => setDraggedItemIndex(null);

  const handleForkTemplate = () => {
    saveLocalDesignOnly({ config, sectionOrder });
    window.location.href = '/'; 
  };

  // --- RENDER ---

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-sans transition-colors duration-300 ${darkMode ? 'dark bg-neutral-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
        <Loader2 className="animate-spin mb-4 text-blue-600" size={48} />
        <p className="font-medium animate-pulse">Fetching profile...</p>
      </div>
    );
  }

  const appProps = {
    activeTab, setActiveTab,
    data, setData,
    config, setConfig,
    sectionOrder, setSectionOrder,
    applyTemplate,
    draggedItemIndex, handleDragStart, handleDragOver, handleDragEnd,
    darkMode, toggleDarkMode: () => setDarkMode(!darkMode),
    undo: handleUndo, redo: handleRedo,
    canUndo: history.index > 0,
    canRedo: history.index < history.stack.length - 1,
    pdfQuality, setPdfQuality,
    handleShare: openShareModal,
    isSharing: false,
    onDownloadPdf: handleDownloadPdf,
    onPrint: printResume,
    isExportingPdf,
    activeTemplate,
    isReadOnly
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'dark bg-neutral-900' : 'bg-gray-100'}`}>
      <GlobalStyles />

      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        darkMode={darkMode}
        customSlug={customSlug}
        setCustomSlug={setCustomSlug}
        shareError={shareError}
        handleGenerateLink={handleGenerateLink}
        isGeneratingLink={isGeneratingLink}
        shareUrl={shareUrl}
        linkCopied={linkCopied}
        handleCopyShareUrl={handleCopyShareUrl}
      />

      <Toast show={toast.show} message={toast.message} variant={toast.variant} />

      {/* --- MOBILE LAYOUT --- */}
      <div className="block md:hidden h-full">
         <MobileLayout {...appProps} />
      </div>

      {/* --- DESKTOP LAYOUT --- */}
      <div className={`hidden md:flex ${isReadOnly ? 'items-center justify-center flex-col' : 'flex-row h-screen'}`}>
        
        {!isReadOnly && <EditorPanel {...appProps} />}

        <div 
            ref={fullScreenContainerRef}
            className={`${isReadOnly ? 'w-full max-w-5xl h-screen' : 'w-full md:w-2/3 lg:w-3/4 h-screen'} overflow-hidden relative flex flex-col transition-colors duration-300 ${
              isReadOnly 
                ? (darkMode ? 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50') 
                : (darkMode ? 'bg-neutral-800' : 'bg-gray-200')
            }`}
        >
            <ZoomToolbar 
              darkMode={darkMode}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              handleFitWidth={handleFitWidth}
              toggleFullScreen={toggleFullScreen}
              handleResetZoom={handleResetZoom}
              zoom={zoom}
              isFullScreen={isFullScreen}
            />

            {isReadOnly && (
              <div className="absolute top-4 left-6 z-50 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg font-semibold text-sm flex items-center gap-2">
                  <Share2 size={16} /> Viewing Shared Resume
              </div>
            )}

            {/* --- IMPROVED PREVIEW AREA --- */}
            {/* Using "flex flex-col" with "overflow-auto" ensures native scrolling */}
            <div 
              ref={previewContainerRef}
              className="w-full h-full overflow-auto custom-scrollbar flex flex-col p-8 md:p-12 relative"
            >
                {/* 1. Phantom Container: Resizes physically to force scrollbars */}
                {/* "mx-auto" keeps it perfectly centered when smaller than viewport */}
                <div 
                  style={{
                    width: contentSize.width > 0 ? contentSize.width * zoom : 'auto',
                    height: contentSize.height > 0 ? contentSize.height * zoom : 'auto',
                    // Smoothly transition size changes
                    transition: 'width 0.15s ease-out, height 0.15s ease-out' 
                  }}
                  className="relative mx-auto shrink-0 z-10" 
                >
                    {/* 2. Transform Container: Pins the scaled content to the phantom container */}
                    <div 
                       style={{
                          transform: `scale(${zoom})`,
                          transformOrigin: 'top left', // Important: Scale from top-left of the box
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: contentSize.width > 0 ? contentSize.width : 'auto'
                       }}
                       className="transition-transform duration-150 ease-out"
                    >
                        {/* 3. Actual Content: Measured by ResizeObserver */}
                        {/* Shadow and visual styles go here on the "Paper" */}
                        <div 
                          id="resume-preview-content" 
                          ref={contentRef} 
                          className="inline-block shadow-2xl origin-top"
                        >
                           <PreviewPanel 
                              data={data} 
                              config={config} 
                              sectionOrder={sectionOrder} 
                              activeTemplate={activeTemplate} 
                              onDownloadPdf={handleDownloadPdf}
                              isExportingPdf={isExportingPdf}
                           />
                        </div>
                    </div>
                </div>

                {/* Footer stays below the Phantom Box content naturally */}
                <div className={`mt-16 mb-20 text-xs font-medium uppercase tracking-widest text-center shrink-0 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                   Profiley • Resume Builder • Laksh Pradhwani 
                </div>

                {!isFullScreen && (
                  <div className="w-full mt-2 shrink-0">
                    <SEOFooter darkMode={darkMode} />
                  </div>
                )}
            </div>

            {/* Auto-save Indicator */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 pointer-events-none">
              {!isReadOnly && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm text-xs font-semibold ${isAutoSaving ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-300 ${darkMode ? 'text-green-400 bg-neutral-900/80' : 'text-green-700 bg-white/80'}`}>
                  <Save size={14} /> Auto-saved
                  </div>
              )}
            </div>
        </div>
      </div>

      {isReadOnly && (
        <ReadOnlyToolbar 
          data={data}
          darkMode={darkMode}
          handleCopyEmail={handleCopyEmail}
          handleDownloadPdf={handleDownloadPdf}
          isExportingPdf={isExportingPdf}
          handleForkTemplate={handleForkTemplate}
        />
      )}

      {/* Print-only copy of the page: Ctrl+P / "Save as PDF" gives a real text PDF. See index.css. */}
      {createPortal(
        <div id="print-root">
          <ResumeDocument data={data} config={config} sectionOrder={sectionOrder} />
        </div>,
        document.body
      )}
    </div>
  );
};

export default App;