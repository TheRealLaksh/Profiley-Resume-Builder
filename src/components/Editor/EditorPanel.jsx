// src/components/Editor/EditorPanel.jsx
import React, { useRef } from 'react';
import { 
    Layout, Palette, Columns, Type, Settings, FileText, Layers, Plus, 
    GripVertical, Eye, EyeOff, User, Upload, X, Trash2, Briefcase, GraduationCap, Code, Award, Heart, FilePlus,
    RotateCcw, RotateCw, Moon, Sun, Share2, Loader2, Monitor, Printer
} from 'lucide-react';
import { EditorSection, Toggle, Select, ColorButton } from '../UI/FormElements';
import { colorThemes, templates } from '../../data/constants';

const EditorPanel = ({ 
    activeTab, setActiveTab, data, setData, config, setConfig, 
    sectionOrder, setSectionOrder, applyTemplate, 
    draggedItemIndex, setDraggedItemIndex, 
    handleDragStart, handleDragOver, handleDragEnd,
    // Props
    darkMode, toggleDarkMode, undo, redo, canUndo, canRedo, 
    pdfQuality, setPdfQuality, handleShare, isSharing
}) => {
    
    const fileInputRef = useRef(null);

    // Helper for conditional styling
    const panelClass = darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-gray-50 border-gray-200 text-gray-800';
    const cardClass = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
    const textClass = darkMode ? 'text-slate-200' : 'text-gray-800';
    const subTextClass = darkMode ? 'text-slate-400' : 'text-gray-500';
    const inputClass = darkMode 
        ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-500' 
        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500';
    const buttonClass = darkMode 
        ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200' 
        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700';

    // --- Handlers (Existing logic preserved) ---
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
            personal: { ...prev.personal, photoUrl: '' }
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        const newSection = [...data[section]];
        newSection[index][field] = value;
        setData({ ...data, [section]: newSection });
    };

    const handleSimpleArrayChange = (section, index, value) => {
        const newSection = [...data[section]];
        newSection[index] = value;
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
    
    const addCustomSection = () => {
        const id = `custom-${Date.now()}`;
        const newSection = { id, label: 'New Custom Section', visible: true, type: 'custom' };
        setSectionOrder([...sectionOrder, newSection]);
        setData(prev => ({
            ...prev,
            custom: { ...prev.custom, [id]: { title: 'Custom Section', content: 'Add your details here...' } }
        }));
        setActiveTab(id);
    };

    const updateCustomSection = (id, field, value) => {
        setData(prev => ({
            ...prev,
            custom: { ...prev.custom, [id]: { ...prev.custom[id], [field]: value } }
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

    return (
        <div className={`w-full md:w-1/3 lg:w-1/4 border-r h-screen overflow-y-auto custom-scrollbar flex flex-col shadow-xl z-10 transition-colors duration-300 ${panelClass}`}>
            
            {/* Top Toolbar: Logo, Undo/Redo, Theme, Share */}
            <div className={`p-4 border-b sticky top-0 z-20 shadow-sm flex flex-col gap-4 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-extrabold flex items-center tracking-tight">
                        <Layout className="mr-2 text-blue-600 fill-blue-100" /> Profiley
                    </h1>
                    <div className="flex items-center gap-1">
                        <button onClick={undo} disabled={!canUndo} className={`p-1.5 rounded-md transition-all ${!canUndo ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-600'}`} title="Undo">
                            <RotateCcw size={18} />
                        </button>
                        <button onClick={redo} disabled={!canRedo} className={`p-1.5 rounded-md transition-all ${!canRedo ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-600'}`} title="Redo">
                            <RotateCw size={18} />
                        </button>
                        <div className={`w-px h-4 mx-1 ${darkMode ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
                        <button onClick={toggleDarkMode} className="p-1.5 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-all" title="Toggle Theme">
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className={`flex p-1 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'}`}>
                    <button onClick={() => setActiveTab('sections')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${!['design', 'export'].includes(activeTab) ? `${darkMode ? 'bg-slate-700 text-blue-400' : 'bg-white text-blue-600'} shadow-sm` : `${subTextClass} hover:opacity-80`}`}>Content</button>
                    <button onClick={() => setActiveTab('design')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${activeTab === 'design' ? `${darkMode ? 'bg-slate-700 text-blue-400' : 'bg-white text-blue-600'} shadow-sm` : `${subTextClass} hover:opacity-80`}`}>Design</button>
                    <button onClick={() => setActiveTab('export')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${activeTab === 'export' ? `${darkMode ? 'bg-slate-700 text-blue-400' : 'bg-white text-blue-600'} shadow-sm` : `${subTextClass} hover:opacity-80`}`}>Export</button>
                </div>
            </div>

            <div className="p-4 flex-grow">
                {activeTab === 'export' ? (
                     <div className={`p-5 rounded-xl shadow-sm border space-y-6 ${cardClass}`}>
                        <div>
                            <h3 className={`text-sm font-bold mb-3 flex items-center uppercase tracking-wider ${textClass}`}><Settings size={16} className="mr-2 opacity-50"/> Export Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${subTextClass}`}>PDF Quality</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => setPdfQuality('screen')}
                                            className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${pdfQuality === 'screen' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : `${darkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'}`}`}
                                        >
                                            <Monitor size={20} />
                                            <span className="text-xs font-semibold">Screen (Fast)</span>
                                        </button>
                                        <button 
                                            onClick={() => setPdfQuality('print')}
                                            className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${pdfQuality === 'print' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : `${darkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'}`}`}
                                        >
                                            <Printer size={20} />
                                            <span className="text-xs font-semibold">Print (HD)</span>
                                        </button>
                                    </div>
                                    <p className="text-[10px] mt-2 text-gray-400">Print quality renders at 3x resolution (300 DPI equivalent) but takes longer to generate.</p>
                                </div>
                                
                                <div className={`h-px w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}></div>

                                <div>
                                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${subTextClass}`}>Shareable Link</label>
                                    <button 
                                        onClick={handleShare}
                                        disabled={isSharing}
                                        className={`w-full p-3 rounded-lg border flex items-center justify-center gap-2 transition-all font-semibold text-sm ${buttonClass} ${isSharing ? 'opacity-50 cursor-wait' : ''}`}
                                    >
                                        {isSharing ? <Loader2 className="animate-spin" size={16} /> : <Share2 size={16} />}
                                        {isSharing ? 'Generating Link...' : 'Generate Public Link'}
                                    </button>
                                    <p className="text-[10px] mt-2 text-gray-400 text-center">Creates a permanent link to your current version.</p>
                                </div>
                            </div>
                        </div>
                     </div>
                ) : activeTab === 'design' ? (
                     <div className={`p-5 rounded-xl shadow-sm border space-y-8 ${cardClass}`}>
                        {/* Templates */}
                        <div>
                            <h3 className={`text-sm font-bold mb-3 flex items-center uppercase tracking-wider ${textClass}`}><Layout size={16} className="mr-2 opacity-50"/> Templates</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(templates).map(([key, tpl]) => (
                                    <button key={key} onClick={() => applyTemplate(key)} className={`flex flex-col items-center p-2 border rounded-lg transition-all group ${darkMode ? 'border-slate-600 hover:border-blue-500 hover:bg-slate-700' : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`}>
                                        <div className="w-full h-16 bg-gray-100 rounded mb-2 overflow-hidden relative">
                                            {/* Visuals */}
                                            {key === 'modern' && <div className="w-full h-full bg-white flex"><div className="w-1/3 bg-slate-800 h-full"></div><div className="w-2/3 h-full"></div></div>}
                                            {key === 'minimal' && <div className="w-full h-full bg-white border-t-4 border-black"></div>}
                                            {key === 'creative' && <div className="w-full h-full bg-white flex flex-row-reverse"><div className="w-1/3 bg-rose-200 h-full"></div><div className="w-2/3 h-full"></div></div>}
                                            {key === 'ats' && <div className="w-full h-full bg-white flex flex-col p-1 gap-1"><div className="h-1 w-full bg-gray-300"></div><div className="h-1 w-3/4 bg-gray-200"></div></div>}
                                        </div>
                                        <span className={`text-xs font-semibold ${subTextClass} group-hover:text-blue-600`}>{tpl.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theme Colors */}
                        <div>
                            <h3 className={`text-sm font-bold mb-3 flex items-center uppercase tracking-wider ${textClass}`}><Palette size={16} className="mr-2 opacity-50"/> Color Palette</h3>
                            <div className="flex gap-3 flex-wrap">
                                {Object.entries(colorThemes).map(([key, theme]) => (
                                    <ColorButton key={key} colorKey={key} theme={theme} selected={config.themeColor === key} onClick={() => setConfig({...config, themeColor: key})} />
                                ))}
                            </div>
                        </div>

                        {/* Layout Options */}
                        <div>
                             <h3 className={`text-sm font-bold mb-3 flex items-center uppercase tracking-wider ${textClass}`}><Columns size={16} className="mr-2 opacity-50"/> Layout & Structure</h3>
                             <div className="space-y-1">
                                <Toggle label="Reverse Layout" value={config.layoutReverse} onChange={(v) => setConfig({...config, layoutReverse: v})} darkMode={darkMode} />
                                <Select label="Font Family" value={config.fontFamily} onChange={(v) => setConfig({...config, fontFamily: v})} 
                                    options={[
                                        {value: 'font-inter', label: 'Inter (Clean)'},
                                        {value: 'font-merriweather', label: 'Merriweather (Serif)'},
                                        {value: 'font-playfair', label: 'Playfair (Elegant)'},
                                        {value: 'font-lora', label: 'Lora (Readable)'},
                                        {value: 'font-raleway', label: 'Raleway (Modern)'},
                                        {value: 'font-oswald', label: 'Oswald (Bold)'},
                                        {value: 'font-sans', label: 'System Sans'},
                                        {value: 'font-serif', label: 'System Serif'},
                                        {value: 'font-mono', label: 'Monospace'}
                                    ]} darkMode={darkMode} />
                                <Select label="Page Spacing" value={config.spacingScale} onChange={(v) => setConfig({...config, spacingScale: v})} 
                                    options={[{value: 'compact', label: 'Compact'}, {value: 'normal', label: 'Normal'}, {value: 'spacious', label: 'Spacious'}]} darkMode={darkMode} />
                                <Select label="Sidebar Background" value={config.sidebarBg} onChange={(v) => setConfig({...config, sidebarBg: v})}
                                    options={[{value: 'none', label: 'Transparent'}, {value: 'gray', label: 'Light Gray'}, {value: 'theme', label: 'Theme Tint'}]} darkMode={darkMode} />
                                <Toggle label="Show Profile Photo" value={config.showPhoto} onChange={(v) => setConfig({...config, showPhoto: v})} darkMode={darkMode} />
                             </div>
                        </div>

                        {/* Typography and Extras sections would follow similar pattern with darkMode prop passed to inputs */}
                        <div>
                            <h3 className={`text-sm font-bold mb-3 flex items-center uppercase tracking-wider ${textClass}`}><Type size={16} className="mr-2 opacity-50"/> Typography</h3>
                            <div className="space-y-1">
                                <Select label="Font Scale" value={config.fontScale} onChange={(v) => setConfig({...config, fontScale: v})}
                                    options={[{value: 'text-xs', label: 'Extra Small'}, {value: 'text-sm', label: 'Small'}, {value: 'text-base', label: 'Normal'}, {value: 'text-lg', label: 'Large'}, {value: 'text-xl', label: 'Extra Large'}]} darkMode={darkMode} />
                                <Select label="Header Alignment" value={config.headerAlign} onChange={(v) => setConfig({...config, headerAlign: v})}
                                    options={[{value: 'text-left', label: 'Left'}, {value: 'text-center', label: 'Center'}, {value: 'text-right', label: 'Right'}]} darkMode={darkMode} />
                                <Toggle label="Uppercase Headers" value={config.uppercaseHeaders} onChange={(v) => setConfig({...config, uppercaseHeaders: v})} darkMode={darkMode} />
                            </div>
                        </div>
                     </div>
                ) : (
                    <>
                        {/* Sections List */}
                        <div className="mb-6 flex flex-col gap-2">
                             <button onClick={() => setActiveTab('sections')} className={`w-full flex items-center p-3 mb-2 rounded-lg transition-all ${activeTab === 'sections' ? 'bg-blue-600 text-white shadow-md translate-x-1' : `${buttonClass}`}`}>
                                <Layers size={18} className="mr-3" /> <span className="font-medium">Manage Sections</span>
                             </button>
                             
                             <h2 className={`text-xs font-bold uppercase tracking-wider mt-4 mb-2 pl-1 ${subTextClass}`}>Edit Section Content</h2>
                             
                             {/* Section Buttons */}
                             {sectionOrder.filter(s => s.visible).map(sec => (
                                <EditorSection key={sec.id} title={sec.label} id={sec.id} activeTab={activeTab} setActiveTab={setActiveTab} 
                                    icon={sec.type === 'custom' ? FilePlus : (sec.id === 'summary' || sec.id === 'personal') ? User : sec.id === 'experience' ? Briefcase : sec.id === 'education' ? GraduationCap : sec.id === 'skills' ? Code : sec.id === 'achievements' ? Award : Heart} 
                                    onDelete={sec.type === 'custom' ? () => deleteCustomSection(sec.id) : null}
                                    darkMode={darkMode}
                                />
                             ))}
                             <EditorSection title="Personal Info" icon={User} id="personal" activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} /> {/* FIXED: Removed 'VP' */}
                        </div>

                        <div className={`p-5 rounded-xl shadow-sm border ${cardClass}`}>
                             {/* Specific Edit Forms (Using inputClass for styling) */}
                             {activeTab === 'sections' && (
                                <div className="space-y-4">
                                    <div className={`flex justify-between items-center border-b pb-2 ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                                        <h3 className={`font-bold ${textClass}`}>Reorder & Toggle</h3>
                                        <button onClick={addCustomSection} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 font-semibold flex items-center gap-1"><FilePlus size={14} /> Add Custom</button>
                                    </div>
                                    <div className="space-y-2">
                                        {sectionOrder.map((section, index) => (
                                            <div key={section.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} className={`flex items-center gap-3 p-3 rounded-lg border cursor-move transition-colors ${draggedItemIndex === index ? 'opacity-50 border-blue-400' : darkMode ? 'bg-slate-900 border-slate-700 hover:border-slate-500' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}`}>
                                                <GripVertical size={16} className="text-gray-400" />
                                                <span className={`flex-grow text-sm font-medium ${textClass}`}>{section.label}</span>
                                                <button onClick={() => setSectionOrder(prev => prev.map(sec => sec.id === section.id ? { ...sec, visible: !sec.visible } : sec))} className={`p-1.5 rounded-md transition-colors ${section.visible ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-gray-100'}`} title={section.visible ? "Hide" : "Show"}>
                                                    {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             )}

                             {/* Personal Edit */}
                             {activeTab === 'personal' && (
                                <div className="space-y-4">
                                     <h3 className={`font-bold border-b pb-2 ${textClass} ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>Personal Details</h3>
                                     <div className="mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-300 flex-shrink-0">
                                                {data.personal.photoUrl ? (
                                                    <img src={data.personal.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-full h-full p-3 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                                                <div className="flex gap-2">
                                                    <button onClick={() => fileInputRef.current.click()} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md hover:bg-blue-100 transition-colors flex items-center gap-1"><Upload size={14} /> Upload</button>
                                                    {data.personal.photoUrl && (
                                                        <button onClick={removeImage} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-md hover:bg-red-100 transition-colors flex items-center gap-1"><X size={14} /> Remove</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                     </div>
                                     <input type="text" name="name" value={data.personal.name} onChange={handlePersonalChange} placeholder="Full Name" className={`w-full p-2.5 border rounded-md outline-none text-sm ${inputClass}`} />
                                     <input type="text" name="title" value={data.personal.title} onChange={handlePersonalChange} placeholder="Job Title" className={`w-full p-2.5 border rounded-md outline-none text-sm ${inputClass}`} />
                                     <input type="email" name="email" value={data.personal.email} onChange={handlePersonalChange} placeholder="Email" className={`w-full p-2.5 border rounded-md outline-none text-sm ${inputClass}`} />
                                     <input type="text" name="phone" value={data.personal.phone} onChange={handlePersonalChange} placeholder="Phone" className={`w-full p-2.5 border rounded-md outline-none text-sm ${inputClass}`} />
                                     <input type="text" name="location" value={data.personal.location} onChange={handlePersonalChange} placeholder="Location" className={`w-full p-2.5 border rounded-md outline-none text-sm ${inputClass}`} />
                                     <input type="text" name="linkedin" value={data.personal.linkedin} onChange={handlePersonalChange} placeholder="LinkedIn URL" className={`w-full p-2.5 border rounded-md outline-none text-sm ${inputClass}`} />
                                     <input type="text" name="portfolio" value={data.personal.portfolio} onChange={handlePersonalChange} placeholder="Portfolio URL" className={`w-full p-2.5 border rounded-md outline-none text-sm ${inputClass}`} />
                                </div>
                             )}

                             {/* Standard List Sections (Experience, Education, etc.) */}
                             {['experience', 'education'].includes(activeTab) && (
                                <div className="space-y-6">
                                    <div className={`flex justify-between items-center border-b pb-2 ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                                        <h3 className={`font-bold ${textClass}`}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                                        <button onClick={() => addItem(activeTab, activeTab === 'experience' ? { id: Date.now(), role: '', company: '', year: '', details: '' } : { id: Date.now(), institution: '', degree: '', year: '', details: '' })} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors"><Plus size={20}/></button>
                                    </div>
                                    {data[activeTab].map((item, index) => (
                                        <div key={item.id} className={`p-4 rounded-lg border relative group ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                                            <button onClick={() => removeItem(activeTab, index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                            <input type="text" value={item.role || item.institution} onChange={(e) => handleArrayChange(activeTab, index, activeTab === 'experience' ? 'role' : 'institution', e.target.value)} placeholder={activeTab === 'experience' ? 'Role' : 'Institution'} className={`w-full mb-2 p-1.5 bg-transparent border-b focus:border-blue-500 outline-none font-medium text-sm ${darkMode ? 'border-slate-600 text-white' : 'border-gray-300 text-gray-900'}`} />
                                            <input type="text" value={item.company || item.degree} onChange={(e) => handleArrayChange(activeTab, index, activeTab === 'experience' ? 'company' : 'degree', e.target.value)} placeholder={activeTab === 'experience' ? 'Company' : 'Degree'} className={`w-full mb-2 p-1.5 bg-transparent border-b focus:border-blue-500 outline-none text-sm ${darkMode ? 'border-slate-600 text-gray-300' : 'border-gray-300 text-gray-700'}`} />
                                            <input type="text" value={item.year} onChange={(e) => handleArrayChange(activeTab, index, 'year', e.target.value)} placeholder="Year/Duration" className={`w-full mb-2 p-1.5 bg-transparent border-b focus:border-blue-500 outline-none text-xs ${darkMode ? 'border-slate-600 text-gray-400' : 'border-gray-300 text-gray-500'}`} />
                                            <textarea value={item.details} onChange={(e) => handleArrayChange(activeTab, index, 'details', e.target.value)} placeholder="Details..." rows={3} className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none ${inputClass}`} />
                                        </div>
                                    ))}
                                </div>
                             )}

                             {/* Simple List Sections (Skills, Achievements, etc.) handled similarly... */}
                             {activeTab === 'skills' && (
                                <div className="space-y-4">
                                     <div className={`flex justify-between items-center border-b pb-2 ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                                        <h3 className={`font-bold ${textClass}`}>Skills</h3>
                                        <button onClick={() => addItem('skills', { name: '', level: 80 })} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full"><Plus size={20}/></button>
                                    </div>
                                    {data.skills.map((skill, index) => (
                                        <div key={index} className={`flex flex-col gap-2 p-2 border rounded-md mb-2 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                                            <div className="flex gap-2 items-center">
                                                <input type="text" value={skill.name} onChange={(e) => handleSkillChange(index, 'name', e.target.value)} placeholder="Skill" className={`flex-grow p-2 border rounded-md outline-none text-sm ${inputClass}`} />
                                                <button onClick={() => removeItem('skills', index)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                                            </div>
                                            <input type="range" value={skill.level} onChange={(e) => handleSkillChange(index, 'level', parseInt(e.target.value))} className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer" />
                                        </div>
                                    ))}
                                </div>
                             )}
                             
                             {/* Summary */}
                             {activeTab === 'summary' && (
                                <div className="space-y-4">
                                    <h3 className={`font-bold border-b pb-2 ${textClass} ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>Profile Summary</h3>
                                    <textarea name="summary" value={data.personal.summary} onChange={handlePersonalChange} placeholder="Write a professional summary..." rows={8} className={`w-full p-2.5 border rounded-md outline-none text-sm ${inputClass}`} /> {/* FIXED: Removed 'Mx' */}
                                </div>
                             )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditorPanel;