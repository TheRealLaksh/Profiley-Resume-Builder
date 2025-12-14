import React, { useState } from "react";

import LeftPanel from "../components/layout/LeftPanel";
import RightPanel from "../components/layout/RightPanel";

import { initialData } from "../constants/initialData";
import { initialSections } from "../constants/initialSections";
import { initialConfig } from "../constants/initialConfig";

const Profiley = () => {
  const [data, setData] = useState(initialData);
  const [config, setConfig] = useState(initialConfig);
  const [sectionOrder, setSectionOrder] = useState(initialSections);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const toggleSectionVisibility = (id) => {
    setSectionOrder((prev) =>
      prev.map((section) =>
        section.id === id
          ? { ...section, visible: !section.visible }
          : section
      )
    );
  };

  const handleDragStart = (_, index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...sectionOrder];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);

    setDraggedIndex(index);
    setSectionOrder(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <LeftPanel
        sectionOrder={sectionOrder}
        toggleSectionVisibility={toggleSectionVisibility}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      />

      <RightPanel>
        <div className="flex items-center justify-center h-full text-gray-400">
          Resume preview (coming next)
        </div>
      </RightPanel>
    </div>
  );
};

export default Profiley;
