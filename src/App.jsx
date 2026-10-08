import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

// Components
import EditorPanel from './components/Editor/EditorPanel';
import ResumeDocument from './components/Preview/ResumeDocument';
import { EditContext } from './components/Preview/editContext';
import MobileLayout from './components/Mobile/MobileLayout';
import Toast from './components/UI/Toast';
import ShareModal from './components/Modals/ShareModal';
import ImportModal from './components/Modals/ImportModal';
import TopBar from './components/Layout/TopBar';
import ZoomDock from './components/Layout/ZoomDock';
import AppSkeleton from './components/Layout/AppSkeleton';
import Footer from './components/Layout/Footer';

// Hooks
import useCanvasZoom from './hooks/useCanvasZoom';
import useMediaQuery from './hooks/useMediaQuery';
import useAiStatus from './ai/useAiStatus';
import { toJsonResume, toProfileyBackup } from './import/formats';

// Utilities & Data
import { downloadResumePdf, printResume } from './utils/pdfManager';
import {
  normalizeData,
  normalizeConfig,
  normalizeSectionOrder,
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

const THEME_KEY = 'profiley_theme';

const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Storage can be blocked; fall through to the system preference.
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

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
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const [theme, setTheme] = useState(getInitialTheme);
  const darkMode = theme === 'dark';
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [pdfQuality, setPdfQuality] = useState('screen');
  const [fitOnePage, setFitOnePage] = useState(true);
  const [history, setHistory] = useState({ stack: [], index: -1 });
  const [saveState, setSaveState] = useState('idle'); // idle | saved | error
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Sharing State
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const ai = useAiStatus();
  const [customSlug, setCustomSlug] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [shareError, setShareError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Notification State
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success', action: null });
  const toastTimerRef = useRef(null);
  const storageWarnedRef = useRef(false);

  // Zoom & Fullscreen State
  const canvas = useCanvasZoom();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const fullScreenContainerRef = useRef(null);

  // Handlers captured by long-lived listeners (shortcuts, toast actions) read the latest through this ref.
  const actionsRef = useRef({});

  const notify = useCallback((message, variant = 'success', action = null) => {
    clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, variant, action });
    toastTimerRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), action ? 6000 : 3500);
  }, []);

  // Destructive actions confirm with an Undo instead of an "are you sure?" dialog.
  const notifyUndo = useCallback((message) => notify(message, 'success', { label: 'Undo' }), [notify]);

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
        setSaveState('saved');
        indicatorTimer = setTimeout(() => setSaveState('idle'), 2200);
      } else {
        setSaveState('error');
        if (!storageWarnedRef.current) {
          storageWarnedRef.current = true;
          notify("Couldn't save to this browser (storage full or blocked). Try removing the photo.", 'error');
        }
      }

      setHistory((prev) => pushSnapshot(prev, { data, config, sectionOrder }));
    }, 1000); 

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(indicatorTimer);
    };
  }, [data, config, sectionOrder, isLoading, isReadOnly, notify]);

  // 4. Fullscreen Listener
  useEffect(() => {
    const onFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
  }, []);

  // 5. Theme: class on <html> drives every colour token, and the choice is remembered.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Not persisted; the system preference applies next time.
    }
  }, [theme]);

  // 6. Keyboard shortcuts (typing in a field keeps the browser's own text undo)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      const typing = /^(input|textarea|select)$/i.test(e.target?.tagName) || e.target?.isContentEditable;

      if (key === 's') {
        e.preventDefault();
        actionsRef.current.save?.();
      } else if (!typing && key === 'z') {
        e.preventDefault();
        if (e.shiftKey) actionsRef.current.redo?.();
        else actionsRef.current.undo?.();
      } else if (!typing && key === 'y') {
        e.preventDefault();
        actionsRef.current.redo?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

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

  // A template replaces the whole design, so options from the previous one can't leak through.
  const applyTemplate = (templateKey) => {
    const template = templates[templateKey];
    if (!template) return;
    setConfig({ ...initialConfig, ...template.config, activeTemplate: templateKey });
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
      const skills = (data.skills || []).map((skill) => (typeof skill === 'string' ? skill : skill?.name)).filter(Boolean);
      const { pages, scale } = await downloadResumePdf({ name: data.personal?.name, quality: pdfQuality, fitOnePage, meta: { keywords: skills } });
      const note = scale < 1 ? ` Shrunk to ${Math.round(scale * 100)}% to fit one page.` : pages > 1 ? ` It runs to ${pages} pages.` : '';
      notify(`PDF downloaded.${note}`);
    } catch (error) {
      console.error('PDF export failed', error);
      notify('PDF export failed. Try again, or use Print / Save as PDF.', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

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

  // Edits made by clicking text on the page. Paths look like "personal:name",
  // "experience:<id>:role", "skill:<index>:name", "section:<id>", "achievements:<index>".
  const handleInlineEdit = (path, value) => {
    const [kind, a, b] = path.split(':');

    if (kind === 'section') {
      const label = value.trim();
      if (!label) return;
      setSectionOrder((prev) => prev.map((s) => (s.id === a ? { ...s, label } : s)));
      if (a.startsWith('custom-')) {
        setData((prev) => (prev.custom[a] ? { ...prev, custom: { ...prev.custom, [a]: { ...prev.custom[a], title: label } } } : prev));
      }
      return;
    }

    setData((prev) => {
      switch (kind) {
        case 'personal':
          return { ...prev, personal: { ...prev.personal, [a]: value } };
        case 'experience':
        case 'education':
          return { ...prev, [kind]: prev[kind].map((item) => (String(item.id) === a ? { ...item, [b]: value } : item)) };
        case 'skill': {
          const index = Number(a);
          if (!value.trim()) return { ...prev, skills: prev.skills.filter((_, i) => i !== index) };
          return {
            ...prev,
            skills: prev.skills.map((skill, i) => {
              if (i !== index) return skill;
              return typeof skill === 'string' ? value : { ...skill, name: value };
            })
          };
        }
        case 'achievements':
        case 'community': {
          const index = Number(a);
          if (!value.trim()) return { ...prev, [kind]: prev[kind].filter((_, i) => i !== index) };
          return { ...prev, [kind]: prev[kind].map((item, i) => (i === index ? value : item)) };
        }
        case 'custom':
          return prev.custom[a] ? { ...prev, custom: { ...prev.custom, [a]: { ...prev.custom[a], [b]: value } } } : prev;
        default:
          return prev;
      }
    });
  };

  // Replaces the resume's content with something imported. Design is only touched when the
  // import carries one (a Profiley backup). Everything goes through normalizeData first.
  const handleApplyImport = ({ data: incoming, customSections = [], config: incomingConfig, sectionOrder: incomingOrder }) => {
    const imported = normalizeData(incoming);
    const photoUrl = imported.personal.photoUrl || data.personal.photoUrl;

    setData({ ...imported, personal: { ...imported.personal, photoUrl } });
    if (incomingConfig) setConfig(normalizeConfig(incomingConfig));
    if (incomingOrder) {
      setSectionOrder(normalizeSectionOrder(incomingOrder));
    } else {
      setSectionOrder((prev) => [
        ...prev.filter((s) => s.type !== 'custom' && !String(s.id).startsWith('custom-')),
        ...customSections.filter((s) => imported.custom[s.id])
      ]);
    }
    setActiveTab('sections');
    notifyUndo('Resume imported');
  };

  const downloadJson = (filename, payload) => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleExportJson = (kind) => {
    const base = (data.personal.name || 'resume').trim().replace(/[^\w.-]+/g, '_') || 'resume';
    if (kind === 'jsonresume') downloadJson(`${base}.jsonresume.json`, toJsonResume(data));
    else downloadJson(`${base}.profiley.json`, toProfileyBackup({ data, config, sectionOrder }));
    notify('Saved to your downloads');
  };

  const handleSaveNow = () => {
    const saved = saveLocalResume({ data, config, sectionOrder });
    setSaveState(saved ? 'saved' : 'error');
    notify(saved ? 'Saved to this browser' : "Couldn't save to this browser", saved ? 'success' : 'error');
  };

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    actionsRef.current = { undo: handleUndo, redo: handleRedo, save: handleSaveNow };
  });

  // --- RENDER ---

  if (isLoading) return <AppSkeleton />;

  const editorProps = {
    activeTab, setActiveTab,
    data, setData,
    config, setConfig,
    sectionOrder, setSectionOrder,
    applyTemplate,
    draggedItemIndex, handleDragStart, handleDragOver, handleDragEnd,
    pdfQuality, setPdfQuality,
    fitOnePage, setFitOnePage,
    handleShare: openShareModal,
    onDownloadPdf: handleDownloadPdf,
    onPrint: () => printResume({ fitOnePage }),
    isExportingPdf,
    openImport: () => setShowImport(true),
    onExportJson: handleExportJson,
    notify,
    notifyUndo
  };

  const history_ = {
    canUndo: history.index > 0,
    canRedo: history.index < history.stack.length - 1,
    undo: handleUndo,
    redo: handleRedo
  };

  const templateName = templates[config.activeTemplate]?.name;

  const desktop = (
    <div className="flex h-[100dvh] flex-col bg-canvas">
      <TopBar
        data={data}
        isReadOnly={isReadOnly}
        darkMode={darkMode}
        toggleDarkMode={toggleTheme}
        {...history_}
        saveState={saveState}
        onShare={openShareModal}
        onDownloadPdf={handleDownloadPdf}
        isExportingPdf={isExportingPdf}
        onCopyEmail={handleCopyEmail}
        onForkTemplate={handleForkTemplate}
      />

      <div className="flex min-h-0 flex-1">
        {!isReadOnly && <EditorPanel {...editorProps} />}

        <main
          id="main"
          ref={fullScreenContainerRef}
          aria-label="Resume preview"
          className="canvas-dots relative min-w-0 flex-1 bg-canvas"
        >
          <div ref={canvas.setContainer} className="scroll-quiet absolute inset-0 overflow-auto">
            <div className="px-12 pb-36 pt-10">
              {/* Phantom box: takes the scaled size so the scroll area matches what you see */}
              <div
                className="relative mx-auto"
                style={{
                  width: canvas.contentSize.width ? canvas.contentSize.width * canvas.zoom : undefined,
                  height: canvas.contentSize.height ? canvas.contentSize.height * canvas.zoom : undefined
                }}
              >
                <div
                  className="absolute left-0 top-0 origin-top-left transition-transform duration-150 ease-snap"
                  style={{ width: canvas.contentSize.width || undefined, transform: `scale(${canvas.zoom})` }}
                >
                  <div ref={canvas.setContent} className="inline-block">
                    <EditContext.Provider value={isReadOnly ? null : { commit: handleInlineEdit }}>
                      <ResumeDocument data={data} config={config} sectionOrder={sectionOrder} />
                    </EditContext.Provider>
                  </div>
                </div>
              </div>

              {!isFullScreen && <Footer />}
            </div>
          </div>

          <p className="pointer-events-none absolute left-4 top-3 font-numeric text-[11px] text-ink-3">
            A4{templateName ? ` · ${templateName}` : ''}{!isReadOnly && ' · click any text to edit'}
          </p>

          <ZoomDock
            className="absolute bottom-5 left-1/2 -translate-x-1/2"
            zoom={canvas.zoom} min={canvas.min} max={canvas.max} isFit={canvas.isFit}
            zoomIn={canvas.zoomIn} zoomOut={canvas.zoomOut} fit={canvas.fit} actualSize={canvas.actualSize}
            toggleFullScreen={toggleFullScreen} isFullScreen={isFullScreen}
          />
        </main>
      </div>
    </div>
  );

  return (
    <div className="font-ui">
      <a
        href="#main"
        className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200]"
      >
        Skip to preview
      </a>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        customSlug={customSlug}
        setCustomSlug={setCustomSlug}
        shareError={shareError}
        handleGenerateLink={handleGenerateLink}
        isGeneratingLink={isGeneratingLink}
        shareUrl={shareUrl}
        linkCopied={linkCopied}
        handleCopyShareUrl={handleCopyShareUrl}
      />

      {/* Mounted only while open so every visit starts from a clean slate. */}
      {showImport && <ImportModal isOpen onClose={() => setShowImport(false)} onApply={handleApplyImport} ai={ai} />}

      <Toast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        action={toast.action}
        onAction={() => {
          actionsRef.current.undo?.();
          setToast((t) => ({ ...t, show: false }));
        }}
      />

      {isDesktop ? desktop : (
        <MobileLayout
          {...editorProps}
          {...history_}
          isReadOnly={isReadOnly}
          darkMode={darkMode}
          toggleDarkMode={toggleTheme}
          saveState={saveState}
          onCopyEmail={handleCopyEmail}
          onForkTemplate={handleForkTemplate}
        />
      )}

      {/* Print-only copy of the page: Ctrl+P / "Save as PDF" gives a real text PDF. See index.css. */}
      {createPortal(
        <div id="print-root">
          <ResumeDocument data={data} config={config} sectionOrder={sectionOrder} paperRole="print" />
        </div>,
        document.body
      )}
    </div>
  );
};

export default App;
