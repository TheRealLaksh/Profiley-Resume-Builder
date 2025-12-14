// src/components/Editor/EditorPanel.jsx
import React, { useRef } from 'react';
import { 
    Layout, Palette, Columns, Type, Settings, FileText, Layers, Plus, 
    GripVertical, Eye, EyeOff, User, Upload, X, Trash2, Briefcase, GraduationCap, Code, Award, Heart, FilePlus 
} from 'lucide-react';
import { EditorSection, Toggle, Select, ColorButton } from '../UI/FormElements';
import { colorThemes, templates } from '../../data/constants';

const EditorPanel = ({ 
    activeTab, setActiveTab, data, setData, config, setConfig, 
    sectionOrder, setSectionOrder, applyTemplate, 
    draggedItemIndex, setDraggedItemIndex, 
    handleDragStart, handleDragOver, handleDragEnd 
}) => {
    
    const fileInputRef = useRef(null);

    // Handlers
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

    const handleArrayChange = (section, index, field, value) => {
        const newSection = [...data[section]];
        newSection[index][field] = value;
        setData({ ...data, [section]: newSection });
    };

    const addItem = (section, template) => {
        setData({ ...data, [section]: [...data[section], template] });
    };

    const removeItem = (section, index) => {
        const newSection = data[section].filter((_, i) => i !== index);
        setData({ ...data, [section]: newSection });
    };
    
    // Custom Section Handlers
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
        <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto custom-scrollbar print:hidden flex flex-col shadow-xl z-10">
            <div className="p-5 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <h1 className="text-xl font-extrabold text-gray-800 flex items-center tracking-tight">
                    <Layout className="mr-2 text-blue-600 fill-blue-100" /> Profiley
                </h1>
                <div className="flex mt-4 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
                    <button onClick={() => setActiveTab('sections')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${!['design'].includes(activeTab) ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Content</button>
                    <button onClick={() => setActiveTab('design')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${activeTab === 'design' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Design</button>
                </div>
            </div>

            <div className="p-4 flex-grow">
                {activeTab === 'design' ? (
                     <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-8">
                        {/* Templates */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center uppercase tracking-wider"><Layout size={16} className="mr-2 text-gray-400"/> Templates</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(templates).map(([key, tpl]) => (
                                    <button key={key} onClick={() => applyTemplate(key)} className="flex flex-col items-center p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                        <div className="w-full h-16 bg-gray-100 rounded mb-2 overflow-hidden relative">
                                            {/* Visuals can be added here similar to original */}
                                        </div>
                                        <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600">{tpl.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theme Colors */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center uppercase tracking-wider"><Palette size={16} className="mr-2 text-gray-400"/> Color Palette</h3>
                            <div className="flex gap-3 flex-wrap">
                                {Object.entries(colorThemes).map(([key, theme]) => (
                                    <ColorButton key={key} colorKey={key} theme={theme} selected={config.themeColor === key} onClick={() => setConfig({...config, themeColor: key})} />
                                ))}
                            </div>
                        </div>

                        {/* Layout Toggles */}
                        <div>
                             <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center uppercase tracking-wider"><Columns size={16} className="mr-2 text-gray-400"/> Layout & Structure</h3>
                             <div className="space-y-1">
                                <Toggle label="Reverse Layout" value={config.layoutReverse} onChange={(v) => setConfig({...config, layoutReverse: v})} />
                                <Select label="Font Family" value={config.fontFamily} onChange={(v) => setConfig({...config, fontFamily: v})} 
                                    options={[{value: 'font-inter', label: 'Inter'}, {value: 'font-merriweather', label: 'Merriweather'}, {value: 'font-playfair', label: 'Playfair'}, {value: 'font-mono', label: 'Monospace'}]} />
                                <Select label="Page Spacing" value={config.spacingScale} onChange={(v) => setConfig({...config, spacingScale: v})} 
                                    options={[{value: 'compact', label: 'Compact'}, {value: 'normal', label: 'Normal'}, {value: 'spacious', label: 'Spacious'}]} />
                             </div>
                        </div>
                     </div>
                ) : (
                    <>
                        {/* Sections List */}
                        <div className="mb-6 flex flex-col gap-2">
                             <button onClick={() => setActiveTab('sections')} className={`w-full flex items-center p-3 mb-2 rounded-lg transition-all ${activeTab === 'sections' ? 'bg-blue-600 text-white shadow-md translate-x-1' : 'bg-white text-gray-700'}`}>
                                <Layers size={18} className="mr-3" /> <span className="font-medium">Manage Sections</span>
                             </button>
                             
                             <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2 pl-1">Edit Section Content</h2>
                             {sectionOrder.filter(s => s.visible).map(sec => (
                                <EditorSection key={sec.id} title={sec.label} id={sec.id} activeTab={activeTab} setActiveTab={setActiveTab} 
                                    icon={sec.type === 'custom' ? FilePlus : (sec.id === 'summary' || sec.id === 'personal') ? User : sec.id === 'experience' ? Briefcase : sec.id === 'education' ? GraduationCap : sec.id === 'skills' ? Code : sec.id === 'achievements' ? Award : Heart} 
                                    onDelete={sec.type === 'custom' ? () => deleteCustomSection(sec.id) : null}
                                />
                             ))}
                             <EditorSection title="Personal Info" icon={User} id="personal" activeTab={activeTab} setActiveTab={setActiveTab} />
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                             {/* Section Reorder logic */}
                             {activeTab === 'sections' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <h3 className="font-bold text-gray-800">Reorder & Toggle</h3>
                                        <button onClick={addCustomSection} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 font-semibold flex items-center gap-1"><Plus size={14} /> Add Custom</button>
                                    </div>
                                    <div className="space-y-2">
                                        {sectionOrder.map((section, index) => (
                                            <div key={section.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} className={`flex items-center gap-3 p-3 rounded-lg border ${draggedItemIndex === index ? 'bg-blue-50 border-blue-300 opacity-50' : 'bg-gray-50 border-gray-200'} cursor-move`}>
                                                <GripVertical size={16} className="text-gray-400" />
                                                <span className="flex-grow text-sm font-medium text-gray-700">{section.label}</span>
                                                <button onClick={() => setSectionOrder(prev => prev.map(sec => sec.id === section.id ? { ...sec, visible: !sec.visible } : sec))}>
                                                    {section.visible ? <Eye size={16} className="text-gray-600"/> : <EyeOff size={16} className="text-gray-400"/>}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             )}

                             {/* Personal Edit */}
                             {activeTab === 'personal' && (
                                <div className="space-y-4">
                                     <h3 className="font-bold text-gray-800 border-b pb-2">Personal Details</h3>
                                     <div className="flex items-center gap-4">
                                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                                        <button onClick={() => fileInputRef.current.click()} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md hover:bg-blue-100 flex items-center gap-1"><Upload size={14} /> Upload Photo</button>
                                     </div>
                                     <input type="text" name="name" value={data.personal.name} onChange={handlePersonalChange} placeholder="Full Name" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                                     <input type="text" name="title" value={data.personal.title} onChange={handlePersonalChange} placeholder="Job Title" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                                     <input type="email" name="email" value={data.personal.email} onChange={handlePersonalChange} placeholder="Email" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                                     <input type="text" name="phone" value={data.personal.phone} onChange={handlePersonalChange} placeholder="Phone" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                                     <input type="text" name="linkedin" value={data.personal.linkedin} onChange={handlePersonalChange} placeholder="LinkedIn" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                                     <input type="text" name="portfolio" value={data.personal.portfolio} onChange={handlePersonalChange} placeholder="Portfolio" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                                </div>
                             )}

                             {/* Summary Edit */}
                             {activeTab === 'summary' && (
                                <textarea name="summary" value={data.personal.summary} onChange={handlePersonalChange} placeholder="Professional Summary" rows={8} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                             )}

                             {/* Experience Edit */}
                             {activeTab === 'experience' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-gray-800">Experience</h3>
                                        <button onClick={() => addItem('experience', { id: Date.now(), role: '', company: '', year: '', details: '' })} className="text-blue-600"><Plus size={20}/></button>
                                    </div>
                                    {data.experience.map((exp, index) => (
                                        <div key={exp.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                                            <button onClick={() => removeItem('experience', index)} className="absolute top-2 right-2 text-red-500"><Trash2 size={16}/></button>
                                            <input type="text" value={exp.role} onChange={(e) => handleArrayChange('experience', index, 'role', e.target.value)} placeholder="Role" className="w-full mb-2 p-1.5 bg-transparent border-b outline-none font-medium" />
                                            <input type="text" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} placeholder="Company" className="w-full mb-2 p-1.5 bg-transparent border-b outline-none" />
                                            <textarea value={exp.details} onChange={(e) => handleArrayChange('experience', index, 'details', e.target.value)} placeholder="Details" rows={3} className="w-full p-2 bg-white border rounded text-sm" />
                                        </div>
                                    ))}
                                </div>
                             )}

                             {/* Custom Section Edit */}
                             {activeTab.startsWith('custom-') && data.custom[activeTab] && (
                                <div className="space-y-4">
                                    <input type="text" value={data.custom[activeTab].title} onChange={(e) => updateCustomSection(activeTab, 'title', e.target.value)} className="w-full p-2.5 border rounded-md font-bold" />
                                    <textarea value={data.custom[activeTab].content} onChange={(e) => updateCustomSection(activeTab, 'content', e.target.value)} rows={10} className="w-full p-2.5 border rounded-md" />
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