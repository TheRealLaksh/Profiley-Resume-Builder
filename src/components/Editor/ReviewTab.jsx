import React, { useState } from 'react';
import { PanelHeading, Segmented } from '../UI/FormElements';
import useAiStatus from '../../ai/useAiStatus';
import AtsPanel from './review/AtsPanel';
import TailorPanel from './review/TailorPanel';

const CONTENT_TABS = new Set(['personal', 'summary', 'experience', 'sections']);

const ReviewTab = ({ data, setData, config, sectionOrder, applyTemplate, setActiveTab, notify, notifyUndo }) => {
  const [mode, setMode] = useState('ats');
  const ai = useAiStatus();

  const onAction = (id) => {
    if (id === 'template-ats') {
      applyTemplate('ats');
      notify?.('Switched to the ATS Friendly template');
    } else if (CONTENT_TABS.has(id) || id === 'design' || id === 'export') {
      setActiveTab(id);
    }
  };

  return (
    <div className="animate-rise">
      <PanelHeading title="Review" subtitle="See how your resume reads to software, and to one specific job." />
      <Segmented
        className="mb-5"
        value={mode}
        onChange={setMode}
        options={[{ value: 'ats', label: 'ATS check' }, { value: 'job', label: 'Job match' }]}
      />
      {mode === 'ats'
        ? <AtsPanel data={data} config={config} sectionOrder={sectionOrder} onAction={onAction} />
        : <TailorPanel data={data} setData={setData} notifyUndo={notifyUndo} ai={ai} />}
    </div>
  );
};

export default ReviewTab;
