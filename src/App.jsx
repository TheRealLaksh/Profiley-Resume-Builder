import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, Sun, RotateCcw, RotateCw, Share2, Save, Loader2, FilePlus, X, Link as LinkIcon,
  ZoomIn, ZoomOut, Maximize, Minimize
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import EditorPanel from './components/Editor/EditorPanel';
import PreviewPanel from './components/Preview/PreviewPanel';
import MobileLayout from './components/Mobile/MobileLayout';
import { saveResumeToDB, saveResumeWithSlug, fetchResumeFromDB } from './firebase'; 
import {
  initialData,
  initialConfig,
  initialSections,
  templates
} from './data/constants';

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Lora:wght@400;700&family=Merriweather:wght@300;400;700&family=Oswald:wght@400;700&family=Playfair+Display:wght@400;700&family=Raleway:wght@400;700&family=Space+Mono:wght@400;700&display=swap');

    @media print {
      body { display: none; }
    }
    
    .dark ::-webkit-scrollbar { width: 8px; }
    .dark ::-webkit-scrollbar-track { background: #171717; }
    .dark ::-webkit-scrollbar-thumb { background: #525252; border-radius: 4px; }
    .dark ::-webkit-scrollbar-thumb:hover { background: #737373; }
  `}</style>
);

const App = () => {
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

  const [showShareModal, setShowShareModal] = useState(false);
  const [customSlug, setCustomSlug] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [shareError, setShareError] = useState('');

  // Zoom & Fullscreen State
  const [zoom, setZoom] = useState(0.8);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const previewContainerRef = useRef(null);
  const fullScreenContainerRef = useRef(null); // Ref for the element to go fullscreen

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

  // Handle Ctrl + Scroll Zoom
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.001; 
        setZoom(prev => Math.min(Math.max(prev + delta, 0.3), 1.5));
      }
    };

    const container = previewContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Handle Fullscreen Change Events
  useEffect(() => {
    const onFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
  }, []);

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
    if (template) {
        setConfig(prev => ({
            ...prev,
            ...template.config
        }));
    }
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

  // Zoom Handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const handleResetZoom = () => setZoom(0.8);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        // Use the container ref to request fullscreen
        if (fullScreenContainerRef.current) {
            fullScreenContainerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Drag handlers
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

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-sans transition-colors duration-300 ${darkMode ? 'dark bg-neutral-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
        <Loader2 className="animate-spin mb-4 text-blue-600" size={48} />
        <p className="font-medium animate-pulse">Fetching profile...</p>
      </div>
    );
  }

  // Define common props to avoid repetition
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
      <Styles />

      {/* Share Modal (Global) */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md p-6 rounded-xl shadow-2xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><LinkIcon size={20} className="text-blue-500"/> Share Resume</h3>
              <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-full"><X size={20}/></button>
            </div>
            
            <p className="text-sm opacity-70 mb-4">Create a public link for your resume.</p>
            
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide mb-2 opacity-60">Custom URL</label>
              <div className="flex items-center">
                <span className={`px-3 py-3 border border-r-0 rounded-l-lg text-sm ${darkMode ? 'bg-neutral-700 border-neutral-600 text-neutral-400' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                  profiley.lakshp.live/
                </span>
                <input 
                  type="text" 
                  value={customSlug} 
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="my-resume"
                  className={`flex-grow p-3 text-sm border rounded-r-lg outline-none ${darkMode ? 'bg-neutral-900 border-neutral-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'}`} 
                />
              </div>
              {shareError && <p className="text-red-500 text-xs mt-2 font-medium">{shareError}</p>}
            </div>

            <button 
              onClick={handleGenerateLink} 
              disabled={isGeneratingLink}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingLink ? <Loader2 className="animate-spin" size={18} /> : <Share2 size={18} />}
              {isGeneratingLink ? 'Checking...' : 'Generate Link'}
            </button>
          </div>
        </div>
      )}

      {/* --- MOBILE LAYOUT (Visible on < md screens) --- */}
      <div className="block md:hidden h-full">
         <MobileLayout {...appProps} />
      </div>

      {/* --- DESKTOP LAYOUT (Visible on >= md screens) --- */}
      <div className={`hidden md:flex ${isReadOnly ? 'items-center justify-center flex-col' : 'flex-row h-screen'}`}>
        {!isReadOnly && (
            <EditorPanel {...appProps} />
        )}

        <div 
            ref={fullScreenContainerRef} // Attached to the container that should go fullscreen
            className={`${isReadOnly ? 'w-full max-w-5xl h-screen' : 'w-full md:w-2/3 lg:w-3/4 h-screen'} overflow-hidden relative flex flex-col items-center transition-colors duration-300 ${darkMode ? 'bg-neutral-800' : 'bg-gray-200'}`}
        >
            
            {/* Desktop Zoom Toolbar */}
            <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">
              <div className={`flex flex-col gap-1 p-1 rounded-lg shadow-lg border backdrop-blur-md ${darkMode ? 'bg-neutral-900/80 border-neutral-700 text-neutral-300' : 'bg-white/80 border-gray-300 text-gray-700'}`}>
                <button 
                  onClick={handleZoomIn} 
                  className={`p-2 rounded-md transition-colors ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'}`}
                  title="Zoom In"
                >
                  <ZoomIn size={18} />
                </button>
                <button 
                  onClick={handleZoomOut} 
                  className={`p-2 rounded-md transition-colors ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'}`}
                  title="Zoom Out"
                >
                  <ZoomOut size={18} />
                </button>
                <button 
                  onClick={toggleFullScreen} 
                  className={`p-2 rounded-md transition-colors ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'}`}
                  title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
                
                <button 
                  onClick={handleResetZoom}
                  className="text-[10px] text-center font-mono font-bold py-1 opacity-60 hover:opacity-100 cursor-pointer"
                  title="Reset Zoom"
                >
                  {Math.round(zoom * 100)}%
                </button>
              </div>
            </div>

            {isReadOnly && (
            <div className="absolute top-4 left-6 z-50 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg font-semibold text-sm flex items-center gap-2">
                <Share2 size={16} /> Viewing Shared Resume
            </div>
            )}

            {/* Scrollable Preview Area */}
            <div 
              ref={previewContainerRef} // Attached to the scrollable div for Zoom events
              className="w-full h-full overflow-auto custom-scrollbar flex flex-col items-center p-8 md:p-12 relative"
            >
                
                {/* Scalable Container */}
                <div 
                  className="transition-transform duration-200 ease-out origin-top shadow-2xl"
                  style={{ transform: `scale(${zoom})`, marginBottom: `${(zoom - 1) * 300}px` }} 
                >
                   <PreviewPanel data={data} config={config} sectionOrder={sectionOrder} activeTemplate={activeTemplate} />
                </div>

                <div className={`mt-16 mb-20 text-xs font-medium uppercase tracking-widest ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                   Profiley • Resume Builder • Laksh Pradhwani 
                </div>
            </div>

            <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
            {!isReadOnly && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm text-xs font-semibold ${isAutoSaving ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-300 ${darkMode ? 'text-green-400 bg-neutral-900/80' : 'text-green-700 bg-white/80'}`}>
                <Save size={14} /> Auto-saved
                </div>
            )}
            {isReadOnly && (
                <button onClick={() => window.location.href = window.location.origin} className="flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-xl transition-all hover:scale-105 font-bold text-gray-900 bg-white hover:bg-gray-50 border border-gray-200">
                    <FilePlus size={20} className="text-blue-600" /> Create Yours
                </button>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;