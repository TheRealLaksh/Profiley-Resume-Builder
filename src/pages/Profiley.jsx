import React, { useState } from "react";
import LeftPanel from "../components/layout/LeftPanel";
import RightPanel from "../components/layout/RightPanel";
import ResumePreview from "../components/preview/ResumePreview";

import { initialData } from "../constants/initialData";
import { initialSections } from "../constants/initialSections";
import { initialConfig } from "../constants/initialConfig";

const Profiley = () => {
  const [data] = useState(initialData);
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
        <ResumePreview
          data={data}
          sectionOrder={sectionOrder}
        />
      </RightPanel>
    </div>
  );
};

export default Profiley;
