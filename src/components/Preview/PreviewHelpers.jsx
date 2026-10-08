import React from 'react';
import { ExternalLink } from 'lucide-react';
import { sanitizeUrl } from '../../utils/safeUrl';
import Editable from './Editable';
import { useEdit } from './editContext';

// Text colour for content that sits on a dark fill (banner, dark sidebar).
const LIGHT = '#ffffff';
const INK = '#18181b';

// --- Icon with fixed, PDF-safe sizing ---
export const IconRenderer = ({ Icon, size = 16, className = "", tone = 'default' }) => {
    if (!Icon) return null;
    return (
        <div
            style={{
                width: size,
                height: size,
                minWidth: size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: tone === 'light' ? LIGHT : INK
            }}
            className={className}
        >
            <Icon size={size} strokeWidth={1.75} />
        </div>
    );
};

// --- Section headers: one component, seven looks (config.sectionHeaderStyle) ---
export const SectionHeader = ({ title, icon, config, theme, editPath }) => {
    const style = config.sectionHeaderStyle || 'underline';
    const upper = config.uppercaseHeaders !== false ? 'uppercase' : '';
    const heading = config.headingFont || '';
    const showIcon = config.showSectionIcons && icon;
    const iconEl = showIcon && (
        <span className={theme.text}><IconRenderer Icon={icon} size={14} /></span>
    );

    switch (style) {
        case 'left-bar':
            return (
                <div className="flex items-center gap-2 mb-2">
                    <span className={`w-1 h-4 rounded-full ${theme.hex}`} />
                    {iconEl}
                    <Editable as="h3" path={editPath} value={title} placeholder="Section title" className={`${upper} ${heading} tracking-[0.14em] text-[11px] font-bold ${theme.text}`} />
                </div>
            );
        case 'box':
            return (
                <div className={`flex items-center gap-2 mb-2 px-2.5 py-1 rounded-sm ${theme.bg}`}>
                    {iconEl}
                    <Editable as="h3" path={editPath} value={title} placeholder="Section title" className={`${upper} ${heading} tracking-[0.14em] text-[11px] font-bold ${theme.text}`} />
                </div>
            );
        case 'plain':
            return (
                <div className="flex items-center gap-2 mb-2">
                    {iconEl}
                    <Editable as="h3" path={editPath} value={title} placeholder="Section title" className={`${upper} ${heading} tracking-[0.2em] text-[10px] font-semibold ${theme.text}`} />
                </div>
            );
        case 'centered':
            return (
                <div className="flex items-center gap-3 mb-2.5">
                    <span className={`h-px flex-1 border-t opacity-40 ${theme.border}`} />
                    {iconEl}
                    <Editable as="h3" path={editPath} value={title} placeholder="Section title" className={`${upper} ${heading} tracking-[0.22em] text-[11px] font-semibold ${theme.text}`} />
                    <span className={`h-px flex-1 border-t opacity-40 ${theme.border}`} />
                </div>
            );
        case 'caps-rule':
            return (
                <div className="flex items-center gap-3 mb-2">
                    {iconEl}
                    <Editable as="h3" path={editPath} value={title} placeholder="Section title" className={`${upper} ${heading} tracking-[0.16em] text-[11px] font-bold text-gray-900 whitespace-nowrap`} />
                    <span className={`h-px flex-1 border-t ${theme.border} opacity-60`} />
                </div>
            );
        case 'prompt':
            return (
                <div className="flex items-center gap-1.5 mb-2 font-mono text-[11px] font-bold">
                    <span className={theme.text}>&gt;</span>
                    <Editable as="h3" path={editPath} value={title} placeholder="Section title" className={`${upper} tracking-wider text-gray-900`} />
                    <span className={`flex-1 border-t border-dashed ${theme.border} opacity-40 ml-1`} />
                </div>
            );
        default: {
            const justify = config.headerAlign === 'text-center' ? 'justify-center'
                : config.headerAlign === 'text-right' ? 'justify-end' : 'justify-start';
            return (
                <div className={`flex items-center gap-2 mb-2 border-b pb-1 ${theme.border} ${justify}`}>
                    {iconEl}
                    <Editable as="h3" path={editPath} value={title} placeholder="Section title" className={`${upper} ${heading} tracking-widest text-[11px] font-bold ${theme.text}`} />
                </div>
            );
        }
    }
};

