import React, { useState, useRef } from 'react';
import { Download } from 'lucide-react';
import { initialData, initialConfig, initialSections, templates } from './data';
import EditorPanel from './components/EditorPanel';
import ResumePreview from './components/ResumePreview';

const Profiley = () => {
  const [data, setData] = useState(initialData);
  const [config, setConfig] = useState(initialConfig);
  const [sectionOrder, setSectionOrder] = useState(initialSections);
  const [activeTab, setActiveTab] = useState('sections');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const fileInputRef = useRef(null);

  // --- Handlers ---
  const handlePersonalChange = (e) => {
    setData({
      ...data,
      personal: { ...data.personal, [e.target.name]: e.target.value }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({
          ...prev,
          personal: { ...prev.personal, photoUrl: reader.result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setData(prev => ({
        ...prev,
        personal: { ...prev.personal, photoUrl: "" }
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const applyTemplate = (templateKey) => {
    const template = templates[templateKey];
    if (template) {
      setConfig({ ...config, ...template.config });
    }
  };

  const toggleSectionVisibility = (id) => {
    setSectionOrder(prev => prev.map(sec => sec.id === id ? { ...sec, visible: !sec.visible } : sec));
  };

  // --- Drag and Drop Handlers ---
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

  // --- Custom Sections ---
  const addCustomSection = () => {
    const id = `custom-${Date.now()}`;
    const newSection = { id, label: 'New Custom Section', visible: true, type: 'custom' };
    setSectionOrder([...sectionOrder, newSection]);
    setData(prev => ({
      ...prev,
      custom: {
        ...prev.custom,
        [id]: { title: 'Custom Section', content: 'Add your details here...' }
      }
    }));
    setActiveTab(id);
  };

  const updateCustomSection = (id, field, value) => {
    setData(prev => ({
      ...prev,
      custom: {
        ...prev.custom,
        [id]: { ...prev.custom[id], [field]: value }
      }
    }));
    if (field === 'title') {
      setSectionOrder(prev => prev.map(sec => sec.id === id ? { ...sec, label: value } : sec));
    }
  };

  const deleteCustomSection = (id) => {
    setSectionOrder(prev => prev.filter(sec => sec.id !== id));
    const newCustom = { ...data.custom };
    delete newCustom[id];
    setData({ ...data, custom: newCustom });
    setActiveTab('sections');
  };

  // --- Standard Array Handlers ---
  const handleArrayChange = (section, index, field, value) => {
    const newSection = [...data[section]];
    newSection[index][field] = value;
    setData({ ...data, [section]: newSection });
  };

  const handleSkillChange = (index, field, value) => {
      const newSkills = [...data.skills];
      if (typeof newSkills[index] === 'string') {
          newSkills[index] = { name: newSkills[index], level: 80 };
      }
      newSkills[index][field] = value;
      setData({ ...data, skills: newSkills });
  };

  const addItem = (section, template) => {
    setData({ ...data, [section]: [...data[section], template] });
  };

  const removeItem = (section, index) => {
    const newSection = data[section].filter((_, i) => i !== index);
    setData({ ...data, [section]: newSection });
  };

  const handleSimpleArrayChange = (section, index, value) => {
    const newSection = [...data[section]];
    newSection[index] = value;
    setData({ ...data, [section]: newSection });
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Lora:ital,wght@0,400;0,700;1,400&family=Merriweather:wght@300;400;700&family=Oswald:wght@400;700&family=Playfair+Display:wght@400;700&family=Raleway:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap');
        
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-safe-margin { padding: 0 !important; margin: 0 !important; }
        }
        .direction-rtl { direction: ltr; } 
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 3px; }
        
        /* Font Classes */
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-lora { font-family: 'Lora', serif; }
        .font-merriweather { font-family: 'Merriweather', serif; }
        .font-oswald { font-family: 'Oswald', sans-serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-raleway { font-family: 'Raleway', sans-serif; }
      `}</style>
      
      {/* Left Panel: Editor */}
      <EditorPanel 
        activeTab={activeTab} setActiveTab={setActiveTab}
        data={data} setData={setData}
        config={config} setConfig={setConfig}
        sectionOrder={sectionOrder} setSectionOrder={setSectionOrder}
        draggedItemIndex={draggedItemIndex} 
        handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDragEnd={handleDragEnd}
        handlePersonalChange={handlePersonalChange} 
        handleImageUpload={handleImageUpload} removeImage={removeImage}
        fileInputRef={fileInputRef} triggerFileInput={triggerFileInput}
        toggleSectionVisibility={toggleSectionVisibility}
        addCustomSection={addCustomSection} deleteCustomSection={deleteCustomSection} updateCustomSection={updateCustomSection}
        addItem={addItem} removeItem={removeItem}
        handleArrayChange={handleArrayChange} handleSkillChange={handleSkillChange} handleSimpleArrayChange={handleSimpleArrayChange}
        applyTemplate={applyTemplate}
      />

      {/* Right Panel: Preview */}
      <div className="w-full md:w-2/3 lg:w-3/4 bg-gray-200 h-screen overflow-y-auto print:h-auto print:overflow-visible p-4 md:p-8 flex flex-col items-center print:bg-white print:p-0 print:block relative">
        
        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 print:hidden z-50 animate-bounce-subtle">
          <button 
            onClick={printDocument}
            className={`flex items-center gap-2 px-8 py-4 rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-blue-500/30 font-bold cursor-pointer text-white bg-blue-600 hover:bg-blue-700`}
          >
            <Download size={22} /> <span className="text-lg">Download PDF</span>
          </button>
        </div>

        {/* The Document */}
        <ResumePreview 
          data={data}
          config={config}
          sectionOrder={sectionOrder}
        />
        
        {/* Footer for Preview Area */}
        <div className="mt-8 text-gray-400 text-xs font-medium uppercase tracking-widest print:hidden">
          Profiley • Resume Builder
        </div>
      </div>
    </div>
  );
};

export default Profiley;