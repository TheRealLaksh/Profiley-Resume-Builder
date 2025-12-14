import { Eye, EyeOff, GripVertical } from "lucide-react";

const LeftPanel = ({
  sectionOrder,
  toggleSectionVisibility,
  onDragStart,
  onDragOver,
  onDragEnd
}) => {
  return (
    <div className="w-80 bg-white border-r p-4">
      <h2 className="font-bold mb-4">Profiley</h2>

      {sectionOrder.map((section, index) => (
        <div
          key={section.id}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDragEnd={onDragEnd}
          className="flex items-center gap-3 p-2 border rounded mb-2"
        >
          <GripVertical size={16} />
          <span className="flex-1">{section.label}</span>
          <button onClick={() => toggleSectionVisibility(section.id)}>
            {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      ))}
    </div>
  );
};

export default LeftPanel;
