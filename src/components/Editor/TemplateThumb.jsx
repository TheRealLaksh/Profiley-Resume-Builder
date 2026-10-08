import React, { memo, useLayoutEffect, useState } from 'react';
import ResumeDocument from '../Preview/ResumeDocument';

const PAPER_WIDTH = 793.7; // 210mm in CSS pixels

/** A real, scaled-down render of the resume, so the gallery shows the user's own content. */
const TemplateThumb = memo(function TemplateThumb({ config, data, sectionOrder }) {
  const [box, setBox] = useState(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!box) return;
    const observer = new ResizeObserver(() => setWidth(box.clientWidth));
    observer.observe(box);
    return () => observer.disconnect();
  }, [box]);

  return (
    <div ref={setBox} className="relative w-full overflow-hidden bg-white" style={{ aspectRatio: '210 / 297' }} aria-hidden="true">
      {width > 0 && (
        <div style={{ width: PAPER_WIDTH, transform: `scale(${width / PAPER_WIDTH})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
          <ResumeDocument data={data} config={config} sectionOrder={sectionOrder} paperRole="thumb" />
        </div>
      )}
    </div>
  );
});

export default TemplateThumb;
