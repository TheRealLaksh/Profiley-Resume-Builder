import React, { useState, useRef } from "react";
import LeftPanel from "../components/layout/LeftPanel";
import RightPanel from "../components/layout/RightPanel";

import { initialData } from "../constants/initialData";
import { initialSections } from "../constants/initialSections";
import { colorThemes } from "../constants/colorThemes";
import { templates } from "../constants/templates";
import { initialConfig } from "../constants/initialConfig";


const Profiley = () => {
  const [data, setData] = useState(initialData);
  const [config, setConfig] = useState(initialConfig);
  const [sectionOrder, setSectionOrder] = useState(initialSections);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const toggleSectionVisibility = (id) => {
    setSectionOrder((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s
      )
    );
  };

  const handleDragStart = (_, index) => setDraggedIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (index === draggedIndex) return;

    const updated = [...sectionOrder];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);

    setDraggedIndex(index);
    setSectionOrder(updated);
  };

  const handleDragEnd = () => setDraggedIndex(null);

  return (
    <div className="min-h-screen flex">
      <LeftPanel
        sectionOrder={sectionOrder}
        toggleSectionVisibility={toggleSectionVisibility}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      />

      <RightPanel>
        <div className="p-8 text-gray-400 text-center">
          Resume preview (coming next)
        </div>
      </RightPanel>
    </div>
  );
};

export default Profiley;
