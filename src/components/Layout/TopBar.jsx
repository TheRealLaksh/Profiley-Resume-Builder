import React from 'react';
import { Check, Download, FilePlus, Link2, Loader2, Mail, Moon, Phone, Redo2, Sun, Undo2 } from 'lucide-react';
import Logo from '../UI/Logo';

const IconButton = ({ label, shortcut, children, ...props }) => (
    <button className="btn btn-ghost btn-icon" aria-label={label} title={shortcut ? `${label} (${shortcut})` : label} {...props}>
        {children}
    </button>
);

/** Desktop header. In editor mode it carries history, theme and the main actions; shared view gets its own set. */
const TopBar = ({
    data, isReadOnly, darkMode, toggleDarkMode,
    canUndo, canRedo, undo, redo,
    saveState, onShare, onDownloadPdf, isExportingPdf,
    onCopyEmail, onForkTemplate
}) => {
    const name = data.personal?.name?.trim();

    return (
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-panel px-4">
            <Logo />
            <span className="mx-1 hidden h-5 w-px bg-line lg:block" />

            <div className="hidden min-w-0 items-center gap-2.5 lg:flex">
                <span className="truncate text-[13px] font-medium text-ink-2">
                    {isReadOnly ? `${name || 'Resume'}` : name ? `${name}'s resume` : 'Untitled resume'}
                </span>
                {isReadOnly ? (
                    <span className="rounded-md bg-accent-soft px-1.5 py-0.5 font-numeric text-[10px] uppercase tracking-wider text-accent-ink">Shared · read only</span>
                ) : (
                    <span className="flex items-center gap-1.5 font-numeric text-[11px] text-ink-3" aria-live="polite">
                        {saveState === 'error' ? (
                            <><span className="h-1.5 w-1.5 rounded-full bg-danger" />Not saved</>
                        ) : saveState === 'saved' ? (
                            <><Check size={12} className="text-accent" />Saved</>
                        ) : (
                            <><span className="h-1.5 w-1.5 rounded-full bg-accent/60" />Autosaves in this browser</>
                        )}
                    </span>
                )}
            </div>

            <div className="flex-1" />

            {!isReadOnly && (
                <div className="flex items-center">
                    <IconButton label="Undo" shortcut="Ctrl+Z" onClick={undo} disabled={!canUndo}><Undo2 size={17} /></IconButton>
                    <IconButton label="Redo" shortcut="Ctrl+Shift+Z" onClick={redo} disabled={!canRedo}><Redo2 size={17} /></IconButton>
                </div>
            )}

            <IconButton label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'} onClick={toggleDarkMode}>
                {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </IconButton>

            <span className="mx-1 hidden h-5 w-px bg-line sm:block" />

            {isReadOnly ? (
                <>
                    {data.personal?.email && (
                        <button className="btn btn-ghost" onClick={onCopyEmail}><Mail size={16} /><span className="hidden xl:inline">Copy email</span></button>
                    )}
                    {data.personal?.phone && (
                        <a className="btn btn-ghost" href={`tel:${data.personal.phone}`}><Phone size={16} /><span className="hidden xl:inline">Call</span></a>
                    )}
                    <button className="btn btn-secondary" onClick={onForkTemplate}><FilePlus size={16} />Use this template</button>
                    <button className="btn btn-primary" onClick={onDownloadPdf} disabled={isExportingPdf}>
                        {isExportingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}Download
                    </button>
                </>
            ) : (
                <>
                    <button className="btn btn-secondary" onClick={onShare}><Link2 size={16} /><span className="hidden xl:inline">Share</span></button>
                    <button className="btn btn-primary" onClick={onDownloadPdf} disabled={isExportingPdf}>
                        {isExportingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        {isExportingPdf ? 'Exporting...' : 'Download PDF'}
                    </button>
                </>
            )}
        </header>
    );
};

export default TopBar;
