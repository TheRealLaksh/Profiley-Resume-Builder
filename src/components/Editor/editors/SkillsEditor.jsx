import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { EmptyState } from '../../UI/FormElements';

const asSkill = (skill) => (typeof skill === 'string' ? { name: skill, level: 80 } : skill);

const SkillsEditor = ({ skills, setData, notifyUndo }) => {
  const [draft, setDraft] = useState('');

  const update = (fn) => setData((prev) => ({ ...prev, skills: fn(prev.skills) }));
  const setField = (index, field, value) =>
    update((list) => list.map((skill, i) => (i === index ? { ...asSkill(skill), [field]: value } : skill)));

  const addDraft = () => {
    const name = draft.trim();
    if (!name) return;
    update((list) => [...list, { name, level: 80 }]);
    setDraft('');
  };

  const remove = (index) => {
    update((list) => list.filter((_, i) => i !== index));
    notifyUndo?.('Removed skill');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="input"
          enterKeyHint="done"
          autoCapitalize="words"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDraft(); } }}
          placeholder="Add a skill and press Enter"
          aria-label="New skill"
        />
        <button className="btn btn-primary btn-icon !h-10 !w-10 phone:!h-[2.875rem] phone:!w-[2.875rem]" onClick={addDraft} disabled={!draft.trim()} aria-label="Add skill"><Plus size={18} /></button>
      </div>

      {skills.length === 0 ? (
        <EmptyState title="No skills yet" text="Type a skill above. Levels appear as bars or dots in templates that use them." />
      ) : (
        <ul className="space-y-2">
          {skills.map((raw, index) => {
            const skill = asSkill(raw);
            return (
              <li key={index} className="card flex items-center gap-3 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <input
                    className="w-full bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-ink-3 phone:py-1 phone:text-base"
                    value={skill.name ?? ''}
                    onChange={(e) => setField(index, 'name', e.target.value)}
                    aria-label={`Skill ${index + 1} name`}
                    placeholder="Skill"
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={skill.level ?? 80}
                    onChange={(e) => setField(index, 'level', Number(e.target.value))}
                    aria-label={`${skill.name || 'Skill'} level`}
                    className="mt-1.5 h-1 w-full cursor-pointer accent-accent phone:mt-2"
                  />
                </div>
                <span className="w-9 text-right font-numeric text-xs tabular text-ink-3">{skill.level ?? 80}%</span>
                <button className="btn btn-ghost btn-danger btn-icon !h-8 !w-8 phone:!h-11 phone:!w-11" onClick={() => remove(index)} aria-label={`Remove ${skill.name || 'skill'}`}><Trash2 size={15} /></button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SkillsEditor;
