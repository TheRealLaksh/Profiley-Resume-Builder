import React, { useState, useRef } from "react";
import {
  Layout,
  Download
} from "lucide-react";

/* ✅ IMPORTED CONSTANTS */
import { initialData } from "../constants/initialData";
import { initialConfig } from "../constants/initialConfig";
import { initialSections } from "../constants/sections";
import { colorThemes } from "../constants/themes";
import { templates } from "../constants/templates";

const Profiley = () => {
  const [data, setData] = useState(initialData);
  const [config, setConfig] = useState(initialConfig);
  const [sectionOrder, setSectionOrder] = useState(initialSections);
  const fileInputRef = useRef(null);

  const printDocument = () => {
    const original = document.title;
    document.title = `${data.personal.name || "Resume"}_CV`;
    window.print();
    setTimeout(() => (document.title = original), 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center space-y-6">
        <h1 className="text-3xl font-extrabold flex items-center justify-center gap-2">
          <Layout className="text-blue-600" />
          Profiley
        </h1>

        <p className="text-gray-600 max-w-md">
          Environment is working. React, Vite, Tailwind, and Node are correctly configured.
        </p>

        <button
          onClick={printDocument}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <Download className="inline mr-2" />
          Test Print
        </button>
      </div>
    </div>
  );
};

export default Profiley;
