// src/components/Editor/DesignTab.jsx
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

    const renderTemplateVisual = (key) => {
        switch(key) {
            case 'modern': 
                return <div className="w-full h-full bg-white flex"><div className="w-1/3 bg-slate-800 h-full"></div><div className="w-2/3 h-full"></div></div>;
            case 'minimal': 
                return <div className="w-full h-full bg-white border-t-4 border-black"></div>;
            case 'creative': 
                return <div className="w-full h-full bg-white flex flex-row-reverse"><div className="w-1/3 bg-rose-200 h-full"></div><div className="w-2/3 h-full"></div></div>;
            case 'ats': 
                return <div className="w-full h-full bg-white flex flex-col p-1 gap-1"><div className="h-1 w-full bg-gray-300"></div><div className="h-1 w-3/4 bg-gray-200"></div></div>;
            case 'executive': 
                return <div className="w-full h-full bg-white flex flex-row-reverse"><div className="w-1/3 bg-blue-800 h-full"></div><div className="w-2/3 h-full flex flex-col justify-center px-1"><div className="h-0.5 w-full bg-gray-300 mb-1"></div></div></div>;
            case 'elegant': 
                return <div className="w-full h-full bg-amber-50 border-4 border-double border-amber-200 flex flex-col items-center justify-center gap-1"><div className="h-0.5 w-1/2 bg-amber-800"></div></div>;
            case 'tech': 
                return <div className="w-full h-full bg-slate-900 flex"><div className="w-1/4 h-full border-r border-slate-700"></div><div className="w-3/4 h-full"></div></div>;
            case 'bold': 
                return <div className="w-full h-full bg-white border-4 border-black flex flex-col"><div className="h-4 w-full bg-black"></div></div>;
            case 'academic': 
                return <div className="w-full h-full bg-white flex flex-col p-1"><div className="h-full w-full border border-gray-300"></div></div>;
            case 'compact': 
                return <div className="w-full h-full bg-white flex text-[4px] leading-none overflow-hidden text-gray-300 p-0.5">|||||||||||||||||||||||</div>;
            default: 
                return <div className="w-full h-full bg-gray-100"></div>;
        }
    };

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
                            <div className="w-full h-16 bg-gray-100 rounded mb-2 overflow-hidden relative border border-gray-200/50">
                                {renderTemplateVisual(key)}
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