// --- Free text: lines starting with - * • become bullets, everything else keeps its line breaks ---
const BULLET = /^\s*[-*•–]\s+/;

export const DetailText = ({ text, className = '', theme, onDark = false }) => {
    if (!text) return null;
    const lines = text.split('\n').filter((l) => l.trim() !== '');
    const hasBullets = lines.some((l) => BULLET.test(l));

    if (!hasBullets) {
        return <p className={`${className} whitespace-pre-line`}>{text}</p>;
    }

    return (
        <div className={`${className} space-y-0.5`}>
            {lines.map((line, i) =>
                BULLET.test(line) ? (
                    <div key={i} className="flex items-start gap-1.5">
                        <span className={`mt-[0.45em] w-1 h-1 rounded-full flex-shrink-0 ${onDark ? 'bg-white' : (theme?.hex ?? 'bg-gray-500')}`} />
                        <span>{line.replace(BULLET, '')}</span>
                    </div>
                ) : (
                    <p key={i}>{line}</p>
                )
            )}
        </div>
    );
};

// --- Experience / education entry. `compact` is used in narrow sidebars. ---
export const Entry = ({ title, subtitle, date, details, config, theme, compact = false, subtitleCaps = false, onDark = false, editBase, fields = {}, placeholders = {} }) => {
    const path = (key) => (editBase && fields[key] ? `${editBase}:${fields[key]}` : undefined);
    const edit = useEdit();
    const bodyText = config.fontScale || 'text-xs';
    const dateBelow = compact || config.dateAlign === 'below';
    const style = config.entryStyle || (config.entryBox === 'boxed' ? 'boxed' : 'clean');

    const content = (
        <>
            <div className={dateBelow ? '' : 'flex justify-between items-baseline gap-3'}>
                <Editable as="h4" path={path('title')} value={title} placeholder={placeholders.title || 'Title'} className={`font-bold ${onDark ? 'text-white' : 'text-gray-900'} text-xs leading-snug ${config.headingFont || ''}`} />
                {(date || edit) && (
                    <Editable as="span" path={path('date')} value={date || ''} placeholder={placeholders.date || 'Dates'} className={`text-[10px] ${onDark ? 'text-white/60' : 'text-gray-500'} whitespace-nowrap tabular-nums ${dateBelow ? 'block mt-0.5' : ''}`} />
                )}
            </div>
            {(subtitle || edit) && (
                <Editable as="div" path={path('subtitle')} value={subtitle || ''} placeholder={placeholders.subtitle || 'Subtitle'} className={`text-[10px] font-semibold mt-0.5 mb-1 ${subtitleCaps ? 'uppercase tracking-wide' : ''} ${onDark ? 'text-white/85' : theme.text}`} />
            )}
            <Editable as="div" multiline path={path('details')} value={details || ''} placeholder="Describe what you did. Start lines with - for bullets." label="Details" inputClassName={`${bodyText} ${onDark ? 'text-white/80' : 'text-gray-600'} leading-snug`}>
                <DetailText text={details} theme={theme} onDark={onDark} className={`${bodyText} ${onDark ? 'text-white/80' : 'text-gray-600'} leading-snug`} />
            </Editable>
        </>
    );

    if (style === 'timeline') {
        return (
            <div className="relative pl-4 pb-3 last:pb-0 break-inside-avoid">
                <span className={`absolute left-0 top-0.5 bottom-0 w-px ${theme.hex} opacity-25`} />
                <span className={`absolute -left-[3px] top-1 w-[7px] h-[7px] rounded-full ${theme.hex}`} />
                {content}
            </div>
        );
    }

    if (style === 'boxed') {
        return (
            <div className={`p-2.5 rounded-lg border ${theme.border} border-opacity-30 bg-white/70 break-inside-avoid`}>
                {content}
            </div>
        );
    }

    return <div className="break-inside-avoid">{content}</div>;
};

