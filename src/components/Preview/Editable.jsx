import React, { useRef, useState } from 'react';
import { useEdit } from './editContext';

const HOVER = 'cursor-text rounded-[3px] outline-offset-2 hover:outline hover:outline-1 hover:outline-dashed hover:outline-accent/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent';

// `inputClassName` carries the type styles when they live on a child (DetailText) rather than on the wrapper,
// so the edit box looks exactly like the text it replaces.
const Editable = ({ path, value = '', as: Tag = 'span', multiline = false, placeholder = 'Add text', className = '', inputClassName = '', children, label }) => {
  const edit = useEdit();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const cancelled = useRef(false);

  if (!edit || !path) return <Tag className={className}>{children ?? value}</Tag>;

  const start = () => {
    cancelled.current = false;
    setDraft(value);
    setEditing(true);
  };

  const finish = () => {
    if (!cancelled.current && draft !== value) edit.commit(path, multiline ? draft : draft.replace(/\s*\n\s*/g, ' '));
    setEditing(false);
  };

  if (editing) {
    const shared = {
      autoFocus: true,
      value: draft,
      onChange: (e) => setDraft(e.target.value),
      onBlur: finish,
      'aria-label': label || placeholder,
      spellCheck: true,
      onFocus: (e) => { const el = e.target; const end = el.value.length; el.setSelectionRange(end, end); },
      className: `m-0 block w-full resize-none rounded-[3px] border-0 bg-accent/10 p-0 outline outline-2 outline-offset-2 outline-accent [font-family:inherit] [letter-spacing:inherit] [text-align:inherit] ${inputClassName || '[font-size:inherit] [font-weight:inherit] [line-height:inherit] text-inherit'}`,
      style: { textTransform: 'none', fieldSizing: 'content', minWidth: '3ch' }
    };

    return multiline ? (
      <Tag className={className}>
        <textarea
          {...shared}
          rows={Math.max(2, draft.split('\n').length)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { cancelled.current = true; e.currentTarget.blur(); }
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); e.currentTarget.blur(); }
          }}
        />
      </Tag>
    ) : (
      <Tag className={className}>
        <input
          {...shared}
          type="text"
          onKeyDown={(e) => {
            if (e.key === 'Escape') { cancelled.current = true; e.currentTarget.blur(); }
            if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
          }}
        />
      </Tag>
    );
  }

  const empty = !String(value).trim();
  return (
    <Tag
      className={`${className} ${HOVER}`}
      tabIndex={0}
      data-editable={path}
      title="Click to edit"
      onClick={start}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'F2') { e.preventDefault(); start(); } }}
    >
      {empty ? <span data-editor-only className="italic text-gray-400">{placeholder}</span> : (children ?? value)}
    </Tag>
  );
};

export default Editable;
