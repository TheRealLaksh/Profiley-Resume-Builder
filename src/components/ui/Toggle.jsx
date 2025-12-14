const Toggle = ({ label, value, onChange }) => {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
          value ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`block w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform duration-200 ${
            value ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

export default Toggle;
