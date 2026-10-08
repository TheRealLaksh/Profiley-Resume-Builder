import React, { useState } from 'react';
import {
    Briefcase, GraduationCap, Code, Award, Heart, User, FileText, FilePlus,
    ArrowDown, ArrowUp, GripVertical, Eye, EyeOff, Pencil, Check, X, ChevronRight, ChevronLeft, Trash2, Plus, FileUp
} from 'lucide-react';
import { PanelHeading, Toggle } from '../UI/FormElements';
import { DESKTOP_QUERY } from '../../utils/layout';
import PersonalEditor from './editors/PersonalEditor';
import EntryEditor from './editors/EntryEditor';
import SkillsEditor from './editors/SkillsEditor';
import ListEditor from './editors/ListEditor';
import { SummaryEditor, CustomSectionEditor } from './editors/TextSectionEditor';

const ICONS = {
    summary: User, experience: Briefcase, education: GraduationCap,
    skills: Code, achievements: Award, community: Heart
};

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

const describe = (section, data) => {
    switch (section.id) {
        case 'summary': {
            const words = data.personal.summary.trim() ? data.personal.summary.trim().split(/\s+/).length : 0;
            return words ? plural(words, 'word') : 'Empty';
        }
        case 'experience': return plural(data.experience.length, 'role');
        case 'education': return plural(data.education.length, 'entry', 'entries');
        case 'skills': return plural(data.skills.length, 'skill');
        case 'achievements': return plural(data.achievements.length, 'item');
        case 'community': return plural(data.community.length, 'item');
        default: return data.custom?.[section.id]?.content ? 'Custom' : 'Empty';
    }
};

