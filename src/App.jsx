// src/App.jsx
import React, { useState, useEffect } from 'react';
import { 
  Download, Moon, Sun, RotateCcw, RotateCw, Share2, Save, Loader2, FilePlus, X, Link as LinkIcon
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import EditorPanel from './components/Editor/EditorPanel';
import PreviewPanel from './components/Preview/PreviewPanel';
import { saveResumeToDB, saveResumeWithSlug, fetchResumeFromDB } from './firebase'; 
import {
  initialData,
  initialConfig,
  initialSections,
  templates
} from './data/constants';

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Lora:wght@400;700&family=Merriweather:wght@300;400;700&family=Oswald:wght@400;700&family=Playfair+Display:wght@400;700&family=Raleway:wght@400;700&display=swap');

    @media print {
      body { display: none; }
    }
    
    .dark ::-webkit-scrollbar { width: 8px; }
    .dark ::-webkit-scrollbar-track { background: #1e293b; }
    .dark ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
    .dark ::-webkit-scrollbar-thumb:hover { background: #64748b; }
  `}</style>
);

const App = () => {
  const [data, setData] = useState(initialData);
  const [config, setConfig] = useState(initialConfig);
  const [sectionOrder, setSectionOrder] = useState(initialSections);
  const [activeTab, setActiveTab] = useState('sections');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const [darkMode, setDarkMode] = useState(false);
  const [pdfQuality, setPdfQuality] = useState('screen'); 
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [customSlug, setCustomSlug] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [shareError, setShareError] = useState('');

  // --- Initialization (Load from Path, Query or LocalStorage) ---
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      // 1. Get ID from ?id=XYZ or /XYZ
      const params = new URLSearchParams(window.location.search);
      let resumeId = params.get('id');
      
      // If no query param, check path (e.g. profiley.live/my-resume)
      if (!resumeId) {
        const path = window.location.pathname.substring(1); // remove leading slash
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

      // 2. Fallback to LocalStorage
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

  // --- Auto-Save ---
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

  // --- Actions ---
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
    const template = templates[templateKey];
    if (template) {
      setConfig(prev => ({ ...prev, ...template.config }));
    }
  };

  // --- Share Logic ---
  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);
    setShareError('');
    try {
      let resumeId;
      
      if (customSlug.trim()) {
        // Try saving with custom slug
        const slug = customSlug.trim().replace(/[^a-zA-Z0-9-_]/g, '-'); // Sanitize
        resumeId = await saveResumeWithSlug(slug, { data, config, sectionOrder });
      } else {
        // Random ID
        resumeId = await saveResumeToDB({ data, config, sectionOrder });
      }

      // Generate URL based on input
      const shareUrl = `${window.location.origin}/${resumeId}`;
      
      await navigator.clipboard.writeText(shareUrl);
      alert(`Success! Link copied to clipboard:\n${shareUrl}`);
      setShowShareModal(false);
    } catch (error) {
      if (error.message === 'URL unavailable') {
        setShareError("This URL is already taken. Please choose another.");
      } else if (error.message.includes("permission")) {
        setShareError("Database permission denied. Check Firestore rules.");
      } else {
        setShareError(error.message || "Failed to generate link.");
      }
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById('cv-document');
    if (!element) return;
    const fileName = (data.personal.name || 'Resume').replace(/\s+/g, '_') + '_CV.pdf';
    const scale = pdfQuality === 'print' ? 3 : 1.5; 
    const imageQuality = pdfQuality === 'print' ? 0.98 : 0.8;
    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: imageQuality },
      html2canvas: { scale: scale, useCORS: true, letterRendering: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };
    html2pdf().set(opt).from(element).save();
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

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-sans transition-colors duration-300 ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
        <Loader2 className="animate-spin mb-4 text-blue-600" size={48} />
        <p className="font-medium animate-pulse">Fetching profile...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isReadOnly ? 'items-center justify-center' : 'md:flex-row'} font-sans transition-colors duration-300 ${darkMode ? 'dark bg-slate-900' : 'bg-gray-100'}`}>
      <Styles />

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md p-6 rounded-xl shadow-2xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><LinkIcon size={20} className="text-blue-500"/> Share Resume</h3>
              <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full"><X size={20}/></button>
            </div>
            
            <p className="text-sm opacity-70 mb-4">Create a public link for your resume. Anyone with this link can view your profile.</p>
            
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide mb-2 opacity-60">Custom URL (Optional)</label>
              <div className="flex items-center">
                <span className={`px-3 py-3 border border-r-0 rounded-l-lg text-sm ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-400' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                  profiley.lakshp.live/
                </span>
                <input 
                  type="text" 
                  value={customSlug} 
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="my-resume"
                  className={`flex-grow p-3 text-sm border rounded-r-lg outline-none ${darkMode ? 'bg-slate-900 border-slate-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'}`} 
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
              {isGeneratingLink ? 'Checking Availability...' : 'Generate & Copy Link'}
            </button>
          </div>
        </div>
      )}

      {/* Editor */}
      {!isReadOnly && (
        <EditorPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={data}
          setData={setData}
          config={config}
          setConfig={setConfig}
          sectionOrder={sectionOrder}
          setSectionOrder={setSectionOrder}
          applyTemplate={applyTemplate}
          draggedItemIndex={draggedItemIndex}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDragEnd={handleDragEnd}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          undo={handleUndo}
          redo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          pdfQuality={pdfQuality}
          setPdfQuality={setPdfQuality}
          handleShare={() => setShowShareModal(true)} // Opens Modal
          isSharing={false}
        />
      )}

      {/* Preview */}
      <div className={`${isReadOnly ? 'w-full max-w-5xl h-screen' : 'w-full md:w-2/3 lg:w-3/4 h-screen'} overflow-y-auto p-4 md:p-8 flex flex-col items-center relative transition-colors duration-300 ${darkMode ? 'bg-slate-800' : 'bg-gray-200'}`}>
        
        {isReadOnly && (
          <div className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg font-semibold text-sm flex items-center gap-2">
            <Share2 size={16} /> You are viewing a shared resume
          </div>
        )}

        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
           {!isReadOnly && (
             <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm text-xs font-semibold ${isAutoSaving ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-300 ${darkMode ? 'text-green-400 bg-slate-900/80' : 'text-green-700 bg-white/80'}`}>
               <Save size={14} /> Auto-saved
             </div>
           )}
           <button onClick={downloadPDF} className="flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-xl transition-all hover:scale-105 font-bold text-white bg-blue-600 hover:bg-blue-700">
            <Download size={20} /> Download PDF
          </button>
          {isReadOnly && (
             <button onClick={() => window.location.href = window.location.origin} className="flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-xl transition-all hover:scale-105 font-bold text-gray-900 bg-white hover:bg-gray-50 border border-gray-200">
                <FilePlus size={20} className="text-blue-600" /> Create Yours
             </button>
           )}
        </div>

        <PreviewPanel data={data} config={config} sectionOrder={sectionOrder} />
        
        <div className={`mt-8 mb-20 text-xs font-medium uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
          Profiley • Resume Builder
        </div>
      </div>
    </div>
  );
};

export default App;