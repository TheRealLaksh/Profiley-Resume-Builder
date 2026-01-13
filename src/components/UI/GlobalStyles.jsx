import React from 'react';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Lora:wght@400;700&family=Merriweather:wght@300;400;700&family=Oswald:wght@400;700&family=Playfair+Display:wght@400;700&family=Raleway:wght@400;700&family=Space+Mono:wght@400;700&display=swap');

    @media print {
      body { display: none; }
    }
    
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