import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { EmptyState } from '../../UI/FormElements';

const ListEditor = ({ field, items, setData, notifyUndo, placeholder, noun = 'item' }) => {
  // Index of a row that should grab focus (set when Enter or "Add" creates one).
  const [focusIndex, setFocusIndex] = useState(null);

  const update = (fn) => setData((prev) => ({ ...prev, [field]: fn(prev[field]) }));

  const addAt = (index) => {
    update((list) => {
      const next = [...list];
      next.splice(index, 0, '');
      return next;
    });
    setFocusIndex(index);
  };

  const move = (index, delta) =>
    update((list) => {
      const target = index + delta;
      if (target < 0 || target >= list.length) return list;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const remove = (index) => {
    update((list) => list.filter((_, i) => i !== index));
    notifyUndo?.(`Removed ${noun}`);
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title={`No ${noun}s yet`}
        action={<button className="btn btn-primary" onClick={() => addAt(0)}><Plus size={16} /> Add {noun}</button>}
      />
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="card group flex items-start gap-1 p-1.5">
          <textarea
            className="min-h-[2.5rem] flex-1 resize-none bg-transparent px-2.5 py-2 text-[13px] leading-snug text-ink outline-none placeholder:text-ink-3 phone:min-h-[3rem] phone:py-3 phone:text-base"
            rows={Math.max(1, Math.ceil(item.length / 44))}
            value={item}
            autoFocus={focusIndex === index}
            onBlur={() => setFocusIndex(null)}
            onChange={(e) => update((list) => list.map((v, i) => (i === index ? e.target.value.replace(/\n/g, ' ') : v)))}
            enterKeyHint="next"
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addAt(index + 1); }
              if (e.key === 'Backspace' && item === '' && items.length > 1) { e.preventDefault(); remove(index); setFocusIndex(Math.max(0, index - 1)); }
            }}
            placeholder={placeholder}
            aria-label={`${noun} ${index + 1}`}
          />
          <div className="flex shrink-0 flex-col opacity-60 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 phone:opacity-100">
            <button className="btn btn-ghost btn-icon !h-6 !w-7 phone:!h-8 phone:!w-10" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up"><ChevronUp size={14} /></button>
            <button className="btn btn-ghost btn-icon !h-6 !w-7 phone:!h-8 phone:!w-10" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Move down"><ChevronDown size={14} /></button>
          </div>
          <button className="btn btn-ghost btn-danger btn-icon !h-8 !w-8 shrink-0 phone:!h-11 phone:!w-11" onClick={() => remove(index)} aria-label={`Remove ${noun} ${index + 1}`}><Trash2 size={15} /></button>
        </div>
      ))}
      <button className="btn btn-secondary w-full border-dashed" onClick={() => addAt(items.length)}><Plus size={16} /> Add {noun}</button>
      <p className="hint phone:hidden">Press Enter to add the next one, Backspace on an empty row to remove it.</p>
    </div>
  );
};

export default ListEditor;
