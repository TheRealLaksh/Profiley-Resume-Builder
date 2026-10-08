import React, { useDeferredValue, useMemo, useState } from 'react';
import { Check, Eye, RotateCcw } from 'lucide-react';
import { colorThemes, initialConfig, templates, templateFilters } from '../../data/constants';
import { Group, PanelHeading, Segmented, SelectField, Swatch, Toggle } from '../UI/FormElements';
import TemplateThumb from './TemplateThumb';
import { tap } from '../../utils/haptics';

const FONTS = [
    { value: 'font-inter', label: 'Inter' },
    { value: 'font-jakarta', label: 'Jakarta' },
    { value: 'font-grotesk', label: 'Grotesk' },
    { value: 'font-raleway', label: 'Raleway' },
    { value: 'font-sans', label: 'Arial' },
    { value: 'font-oswald', label: 'Oswald' },
    { value: 'font-merriweather', label: 'Merriweather' },
    { value: 'font-lora', label: 'Lora' },
    { value: 'font-playfair', label: 'Playfair' },
    { value: 'font-mono', label: 'Space Mono' }
];

const HEADING_FONTS = [
    { value: '', label: 'Same as body' },
    { value: 'font-grotesk', label: 'Grotesk' },
    { value: 'font-playfair', label: 'Playfair' },
    { value: 'font-merriweather', label: 'Merriweather' },
    { value: 'font-oswald', label: 'Oswald' },
    { value: 'font-mono', label: 'Space Mono' }
];

