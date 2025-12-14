import { Layout } from "lucide-react";

const LeftPanel = () => {
  return (
    <div className="w-80 bg-white border-r border-gray-300 p-4 text-gray-900">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        <Layout className="text-blue-600" />
        Profiley
      </h2>

      <p className="text-sm text-gray-500">
        Editor panel (coming next)
      </p>
    </div>
  );
};

export default LeftPanel;
