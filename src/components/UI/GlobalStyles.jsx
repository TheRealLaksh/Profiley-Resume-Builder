import React from 'react';

const GlobalStyles = () => (
  <style>{`
    .dark ::-webkit-scrollbar { width: 8px; }
    .dark ::-webkit-scrollbar-track { background: #171717; }
    .dark ::-webkit-scrollbar-thumb { background: #525252; border-radius: 4px; }
    .dark ::-webkit-scrollbar-thumb:hover { background: #737373; }

    @keyframes slideIn {
      from { transform: translate(-50%, 100%); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }
    
    .toast-enter {
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `}</style>
);

export default GlobalStyles;