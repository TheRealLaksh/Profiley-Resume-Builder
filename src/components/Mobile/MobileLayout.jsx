import React, { useState } from 'react';
import {
    Download, Eye, FileText, FilePlus, Link2, Loader2, Mail, Moon, Palette, Phone, Redo2, Sun, Undo2
} from 'lucide-react';
import { EditorBody } from '../Editor/EditorPanel';
import ResumeDocument from '../Preview/ResumeDocument';
import ZoomDock from '../Layout/ZoomDock';
import Logo from '../UI/Logo';
import useCanvasZoom from '../../hooks/useCanvasZoom';

const NAV = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'export', label: 'Export', icon: Link2 }
];

const MobileLayout = (props) => {
    const {
        activeTab, setActiveTab, darkMode, toggleDarkMode, data, config, sectionOrder, isReadOnly,
        canUndo, canRedo, undo, redo, onDownloadPdf, isExportingPdf, onCopyEmail, onForkTemplate
    } = props;

    const [showPreview, setShowPreview] = useState(false);
    const {
        setContainer, setContent, zoom, min, max, isFit, contentSize, zoomIn, zoomOut, fit, actualSize
    } = useCanvasZoom({ gutter: 16, min: 0.25, maxFit: 1 });

    const inPreview = isReadOnly || showPreview;
    const current = inPreview ? 'preview' : (activeTab === 'design' || activeTab === 'export' ? activeTab : 'content');

    const go = (id) => {
        if (id === 'preview') { setShowPreview(true); return; }
        setShowPreview(false);
        setActiveTab(id === 'content' ? 'sections' : id);
    };

    return (
        <div className="flex h-[100dvh] flex-col bg-canvas text-ink">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-panel px-3">
                {isReadOnly ? (
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{data.personal.name || 'Resume'}</p>
                        <p className="font-numeric text-[10px] uppercase tracking-wider text-ink-3">Shared · read only</p>
                    </div>
                ) : (
                    <div className="flex-1"><Logo size="sm" /></div>
                )}

                {!isReadOnly && !inPreview && (
                    <>
                        <button className="btn btn-ghost btn-icon" onClick={undo} disabled={!canUndo} aria-label="Undo"><Undo2 size={17} /></button>
                        <button className="btn btn-ghost btn-icon" onClick={redo} disabled={!canRedo} aria-label="Redo"><Redo2 size={17} /></button>
                    </>
                )}
                {inPreview && (
                    <button className="btn btn-primary" onClick={onDownloadPdf} disabled={isExportingPdf}>
                        {isExportingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        {isExportingPdf ? 'Exporting' : 'PDF'}
                    </button>
                )}
                <button className="btn btn-ghost btn-icon" onClick={toggleDarkMode} aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}>
                    {darkMode ? <Sun size={17} /> : <Moon size={17} />}
                </button>
            </header>

            <main id="main" className="relative min-h-0 flex-1">
                {!inPreview && (
                    <div key={activeTab} className="scroll-quiet absolute inset-0 overflow-y-auto bg-panel px-4 pb-8 pt-4">
                        <EditorBody {...props} />
                    </div>
                )}

                {/* The preview stays mounted so zoom survives switching tabs. */}
                <div className={`canvas-dots absolute inset-0 bg-canvas ${inPreview ? '' : 'invisible'}`} aria-hidden={!inPreview}>
                    <div ref={setContainer} className="scroll-quiet absolute inset-0 overflow-auto overscroll-contain">
                        <div className={`px-4 pt-5 ${isReadOnly ? 'pb-40' : 'pb-28'}`}>
                            <div
                                className="relative mx-auto"
                                style={{
                                    width: contentSize.width ? contentSize.width * zoom : undefined,
                                    height: contentSize.height ? contentSize.height * zoom : undefined
                                }}
                            >
                                <div
                                    className="absolute left-0 top-0 origin-top-left"
                                    style={{ width: contentSize.width || undefined, transform: `scale(${zoom})` }}
                                >
                                    <div ref={setContent} className="inline-block">
                                        <ResumeDocument data={data} config={config} sectionOrder={sectionOrder} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ZoomDock
                        className={`absolute left-1/2 -translate-x-1/2 ${isReadOnly ? 'bottom-24' : 'bottom-4'}`}
                        zoom={zoom} min={min} max={max} isFit={isFit}
                        zoomIn={zoomIn} zoomOut={zoomOut} fit={fit} actualSize={actualSize}
                    />
                </div>
            </main>

            {isReadOnly ? (
                <div className="flex shrink-0 items-center gap-2 border-t border-line bg-panel px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
                    {data.personal.email && (
                        <button className="btn btn-secondary btn-icon !h-11 !w-11" onClick={onCopyEmail} aria-label="Copy email"><Mail size={18} /></button>
                    )}
                    {data.personal.phone && (
                        <a className="btn btn-secondary btn-icon !h-11 !w-11" href={`tel:${data.personal.phone}`} aria-label="Call"><Phone size={18} /></a>
                    )}
                    <button className="btn btn-primary !h-11 flex-1" onClick={onForkTemplate}><FilePlus size={17} /> Use this template</button>
                </div>
            ) : (
                <nav aria-label="Primary" className="grid shrink-0 grid-cols-4 border-t border-line bg-panel px-2 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1">
                    {NAV.map(({ id, label, icon: Icon }) => {
                        const active = current === id;
                        return (
                            <button
                                key={id}
                                onClick={() => go(id)}
                                aria-current={active ? 'page' : undefined}
                                className={`relative flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium transition-colors duration-200 ease-snap ${active ? 'text-accent-ink' : 'text-ink-3 hover:text-ink'}`}
                            >
                                <span className={`absolute left-1/2 top-0 h-0.5 -translate-x-1/2 rounded-full bg-accent transition-all duration-300 ease-snap ${active ? 'w-8 opacity-100' : 'w-0 opacity-0'}`} />
                                <Icon size={20} strokeWidth={active ? 2 : 1.6} />
                                {label}
                            </button>
                        );
                    })}
                </nav>
            )}
        </div>
    );
};

export default MobileLayout;
