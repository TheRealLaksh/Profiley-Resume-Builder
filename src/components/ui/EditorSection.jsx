import { Trash2 } from "lucide-react";

const EditorSection = ({ title, icon: Icon, id, activeTab, setActiveTab, onDelete }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <button
        onClick={() => setActiveTab(id)}
        className={`flex-grow flex items-center p-3 rounded-lg transition-all duration-200 text-left ${
          activeTab === id
            ? "bg-blue-600 text-white shadow-md translate-x-1"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200"
        }`}
      >
        <Icon size={18} className="mr-3" />
        <span className="font-medium truncate">{title}</span>
      </button>

      {onDelete && (
        <button
          onClick={onDelete}
          className="p-3 bg-white text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
};

export default EditorSection;
