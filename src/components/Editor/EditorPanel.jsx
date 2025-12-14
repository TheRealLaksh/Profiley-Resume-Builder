import React from 'react';
import { Layout, RotateCcw, RotateCw, Moon, Sun } from 'lucide-react';
import ContentTab from './ContentTab';
import DesignTab from './DesignTab';
import ExportTab from './ExportTab';

const EditorPanel = ({ 
    activeTab, setActiveTab, data, setData, config, setConfig, 
    sectionOrder, setSectionOrder, applyTemplate, 
    draggedItemIndex, setDraggedItemIndex, 
    handleDragStart, handleDragOver, handleDragEnd,
    // Props
    darkMode, toggleDarkMode, undo, redo, canUndo, canRedo, 
    pdfQuality, setPdfQuality, handleShare, isSharing
}) => {
    
    // Helper for conditional styling
    const panelClass = darkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-100' : 'bg-gray-50 border-gray-200 text-gray-800';
    const subTextClass = darkMode ? 'text-neutral-400' : 'text-gray-500';

    return (
        <div className={`w-full md:w-1/3 lg:w-1/4 border-r h-screen overflow-y-auto custom-scrollbar flex flex-col shadow-xl z-10 transition-colors duration-300 ${panelClass}`}>
            
            {/* Top Toolbar: Logo, Undo/Redo, Theme, Tabs */}
            <div className={`p-4 border-b sticky top-0 z-20 shadow-sm flex flex-col gap-4 ${darkMode ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-gray-200'}`}>
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
                        <div className={`w-px h-4 mx-1 ${darkMode ? 'bg-neutral-700' : 'bg-gray-300'}`}></div>
                        <button onClick={toggleDarkMode} className="p-1.5 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-all" title="Toggle Theme">
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className={`flex p-1 rounded-xl border ${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-gray-100 border-gray-200'}`}>
                    <button onClick={() => setActiveTab('sections')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${!['design', 'export'].includes(activeTab) ? `${darkMode ? 'bg-neutral-700 text-blue-400' : 'bg-white text-blue-600'} shadow-sm` : `${subTextClass} hover:opacity-80`}`}>Content</button>
                    <button onClick={() => setActiveTab('design')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${activeTab === 'design' ? `${darkMode ? 'bg-neutral-700 text-blue-400' : 'bg-white text-blue-600'} shadow-sm` : `${subTextClass} hover:opacity-80`}`}>Design</button>
                    <button onClick={() => setActiveTab('export')} className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${activeTab === 'export' ? `${darkMode ? 'bg-neutral-700 text-blue-400' : 'bg-white text-blue-600'} shadow-sm` : `${subTextClass} hover:opacity-80`}`}>Export</button>
                </div>
            </div>

            <div className="p-4 flex-grow">
                {activeTab === 'export' ? (
                    <ExportTab 
                        pdfQuality={pdfQuality}
                        setPdfQuality={setPdfQuality}
                        handleShare={handleShare}
                        isSharing={isSharing}
                        darkMode={darkMode}
                    />
                ) : activeTab === 'design' ? (
                    <DesignTab 
                        config={config}
                        setConfig={setConfig}
                        applyTemplate={applyTemplate}
                        darkMode={darkMode}
                    />
                ) : (
                    <ContentTab 
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        data={data}
                        setData={setData}
                        sectionOrder={sectionOrder}
                        setSectionOrder={setSectionOrder}
                        draggedItemIndex={draggedItemIndex}
                        handleDragStart={handleDragStart}
                        handleDragOver={handleDragOver}
                        handleDragEnd={handleDragEnd}
                        darkMode={darkMode}
                    />
                )}
            </div>
        </div>
    );
};

export default EditorPanel;