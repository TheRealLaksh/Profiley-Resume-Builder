import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize, 
  Monitor, // Icon for "Fit Screen"
  MoveHorizontal // Icon for "Fit Width"
} from 'lucide-react';

const ZoomToolbar = ({ 
  darkMode, 
  handleZoomIn, 
  handleZoomOut, 
  toggleFullScreen, 
  handleResetZoom, 
  handleFitWidth, // NEW: Prop to snap to width
  zoom, 
  isFullScreen,
  minZoom = 0.3, // NEW: Limit constraints
  maxZoom = 1.5 
}) => {
  // Check limits to disable buttons
  const isMin = zoom <= minZoom;
  const isMax = zoom >= maxZoom;

  const baseBtnClass = `p-2 rounded-md transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/50`;
  const activeClass = darkMode 
    ? 'hover:bg-neutral-700 text-neutral-300' 
    : 'hover:bg-gray-100 text-gray-700';
  const disabledClass = 'opacity-30 cursor-not-allowed';

  // Helper to determine class based on state
  const getBtnClass = (disabled = false) => 
    `${baseBtnClass} ${disabled ? disabledClass : activeClass}`;

  return (
    <div className="absolute top-4 right-4 z-40 flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`flex flex-col gap-1 p-1.5 rounded-xl shadow-xl border backdrop-blur-md ${darkMode ? 'bg-neutral-900/90 border-neutral-700' : 'bg-white/90 border-gray-200'}`}>
        
        {/* Zoom In */}
        <button 
          onClick={handleZoomIn} 
          disabled={isMax}
          className={getBtnClass(isMax)}
          title="Zoom In (Ctrl +)"
          aria-label="Zoom In"
        >
          <ZoomIn size={18} />
        </button>

        {/* Zoom Out */}
        <button 
          onClick={handleZoomOut} 
          disabled={isMin}
          className={getBtnClass(isMin)}
          title="Zoom Out (Ctrl -)"
          aria-label="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>

        {/* Separator for logical grouping */}
        <div className={`h-px mx-2 my-1 ${darkMode ? 'bg-neutral-700' : 'bg-gray-300'}`} />

        {/* NEW: Fit Width (Optional but recommended) */}
        {handleFitWidth && (
          <button 
            onClick={handleFitWidth} 
            className={getBtnClass()} 
            title="Fit to Width"
            aria-label="Fit to Width"
          >
            <MoveHorizontal size={18} />
          </button>
        )}

        {/* Fullscreen Toggle */}
        <button 
          onClick={toggleFullScreen} 
          className={getBtnClass()} 
          title={isFullScreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen (F11)"}
          aria-label={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
        
        {/* Reset / Percentage Display */}
        <button 
          onClick={handleResetZoom}
          className={`text-[10px] font-mono font-bold py-1.5 mt-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors ${zoom === 1 ? 'opacity-100 font-extrabold' : 'opacity-70 hover:opacity-100'}`}
          title="Reset to 100%"
          aria-label="Reset Zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
      </div>
    </div>
  );
};

export default ZoomToolbar;