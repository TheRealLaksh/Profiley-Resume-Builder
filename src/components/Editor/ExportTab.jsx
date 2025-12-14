import React from 'react';
import { Settings, Monitor, Printer, Share2, Loader2 } from 'lucide-react';

const ExportTab = ({ 
    pdfQuality, 
    setPdfQuality, 
    handleShare, 
    isSharing, 
    darkMode 
}) => {
    // Styling helpers
    const cardClass = darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200';
    const textClass = darkMode ? 'text-neutral-200' : 'text-gray-800';
    const subTextClass = darkMode ? 'text-neutral-400' : 'text-gray-500';
    const buttonClass = darkMode 
        ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-200' 
        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700';

    return (
        <div className={`p-5 rounded-xl shadow-sm border space-y-6 ${cardClass}`}>
            <div>
                <h3 className={`text-sm font-bold mb-3 flex items-center uppercase tracking-wider ${textClass}`}>
                    <Settings size={16} className="mr-2 opacity-50"/> Export Settings
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${subTextClass}`}>PDF Quality</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => setPdfQuality('screen')}
                                className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${pdfQuality === 'screen' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : `${darkMode ? 'border-neutral-600 hover:bg-neutral-700' : 'border-gray-200 hover:bg-gray-50'}`}`}
                            >
                                <Monitor size={20} />
                                <span className="text-xs font-semibold">Screen (Fast)</span>
                            </button>
                            <button 
                                onClick={() => setPdfQuality('print')}
                                className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${pdfQuality === 'print' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : `${darkMode ? 'border-neutral-600 hover:bg-neutral-700' : 'border-gray-200 hover:bg-gray-50'}`}`}
                            >
                                <Printer size={20} />
                                <span className="text-xs font-semibold">Print (HD)</span>
                            </button>
                        </div>
                        <p className="text-[10px] mt-2 text-gray-400">Print quality renders at 3x resolution (300 DPI equivalent) but takes longer to generate.</p>
                    </div>
                    
                    <div className={`h-px w-full ${darkMode ? 'bg-neutral-700' : 'bg-gray-200'}`}></div>

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
    );
};

export default ExportTab;