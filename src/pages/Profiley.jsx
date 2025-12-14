import React, { useState, useRef } from "react";
import LeftPanel from "../components/layout/LeftPanel";
import RightPanel from "../components/layout/RightPanel";

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

  const toggleSectionVisibility = (id) => {
    setSectionOrder((prev) =>
      prev.map((section) =>
        section.id === id
          ? { ...section, visible: !section.visible }
          : section
      )
    );
  };

  const printDocument = () => {
    const original = document.title;
    document.title = `${data.personal.name || "Resume"}_CV`;
    window.print();
    setTimeout(() => (document.title = original), 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <LeftPanel
        sectionOrder={sectionOrder}
        toggleSectionVisibility={toggleSectionVisibility}
      />
      <RightPanel />
    </div>
  );
};

export default Profiley;
