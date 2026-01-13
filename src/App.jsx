import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, Share2 } from 'lucide-react';

// Components
import EditorPanel from './components/Editor/EditorPanel';
import PreviewPanel from './components/Preview/PreviewPanel';
import MobileLayout from './components/Mobile/MobileLayout';
import SEOFooter from './components/SEO/SEOFooter';

// New Clean Components
import GlobalStyles from './components/UI/GlobalStyles';
import Toast from './components/UI/Toast';
import ShareModal from './components/Modals/ShareModal';
import ZoomToolbar from './components/Layout/ZoomToolbar';
import ReadOnlyToolbar from './components/Layout/ReadOnlyToolbar';

// Utilities & Data
import { handleDownloadPdf } from './utils/pdfManager';
import { saveResumeToDB, saveResumeWithSlug, fetchResumeFromDB } from './firebase'; 
import {
  initialData,
  initialConfig,
  initialSections,
  templates
} from './data/constants';

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
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Sharing State
  const [showShareModal, setShowShareModal] = useState(false);
  const [customSlug, setCustomSlug] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [shareError, setShareError] = useState('');
  
  // Notification State
  const [showCopyToast, setShowCopyToast] = useState(false);

  // Zoom & Fullscreen State
  const [zoom, setZoom] = useState(0.8);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const previewContainerRef = useRef(null);
  const fullScreenContainerRef = useRef(null);

  // --- EFFECTS ---

  // 1. Initialization (Load from URL or LocalStorage)
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const params = new URLSearchParams(window.location.search);
      let resumeId = params.get('id');
      
      if (!resumeId) {
        const path = window.location.pathname.substring(1);
        if (path && path.length > 0 && path !== 'index.html') {
          resumeId = path;
        }
      }

      if (resumeId) {
        try {
          const fetched = await fetchResumeFromDB(resumeId);
          if (fetched) {
            if (fetched.data) setData(fetched.data);
            if (fetched.config) setConfig(fetched.config);
            if (fetched.sectionOrder) setSectionOrder(fetched.sectionOrder);
            setIsReadOnly(true); 
            if (fetched.data?.personal?.name) {
                document.title = `${fetched.data.personal.name} - Resume`;
            }
            setIsLoading(false);
            return;
          } else {
            alert("Resume not found. Loading editor.");
            window.history.replaceState({}, document.title, "/");
          }
        } catch (error) {
          console.error("Error loading:", error);
        }
      }

      const savedData = localStorage.getItem('profiley_data');
      const savedConfig = localStorage.getItem('profiley_config');
      const savedOrder = localStorage.getItem('profiley_order');
      
      if (savedData) setData(JSON.parse(savedData));
      if (savedConfig) setConfig(JSON.parse(savedConfig));
      if (savedOrder) setSectionOrder(JSON.parse(savedOrder));
      
      setIsLoading(false);
    };
    init();
  }, []);

  // 2. Auto-save & History
  useEffect(() => {
    if (isLoading || isReadOnly) return; 

    const timeoutId = setTimeout(() => {
      localStorage.setItem('profiley_data', JSON.stringify(data));
      localStorage.setItem('profiley_config', JSON.stringify(config));
      localStorage.setItem('profiley_order', JSON.stringify(sectionOrder));
      setIsAutoSaving(true);
      setTimeout(() => setIsAutoSaving(false), 1000);

      const currentState = { data, config, sectionOrder };
      const lastState = history[historyIndex];
      
      if (!lastState || JSON.stringify(lastState) !== JSON.stringify(currentState)) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }, 1000); 

    return () => clearTimeout(timeoutId);
  }, [data, config, sectionOrder, isLoading, isReadOnly]);

  // 3. Zoom via Ctrl+Scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.001; 
        setZoom(prev => Math.min(Math.max(prev + delta, 0.3), 1.5));
      }
    };
    const container = previewContainerRef.current;
    if (container) container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      if (container) container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // 4. Fullscreen Listener
  useEffect(() => {
    const onFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
  }, []);

  // --- HANDLERS ---

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setData(prevState.data);
      setConfig(prevState.config);
      setSectionOrder(prevState.sectionOrder);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setData(nextState.data);
      setConfig(nextState.config);
      setSectionOrder(nextState.sectionOrder);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const applyTemplate = (templateKey) => {
    setActiveTemplate(templateKey);
    const template = templates[templateKey];
    if (template) setConfig(prev => ({ ...prev, ...template.config }));
  };

  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);
    setShareError('');
    try {
      let resumeId;
      if (customSlug.trim()) {
        const slug = customSlug.trim().replace(/[^a-zA-Z0-9-_]/g, '-');
        resumeId = await saveResumeWithSlug(slug, { data, config, sectionOrder });
      } else {
        resumeId = await saveResumeToDB({ data, config, sectionOrder });
      }
      const shareUrl = `${window.location.origin}/${resumeId}`;
      await navigator.clipboard.writeText(shareUrl);
      alert(`Success! Link copied to clipboard:\n${shareUrl}`);
      setShowShareModal(false);
    } catch (error) {
        setShareError(error.message || "Failed to generate link.");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyEmail = () => {
    if (data.personal?.email) {
      navigator.clipboard.writeText(data.personal.email);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000);
    }
  };

  const triggerPdfDownload = () => handleDownloadPdf('resume-preview-content', data.personal?.name);

  // Zoom Helpers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const handleResetZoom = () => setZoom(0.8);
  
  // NEW: Fit to Width Handler
  const handleFitWidth = () => {
    // 1.0 represents "Actual Size" or fit width depending on your CSS container logic.
    // Adjust this value (e.g., 1.1 or 1.2) if your specific layout requires more width.
    setZoom(1.0); 
  };
  
  const toggleFullScreen = () => {
    if (!document.fullscreenElement && fullScreenContainerRef.current) {
        fullScreenContainerRef.current.requestFullscreen().catch(console.error);
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
  };

  // Drag Helpers
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
    localStorage.setItem('profiley_config', JSON.stringify(config));
    localStorage.setItem('profiley_order', JSON.stringify(sectionOrder));
    localStorage.removeItem('profiley_data');
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
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    pdfQuality, setPdfQuality,
    handleShare: () => setShowShareModal(true),
    isSharing: false,
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
      />

      <Toast show={showCopyToast} message="Email copied to clipboard!" />

      {/* --- MOBILE LAYOUT --- */}
      <div className="block md:hidden h-full">
         <MobileLayout {...appProps} />
      </div>

      {/* --- DESKTOP LAYOUT --- */}
      <div className={`hidden md:flex ${isReadOnly ? 'items-center justify-center flex-col' : 'flex-row h-screen'}`}>
        
        {!isReadOnly && <EditorPanel {...appProps} />}

        <div 
            ref={fullScreenContainerRef}
            className={`${isReadOnly ? 'w-full max-w-5xl h-screen' : 'w-full md:w-2/3 lg:w-3/4 h-screen'} overflow-hidden relative flex flex-col items-center transition-colors duration-300 ${
              isReadOnly 
                ? (darkMode ? 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50') 
                : (darkMode ? 'bg-neutral-800' : 'bg-gray-200')
            }`}
        >
            <ZoomToolbar 
              darkMode={darkMode}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              handleFitWidth={handleFitWidth} // <-- Passed here
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

            {/* Scrollable Preview Area */}
            <div 
              ref={previewContainerRef}
              className="w-full h-full overflow-auto custom-scrollbar flex flex-col items-center p-8 md:p-12 relative"
            >
                {/* Scalable Container */}
                <div 
                  id="resume-preview-content"
                  className="transition-transform duration-200 ease-out origin-top shadow-2xl"
                  style={{ transform: `scale(${zoom})`, marginBottom: `${(zoom - 1) * 300}px` }} 
                >
                   <PreviewPanel data={data} config={config} sectionOrder={sectionOrder} activeTemplate={activeTemplate} />
                </div>

                <div className={`mt-16 mb-20 text-xs font-medium uppercase tracking-widest ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                   Profiley • Resume Builder • Laksh Pradhwani 
                </div>

                {!isFullScreen && (
                  <div className="w-full mt-10">
                    <SEOFooter darkMode={darkMode} />
                  </div>
                )}
            </div>

            <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
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
          handleDownloadPdf={triggerPdfDownload}
          handleForkTemplate={handleForkTemplate}
        />
      )}
    </div>
  );
};

export default App;