import React from 'react';
import { 
  Layout, Layers, Plus, GripVertical, Eye, EyeOff, 
  User, Upload, X, Trash2, FilePlus, Palette, Columns, Type, Settings, FileText 
} from 'lucide-react';
import { EditorSection, Toggle, Select, ColorButton } from './FormElements';
import { templates, colorThemes } from '../data';

const EditorPanel = ({
  activeTab, setActiveTab,
  data, setData,
  config, setConfig,
  sectionOrder, setSectionOrder,
  draggedItemIndex, handleDragStart, handleDragOver, handleDragEnd,
  handlePersonalChange, handleImageUpload, removeImage, fileInputRef, triggerFileInput,
  toggleSectionVisibility, addCustomSection, deleteCustomSection, updateCustomSection,
  addItem, removeItem, handleArrayChange, handleSkillChange, handleSimpleArrayChange,
  applyTemplate
}) => {

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto custom-scrollbar print:hidden flex flex-col shadow-xl z-10">
      <div className="p-5 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <h1 className="text-xl font-extrabold text-gray-800 flex items-center tracking-tight">
          <Layout className="mr-2 text-blue-600 fill-blue-100" /> Profiley
        </h1>
        <div className="flex mt-4 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
          <button 
            onClick={() => setActiveTab('sections')} 
            className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${!['design'].includes(activeTab) ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Content
          </button>
          <button 
            onClick={() => setActiveTab('design')} 
            className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${activeTab === 'design' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Design
          </button>
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
                  <button 
                    key={key}
                    onClick={() => applyTemplate(key)}
                    className="flex flex-col items-center p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <div className="w-full h-16 bg-gray-100 rounded mb-2 overflow-hidden relative">
                      {key === 'modern' && <div className="w-full h-full bg-white flex"><div className="w-1/3 bg-slate-800 h-full"></div><div className="w-2/3 h-full"></div></div>}
                      {key === 'minimal' && <div className="w-full h-full bg-white border-t-4 border-black"></div>}
                      {key === 'creative' && <div className="w-full h-full bg-white flex flex-row-reverse"><div className="w-1/3 bg-rose-200 h-full"></div><div className="w-2/3 h-full"></div></div>}
                      {key === 'ats' && <div className="w-full h-full bg-white flex flex-col p-1 gap-1"><div className="h-1 w-full bg-gray-300"></div><div className="h-1 w-3/4 bg-gray-200"></div></div>}
                    </div>
                    <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600">{tpl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Theme */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center uppercase tracking-wider"><Palette size={16} className="mr-2 text-gray-400"/> Color Palette</h3>
              <div className="flex gap-3 flex-wrap">
                {Object.entries(colorThemes).map(([key, theme]) => (
                  <ColorButton 
                    key={key} 
                    theme={theme} 
                    selected={config.themeColor === key} 
                    onClick={() => setConfig({...config, themeColor: key})} 
                  />
                ))}
              </div>
            </div>

            {/* Layout Options */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center uppercase tracking-wider"><Columns size={16} className="mr-2 text-gray-400"/> Layout & Structure</h3>
              <div className="space-y-1">
                <Toggle label="Reverse Layout (Sidebar Left)" value={config.layoutReverse} onChange={(v) => setConfig({...config, layoutReverse: v})} />
                <Select 
                  label="Page Spacing" 
                  value={config.spacingScale} 
                  onChange={(v) => setConfig({...config, spacingScale: v})}
                  options={[
                    {value: 'compact', label: 'Compact'},
                    {value: 'normal', label: 'Normal'},
                    {value: 'spacious', label: 'Spacious'},
                  ]}
                />
                <Select 
                  label="Sidebar Background" 
                  value={config.sidebarBg} 
                  onChange={(v) => setConfig({...config, sidebarBg: v})}
                  options={[
                    {value: 'none', label: 'Transparent'},
                    {value: 'gray', label: 'Light Gray'},
                    {value: 'theme', label: 'Theme Tint'},
                  ]}
                />
                <Toggle label="Show Profile Photo" value={config.showPhoto} onChange={(v) => setConfig({...config, showPhoto: v})} />
                <Select 
                  label="Page Border Style" 
                  value={config.borderStyle} 
                  onChange={(v) => setConfig({...config, borderStyle: v})}
                  options={[
                    {value: 'none', label: 'None'},
                    {value: 'simple', label: 'Simple Frame'},
                    {value: 'double', label: 'Double Line'},
                    {value: 'thick', label: 'Thick Frame'},
                    {value: 'offset', label: 'Offset Frame'},
                    {value: 'rounded', label: 'Rounded Frame'},
                    {value: 'minimal', label: 'Minimal (Top/Bottom)'},
                    {value: 'corners', label: 'Corner Accents'},
                  ]}
                />
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center uppercase tracking-wider"><Type size={16} className="mr-2 text-gray-400"/> Typography</h3>
              <div className="space-y-1">
                 <Select 
                  label="Font Family" 
                  value={config.fontFamily} 
                  onChange={(v) => setConfig({...config, fontFamily: v})}
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
                  ]}
                />
                 <Select 
                  label="Font Scale" 
                  value={config.fontScale} 
                  onChange={(v) => setConfig({...config, fontScale: v})}
                  options={[
                    {value: 'text-xs', label: 'Extra Small'},
                    {value: 'text-sm', label: 'Small'},
                    {value: 'text-base', label: 'Normal'},
                    {value: 'text-lg', label: 'Large'},
                    {value: 'text-xl', label: 'Extra Large'}
                  ]}
                />
                <Select 
                  label="Header Alignment" 
                  value={config.headerAlign} 
                  onChange={(v) => setConfig({...config, headerAlign: v})}
                  options={[
                    {value: 'text-left', label: 'Left'},
                    {value: 'text-center', label: 'Center'},
                    {value: 'text-right', label: 'Right'}
                  ]}
                />
                <Select 
                  label="Name Weight" 
                  value={config.nameWeight} 
                  onChange={(v) => setConfig({...config, nameWeight: v})}
                  options={[
                    {value: 'font-normal', label: 'Regular'},
                    {value: 'font-bold', label: 'Bold'},
                    {value: 'font-extrabold', label: 'Extra Bold'}
                  ]}
                />
                <Toggle label="Uppercase Headers" value={config.uppercaseHeaders} onChange={(v) => setConfig({...config, uppercaseHeaders: v})} />
              </div>
            </div>

            {/* Advanced Styling */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center uppercase tracking-wider"><Settings size={16} className="mr-2 text-gray-400"/> Styling Details</h3>
              <div className="space-y-1">
                 <Select 
                  label="Paper Background" 
                  value={config.paperTint} 
                  onChange={(v) => setConfig({...config, paperTint: v})}
                  options={[
                    {value: 'bg-white', label: 'Crisp White'},
                    {value: 'bg-stone-50', label: 'Warm Ivory'},
                    {value: 'bg-slate-50', label: 'Cool White'}
                  ]}
                />
                <Select 
                  label="Section Header Size" 
                  value={config.sectionTitleSize} 
                  onChange={(v) => setConfig({...config, sectionTitleSize: v})}
                  options={[
                    {value: 'text-base', label: 'Normal'},
                    {value: 'text-lg', label: 'Large'},
                    {value: 'text-xl', label: 'Huge'},
                  ]}
                />
                <Select 
                  label="Section Header Style" 
                  value={config.sectionHeaderStyle} 
                  onChange={(v) => setConfig({...config, sectionHeaderStyle: v})}
                  options={[
                    {value: 'underline', label: 'Classic Underline'},
                    {value: 'box', label: 'Shaded Box'},
                    {value: 'left-bar', label: 'Left Bar Accent'},
                    {value: 'centered', label: 'Centered with Lines'}
                  ]}
                />
                <Select 
                  label="Skills Shape" 
                  value={config.skillShape} 
                  onChange={(v) => setConfig({...config, skillShape: v})}
                  options={[
                    {value: 'rounded-md', label: 'Standard'},
                    {value: 'rounded', label: 'Square-ish'},
                    {value: 'rounded-full', label: 'Pills/Capsule'},
                  ]}
                />
                <Select 
                  label="Entry Style" 
                  value={config.entryBox} 
                  onChange={(v) => setConfig({...config, entryBox: v})}
                  options={[
                    {value: 'clean', label: 'Clean (Minimal)'},
                    {value: 'boxed', label: 'Boxed Card'},
                    {value: 'line-left', label: 'Left Line Accent'},
                  ]}
                />
                <Toggle label="Show Timeline Line" value={config.timeline} onChange={(v) => setConfig({...config, timeline: v})} />
                <Select 
                  label="Date Alignment" 
                  value={config.dateAlign} 
                  onChange={(v) => setConfig({...config, dateAlign: v})}
                  options={[
                    {value: 'right', label: 'Right Aligned'},
                    {value: 'below', label: 'Below Role'},
                    {value: 'inline', label: 'Inline'},
                  ]}
                />
                <Select 
                  label="Contact Layout" 
                  value={config.contactLayout} 
                  onChange={(v) => setConfig({...config, contactLayout: v})}
                  options={[
                    {value: 'row', label: 'Single Row'},
                    {value: 'stack', label: 'Stacked Column'},
                    {value: 'grid', label: 'Grid (2 Cols)'},
                  ]}
                />
                <Select 
                  label="Company Name Style" 
                  value={config.companyStyle} 
                  onChange={(v) => setConfig({...config, companyStyle: v})}
                  options={[
                    {value: 'font-semibold', label: 'Semi-Bold'},
                    {value: 'font-bold', label: 'Bold'},
                    {value: 'italic', label: 'Italic'},
                    {value: 'uppercase', label: 'Uppercase'},
                  ]}
                />
                <Select 
                  label="Section Divider" 
                  value={config.dividerStyle} 
                  onChange={(v) => setConfig({...config, dividerStyle: v})}
                  options={[
                    {value: 'none', label: 'None'},
                    {value: 'solid', label: 'Solid Line'},
                    {value: 'thick', label: 'Thick Line'},
                    {value: 'dashed', label: 'Dashed Line'},
                    {value: 'dotted', label: 'Dotted Line'},
                    {value: 'gradient', label: 'Gradient Fade'},
                    {value: 'diamond', label: 'Diamond Center'},
                  ]}
                />
                 <Select 
                  label="Social Icons" 
                  value={config.socialStyle} 
                  onChange={(v) => setConfig({...config, socialStyle: v})}
                  options={[
                    {value: 'simple', label: 'Simple (Icon only)'},
                    {value: 'circle', label: 'Circled'},
                    {value: 'filled', label: 'Filled Circle'}
                  ]}
                />
                 <Select 
                  label="Skills Format" 
                  value={config.skillStyle} 
                  onChange={(v) => setConfig({...config, skillStyle: v})}
                  options={[
                    {value: 'tags', label: 'Tags / Pills'},
                    {value: 'list', label: 'Bulleted List'},
                    {value: 'comma', label: 'Comma Separated'},
                    {value: 'bars', label: 'Progress Bars (Visual)'}
                  ]}
                />
                 <Select 
                  label="Bullet Style" 
                  value={config.bulletStyle} 
                  onChange={(v) => setConfig({...config, bulletStyle: v})}
                  options={[
                    {value: 'disc', label: 'Disc (●)'},
                    {value: 'square', label: 'Square (■)'},
                    {value: 'check', label: 'Check (✓)'},
                    {value: 'none', label: 'None'}
                  ]}
                />
              </div>
            </div>
            
            {/* Extras */}
            <div>
               <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center uppercase tracking-wider"><FileText size={16} className="mr-2 text-gray-400"/> Extras</h3>
               <div className="space-y-3">
                 <div className="py-2">
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Watermark Text</label>
                   <input 
                    type="text" 
                    value={config.watermark} 
                    onChange={(e) => setConfig({...config, watermark: e.target.value})} 
                    placeholder="e.g. CONFIDENTIAL"
                    className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                 </div>
                 <div className="py-2">
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Custom Footer</label>
                   <input 
                    type="text" 
                    value={config.customFooter} 
                    onChange={(e) => setConfig({...config, customFooter: e.target.value})} 
                    placeholder="e.g. References available upon request"
                    className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                 </div>
                 {config.showPhoto && (
                   <div className="py-2">
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Photo Style</label>
                      <div className="flex gap-2 mb-2">
                         {['rounded-none', 'rounded-lg', 'rounded-full'].map(shape => (
                           <button 
                             key={shape}
                             onClick={() => setConfig({...config, photoShape: shape})}
                             className={`w-8 h-8 bg-gray-200 hover:bg-gray-300 transition-colors ${shape} ${config.photoShape === shape ? 'ring-2 ring-blue-600 ring-offset-1 bg-gray-300' : ''}`}
                             title="Shape"
                           />
                         ))}
                      </div>
                      <select 
                        value={config.photoBorder} 
                        onChange={(e) => setConfig({...config, photoBorder: e.target.value})} 
                        className="w-full p-2 text-sm border border-gray-300 rounded-md"
                      >
                        <option value="none">No Border</option>
                        <option value="thin">Thin Border</option>
                        <option value="thick">Thick Border</option>
                      </select>
                   </div>
                 )}
               </div>
            </div>

          </div>
        ) : (
          <>
          {/* CONTENT EDITOR MODE */}
            
            {/* MAIN NAV FOR CONTENT */}
            <div className="mb-6 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('sections')}
                className={`w-full flex items-center p-3 mb-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'sections'
                    ? 'bg-blue-600 text-white shadow-md translate-x-1' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                }`}
              >
                <Layers size={18} className="mr-3" />
                <span className="font-medium">Manage Sections</span>
              </button>
              
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2 pl-1">Edit Section Content</h2>
              
              {sectionOrder.filter(s => s.visible).map(sec => (
                <EditorSection 
                  key={sec.id} 
                  title={sec.label} 
                  icon={sec.type === 'custom' ? FilePlus : sec.icon} 
                  id={sec.id}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onDelete={sec.type === 'custom' ? () => deleteCustomSection(sec.id) : null}
                />
              ))}
              
              {/* Always show Personal Info separately */}
              <EditorSection title="Personal Info" icon={User} id="personal" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              
              {/* SECTION MANAGER */}
              {activeTab === 'sections' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-gray-800">Reorder & Toggle Sections</h3>
                    <button onClick={addCustomSection} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 font-semibold flex items-center gap-1">
                      <Plus size={14} /> Add Custom
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 mb-2">Drag to reorder. Click eye to toggle visibility.</p>
                    {sectionOrder.map((section, index) => (
                      <div 
                        key={section.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${draggedItemIndex === index ? 'bg-blue-50 border-blue-300 opacity-50' : 'bg-gray-50 border-gray-200'} cursor-move hover:border-blue-300 transition-colors`}
                      >
                        <GripVertical size={16} className="text-gray-400" />
                        <span className="flex-grow text-sm font-medium text-gray-700">{section.label}</span>
                        <button 
                          onClick={() => toggleSectionVisibility(section.id)}
                          className={`p-1.5 rounded-md transition-colors ${section.visible ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
                          title={section.visible ? "Hide Section" : "Show Section"}
                        >
                          {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PERSONAL EDIT */}
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 border-b pb-2">Personal Details</h3>
                  
                  {/* PHOTO UPLOAD */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-300 flex-shrink-0">
                        {data.personal.photoUrl ? (
                          <img src={data.personal.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-full h-full p-3 text-gray-400" />
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          accept="image/*" 
                          className="hidden" 
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={triggerFileInput}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md hover:bg-blue-100 transition-colors flex items-center gap-1"
                          >
                            <Upload size={14} /> Upload Photo
                          </button>
                          {data.personal.photoUrl && (
                            <button 
                              onClick={removeImage}
                              className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-md hover:bg-red-100 transition-colors flex items-center gap-1"
                            >
                              <X size={14} /> Remove
                            </button>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">Recommended: Square JPG/PNG</span>
                      </div>
                    </div>
                  </div>

                  <input type="text" name="name" value={data.personal.name} onChange={handlePersonalChange} placeholder="Full Name" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow" />
                  <input type="text" name="title" value={data.personal.title} onChange={handlePersonalChange} placeholder="Job Title / Headline" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow" />
                  <input type="email" name="email" value={data.personal.email} onChange={handlePersonalChange} placeholder="Email" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow" />
                  <input type="text" name="phone" value={data.personal.phone} onChange={handlePersonalChange} placeholder="Phone" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow" />
                  <input type="text" name="location" value={data.personal.location} onChange={handlePersonalChange} placeholder="Location" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow" />
                  
                  <input type="text" name="linkedin" value={data.personal.linkedin} onChange={handlePersonalChange} placeholder="LinkedIn URL" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow" />
                  <input type="text" name="portfolio" value={data.personal.portfolio} onChange={handlePersonalChange} placeholder="Portfolio URL" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow" />
                </div>
              )}

              {/* SUMMARY EDIT */}
              {activeTab === 'summary' && (
                  <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 border-b pb-2">Profile Summary</h3>
                  <textarea name="summary" value={data.personal.summary} onChange={handlePersonalChange} placeholder="Professional Summary" rows={8} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow" />
                  </div>
              )}

              {/* EXPERIENCE EDIT */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-gray-800">Experience</h3>
                    <button onClick={() => addItem('experience', { id: Date.now(), role: '', company: '', year: '', details: '' })} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors"><Plus size={20}/></button>
                  </div>
                  {data.experience.map((exp, index) => (
                    <div key={exp.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group transition-shadow hover:shadow-sm">
                      <button onClick={() => removeItem('experience', index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      <input type="text" value={exp.role} onChange={(e) => handleArrayChange('experience', index, 'role', e.target.value)} placeholder="Role" className="w-full mb-2 p-1.5 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none font-medium text-sm text-gray-900" />
                      <input type="text" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} placeholder="Company" className="w-full mb-2 p-1.5 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm text-gray-700" />
                      <input type="text" value={exp.year} onChange={(e) => handleArrayChange('experience', index, 'year', e.target.value)} placeholder="Duration" className="w-full mb-2 p-1.5 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-xs text-gray-500" />
                      <textarea value={exp.details} onChange={(e) => handleArrayChange('experience', index, 'details', e.target.value)} placeholder="Details" rows={3} className="w-full p-2 bg-white border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                  ))}
                </div>
              )}

              {/* EDUCATION EDIT */}
              {activeTab === 'education' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-gray-800">Education</h3>
                    <button onClick={() => addItem('education', { id: Date.now(), institution: '', degree: '', year: '', details: '' })} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors"><Plus size={20}/></button>
                  </div>
                  {data.education.map((edu, index) => (
                    <div key={edu.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group transition-shadow hover:shadow-sm">
                      <button onClick={() => removeItem('education', index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      <input type="text" value={edu.institution} onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)} placeholder="Institution" className="w-full mb-2 p-1.5 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none font-medium text-sm text-gray-900" />
                      <input type="text" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} placeholder="Degree/Stream" className="w-full mb-2 p-1.5 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm text-gray-700" />
                      <input type="text" value={edu.year} onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)} placeholder="Year" className="w-full mb-2 p-1.5 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-xs text-gray-500" />
                      <textarea value={edu.details} onChange={(e) => handleArrayChange('education', index, 'details', e.target.value)} placeholder="Details (Grades, etc.)" rows={2} className="w-full p-2 bg-white border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                  ))}
                </div>
              )}

              {/* SKILLS EDIT */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-gray-800">Skills</h3>
                    <button onClick={() => addItem('skills', { name: '', level: 80 })} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors"><Plus size={20}/></button>
                  </div>
                  {data.skills.map((skill, index) => (
                    <div key={index} className="flex flex-col gap-2 p-2 border rounded-md bg-gray-50 mb-2">
                        <div className="flex gap-2 items-center">
                          <input 
                            type="text" 
                            value={skill.name} 
                            onChange={(e) => handleSkillChange(index, 'name', e.target.value)} 
                            placeholder="Skill Name"
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                          />
                          <button onClick={() => removeItem('skills', index)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-12">Level: {skill.level}%</span>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={skill.level} 
                            onChange={(e) => handleSkillChange(index, 'level', parseInt(e.target.value))}
                            className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ACHIEVEMENTS EDIT */}
              {activeTab === 'achievements' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-gray-800">Achievements</h3>
                    <button onClick={() => addItem('achievements', '')} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors"><Plus size={20}/></button>
                  </div>
                  {data.achievements.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <textarea value={item} onChange={(e) => handleSimpleArrayChange('achievements', index, e.target.value)} rows={2} className="flex-grow p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                      <button onClick={() => removeItem('achievements', index)} className="text-gray-400 hover:text-red-500 mt-2 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              )}

              {/* COMMUNITY EDIT */}
              {activeTab === 'community' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-gray-800">Community Service</h3>
                    <button onClick={() => addItem('community', '')} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors"><Plus size={20}/></button>
                  </div>
                  {data.community.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <textarea value={item} onChange={(e) => handleSimpleArrayChange('community', index, e.target.value)} rows={2} className="flex-grow p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                      <button onClick={() => removeItem('community', index)} className="text-gray-400 hover:text-red-500 mt-2 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              )}

              {/* CUSTOM SECTION EDIT */}
              {activeTab.startsWith('custom-') && data.custom[activeTab] && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-gray-800">Custom Section</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Section Title</label>
                      <input 
                        type="text" 
                        value={data.custom[activeTab].title} 
                        onChange={(e) => updateCustomSection(activeTab, 'title', e.target.value)} 
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Content (Markdown supported)</label>
                      <textarea 
                        value={data.custom[activeTab].content} 
                        onChange={(e) => updateCustomSection(activeTab, 'content', e.target.value)} 
                        rows={10} 
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>
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