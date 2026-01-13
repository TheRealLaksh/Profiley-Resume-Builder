import React from 'react';
import { Mail, Phone, Download, FilePlus } from 'lucide-react';

const ReadOnlyToolbar = ({ 
  data, 
  darkMode, 
  handleCopyEmail, 
  handleDownloadPdf, 
  handleForkTemplate 
}) => {
  return (
    <div className={`fixed bottom-0 left-0 w-full z-[100] px-6 py-4 flex items-center justify-center gap-4 border-t shadow-[0_-4px_20px_rgba(0,0,0,0.1)] backdrop-blur-md transition-colors duration-300 ${darkMode ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white/90 border-gray-200'}`}>
      
      <div className="flex items-center gap-3">
        {data.personal?.email && (
          <button 
            onClick={handleCopyEmail}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95 cursor-pointer"
            title="Copy Email to Clipboard"
          >
            <Mail size={18} />
            <span className="hidden sm:inline">Email</span>
          </button>
        )}
        
        {data.personal?.phone && (
          <a 
            href={`tel:${data.personal.phone}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg hover:shadow-green-500/25 hover:scale-105 active:scale-95"
          >
            <Phone size={18} />
            <span className="hidden sm:inline">Call</span>
          </a>
        )}
      </div>

      {(data.personal?.email || data.personal?.phone) && (
         <div className={`hidden sm:block h-8 w-px ${darkMode ? 'bg-neutral-700' : 'bg-gray-300'}`}></div>
      )}

      <button 
        onClick={handleDownloadPdf}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 hover:scale-105 active:scale-95 cursor-pointer"
      >
          <Download size={18} />
          <span className="hidden sm:inline">Download</span>
      </button>

      <button 
        onClick={handleForkTemplate} 
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all shadow-lg hover:scale-105 active:scale-95 border ${darkMode ? 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'}`}
      >
          <FilePlus size={18} className="text-blue-500" />
          <span>Use Template</span>
      </button>
    </div>
  );
};

export default ReadOnlyToolbar;