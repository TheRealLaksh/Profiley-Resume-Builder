import React from 'react';
import { Maximize, Minimize, Minus, Plus, ScanLine } from 'lucide-react';

/** Floating zoom control, centred under the page. */
const ZoomDock = ({ zoom, min, max, isFit, zoomIn, zoomOut, fit, actualSize, toggleFullScreen, isFullScreen, className = '' }) => (
    <div
        role="toolbar"
        aria-label="Zoom"
        className={`flex items-center gap-0.5 rounded-2xl border border-line bg-panel/90 p-1 shadow-pop backdrop-blur-md ${className}`}
    >
        <button className="btn btn-ghost btn-icon !h-8 !w-8 phone:!h-11 phone:!w-11" onClick={zoomOut} disabled={zoom <= min} aria-label="Zoom out" title="Zoom out"><Minus size={16} /></button>
        <button
            className="btn btn-ghost !h-8 w-14 !px-0 font-numeric text-xs tabular phone:!h-11 phone:w-16 phone:text-[13px]"
            onClick={actualSize}
            aria-label={`Zoom ${Math.round(zoom * 100)} percent. Click for actual size.`}
            title="Actual size (100%)"
        >
            {Math.round(zoom * 100)}%
        </button>
        <button className="btn btn-ghost btn-icon !h-8 !w-8 phone:!h-11 phone:!w-11" onClick={zoomIn} disabled={zoom >= max} aria-label="Zoom in" title="Zoom in"><Plus size={16} /></button>
        <span className="mx-1 h-4 w-px bg-line" />
        <button
            className={`btn btn-icon !h-8 !w-8 phone:!h-11 phone:!w-11 ${isFit ? 'bg-accent-soft text-accent-ink' : 'btn-ghost'}`}
            onClick={fit}
            aria-pressed={isFit}
            aria-label="Fit page to width"
            title="Fit to width"
        >
            <ScanLine size={16} />
        </button>
        {toggleFullScreen && (
            <button className="btn btn-ghost btn-icon !h-8 !w-8 phone:!h-11 phone:!w-11" onClick={toggleFullScreen} aria-label={isFullScreen ? 'Exit full screen' : 'Full screen'} title={isFullScreen ? 'Exit full screen' : 'Full screen'}>
                {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
        )}
    </div>
);

export default ZoomDock;
