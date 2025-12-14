// src/App.jsx
import React, { useState } from 'react';
import { Download } from 'lucide-react';
import EditorPanel from './components/Editor/EditorPanel';
import PreviewPanel from './components/Preview/PreviewPanel';
import { initialData, initialConfig, initialSections, templates } from './data/constants';

// Google Fonts Import
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Lora:ital,wght@0,400;0,700;1,400&family=Merriweather:wght@300;400;700&family=Oswald:wght@400;700&family=Playfair+Display:wght@400;700&family=Raleway:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap');
    @media print {
      @page { margin: 0; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .print-safe-margin { padding: 0 !important; margin: 0 !important; }
    }
  `}</style>
);

const App = () => {
  const [data, setData] = useState(initialData);
  const [config, setConfig] = useState(initialConfig);
  const [sectionOrder, setSectionOrder] = useState(initialSections);
  const [activeTab, setActiveTab] = useState('sections');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  // --- Handlers ---
  const applyTemplate = (templateKey) => {
    const template = templates[templateKey];
    if (template) {
      setConfig({ ...config, ...template.config });
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    const newOrder = [...sectionOrder];
    const draggedItem = newOrder[draggedItemIndex];
    newOrder.splice(draggedItemIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    
    setSectionOrder(newOrder);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const printDocument = () => {
    const safeName = (data.personal.name || 'Resume').replace(/\s+/g, '_');
    const originalTitle = document.title;
    document.title = `${safeName}_CV`;
    window.print();
    setTimeout(() => document.title = originalTitle, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
      <Fonts />
      
      {/* Editor Side */}
      <EditorPanel 
        activeTab={activeTab} setActiveTab={setActiveTab}
        data={data} setData={setData}
        config={config} setConfig={setConfig}
        sectionOrder={sectionOrder} setSectionOrder={setSectionOrder}
        applyTemplate={applyTemplate}
        draggedItemIndex={draggedItemIndex} setDraggedItemIndex={setDraggedItemIndex}
        handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDragEnd={handleDragEnd}
      />

      {/* Preview Side */}
      <div className="w-full md:w-2/3 lg:w-3/4 bg-gray-200 h-screen overflow-y-auto print:h-auto print:overflow-visible p-4 md:p-8 flex flex-col items-center print:bg-white print:p-0 print:block relative">
         <div className="fixed bottom-8 right-8 print:hidden z-50 animate-bounce-subtle">
            <button 
              onClick={printDocument}
              className="flex items-center gap-2 px-8 py-4 rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-blue-500/30 font-bold cursor-pointer text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download size={22} /> <span className="text-lg">Download PDF</span>
            </button>
         </div>
         
         <PreviewPanel 
            data={data} 
            config={config} 
            sectionOrder={sectionOrder} 
            printDocument={printDocument}
         />
         
         <div className="mt-8 text-gray-400 text-xs font-medium uppercase tracking-widest print:hidden">
            Profiley • Resume Builder
         </div>
      </div>
    </div>
  );
};

export default App;