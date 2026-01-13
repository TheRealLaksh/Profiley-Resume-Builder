import React from 'react';
import { X, Link as LinkIcon, Loader2, Share2 } from 'lucide-react';

const ShareModal = ({ 
  isOpen, 
  onClose, 
  darkMode, 
  customSlug, 
  setCustomSlug, 
  shareError, 
  handleGenerateLink, 
  isGeneratingLink 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md p-6 rounded-xl shadow-2xl ${darkMode ? 'bg-neutral-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <LinkIcon size={20} className="text-blue-500"/> Share Resume
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-full">
            <X size={20}/>
          </button>
        </div>
        
        <p className="text-sm opacity-70 mb-4">Create a public link for your resume.</p>
        
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wide mb-2 opacity-60">Custom URL</label>
          <div className="flex items-center">
            <span className={`px-3 py-3 border border-r-0 rounded-l-lg text-sm ${darkMode ? 'bg-neutral-700 border-neutral-600 text-neutral-400' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
              profiley.lakshp.live/
            </span>
            <input 
              type="text" 
              value={customSlug} 
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="my-resume"
              className={`flex-grow p-3 text-sm border rounded-r-lg outline-none ${darkMode ? 'bg-neutral-900 border-neutral-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'}`} 
            />
          </div>
          {shareError && <p className="text-red-500 text-xs mt-2 font-medium">{shareError}</p>}
        </div>

        <button 
          onClick={handleGenerateLink} 
          disabled={isGeneratingLink}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingLink ? <Loader2 className="animate-spin" size={18} /> : <Share2 size={18} />}
          {isGeneratingLink ? 'Checking...' : 'Generate Link'}
        </button>
      </div>
    </div>
  );
};

export default ShareModal;