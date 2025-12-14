import React, { useRef } from 'react';
import { 
    Layers, Plus, GripVertical, Eye, EyeOff, User, Upload, X, Trash2, 
    Briefcase, GraduationCap, Code, Award, Heart, FilePlus 
} from 'lucide-react';
import { EditorSection } from '../UI/FormElements';

const ContentTab = ({ 
    activeTab, 
    setActiveTab, 
    data, 
    setData, 
    sectionOrder, 
    setSectionOrder, 
    draggedItemIndex, 
    handleDragStart, 
    handleDragOver, 
    handleDragEnd, 
    darkMode 
}) => {
    
    const fileInputRef = useRef(null);

    // Styling helpers
    const cardClass = darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200';
    const textClass = darkMode ? 'text-neutral-200' : 'text-gray-800';
    const subTextClass = darkMode ? 'text-neutral-400' : 'text-gray-500';
    const inputClass = darkMode 
        ? 'bg-neutral-900 border-neutral-700 text-white focus:ring-blue-500' 
        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500';
    const buttonClass = darkMode 
        ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-200' 
        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700';

    // --- Helper Functions (Moved here from EditorPanel) ---
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
    
    const deleteCustomSection = (id) => {
        setSectionOrder(prev => prev.filter(sec => sec.id !== id));
        const newCustom = { ...data.custom };
        delete newCustom[id];
        setData({ ...data, custom: newCustom });
        setActiveTab('sections');
    };

    return (
        <>
            {/* Sections List Navigation */}
            <div className="mb-6 flex flex-col gap-2">
                <button onClick={() => setActiveTab('sections')} className={`w-full flex items-center p-3 mb-2 rounded-lg transition-all ${activeTab === 'sections' ? 'bg-blue-600 text-white shadow-md translate-x-1' : `${buttonClass}`}`}>
                    <Layers size={18} className="mr-3" /> <span className="font-medium">Manage Sections</span>
                </button>
                
                <h2 className={`text-xs font-bold uppercase tracking-wider mt-4 mb-2 pl-1 ${subTextClass}`}>Edit Section Content</h2>
                
                {sectionOrder.filter(s => s.visible).map(sec => (
                    <EditorSection key={sec.id} title={sec.label} id={sec.id} activeTab={activeTab} setActiveTab={setActiveTab} 
                        icon={sec.type === 'custom' ? FilePlus : (sec.id === 'summary' || sec.id === 'personal') ? User : sec.id === 'experience' ? Briefcase : sec.id === 'education' ? GraduationCap : sec.id === 'skills' ? Code : sec.id === 'achievements' ? Award : Heart} 
                        onDelete={sec.type === 'custom' ? () => deleteCustomSection(sec.id) : null}
                        darkMode={darkMode}
                    />
                ))}
                <EditorSection title="Personal Info" icon={User} id="personal" activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
            </div>

            <div className={`p-5 rounded-xl shadow-sm border ${cardClass}`}>
                {/* 1. Reorder & Toggle View */}
                {activeTab === 'sections' && (
                    <div className="space-y-4">
                        <div className={`flex justify-between items-center border-b pb-2 ${darkMode ? 'border-neutral-700' : 'border-gray-100'}`}>
                            <h3 className={`font-bold ${textClass}`}>Reorder & Toggle</h3>
                            <button onClick={addCustomSection} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 font-semibold flex items-center gap-1"><FilePlus size={14} /> Add Custom</button>
                        </div>
                        <div className="space-y-2">
                            {sectionOrder.map((section, index) => (
                                <div key={section.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} className={`flex items-center gap-3 p-3 rounded-lg border cursor-move transition-colors ${draggedItemIndex === index ? 'opacity-50 border-blue-400' : darkMode ? 'bg-neutral-900 border-neutral-700 hover:border-neutral-500' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}`}>
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

                {/* 2. Personal Details Edit */}
                {activeTab === 'personal' && (
                    <div className="space-y-4">
                        <h3 className={`font-bold border-b pb-2 ${textClass} ${darkMode ? 'border-neutral-700' : 'border-gray-100'}`}>Personal Details</h3>
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

                {/* 3. List Sections (Experience, Education) */}
                {['experience', 'education'].includes(activeTab) && (
                    <div className="space-y-6">
                        <div className={`flex justify-between items-center border-b pb-2 ${darkMode ? 'border-neutral-700' : 'border-gray-100'}`}>
                            <h3 className={`font-bold ${textClass}`}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                            <button onClick={() => addItem(activeTab, activeTab === 'experience' ? { id: Date.now(), role: '', company: '', year: '', details: '' } : { id: Date.now(), institution: '', degree: '', year: '', details: '' })} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors"><Plus size={20}/></button>
                        </div>
                        {data[activeTab].map((item, index) => (
                            <div key={item.id} className={`p-4 rounded-lg border relative group ${darkMode ? 'bg-neutral-900 border-neutral-700' : 'bg-gray-50 border-gray-200'}`}>
                                <button onClick={() => removeItem(activeTab, index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                <input type="text" value={item.role || item.institution} onChange={(e) => handleArrayChange(activeTab, index, activeTab === 'experience' ? 'role' : 'institution', e.target.value)} placeholder={activeTab === 'experience' ? 'Role' : 'Institution'} className={`w-full mb-2 p-1.5 bg-transparent border-b focus:border-blue-500 outline-none font-medium text-sm ${darkMode ? 'border-neutral-600 text-white' : 'border-gray-300 text-gray-900'}`} />
                                <input type="text" value={item.company || item.degree} onChange={(e) => handleArrayChange(activeTab, index, activeTab === 'experience' ? 'company' : 'degree', e.target.value)} placeholder={activeTab === 'experience' ? 'Company' : 'Degree'} className={`w-full mb-2 p-1.5 bg-transparent border-b focus:border-blue-500 outline-none text-sm ${darkMode ? 'border-neutral-600 text-gray-300' : 'border-gray-300 text-gray-700'}`} />
                                <input type="text" value={item.year} onChange={(e) => handleArrayChange(activeTab, index, 'year', e.target.value)} placeholder="Year/Duration" className={`w-full mb-2 p-1.5 bg-transparent border-b focus:border-blue-500 outline-none text-xs ${darkMode ? 'border-neutral-600 text-gray-400' : 'border-gray-300 text-gray-500'}`} />
                                <textarea value={item.details} onChange={(e) => handleArrayChange(activeTab, index, 'details', e.target.value)} placeholder="Details..." rows={3} className={`w-full p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none ${inputClass}`} />
                            </div>
                        ))}
                    </div>
                )}

                {/* 4. Skills & Simple Lists */}
                {activeTab === 'skills' && (
                    <div className="space-y-4">
                        <div className={`flex justify-between items-center border-b pb-2 ${darkMode ? 'border-neutral-700' : 'border-gray-100'}`}>
                            <h3 className={`font-bold ${textClass}`}>Skills</h3>
                            <button onClick={() => addItem('skills', { name: '', level: 80 })} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full"><Plus size={20}/></button>
                        </div>
                        {data.skills.map((skill, index) => (
                            <div key={index} className={`flex flex-col gap-2 p-2 border rounded-md mb-2 ${darkMode ? 'bg-neutral-900 border-neutral-700' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex gap-2 items-center">
                                    <input type="text" value={skill.name} onChange={(e) => handleSkillChange(index, 'name', e.target.value)} placeholder="Skill" className={`flex-grow p-2 border rounded-md outline-none text-sm ${inputClass}`} />
                                    <button onClick={() => removeItem('skills', index)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>
                                <input type="range" value={skill.level} onChange={(e) => handleSkillChange(index, 'level', parseInt(e.target.value))} className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer" />
                            </div>
                        ))}
                    </div>
                )}
                
                {/* 5. Summary */}
                {activeTab === 'summary' && (
                    <div className="space-y-4">
                        <h3 className={`font-bold border-b pb-2 ${textClass} ${darkMode ? 'border-neutral-700' : 'border-gray-100'}`}>Profile Summary</h3>
                        <textarea name="summary" value={data.personal.summary} onChange={handlePersonalChange} placeholder="Write a professional summary..." rows={8} className={`w-full p-2.5 border rounded-md outline-none text-sm ${inputClass}`} />
                    </div>
                )}
            </div>
        </>
    );
};

export default ContentTab;