// --- Skills ---
export const SkillTag = ({ skill, index, config, theme, onDark = false }) => {
    const namePath = index === undefined ? undefined : `skill:${index}:name`;
    const skillName = typeof skill === 'object' ? skill.name : skill;
    const skillLevel = typeof skill === 'object' ? skill.level : null;
    const style = config.skillStyle || 'tags';
    const nameEl = <Editable as="span" path={namePath} value={skillName} placeholder="Skill" />;

    const marginStyle = { marginRight: '5px', marginBottom: '5px' };
    const baseText = onDark ? 'text-white' : 'text-gray-800';

    if (style === 'tags') {
        // Soft filled chips, no border: html2canvas (image PDF) mis-sizes bordered inline boxes by the
        // border width, which left the outline floating above its text.
        return (
            <span
                className={`text-[10px] font-medium break-inside-avoid inline-block px-2 rounded-md leading-[18px] ${
                    onDark ? 'bg-white/15 text-white' : `bg-black/[0.06] ${theme.text}`
                }`}
                style={marginStyle}
            >
                {nameEl}
            </span>
        );
    }

    if (style === 'bars') {
        return (
            <div className="w-full break-inside-avoid" style={{ marginBottom: '7px' }}>
                <div className={`flex justify-between text-[10px] mb-0.5 ${baseText}`}>
                    <span className="font-semibold">{nameEl}</span>
                    {skillLevel != null && <span className="opacity-60 tabular-nums">{skillLevel}%</span>}
                </div>
                <div className={`w-full h-1 rounded-full overflow-hidden ${onDark ? 'bg-white/20' : 'bg-gray-200'}`}>
                    <div
                        className={`h-full rounded-full ${onDark ? 'bg-white' : theme.hex}`}
                        style={{ width: `${skillLevel ?? 100}%` }}
                    />
                </div>
            </div>
        );
    }

    if (style === 'dots') {
        const filled = Math.round(((skillLevel ?? 80) / 100) * 5);
        return (
            <div className={`w-full flex items-center justify-between gap-2 break-inside-avoid ${baseText}`} style={{ marginBottom: '6px' }}>
                <span className="text-[10px] font-medium leading-tight">{nameEl}</span>
                <span className="flex gap-[3px] flex-shrink-0">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <span
                            key={i}
                            className={`w-[6px] h-[6px] rounded-full ${i < filled ? (onDark ? 'bg-white' : theme.hex) : (onDark ? 'bg-white/25' : 'bg-gray-200')}`}
                        />
                    ))}
                </span>
            </div>
        );
    }

    // list
    return (
        <div className="flex items-start break-inside-avoid w-full" style={{ marginBottom: '4px' }}>
            <span className={`w-1 h-1 mt-[5px] rounded-full mr-2 flex-shrink-0 ${onDark ? 'bg-white' : theme.hex}`} />
            <span className={`text-[10px] font-medium leading-snug ${baseText}`}>{nameEl}</span>
        </div>
    );
};

// --- Contact line ---
export const ContactItem = ({ icon, text, link: rawLink, tone = 'default', editPath, placeholder }) => {
    const edit = useEdit();
    if (!text && !(edit && editPath)) return null;

    // Links come from user input (and from other people's shared resumes): only http(s) is allowed.
    const link = sanitizeUrl(rawLink);
    const color = tone === 'light' ? LIGHT : INK;

    const textStyle = { color, fontSize: '10px', fontWeight: 500, lineHeight: 1.3, textDecoration: 'none', overflowWrap: 'anywhere' };
    const textEl = editPath ? (
        <span style={textStyle}><Editable as="span" path={editPath} value={text || ''} placeholder={placeholder} /></span>
    ) : (
        <span style={textStyle}>{text}</span>
    );

    const body = (
        <>
            {icon && (
                <span className="flex-shrink-0 flex items-center justify-center">
                    <IconRenderer Icon={icon} size={11} tone={tone} />
                </span>
            )}
            {textEl}
            {link && <ExternalLink size={8} color={color} className="flex-shrink-0 opacity-60" />}
        </>
    );

    const cls = 'flex items-center gap-1.5 min-w-0 max-w-full break-inside-avoid';
    const marker = { 'data-contact': '' };

    return link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className={cls} style={{ textDecoration: 'none' }} {...marker}>
            {body}
        </a>
    ) : (
        <div className={cls} {...marker}>{body}</div>
    );
};