const ContentTab = ({
    activeTab, setActiveTab, data, setData, sectionOrder, setSectionOrder,
    draggedItemIndex, handleDragStart, handleDragOver, handleDragEnd, notifyUndo, openImport
}) => {
    const [editingId, setEditingId] = useState(null);
    // Drag-and-drop is a mouse gesture; on a phone a long press would start a ghost drag, so reordering uses buttons there.
    const canDrag = typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;
    const [reorder, setReorder] = useState(false);
    const [draftLabel, setDraftLabel] = useState('');

    const section = sectionOrder.find((s) => s.id === activeTab);
    const isCustom = (s) => s?.type === 'custom' || s?.id?.startsWith('custom-');

    // ---- Section list actions ----
    const toggleVisible = (id) =>
        setSectionOrder((prev) => prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));

    const moveSection = (index, delta) =>
        setSectionOrder((prev) => {
            const target = index + delta;
            if (target < 0 || target >= prev.length) return prev;
            const next = [...prev];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });

    const startRename = (s) => { setEditingId(s.id); setDraftLabel(s.label); };
    const cancelRename = () => { setEditingId(null); setDraftLabel(''); };
    const saveRename = () => {
        const label = draftLabel.trim();
        if (label) {
            setSectionOrder((prev) => prev.map((s) => (s.id === editingId ? { ...s, label } : s)));
            if (isCustom({ id: editingId })) {
                setData((prev) => ({
                    ...prev,
                    custom: { ...prev.custom, [editingId]: { ...prev.custom[editingId], title: label } }
                }));
            }
        }
        cancelRename();
    };

    const addCustomSection = () => {
        const id = `custom-${Date.now()}`;
        setSectionOrder((prev) => [...prev, { id, label: 'New section', visible: true, type: 'custom' }]);
        setData((prev) => ({ ...prev, custom: { ...prev.custom, [id]: { title: 'New section', content: '' } } }));
        setActiveTab(id);
    };

    const deleteCustomSection = (id) => {
        setSectionOrder((prev) => prev.filter((s) => s.id !== id));
        setData((prev) => {
            const custom = { ...prev.custom };
            delete custom[id];
            return { ...prev, custom };
        });
        setActiveTab('sections');
        notifyUndo?.('Section deleted');
    };

    // =====================================================================
    // Overview: personal card + sections list
    // =====================================================================
    if (activeTab === 'sections') {
        const initials = (data.personal.name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

        return (
            <div className="animate-rise">
                <PanelHeading
                    title="Your resume"
                    subtitle={<><span className="phone:hidden">Pick a section to edit. Drag to reorder, or use the arrow keys on the handle.</span><span className="desk:hidden">Tap a section to edit it.</span></>}
                    action={(
                        <div className="flex shrink-0 items-center gap-2">
                            <button className={`btn btn-sm shrink-0 desk:hidden ${reorder ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setReorder((v) => !v)} aria-pressed={reorder}>
                                {reorder ? <><Check size={14} /> Done</> : <><ArrowUp size={13} /><ArrowDown size={13} className="-ml-2" /> Reorder</>}
                            </button>
                            {openImport && !reorder && <button className="btn btn-secondary btn-sm shrink-0" onClick={openImport}><FileUp size={14} /> Import</button>}
                        </div>
                    )}
                />

                <button
                    type="button"
                    onClick={() => setActiveTab('personal')}
                    className="card group mb-5 flex w-full items-center gap-3.5 p-3.5 text-left transition-[border-color,box-shadow] duration-200 ease-snap hover:border-line-strong hover:shadow-soft"
                >
                    <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-accent-soft font-display text-lg text-accent-ink">
                        {data.personal.photoUrl ? <img src={data.personal.photoUrl} alt="" className="h-full w-full object-cover" /> : initials}
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">{data.personal.name || 'Add your name'}</span>
                        <span className="block truncate text-xs text-ink-3">{data.personal.title || 'Headline, contact details and photo'}</span>
                    </span>
                    <ChevronRight size={18} className="text-ink-3 transition-transform duration-200 ease-snap group-hover:translate-x-0.5" />
                </button>

                <h3 className="eyebrow mb-2 px-1">Sections</h3>
                <ul className="stagger space-y-1.5">
                    {sectionOrder.map((s, index) => {
                        const Icon = s.type === 'custom' ? FilePlus : (ICONS[s.id] ?? FileText);
                        const dragging = draggedItemIndex === index;
                        const editing = editingId === s.id;

                        return (
                            <li
                                key={s.id}
                                style={{ '--i': index }}
                                draggable={!editing && canDrag}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`card flex items-center gap-1 py-1 pl-1 pr-1.5 transition-[opacity,border-color,box-shadow] duration-200 ease-snap ${dragging ? 'border-accent opacity-60 shadow-pop' : 'hover:border-line-strong'} ${s.visible ? '' : 'bg-transparent'}`}
                            >
                                <button
                                    type="button"
                                    className="grid h-9 w-7 shrink-0 cursor-grab place-items-center rounded-lg text-ink-3 hover:bg-sunken hover:text-ink active:cursor-grabbing phone:hidden"
                                    aria-label={`Reorder ${s.label}. Press up or down arrow to move.`}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowUp') { e.preventDefault(); moveSection(index, -1); }
                                        if (e.key === 'ArrowDown') { e.preventDefault(); moveSection(index, 1); }
                                    }}
                                >
                                    <GripVertical size={16} />
                                </button>

                                {editing ? (
                                    <div className="flex min-w-0 flex-1 items-center gap-1">
                                        <input
                                            autoFocus
                                            className="input !h-8 !rounded-lg"
                                            value={draftLabel}
                                            onChange={(e) => setDraftLabel(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') cancelRename(); }}
                                            aria-label="Section name"
                                        />
                                        <button className="btn btn-ghost btn-icon !h-8 !w-8 text-accent" onClick={saveRename} aria-label="Save name"><Check size={16} /></button>
                                        <button className="btn btn-ghost btn-icon !h-8 !w-8" onClick={cancelRename} aria-label="Cancel rename"><X size={16} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => (reorder ? undefined : setActiveTab(s.id))}
                                            className={`group flex min-w-0 flex-1 items-center gap-3 rounded-lg py-1.5 pl-1 text-left phone:min-h-12 phone:pl-2 ${s.visible ? '' : 'opacity-55'}`}
                                        >
                                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sunken text-ink-2 phone:h-10 phone:w-10 phone:rounded-xl"><Icon size={16} /></span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-[13px] font-medium text-ink phone:text-[15px]">{s.label}</span>
                                                <span className="block truncate text-xs text-ink-3 phone:text-[13px]">{s.visible ? describe(s, data) : 'Hidden from resume'}</span>
                                            </span>
                                        </button>
                                        {reorder ? (
                                            <>
                                                <button className="btn btn-secondary btn-icon" onClick={() => moveSection(index, -1)} disabled={index === 0} aria-label={`Move ${s.label} up`}><ArrowUp size={18} /></button>
                                                <button className="btn btn-secondary btn-icon" onClick={() => moveSection(index, 1)} disabled={index === sectionOrder.length - 1} aria-label={`Move ${s.label} down`}><ArrowDown size={18} /></button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn btn-ghost btn-icon !h-8 !w-8 phone:!h-11 phone:!w-11" onClick={() => startRename(s)} aria-label={`Rename ${s.label}`} title="Rename"><Pencil size={14} /></button>
                                                <button
                                                    className={`btn btn-ghost btn-icon !h-8 !w-8 phone:!h-11 phone:!w-11 ${s.visible ? '' : 'text-ink-3'}`}
                                                    onClick={() => toggleVisible(s.id)}
                                                    aria-label={s.visible ? `Hide ${s.label}` : `Show ${s.label}`}
                                                    aria-pressed={s.visible}
                                                    title={s.visible ? 'Hide from resume' : 'Show on resume'}
                                                >
                                                    {s.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <button className="btn btn-secondary mt-3 w-full border-dashed" onClick={addCustomSection}>
                    <Plus size={16} /> Add custom section
                </button>
            </div>
        );
    }

    // =====================================================================
    // Detail editors
    // =====================================================================
    const isPersonal = activeTab === 'personal';
    if (!isPersonal && !section) {
        // The section was deleted (or the tab is stale): fall back to the list.
        return (
            <div className="animate-rise">
                <button className="btn btn-secondary" onClick={() => setActiveTab('sections')}><ChevronLeft size={16} /> Back to sections</button>
            </div>
        );
    }

    const title = isPersonal ? 'Personal details' : section.label;

    const renderEditor = () => {
        if (isPersonal) return <PersonalEditor data={data} setData={setData} />;
        switch (section.id) {
            case 'summary': return <SummaryEditor summary={data.personal.summary} setData={setData} />;
            case 'experience': return <EntryEditor kind="experience" items={data.experience} setData={setData} notifyUndo={notifyUndo} />;
            case 'education': return <EntryEditor kind="education" items={data.education} setData={setData} notifyUndo={notifyUndo} />;
            case 'skills': return <SkillsEditor skills={data.skills} setData={setData} notifyUndo={notifyUndo} />;
            case 'achievements':
                return <ListEditor field="achievements" items={data.achievements} setData={setData} notifyUndo={notifyUndo} noun="achievement" placeholder="Won the 2024 national design challenge" />;
            case 'community':
                return <ListEditor field="community" items={data.community} setData={setData} notifyUndo={notifyUndo} noun="activity" placeholder="Mentored 12 students through the coding club" />;
            default:
                return data.custom?.[section.id]
                    ? <CustomSectionEditor id={section.id} section={data.custom[section.id]} setData={setData} setSectionOrder={setSectionOrder} />
                    : null;
        }
    };

    return (
        <div className="animate-rise" key={activeTab}>
            <div className="phone:hidden">
                <button className="btn btn-ghost btn-sm -ml-2 mb-3" onClick={() => setActiveTab('sections')}>
                    <ChevronLeft size={16} /> All sections
                </button>
                <PanelHeading title={title} />
            </div>

            {/* Phones: the title and the way back stay pinned while the form scrolls. */}
            <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 flex items-center gap-1 border-b border-line bg-panel px-2 py-2 shadow-[0_6px_12px_-10px_rgb(60_45_20/0.25)] desk:hidden">
                <button className="btn btn-ghost btn-icon" onClick={() => setActiveTab('sections')} aria-label="Back to all sections"><ChevronLeft size={22} /></button>
                <h2 className="min-w-0 flex-1 truncate font-display text-[22px] leading-none tracking-tight text-ink">{title}</h2>
            </div>

            {!isPersonal && (
                <div className="mb-4 rounded-xl border border-line bg-sunken/40 px-3.5">
                    <Toggle label="Show on resume" value={section.visible} onChange={() => toggleVisible(section.id)} />
                </div>
            )}

            {renderEditor()}

            {!isPersonal && isCustom(section) && (
                <button className="btn btn-danger mt-6 w-full" onClick={() => deleteCustomSection(section.id)}>
                    <Trash2 size={16} /> Delete this section
                </button>
            )}
        </div>
    );
};

export default ContentTab;
