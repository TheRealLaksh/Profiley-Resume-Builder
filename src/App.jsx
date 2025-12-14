// src/App.jsx
import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react'; // Added Loader icon
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import EditorPanel from './components/Editor/EditorPanel';
import PreviewPanel from './components/Preview/PreviewPanel';
import { initialData, initialConfig, initialSections, templates } from './data/constants';

// Google Fonts Import
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Lora:ital,wght@0,400;0,700;1,400&family=Merriweather:wght@300;400;700&family=Oswald:wght@400;700&family=Playfair+Display:wght@400;700&family=Raleway:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap');
  `}</style>
);

const App = () => {
  const [data, setData] = useState(initialData);
  const [config, setConfig] = useState(initialConfig);
  const [sectionOrder, setSectionOrder] = useState(initialSections);
  const [activeTab, setActiveTab] = useState('sections');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false); // State for loading feedback

  // --- Handlers ---
  const applyTemplate = (templateKey) => {
    const template = templates[templateKey];
    if (template) {
      setConfig({ ...config, ...template.config });
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
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

  // --- NEW DOWNLOAD LOGIC ---
  const downloadPDF = async () => {
    setIsDownloading(true);
    const element = document.getElementById('cv-document');
    if (!element) {
      setIsDownloading(false);
      return;
    }

    try {
      // 1. Capture the element as a high-quality Canvas
      // Scale 2 or 3 gives sharper text in the PDF
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true, // Important for external images like profile pics
        logging: false,
        backgroundColor: '#ffffff' // Ensure white background
      });

      // 2. Convert Canvas to JPG Data URL
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // 3. Calculate Dimensions to fit A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate ratio to fit width perfectly
      const ratio = pdfWidth / imgWidth;
      const finalHeight = imgHeight * ratio;

      // 4. Add Image to PDF
      // If content is shorter than A4, it just sits at top
      // If content is longer, we might need multiple pages (basic version fits to one page logic for now)
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, finalHeight);

      // 5. Save
      const safeName = (data.personal.name || 'Resume').replace(/\s+/g, '_');
      pdf.save(`${safeName}_CV.pdf`);

    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("Something went wrong while generating the PDF.");
    } finally {
      setIsDownloading(false);
    }
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
              onClick={downloadPDF}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-8 py-4 rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-blue-500/30 font-bold cursor-pointer text-white ${isDownloading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isDownloading ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <Download size={22} />
              )}
              <span className="text-lg">{isDownloading ? 'Converting...' : 'Download PDF'}</span>
            </button>
         </div>
         
         <PreviewPanel 
            data={data} 
            config={config} 
            sectionOrder={sectionOrder} 
         />
         
         <div className="mt-8 text-gray-400 text-xs font-medium uppercase tracking-widest print:hidden">
            Profiley • Resume Builder
         </div>
      </div>
    </div>
  );
};

export default App;