import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';

const ZoomToolbar = ({ 
  darkMode, 
  handleZoomIn, 
  handleZoomOut, 
  toggleFullScreen, 
  handleResetZoom, 
  zoom, 
  isFullScreen 
}) => {
  const btnClass = `p-2 rounded-md transition-colors ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'}`;

  return (
    <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">
      <div className={`flex flex-col gap-1 p-1 rounded-lg shadow-lg border backdrop-blur-md ${darkMode ? 'bg-neutral-900/80 border-neutral-700 text-neutral-300' : 'bg-white/80 border-gray-300 text-gray-700'}`}>
        <button onClick={handleZoomIn} className={btnClass} title="Zoom In">
          <ZoomIn size={18} />
        </button>
        <button onClick={handleZoomOut} className={btnClass} title="Zoom Out">
          <ZoomOut size={18} />
        </button>
        <button onClick={toggleFullScreen} className={btnClass} title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}>
          {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
        
        <button 
          onClick={handleResetZoom}
          className="text-[10px] text-center font-mono font-bold py-1 opacity-60 hover:opacity-100 cursor-pointer"
          title="Reset Zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
      </div>
    </div>
  );
};

export default ZoomToolbar;