const DesignTab = ({ data, config, setConfig, sectionOrder, applyTemplate, openPreview }) => {
    const [filter, setFilter] = useState('all');
    const deferredData = useDeferredValue(data);

    const update = (patch) => setConfig((prev) => ({ ...prev, ...patch }));
    const isSidebar = config.layoutType === 'sidebar';
    const hasHeaderChoice = !isSidebar && config.layoutType !== 'gutter';

    const visibleTemplates = useMemo(
        () => Object.entries(templates).filter(([, t]) => filter === 'all' || t.tags.includes(filter)),
        [filter]
    );

    return (
        <div className="animate-rise">
            <PanelHeading
                title="Design"
                subtitle="Start from a template, then fine-tune."
                action={
                    <button className="btn btn-ghost btn-sm" onClick={() => applyTemplate(config.activeTemplate)} title="Undo your tweaks and restore this template">
                        <RotateCcw size={14} /> Reset
                    </button>
                }
            />

            <Group title="Templates" meta={`${Object.keys(templates).length} designs`}>
                <div className="-mx-1 flex flex-wrap gap-1.5 px-1 phone:-mx-4 phone:flex-nowrap phone:snap-x phone:overflow-x-auto phone:px-4 phone:pb-1 phone:[scrollbar-width:none] phone:[&::-webkit-scrollbar]:hidden" role="group" aria-label="Filter templates">
                    {templateFilters.map((f) => (
                        <button
                            key={f.id}
                            type="button"
                            aria-pressed={filter === f.id}
                            onClick={() => setFilter(f.id)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200 ease-snap phone:min-h-10 phone:shrink-0 phone:snap-start phone:px-4 phone:text-[13px] ${filter === f.id ? 'border-ink bg-ink text-canvas' : 'border-line text-ink-2 hover:border-line-strong hover:text-ink'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {visibleTemplates.map(([key, tpl]) => {
                        const selected = config.activeTemplate === key;
                        const previewConfig = { ...initialConfig, ...tpl.config, activeTemplate: key };
                        return (
                            <button
                                key={key}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => { tap(); applyTemplate(key); }}
                                className={`group rounded-2xl border p-1.5 text-left transition-[border-color,box-shadow,background-color,transform] duration-200 ease-snap active:scale-[0.985] ${selected ? 'border-accent bg-accent-soft/60 shadow-soft' : 'border-line bg-surface hover:border-line-strong hover:shadow-soft'}`}
                            >
                                <div className="overflow-hidden rounded-lg border border-line/80 shadow-[0_1px_3px_rgb(60_45_20/0.1)] transition-transform duration-300 ease-snap group-hover:-translate-y-0.5">
                                    <TemplateThumb config={previewConfig} data={deferredData} sectionOrder={sectionOrder} />
                                </div>
                                <div className="px-1.5 pb-1 pt-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[13px] font-semibold text-ink phone:text-sm">{tpl.name}</span>
                                        {selected && <span className="grid h-4 w-4 place-items-center rounded-full bg-accent text-accent-fg"><Check size={10} strokeWidth={3.5} /></span>}
                                    </div>
                                    <span className="mt-0.5 block text-xs leading-snug text-ink-3 line-clamp-2 phone:text-[13px]">{tpl.description}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Group>

            <Group title="Colour" meta={colorThemes[config.themeColor]?.name}>
                <div className="flex flex-wrap gap-2.5" role="group" aria-label="Accent colour">
                    {Object.entries(colorThemes).map(([key, theme]) => (
                        <Swatch key={key} theme={theme} selected={config.themeColor === key} onClick={() => update({ themeColor: key })} />
                    ))}
                </div>
                <Segmented
                    label="Paper"
                    value={config.paperTint || 'bg-white'}
                    onChange={(v) => update({ paperTint: v })}
                    options={[
                        { value: 'bg-white', label: 'White' },
                        { value: 'bg-[#fbf7ee]', label: 'Warm' },
                        { value: 'bg-[#fdf6f3]', label: 'Blush' },
                        { value: 'bg-[#f4f7fa]', label: 'Cool' }
                    ]}
                />
            </Group>

            <Group title="Layout" defaultOpen={false}>
                <Segmented
                    label="Structure"
                    value={config.layoutType}
                    onChange={(v) => update({ layoutType: v })}
                    options={[
                        { value: 'sidebar', label: 'Sidebar' },
                        { value: 'single', label: 'Single' },
                        { value: 'grid', label: 'Grid' },
                        { value: 'gutter', label: 'Gutter' }
                    ]}
                />
                {isSidebar && (
                    <>
                        <Segmented
                            label="Sidebar position"
                            value={config.layoutReverse ? 'right' : 'left'}
                            onChange={(v) => update({ layoutReverse: v === 'right' })}
                            options={[{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }]}
                        />
                        <Segmented
                            label="Sidebar fill"
                            value={config.sidebarBg}
                            onChange={(v) => update({ sidebarBg: v })}
                            options={[
                                { value: 'none', label: 'Plain' },
                                { value: 'gray', label: 'Grey' },
                                { value: 'theme', label: 'Tint' },
                                { value: 'dark', label: 'Dark' }
                            ]}
                        />
                    </>
                )}
                {hasHeaderChoice && (
                    <SelectField
                        label="Header"
                        value={config.headerStyle || 'default'}
                        onChange={(v) => update({ headerStyle: v })}
                        options={[
                            { value: 'default', label: 'Classic' },
                            { value: 'banner', label: 'Colour banner' },
                            { value: 'centered', label: 'Centred' },
                            { value: 'split', label: 'Split (name left, contact right)' },
                            { value: 'poster', label: 'Poster' }
                        ]}
                    />
                )}
                {(isSidebar || (config.headerStyle || 'default') === 'default') && (
                    <Segmented
                        label="Header alignment"
                        value={config.headerAlign}
                        onChange={(v) => update({ headerAlign: v })}
                        options={[{ value: 'text-left', label: 'Left' }, { value: 'text-center', label: 'Centre' }, { value: 'text-right', label: 'Right' }]}
                    />
                )}
                <Segmented
                    label="Spacing"
                    value={config.spacingScale}
                    onChange={(v) => update({ spacingScale: v })}
                    options={[{ value: 'compact', label: 'Compact' }, { value: 'normal', label: 'Normal' }, { value: 'spacious', label: 'Airy' }]}
                />
            </Group>

            <Group title="Typography" defaultOpen={false}>
                <div>
                    <span className="label">Font</span>
                    <div className="grid grid-cols-2 gap-2" role="group" aria-label="Body font">
                        {FONTS.map((font) => (
                            <button
                                key={font.value}
                                type="button"
                                aria-pressed={config.fontFamily === font.value}
                                onClick={() => update({ fontFamily: font.value })}
                                className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition-[border-color,background-color] duration-200 ease-snap ${config.fontFamily === font.value ? 'border-accent bg-accent-soft/60' : 'border-line bg-surface hover:border-line-strong'}`}
                            >
                                <span className={`${font.value} text-xl leading-none text-ink`}>Aa</span>
                                <span className="truncate text-xs font-medium text-ink-2">{font.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <SelectField label="Heading font" value={config.headingFont || ''} onChange={(v) => update({ headingFont: v })} options={HEADING_FONTS} />
                <Segmented
                    label="Text size"
                    value={config.fontScale}
                    onChange={(v) => update({ fontScale: v })}
                    options={[{ value: 'text-[11px]', label: 'Small' }, { value: 'text-xs', label: 'Medium' }, { value: 'text-[13px]', label: 'Large' }]}
                />
                <Segmented
                    label="Name size"
                    value={config.nameSize}
                    onChange={(v) => update({ nameSize: v })}
                    options={[{ value: 'text-2xl', label: 'S' }, { value: 'text-3xl', label: 'M' }, { value: 'text-4xl', label: 'L' }, { value: 'text-5xl', label: 'XL' }]}
                />
                <Segmented
                    label="Name weight"
                    value={config.nameWeight}
                    onChange={(v) => update({ nameWeight: v })}
                    options={[{ value: 'font-bold', label: 'Bold' }, { value: 'font-extrabold', label: 'Heavy' }, { value: 'font-black', label: 'Black' }]}
                />
                <Toggle label="Uppercase section titles" value={config.uppercaseHeaders !== false} onChange={(v) => update({ uppercaseHeaders: v })} />
            </Group>

            <Group title="Sections and entries" defaultOpen={false}>
                <SelectField
                    label="Section title style"
                    value={config.sectionHeaderStyle || 'underline'}
                    onChange={(v) => update({ sectionHeaderStyle: v })}
                    options={[
                        { value: 'underline', label: 'Underline' },
                        { value: 'left-bar', label: 'Side bar' },
                        { value: 'box', label: 'Tinted box' },
                        { value: 'plain', label: 'Plain' },
                        { value: 'centered', label: 'Centred between rules' },
                        { value: 'caps-rule', label: 'Title with rule' },
                        { value: 'prompt', label: 'Terminal prompt' }
                    ]}
                />
                <Segmented
                    label="Entries"
                    value={config.entryStyle || 'clean'}
                    onChange={(v) => update({ entryStyle: v })}
                    options={[{ value: 'clean', label: 'Clean' }, { value: 'boxed', label: 'Boxed' }, { value: 'timeline', label: 'Timeline' }]}
                />
                <Segmented
                    label="Dates"
                    value={config.dateAlign || 'right'}
                    onChange={(v) => update({ dateAlign: v })}
                    options={[{ value: 'right', label: 'Beside title' }, { value: 'below', label: 'Below title' }]}
                />
                <Segmented
                    label="Skills"
                    value={config.skillStyle || 'tags'}
                    onChange={(v) => update({ skillStyle: v })}
                    options={[
                        { value: 'tags', label: 'Tags' }, { value: 'bars', label: 'Bars' }, { value: 'dots', label: 'Dots' },
                        { value: 'list', label: 'List' }, { value: 'comma', label: 'Inline' }
                    ]}
                />
            </Group>

            <Group title="Details" defaultOpen={false}>
                <Toggle label="Profile photo" value={config.showPhoto} onChange={(v) => update({ showPhoto: v })} />
                {config.showPhoto && (
                    <Segmented
                        label="Photo shape"
                        value={config.photoShape}
                        onChange={(v) => update({ photoShape: v })}
                        options={[{ value: 'rounded-full', label: 'Circle' }, { value: 'rounded-xl', label: 'Soft' }, { value: 'rounded-none', label: 'Square' }]}
                    />
                )}
                <Toggle label="Contact icons" value={config.showIcons !== false} onChange={(v) => update({ showIcons: v })} />
                <Toggle label="Section icons" value={config.showSectionIcons !== false} onChange={(v) => update({ showSectionIcons: v })} />
                <Segmented
                    label="Page frame"
                    value={config.borderStyle || 'none'}
                    onChange={(v) => update({ borderStyle: v })}
                    options={[{ value: 'none', label: 'None' }, { value: 'simple', label: 'Thin' }, { value: 'double', label: 'Double' }]}
                />
                <Segmented
                    label="Divider under name"
                    value={config.dividerStyle || 'none'}
                    onChange={(v) => update({ dividerStyle: v })}
                    options={[{ value: 'none', label: 'Hairline' }, { value: 'thick', label: 'Thick' }, { value: 'diamond', label: 'Diamond' }]}
                />
            </Group>

            {openPreview && (
                <div className="pointer-events-none sticky bottom-3 z-10 mt-4 flex justify-center">
                    <button type="button" onClick={openPreview} className="btn btn-primary pointer-events-auto h-14 gap-3 rounded-full pl-2.5 pr-5 shadow-pop">
                        {/* A live thumbnail: it updates as you change colours and fonts, so you can see the effect without leaving. */}
                        <span className="block w-8 shrink-0 overflow-hidden rounded-[4px] ring-1 ring-white/40">
                            <TemplateThumb config={config} data={deferredData} sectionOrder={sectionOrder} />
                        </span>
                        <span className="flex items-center gap-1.5"><Eye size={17} /> See it on your resume</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default DesignTab;
