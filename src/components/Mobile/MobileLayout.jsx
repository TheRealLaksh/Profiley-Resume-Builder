import React, { useState, useEffect, useRef } from 'react';
import { 
    Layers, Palette, Share2, Eye, Layout, 
    ChevronLeft, FileText, ZoomIn, ZoomOut, Maximize, Minimize 
} from 'lucide-react';
import ContentTab from '../Editor/ContentTab';
import DesignTab from '../Editor/DesignTab';
import ExportTab from '../Editor/ExportTab';
import PreviewPanel from '../Preview/PreviewPanel';

const MobileLayout = (props) => {
    const { 
        activeTab, setActiveTab, 
        darkMode, data, sectionOrder
    } = props;

    // 'editor' or 'preview'
    const [mobileView, setMobileView] = useState('editor');
    const [mobileZoom, setMobileZoom] = useState(0.55); // Default start scale for mobile
    const [isFullScreen, setIsFullScreen] = useState(false);
    
    const previewRef = useRef(null);
    const touchStartDistRef = useRef(0);
    const startZoomRef = useRef(0.55);
    const fullScreenContainerRef = useRef(null);

    // Auto-switch to editor view if user navigates deeper into content
    useEffect(() => {
        if (activeTab !== 'sections' && activeTab !== 'design' && activeTab !== 'export') {
            setMobileView('editor');
        }
    }, [activeTab]);

    // Handle Ctrl + Scroll Zoom & Pinch-to-Zoom
    useEffect(() => {
        const container = previewRef.current;
        if (!container) return;

        // Mouse Wheel Zoom (Ctrl + Wheel)
        const handleWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY * -0.001; 
                setMobileZoom(prev => Math.min(Math.max(prev + delta, 0.3), 2.0));
            }
        };

        // Touch Start (Pinch)
        const onTouchStart = (e) => {
            if (e.touches.length === 2) {
                // We don't preventDefault here to allow potential scrolling if fingers move together,
                // but for pinch we mostly care about distance.
                const dist = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
                touchStartDistRef.current = dist;
                startZoomRef.current = mobileZoom;
            }
        };

        // Touch Move (Pinch)
        const onTouchMove = (e) => {
            if (e.touches.length === 2) {
                e.preventDefault(); // Stop browser zoom/scroll
                const dist = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
                if (touchStartDistRef.current > 0) {
                    const scaleChange = dist / touchStartDistRef.current;
                    setMobileZoom(Math.min(Math.max(startZoomRef.current * scaleChange, 0.3), 2.0));
                }
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('touchstart', onTouchStart, { passive: false });
        container.addEventListener('touchmove', onTouchMove, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('touchstart', onTouchStart);
            container.removeEventListener('touchmove', onTouchMove);
        };
    }, [mobileZoom]); // Re-bind if necessary, though refs handle state access

    // Handle Fullscreen Change
    useEffect(() => {
        const onFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            // Target the mobile layout container or a specific wrapper
            if (fullScreenContainerRef.current) {
                fullScreenContainerRef.current.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else {
                 // Fallback to document element if ref is missing
                 document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const handleZoomIn = () => setMobileZoom(prev => Math.min(prev + 0.05, 1.5));
    const handleZoomOut = () => setMobileZoom(prev => Math.max(prev - 0.05, 0.3));
    const handleResetZoom = () => setMobileZoom(0.55);

    // Styling Constants
    const themeClasses = darkMode 
        ? 'bg-neutral-900 text-neutral-100' 
        : 'bg-gray-50 text-gray-900';
    
    const navItemBase = "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 active:scale-95";
    const navItemActive = darkMode ? "text-blue-400" : "text-blue-600";
    const navItemInactive = darkMode ? "text-neutral-500 hover:text-neutral-300" : "text-gray-400 hover:text-gray-600";

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'design':
                return <DesignTab {...props} />;
            case 'export':
                return <ExportTab {...props} />;
            default:
                return <ContentTab {...props} />;
        }
    };

    const isDrillDown = !['sections', 'design', 'export'].includes(activeTab);

    return (
        <div 
            ref={fullScreenContainerRef}
            className={`flex flex-col h-[100dvh] w-full overflow-hidden ${themeClasses}`}
        >
            
            {/* Top Bar: Dynamic Header */}
            <div className={`flex-shrink-0 px-4 py-3 flex items-center justify-between border-b backdrop-blur-md z-20 ${darkMode ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white/80 border-gray-200'}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    {/* Back button logic for drill-down states */}
                    {isDrillDown && mobileView === 'editor' ? (
                        <button 
                            onClick={() => setActiveTab('sections')}
                            className={`p-1.5 rounded-full ${darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <ChevronLeft size={18} />
                        </button>
                    ) : (
                         <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                            <Layout size={18} className="text-blue-500" />
                         </div>
                    )}
                    
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold leading-tight truncate">
                            {mobileView === 'preview' ? 'Live Preview' : 
                             isDrillDown ? (sectionOrder.find(s=>s.id === activeTab)?.label || 'Editing') : 
                             activeTab === 'design' ? 'Design Studio' : 
                             activeTab === 'export' ? 'Export & Share' : 'Profiley Mobile'}
                        </h1>
                        <span className="text-[10px] opacity-50 font-medium tracking-wide uppercase">
                            {mobileView === 'preview' ? data.personal.name || 'Untitled' : 
                             activeTab === 'sections' ? 'Resume Builder' : 'Configuration'}
                        </span>
                    </div>
                </div>

                {/* Quick Toggle for Preview */}
                <button
                    onClick={() => setMobileView(v => v === 'editor' ? 'preview' : 'editor')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                        mobileView === 'preview' 
                        ? 'bg-blue-600 text-white shadow-blue-500/20' 
                        : darkMode ? 'bg-neutral-800 text-neutral-300 border border-neutral-700' : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                >
                    {mobileView === 'preview' ? <FileText size={14} /> : <Eye size={14} />}
                    <span>{mobileView === 'preview' ? 'Edit' : 'View'}</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow overflow-hidden relative">
                
                {/* Editor View */}
                <div className={`absolute inset-0 overflow-y-auto custom-scrollbar transition-opacity duration-300 ${mobileView === 'editor' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <div className="p-4 pb-24 space-y-4">
                        {renderActiveComponent()}
                    </div>
                </div>

                {/* Preview View - Improved with Zoom */}
                <div 
                    ref={previewRef}
                    className={`absolute inset-0 bg-neutral-900/5 overflow-hidden flex flex-col items-center justify-start transition-opacity duration-300 ${mobileView === 'preview' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                >
                   
                   {/* Scrollable Canvas Area */}
                   <div className="w-full h-full overflow-auto custom-scrollbar relative p-4 pb-32">
                        {/* Zoomable Container */}
                        <div 
                            className="w-full flex justify-center origin-top-left"
                            style={{ 
                                minHeight: '1000px', // Ensure enough scroll space
                                width: '100%',
                            }}
                        >
                            <div 
                                className="shadow-2xl border border-gray-200/10 origin-top transform transition-transform duration-150"
                                style={{ transform: `scale(${mobileZoom})` }}
                            >
                                <PreviewPanel {...props} />
                            </div>
                        </div>
                   </div>

                   {/* Mobile Zoom & Fullscreen Controls */}
                   <div className={`absolute bottom-4 right-4 flex items-center gap-2 px-2 py-2 rounded-full shadow-xl border backdrop-blur-xl ${darkMode ? 'bg-neutral-800/90 border-neutral-700' : 'bg-white/90 border-gray-200'}`}>
                        <button onClick={handleZoomOut} className="p-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform">
                            <ZoomOut size={16} />
                        </button>
                        <button onClick={handleResetZoom} className="text-[10px] font-bold w-8 text-center opacity-70">
                            {Math.round(mobileZoom * 100)}%
                        </button>
                        <button onClick={handleZoomIn} className="p-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform">
                            <ZoomIn size={16} />
                        </button>
                        <div className="w-[1px] h-4 bg-gray-500/20 mx-1"></div>
                        <button onClick={toggleFullScreen} className="p-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform">
                            {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
                        </button>
                   </div>
                </div>

            </div>

            {/* Bottom Navigation Bar */}
            <div className={`flex-shrink-0 h-16 border-t backdrop-blur-xl z-30 grid grid-cols-4 px-2 pb-safe ${darkMode ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white/90 border-gray-200'}`}>
                
                <button 
                    onClick={() => { setActiveTab('sections'); setMobileView('editor'); }}
                    className={`${navItemBase} ${activeTab === 'sections' || isDrillDown ? navItemActive : navItemInactive}`}
                >
                    <Layers size={20} strokeWidth={activeTab === 'sections' || isDrillDown ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Content</span>
                </button>

                <button 
                    onClick={() => { setActiveTab('design'); setMobileView('editor'); }}
                    className={`${navItemBase} ${activeTab === 'design' ? navItemActive : navItemInactive}`}
                >
                    <Palette size={20} strokeWidth={activeTab === 'design' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Design</span>
                </button>

                <button 
                    onClick={() => setMobileView('preview')}
                    className={`${navItemBase} ${mobileView === 'preview' ? navItemActive : navItemInactive}`}
                >
                    <Eye size={20} strokeWidth={mobileView === 'preview' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Preview</span>
                </button>

                <button 
                    onClick={() => { setActiveTab('export'); setMobileView('editor'); }}
                    className={`${navItemBase} ${activeTab === 'export' ? navItemActive : navItemInactive}`}
                >
                    <Share2 size={20} strokeWidth={activeTab === 'export' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Export</span>
                </button>

            </div>
        </div>
    );
};

export default MobileLayout;