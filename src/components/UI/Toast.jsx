import React from 'react';
import { Check } from 'lucide-react';

const Toast = ({ show, message }) => {
  if (!show) return null;

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[110] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md toast-enter bg-gray-900 text-white dark:bg-white dark:text-gray-900">
      <div className="p-1 rounded-full bg-green-500 text-white">
        <Check size={14} strokeWidth={3} />
      </div>
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
};

export default Toast;