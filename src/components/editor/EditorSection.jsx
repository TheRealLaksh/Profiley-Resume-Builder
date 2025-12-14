import { Trash2 } from "lucide-react";

const EditorSection = ({ title, icon: Icon, active, onClick, onDelete }) => (
  <div className="flex items-center gap-2">
    <button
      onClick={onClick}
      className={`flex-1 flex items-center gap-2 p-3 rounded-lg ${
        active ? "bg-blue-600 text-white" : "bg-white"
      }`}
    >
      <Icon size={18} />
      {title}
    </button>
    {onDelete && (
      <button onClick={onDelete} className="text-red-500">
        <Trash2 size={16} />
      </button>
    )}
  </div>
);

export default EditorSection;
