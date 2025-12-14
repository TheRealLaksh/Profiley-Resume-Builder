// src/components/UI/FormElements.jsx
import React from 'react';
import { Trash2 } from 'lucide-react';

export const EditorSection = ({ title, icon: Icon, id, activeTab, setActiveTab, onDelete, darkMode }) => (
  <div className="flex items-center gap-2 mb-2">
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-grow flex items-center p-3 rounded-lgybGb transition-all duration-200 text-left ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-md translate-x-1' 
          : darkMode 
            ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-transparent hover:border-neutral-600'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
      }`}
    >
      <Icon size={18} className="mr-3" />
      <span className="font-medium truncate">{title}</span>
    </button>
    {onDelete && (
      <button 
        onClick={onDelete} 
        className={`p-3 rounded-lg border border-transparent transition-colors ${
          darkMode 
            ? 'bg-neutral-800 text-red-400 hover:bg-red-900/30 hover:border-red-900/50' 
            : 'bg-white text-red-500 hover:bg-red-50 hover:border-red-100'
        }`}
      >
        <Trash2 size={18} />
      </button>
    )}
  </div>
);

export const Toggle = ({ label, value, onChange, darkMode }) => (
  <div className={`flex justify-between items-center py-2.5 border-b last:border-0 ${darkMode ? 'border-neutral-700' : 'border-gray-100'}`}>
    <span className={`text-sm font-medium ${darkMode ? 'text-neutral-300' : 'text-gray-700'}`}>{label}</span>
    <button 
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full relative transition-colors duration-200ybGb ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${value ? 'bg-blue-600' : darkMode ? 'bg-neutral-600' : 'bg-gray-300'}`}
    >
      <span className={`block w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform duration-200 ${value ? 'left-6' : 'left-1'}`} />
    </button>
  </div>
);

export const Select = ({ label, value, onChange, options, darkMode }) => (
  <div className={`py-2.5 border-b last:border-0 ${darkMode ? 'border-neutral-700' : 'border-gray-100'}`}>
    <label className={`block text-xs font-bold uppercase tracking-wide mb-1.5 ${darkMode ? 'text-neutral-500' : 'text-gray-500'}`}>{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className={`w-full p-2 text-sm border rounded-md outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        darkMode 
          ? 'bg-neutral-900 border-neutral-600 text-white' 
          : 'bg-white border-gray-300 text-gray-900'
      }`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} className={darkMode ? 'bg-neutral-900 text-white' : ''}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const ColorButton = ({ colorKey, theme, selected, onClick }) => {
  return (
    <button 
      onClick={onClick}
      title={theme.name}
      className={`w-8 h-8 rounded-full ${theme.hex} shadow-sm transition-transform hover:scale-110 ${selected ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
      aria-label={`Select ${theme.name} theme`}
    />
  );
};