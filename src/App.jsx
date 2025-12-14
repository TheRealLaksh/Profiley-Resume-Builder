// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Download, Moon, Sun, RotateCcw, RotateCw, Share2, Save } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import EditorPanel from './components/Editor/EditorPanel';
import PreviewPanel from './components/Preview/PreviewPanel';
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
    
    /* Custom Scrollbar for Dark Mode */
    .dark ::-webkit-scrollbar { width: 8px; }
    .dark ::-webkit-scrollbar-track { background: #1e293b; }
    .dark ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
    .dark ::-webkit-scrollbar-thumb:hover { background: #64748b; }
  `}</style>
);

const App = () => {
  // --- State ---
  const [data, setData] = useState(initialData);
  const [config, setConfig] = useState(initialConfig);
  const [sectionOrder, setSectionOrder] = useState(initialSections);
  const [activeTab, setActiveTab] = useState('sections');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  // New Features State
  const [darkMode, setDarkMode] = useState(false);
  const [pdfQuality, setPdfQuality] = useState('screen'); // 'screen' or 'print'
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // --- Initialization (Auto-load) ---
  useEffect(() => {
    const savedData = localStorage.getItem('profiley_data');
    const savedConfig = localStorage.getItem('profiley_config');
    const savedOrder = localStorage.getItem('profiley_order');
    
    if (savedData) setData(JSON.parse(savedData));
    if (savedConfig) setConfig(JSON.parse(savedConfig));
    if (savedOrder) setSectionOrder(JSON.parse(savedOrder));
  }, []);

  // --- Auto-Save & History Logic ---
  useEffect(() => {
    const timeoutId = setTimeout(() => { // FIXED: Removed 'yb'
      // Save to LocalStorage
      localStorage.setItem('profiley_data', JSON.stringify(data));
      localStorage.setItem('profiley_config', JSON.stringify(config));
      localStorage.setItem('profiley_order', JSON.stringify(sectionOrder));
      setIsAutoSaving(true);
      setTimeout(() => setIsAutoSaving(false), 1000);

      // Add to History (only if different from current head)
      const currentState = { data, config, sectionOrder };
      const lastState = history[historyIndex];
      
      if (!lastState || JSON.stringify(lastState) !== JSON.stringify(currentState)) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        // Limit history to 50 steps
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }, 1000); // 1s debounce

    return () => clearTimeout(timeoutId);
  }, [data, config, sectionOrder]);

  // --- Actions ---
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setData(prevState.data);
      setConfig(prevState.config);
      setSectionOrder(prevState.sectionOrder);
      setHistoryIndex(historyIndex - 1); // FIXED: Removed 'uj'
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
    const template = templates[templateKey]; // FIXED: Removed 'SJ'
    if (template) {
      // Merge template config with current config, allowing subsequent edits
      setConfig(prev => ({ ...prev, ...template.config }));
    }
  };

  const handleShare = () => {
    // Simulation of sharing functionality
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({ data, config, sectionOrder })
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${data.personal.name.replace(/\s+/g, "_")}_profiley_data.json`;
    link.click();
    alert("Public link generation requires a backend.\n\nFor now, we've downloaded a JSON snapshot of your resume that you can share or import later.");
  };

  const downloadPDF = () => {
    const element = document.getElementById('cv-document');
    if (!element) return;

    const fileName = (data.personal.name || 'Resume').replace(/\s+/g, '_') + '_CV.pdf';

    // Quality Settings
    const scale = pdfQuality === 'print' ? 3 : 1.5; // Higher scale for print
    const imageQuality = pdfQuality === 'print' ? 0.98 : 0.8;

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: imageQuality },
      html2canvas: {
        scale: scale,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

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

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-300 ${darkMode ? 'dark bg-slate-900' : 'bg-gray-100'}`}>
      <Styles />

      {/* Editor Panel */}
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
        // New Props
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        undo={handleUndo}
        redo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        pdfQuality={pdfQuality}
        setPdfQuality={setPdfQuality}
        handleShare={handleShare}
        isAutoSaving={isAutoSaving}
      />

      {/* Preview Area */}
      <div className={`w-full md:w-2/3 lg:w-3/4 h-screen overflow-y-auto p-4 md:p-8 flex flex-col items-center relative transition-colors duration-300 ${darkMode ? 'bg-slate-800' : 'bg-gray-200'}`}>
        
        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
           <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm text-xs font-semibold ${isAutoSaving ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-300 ${darkMode ? 'text-green-400 bg-slate-900/80' : 'text-green-700 bg-white/80'}`}>
             <Save size={14} /> Auto-saved
           </div>

           <button
            onClick={downloadPDF}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-xl transition-all hover:scale-105 font-bold text-white bg-blue-600 hover:bg-blue-700"
          >
            <Download size={20} />
            Download PDF
          </button>
        </div>

        <PreviewPanel
          data={data}
          config={config}
          sectionOrder={sectionOrder}
        />

        <div className={`mt-8 mb-20 text-xs font-medium uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
          Profiley • Resume Builder
        </div>
      </div>
    </div>
  );
};

export default App;