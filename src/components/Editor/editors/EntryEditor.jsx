import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Plus, Trash2 } from 'lucide-react';
import { TextField, TextAreaField, EmptyState } from '../../UI/FormElements';

const KINDS = {
  experience: {
    primary: 'role', secondary: 'company',
    primaryLabel: 'Role', secondaryLabel: 'Company',
    primaryPlaceholder: 'Product Designer', secondaryPlaceholder: 'Northwind Labs',
    detailsPlaceholder: '- Led the redesign of the onboarding flow, lifting activation by 18%\n- Built the first shared component library',
    noun: 'role', empty: { primary: '', secondary: '', year: '', details: '' }
  },
  education: {
    primary: 'institution', secondary: 'degree',
    primaryLabel: 'Institution', secondaryLabel: 'Degree or field',
    primaryPlaceholder: 'Savitribai Phule Pune University', secondaryPlaceholder: 'B.Des, Communication Design',
    detailsPlaceholder: 'Grades, thesis, societies, relevant coursework',
    noun: 'education entry', empty: { institution: '', degree: '', year: '', details: '' }
  }
};

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const EntryEditor = ({ kind, items, setData, notifyUndo }) => {
  const cfg = KINDS[kind];
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  const update = (fn) => setData((prev) => ({ ...prev, [kind]: fn(prev[kind]) }));
  const setField = (id, field, value) =>
    update((list) => list.map((item) => (item.id === id ? { ...item, [field]: value } : item)));

  const add = () => {
    const id = newId();
    update((list) => [...list, { id, ...cfg.empty }]);
    setOpenId(id);
  };

  const move = (index, delta) =>
    update((list) => {
      const target = index + delta;
      if (target < 0 || target >= list.length) return list;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const duplicate = (index) => {
    const id = newId();
    update((list) => {
      const next = [...list];
      next.splice(index + 1, 0, { ...list[index], id });
      return next;
    });
    setOpenId(id);
  };

  const remove = (id) => {
    update((list) => list.filter((item) => item.id !== id));
    notifyUndo?.(`Removed ${cfg.noun}`);
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title={`No ${cfg.noun}s yet`}
        text="Add your first one. You can reorder them later."
        action={<button className="btn btn-primary" onClick={add}><Plus size={16} /> Add {cfg.noun}</button>}
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const open = openId === item.id;
        const title = item[cfg.primary] || `Untitled ${cfg.noun}`;
        const sub = [item[cfg.secondary], item.year].filter(Boolean).join('  ·  ');

        return (
          <div key={item.id} className={`card overflow-hidden transition-shadow duration-200 ${open ? 'shadow-soft' : ''}`}>
            <div className="flex items-center gap-1 pr-2">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
                className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left max-md:min-h-[3.75rem]"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-sunken font-numeric text-[11px] text-ink-2 max-md:h-8 max-md:w-8 max-md:rounded-lg max-md:text-xs">{index + 1}</span>
                <span className="min-w-0">
                  <span className={`block truncate text-[13px] font-medium max-md:text-[15px] ${item[cfg.primary] ? 'text-ink' : 'text-ink-3'}`}>{title}</span>
                  {sub && <span className="block truncate text-xs text-ink-3 max-md:text-[13px]">{sub}</span>}
                </span>
              </button>
              <button className="btn btn-ghost btn-icon btn-sm !h-8 !w-8 max-md:!h-11 max-md:!w-10" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${title} up`} title="Move up"><ChevronUp size={16} /></button>
              <button className="btn btn-ghost btn-icon btn-sm !h-8 !w-8 max-md:!h-11 max-md:!w-10" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label={`Move ${title} down`} title="Move down"><ChevronDown size={16} /></button>
            </div>

            {open && (
              <div className="animate-fade space-y-4 border-t border-line px-4 pb-4 pt-4">
                <TextField label={cfg.primaryLabel} value={item[cfg.primary] ?? ''} onChange={(e) => setField(item.id, cfg.primary, e.target.value)} placeholder={cfg.primaryPlaceholder} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_9.5rem]">
                  <TextField label={cfg.secondaryLabel} value={item[cfg.secondary] ?? ''} onChange={(e) => setField(item.id, cfg.secondary, e.target.value)} placeholder={cfg.secondaryPlaceholder} />
                  <TextField label="Dates" value={item.year ?? ''} onChange={(e) => setField(item.id, 'year', e.target.value)} placeholder="2022 – Present" />
                </div>
                <TextAreaField
                  label="Details"
                  rows={5}
                  value={item.details ?? ''}
                  onChange={(e) => setField(item.id, 'details', e.target.value)}
                  placeholder={cfg.detailsPlaceholder}
                  hint="Start a line with a dash (-) to make it a bullet point."
                />
                <div className="flex items-center justify-between pt-1">
                  <button className="btn btn-ghost btn-sm" onClick={() => duplicate(index)}><Copy size={14} /> Duplicate</button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(item.id)}><Trash2 size={14} /> Remove</button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button className="btn btn-secondary w-full border-dashed" onClick={add}><Plus size={16} /> Add {cfg.noun}</button>
    </div>
  );
};

export default EntryEditor;
