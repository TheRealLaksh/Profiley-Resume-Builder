import React from 'react';
import { Layout, Palette, Columns, Type } from 'lucide-react';
import { Toggle, Select, ColorButton } from '../UI/FormElements';
import { colorThemes, templates } from '../../data/constants';

const DesignTab = ({ 
    config, 
    setConfig, 
    applyTemplate, 
    darkMode 
}) => {
    // Styling helpers
    const cardClass = darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200';
    const textClass = darkMode ? 'text-neutral-200' : 'text-gray-800';
    const subTextClass = darkMode ? 'text-neutral-400' : 'text-gray-500';

    return (
        <div className={`p-5 rounded-xl shadow-sm border space-y-8 ${cardClass}`}>
            {/* Templates */}
            <div>
                <h3 className={`text-sm font-bold mb-3 flex items-center uppercase tracking-wider ${textClass}`}>
                    <Layout size={16} className="mr-2 opacity-50"/> Templates
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {Object.entries(templates).map(([key, tpl]) => (
                        <button key={key} onClick={() => applyTemplate(key)} className={`flex flex-col items-center p-2 border rounded-lg transition-all group ${darkMode ? 'border-neutral-600 hover:border-blue-500 hover:bg-neutral-700' : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`}>
                            <div className="w-full h-16 bg-gray-100 rounded mb-2 overflow-hidden relative">
                                {/* Visuals for templates */}
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
                <h3 className={`text-sm font-bold mb-3 flex items-center uppercase tracking-wider ${textClass}`}>
                    <Palette size={16} className="mr-2 opacity-50"/> Color Palette
                </h3>
                <div className="flex gap-3 flex-wrap">
                    {Object.entries(colorThemes).map(([key, theme]) => (
                        <ColorButton key={key} colorKey={key} theme={theme} selected={config.themeColor === key} onClick={() => setConfig({...config, themeColor: key})} />
                    ))}
                </div>
            </div>

            {/* Layout Options */}
            <div>
                <h3 className={`text-sm font-bold mb-3 flex items-center uppercase tracking-wider ${textClass}`}>
                    <Columns size={16} className="mr-2 opacity-50"/> Layout & Structure
                </h3>
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

            {/* Typography */}
            <div>
                <h3 className={`text-sm font-bold mb-3 flex items-center uppercase tracking-wider ${textClass}`}>
                    <Type size={16} className="mr-2 opacity-50"/> Typography
                </h3>
                <div className="space-y-1">
                    <Select label="Font Scale" value={config.fontScale} onChange={(v) => setConfig({...config, fontScale: v})}
                        options={[{value: 'text-xs', label: 'Extra Small'}, {value: 'text-sm', label: 'Small'}, {value: 'text-base', label: 'Normal'}, {value: 'text-lg', label: 'Large'}, {value: 'text-xl', label: 'Extra Large'}]} darkMode={darkMode} />
                    <Select label="Header Alignment" value={config.headerAlign} onChange={(v) => setConfig({...config, headerAlign: v})}
                        options={[{value: 'text-left', label: 'Left'}, {value: 'text-center', label: 'Center'}, {value: 'text-right', label: 'Right'}]} darkMode={darkMode} />
                    <Toggle label="Uppercase Headers" value={config.uppercaseHeaders} onChange={(v) => setConfig({...config, uppercaseHeaders: v})} darkMode={darkMode} />
                </div>
            </div>
        </div>
    );
};

export default DesignTab;