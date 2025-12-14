import { Eye, EyeOff, GripVertical } from "lucide-react";

const LeftPanel = ({
  sectionOrder,
  toggleSectionVisibility,
}) => {
  return (
    <div className="w-80 bg-white border-r border-gray-300 p-4 text-gray-900">
      <h2 className="text-lg font-bold mb-4">Profiley</h2>

      <div className="space-y-2">
        {sectionOrder.map((section) => (
          <div
            key={section.id}
            className="flex items-center justify-between px-3 py-2 border rounded-md bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">
                {section.label}
              </span>
            </div>

            <button
              onClick={() => toggleSectionVisibility(section.id)}
              className="text-gray-600 hover:text-gray-900"
            >
              {section.visible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;
