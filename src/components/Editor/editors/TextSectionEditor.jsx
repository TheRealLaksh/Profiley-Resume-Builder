import React from 'react';
import { TextField, TextAreaField } from '../../UI/FormElements';

const wordCount = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);

export const SummaryEditor = ({ summary, setData }) => {
  const words = wordCount(summary);
  const note = words === 0 ? 'Two or three sentences work best: who you are, what you do, what you want next.'
    : words < 30 ? `${words} words. A little more context helps.`
    : words > 90 ? `${words} words. Consider trimming to about 60.`
    : `${words} words.`;

  return (
    <TextAreaField
      label="Summary"
      rows={9}
      value={summary}
      onChange={(e) => setData((prev) => ({ ...prev, personal: { ...prev.personal, summary: e.target.value } }))}
      placeholder="Product designer with six years of experience building design systems for fintech teams..."
      hint={note}
    />
  );
};

export const CustomSectionEditor = ({ id, section, setData, setSectionOrder }) => {
  const setField = (field, value) =>
    setData((prev) => ({ ...prev, custom: { ...prev.custom, [id]: { ...prev.custom[id], [field]: value } } }));

  return (
    <div className="space-y-4">
      <TextField
        label="Section title"
        value={section.title}
        onChange={(e) => {
          setField('title', e.target.value);
          setSectionOrder((prev) => prev.map((s) => (s.id === id ? { ...s, label: e.target.value } : s)));
        }}
        placeholder="Certifications"
      />
      <TextAreaField
        label="Content"
        rows={8}
        value={section.content}
        onChange={(e) => setField('content', e.target.value)}
        placeholder={"- AWS Certified Cloud Practitioner (2025)\n- Google UX Design Certificate"}
        hint="Start a line with a dash (-) to make it a bullet point."
      />
    </div>
  );
};
