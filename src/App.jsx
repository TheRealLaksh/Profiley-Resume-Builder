import React, { useState } from 'react';
import { Download } from 'lucide-react';
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
  `}</style>
);

const App = () => {
  const [data, setData] = useState(initialData);
  const [config, setConfig] = useState(initialConfig);
  const [sectionOrder, setSectionOrder] = useState(initialSections);
  const [activeTab, setActiveTab] = useState('sections');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const applyTemplate = (templateKey) => {
    const template = templates[templateKey];
    if (template) setConfig({ ...config, ...template.config });
  };

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

  // ✅ REAL PDF DOWNLOAD (NO PRINT PREVIEW)
  const downloadPDF = () => {
    const element = document.getElementById('cv-document');
    if (!element) return;

    const fileName =
      (data.personal.name || 'Resume').replace(/\s+/g, '_') + '_CV.pdf';

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
      <Styles />

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
      />

      <div className="w-full md:w-2/3 lg:w-3/4 bg-gray-200 h-screen overflow-y-auto p-4 md:p-8 flex flex-col items-center relative">
        <button
          onClick={downloadPDF}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-8 py-4 rounded-full shadow-2xl transition-all hover:scale-105 font-bold text-white bg-blue-600 hover:bg-blue-700"
        >
          <Download size={22} />
          Download PDF
        </button>

        <PreviewPanel
          data={data}
          config={config}
          sectionOrder={sectionOrder}
        />

        <div className="mt-8 text-gray-400 text-xs font-medium uppercase tracking-widest">
          Profiley • Resume Builder
        </div>
      </div>
    </div>
  );
};

export default App;
