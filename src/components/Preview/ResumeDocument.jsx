import React from 'react';
import {
    Mail, Phone, MapPin, Linkedin, Globe,
    Briefcase, User, GraduationCap, Code, Award, Heart, FileText
} from 'lucide-react';

import { colorThemes } from '../../data/constants';
import { sanitizeImageSrc, sanitizeUrl } from '../../utils/safeUrl';
import { ContactItem, DetailText, Entry, SectionHeader, SkillTag } from './PreviewHelpers';
import Editable from './Editable';
import { useEdit } from './editContext';

const sectionIcons = {
    summary: User,
    experience: Briefcase,
    education: GraduationCap,
    skills: Code,
    achievements: Award,
    community: Heart
};

// Vertical rhythm for the "Page Spacing" option.
const SPACING = {
    compact: { stack: 'space-y-3.5', entries: 'space-y-2.5' },
    normal: { stack: 'space-y-5', entries: 'space-y-3.5' },
    spacious: { stack: 'space-y-7', entries: 'space-y-5' }
};

const isEmptyContent = (content) =>
    content == null || content === false || content === '' || (Array.isArray(content) && content.length === 0);

/**
 * The A4 page itself: no toolbar, no zoom. It is rendered in the editor preview,
 * the mobile preview, the template gallery thumbnails and the print-only copy,
 * and it is what PDF export captures.
 *
 * Looks are driven entirely by `config` (see data/templates.js): layoutType,
 * headerStyle, sectionHeaderStyle, entryStyle, skillStyle, sidebarBg, borderStyle, ...
 */
const ResumeDocument = ({ data, config, sectionOrder, paperRole = 'main' }) => {
    const sections = sectionOrder || [];
    const edit = useEdit();
    const theme = colorThemes[config.themeColor] || colorThemes.midnight;
    const layoutType = config.layoutType;
    const isSidebarLayout = layoutType === 'sidebar' || (layoutType == null && config.sidebarBg !== 'none');
    const isGutter = layoutType === 'gutter';
    const isGrid = layoutType === 'grid';
    const spacing = SPACING[config.spacingScale] || SPACING.compact;
    const bodyText = config.fontScale || 'text-xs';
    const headerStyle = config.headerStyle || 'default';
    const heading = config.headingFont || '';

    const contactIcon = (Icon) => (config.showIcons === false ? null : Icon);
    const photoSrc = sanitizeImageSrc(data.personal.photoUrl);
    const linkedinUrl = sanitizeUrl(data.personal.linkedin);
    const portfolioUrl = sanitizeUrl(data.personal.portfolio);

    // Renamed custom sections keep their title in data.custom; everything else uses the section label.
    const getTitle = (section) => data.custom?.[section.id]?.title || section.label;

    const nameClass = `${config.nameSize || 'text-2xl'} ${config.nameWeight || 'font-extrabold'} ${heading} tracking-tight leading-[1.08]`;
    const alignClass = config.headerAlign === 'text-center' ? 'items-center text-center'
        : config.headerAlign === 'text-right' ? 'items-end text-right' : 'items-start text-left';

    // ---- Section bodies ----
    const renderSectionContent = (sectionId, { narrow = false, onDark = false } = {}) => {
        const entriesWrap = config.entryStyle === 'timeline' ? '' : spacing.entries;

        switch (sectionId) {
            case 'summary':
                return (edit || data.personal.summary) && (
                    <Editable as="div" multiline path="personal:summary" value={data.personal.summary} placeholder="Write a short summary of who you are and what you do." label="Summary" inputClassName={`${bodyText} leading-relaxed text-gray-700`}>
                        <DetailText text={data.personal.summary} theme={theme} className={`${bodyText} leading-relaxed text-gray-700 ${narrow ? '' : 'text-pretty'}`} />
                    </Editable>
                );
            case 'experience':
                return data.experience.length > 0 && (
                    <div className={entriesWrap}>
                        {data.experience.map((exp, idx) => (
                            <Entry
                                key={exp.id ?? idx}
                                editBase={`experience:${exp.id}`}
                                fields={{ title: 'role', subtitle: 'company', date: 'year', details: 'details' }}
                                placeholders={{ title: 'Role', subtitle: 'Company', date: 'Dates' }}
                                title={exp.role}
                                subtitle={exp.company}
                                subtitleCaps
                                date={exp.year}
                                details={exp.details}
                                config={config}
                                theme={theme}
                                compact={narrow}
                            />
                        ))}
                    </div>
                );
            case 'education':
                return data.education.length > 0 && (
                    <div className={entriesWrap}>
                        {data.education.map((edu, idx) => (
                            <Entry
                                key={edu.id ?? idx}
                                editBase={`education:${edu.id}`}
                                fields={{ title: 'institution', subtitle: 'degree', date: 'year', details: 'details' }}
                                placeholders={{ title: 'Institution', subtitle: 'Degree', date: 'Dates' }}
                                title={edu.institution}
                                subtitle={edu.degree}
                                date={edu.year}
                                details={edu.details}
                                config={config}
                                theme={theme}
                                compact={narrow}
                                onDark={onDark}
                            />
                        ))}
                    </div>
                );
            case 'skills': {
                if (data.skills.length === 0) return null;
                const style = config.skillStyle || 'tags';
                if (style === 'comma') {
                    const names = data.skills.map((s) => (typeof s === 'string' ? s : s.name)).filter(Boolean);
                    return <p className={`${bodyText} leading-relaxed ${onDark ? 'text-white/90' : 'text-gray-700'}`}>{names.join('  ·  ')}</p>;
                }
                return (
                    <div className={`flex flex-wrap ${style === 'tags' ? '' : 'flex-col'}`}>
                        {data.skills.map((skill, idx) => (
                            <SkillTag key={idx} index={idx} skill={skill} config={config} theme={theme} onDark={onDark} />
                        ))}
                    </div>
                );
            }
            case 'achievements':
            case 'community': {
                const items = sectionId === 'achievements' ? data.achievements : data.community;
                if (items.length === 0) return null;
                return (
                    <ul className="list-none space-y-1.5">
                        {items.map((item, idx) => (
                            <li key={idx} className={`${bodyText} ${onDark ? 'text-white/90' : 'text-gray-700'} flex items-start gap-2 leading-snug`}>
                                <span className={`mt-[0.5em] w-1 h-1 rounded-full flex-shrink-0 ${onDark ? 'bg-white' : theme.hex}`} />
                                <Editable as="span" path={`${sectionId}:${idx}`} value={item} placeholder="Add a point" />
                            </li>
                        ))}
                    </ul>
                );
            }
            default: {
                const customSec = data.custom?.[sectionId];
                return (customSec?.content || (edit && customSec)) ? (
                    <Editable as="div" multiline path={`custom:${sectionId}:content`} value={customSec.content} placeholder="Add details for this section." label="Section content" inputClassName={`${bodyText} text-gray-700 leading-snug`}>
                        <DetailText text={customSec.content} theme={theme} className={`${bodyText} text-gray-700 leading-snug`} />
                    </Editable>
                ) : null;
            }
        }
    };

    // Sections without content (e.g. an empty summary) would print a lonely heading.
    const renderableSections = (list, opts) =>
        list
            .map((section) => ({ section, content: renderSectionContent(section.id, opts) }))
            .filter(({ content }) => !isEmptyContent(content));

    // ---- Shared pieces ----
    const photoBox = (sizeClass, extra = '') =>
        config.showPhoto && (
            <div className={`${sizeClass} flex-shrink-0 overflow-hidden ${config.photoShape || 'rounded-full'} ${extra}`}>
                {photoSrc ? (
                    <img src={photoSrc} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User size={22} strokeWidth={1.5} />
                    </div>
                )}
            </div>
        );

    const contacts = (tone, { withLinks = true } = {}) => [
        <ContactItem key="email" icon={contactIcon(Mail)} text={data.personal.email} tone={tone} editPath="personal:email" placeholder="Email" />,
        <ContactItem key="phone" icon={contactIcon(Phone)} text={data.personal.phone} tone={tone} editPath="personal:phone" placeholder="Phone" />,
        <ContactItem key="loc" icon={contactIcon(MapPin)} text={data.personal.location} tone={tone} editPath="personal:location" placeholder="Location" />,
        withLinks && <ContactItem key="in" icon={contactIcon(Linkedin)} text={linkedinUrl ? 'LinkedIn' : ''} link={linkedinUrl} tone={tone} />,
        withLinks && <ContactItem key="web" icon={contactIcon(Globe)} text={portfolioUrl ? 'Portfolio' : ''} link={portfolioUrl} tone={tone} />
    ];

    const paperTint = config.paperTint || 'bg-white';
    const pageClass = `w-[210mm] min-h-[297mm] ${paperTint} shadow-paper mx-auto overflow-hidden relative text-gray-800 ${config.fontFamily}`;

    const frame = (() => {
        const base = 'pointer-events-none absolute';
        switch (config.borderStyle) {
            case 'simple': return <div className={`${base} inset-4 border ${theme.border} border-opacity-40`} />;
            case 'double': return <div className={`${base} inset-4 border-4 border-double ${theme.border} border-opacity-50`} />;
            case 'offset': return <div className={`${base} inset-5 border ${theme.border} border-opacity-50`} />;
            default: return null;
        }
    })();
    const framed = Boolean(frame);

    const visibleSections = sections.filter((s) => s.visible);

    // =================================================================
    // Sidebar layouts
    // =================================================================
    if (isSidebarLayout) {
        const sidebarSectionIds = config.sidebarSections || ['education', 'skills', 'community'];
        const dark = config.sidebarBg === 'dark';
        const sidebarSections = renderableSections(
            visibleSections.filter((s) => sidebarSectionIds.includes(s.id)),
            { narrow: true, onDark: dark }
        );
        const mainSections = renderableSections(visibleSections.filter((s) => !sidebarSectionIds.includes(s.id)));

        const sidebarSurface = dark ? `${theme.fill} text-white`
            : config.sidebarBg === 'theme' ? `${theme.bg} text-gray-800`
            : config.sidebarBg === 'gray' ? 'bg-slate-100 text-gray-800'
            : 'bg-transparent border-r border-gray-200 text-gray-700';
        const railRule = dark ? 'border-white/25' : `${theme.border} border-opacity-40`;
        const railTitle = `${config.uppercaseHeaders !== false ? 'uppercase' : ''} ${heading} text-[10px] font-semibold tracking-[0.18em] mb-2 pb-1.5 border-b ${railRule} ${dark ? 'text-white/80' : 'text-gray-600'}`;
        const tone = dark ? 'light' : 'default';

        return (
            <div data-resume-paper={paperRole} className={`${pageClass} flex ${config.layoutReverse ? 'flex-row-reverse' : 'flex-row'}`}>
                <aside className={`w-[31%] flex-shrink-0 px-5 py-7 min-h-[297mm] ${sidebarSurface} flex flex-col gap-5 min-w-0`}>
                    {photoBox('w-24 h-24 mx-auto', dark ? 'border-2 border-white/40' : `border-2 ${theme.border}`)}

                    <div className="space-y-2">
                        <h3 className={railTitle}>Contact</h3>
                        {contacts(tone)}
                    </div>

                    {sidebarSections.map(({ section, content }) => (
                        <div key={section.id}>
                            <Editable as="h3" path={`section:${section.id}`} value={getTitle(section)} placeholder="Section title" className={railTitle} />
                            {content}
                        </div>
                    ))}
                </aside>

                <div className="flex-1 px-7 py-7 flex flex-col min-w-0">
                    <header className={`flex flex-col gap-1.5 pb-4 mb-5 border-b ${theme.border} border-opacity-40 ${alignClass}`}>
                        <Editable as="h1" path="personal:name" value={data.personal.name} placeholder="Your name" className={`${nameClass} ${theme.text}`} />
                        {(data.personal.title || edit) && <Editable as="p" path="personal:title" value={data.personal.title} placeholder="Your headline" className="text-[13px] font-medium text-gray-500 tracking-tight" />}
                    </header>

                    <div className={spacing.stack}>
                        {mainSections.map(({ section, content }) => (
                            <section key={section.id}>
                                <SectionHeader
                                    title={getTitle(section)}
                                    editPath={`section:${section.id}`}
                                    icon={sectionIcons[section.id] ?? FileText}
                                    config={config}
                                    theme={theme}
                                />
                                {content}
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // =================================================================
    // Single-column layouts (single / grid / gutter)
    // =================================================================
    const contactRow = (tone, justify = '') => (
        <div className={`flex flex-wrap gap-x-4 gap-y-1 ${justify}`}>{contacts(tone)}</div>
    );

    const renderHeader = () => {
        const title = data.personal.title;

        switch (headerStyle) {
            case 'banner':
                return (
                    <header className={`${theme.fill} text-white px-9 pt-9 pb-6`}>
                        <div className="flex items-center gap-5">
                            {photoBox('w-20 h-20', 'border-2 border-white/40')}
                            <div className="min-w-0">
                                <Editable as="h1" path="personal:name" value={data.personal.name} placeholder="Your name" className={`${nameClass} text-white`} />
                                {(title || edit) && <Editable as="p" path="personal:title" value={title} placeholder="Your headline" className="text-sm text-white/80 mt-1.5 font-medium" />}
                            </div>
                        </div>
                        <div className="mt-5 pt-4 border-t border-white/25">{contactRow('light')}</div>
                    </header>
                );
            case 'centered': {
                const divider =
                    config.dividerStyle === 'thick' ? <div className={`h-[3px] w-14 my-3.5 ${theme.hex}`} />
                    : config.dividerStyle === 'diamond' ? (
                        <div className="flex items-center gap-2 my-3.5 w-44">
                            <span className={`flex-1 h-px ${theme.hex} opacity-40`} />
                            <span className={`w-1.5 h-1.5 rotate-45 ${theme.hex}`} />
                            <span className={`flex-1 h-px ${theme.hex} opacity-40`} />
                        </div>
                    ) : <div className="h-px w-20 my-3.5 bg-gray-300" />;
                return (
                    <header className="flex flex-col items-center text-center mb-6">
                        {photoBox('w-20 h-20 mb-3', `border ${theme.border} border-opacity-30`)}
                        <Editable as="h1" path="personal:name" value={data.personal.name} placeholder="Your name" className={`${nameClass} ${theme.text}`} />
                        {(title || edit) && <Editable as="p" path="personal:title" value={title} placeholder="Your headline" className="text-[11px] mt-1.5 text-gray-500 uppercase tracking-[0.22em] font-medium" />}
                        {divider}
                        {contactRow('default', 'justify-center')}
                    </header>
                );
            }
            case 'split':
                return (
                    <header className={`flex justify-between items-end gap-8 pb-4 mb-6 border-b-2 ${theme.border}`}>
                        <div className="min-w-0">
                            <Editable as="h1" path="personal:name" value={data.personal.name} placeholder="Your name" className={`${nameClass} ${theme.text}`} />
                            {(title || edit) && <Editable as="p" path="personal:title" value={title} placeholder="Your headline" className="text-[13px] mt-1.5 text-gray-600 font-medium" />}
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">{contacts('default')}</div>
                    </header>
                );
            case 'poster':
                return (
                    <header className="mb-7">
                        <Editable as="h1" path="personal:name" value={data.personal.name} placeholder="Your name" className={`${nameClass} ${theme.text} !leading-[0.95] tracking-tighter`} />
                        {(title || edit) && <Editable as="p" path="personal:title" value={title} placeholder="Your headline" className="text-[15px] mt-3 text-gray-600 font-medium" />}
                        <div className={`h-1.5 w-20 mt-4 mb-4 ${theme.hex}`} />
                        {contactRow('default')}
                    </header>
                );
            default:
                return (
                    <header className={`flex flex-col gap-2.5 ${isGutter ? 'mb-6' : 'mb-5'} ${alignClass}`}>
                        <div className={`flex items-center gap-4 w-full ${config.headerAlign === 'text-center' ? 'justify-center' : config.headerAlign === 'text-right' ? 'flex-row-reverse' : ''}`}>
                            {photoBox('w-[72px] h-[72px]', 'border border-gray-200')}
                            <div className="min-w-0">
                                <Editable as="h1" path="personal:name" value={data.personal.name} placeholder="Your name" className={`${nameClass} ${theme.text}`} />
                                {(title || edit) && <Editable as="p" path="personal:title" value={title} placeholder="Your headline" className="text-[13px] mt-1 text-gray-600 font-medium" />}
                            </div>
                        </div>
                        {!isGutter && contactRow('default', config.headerAlign === 'text-center' ? 'justify-center' : config.headerAlign === 'text-right' ? 'justify-end' : '')}
                    </header>
                );
        }
    };

    const bodySections = renderableSections(visibleSections);
    const padClass = headerStyle === 'banner' ? 'px-9 pt-6 pb-9' : framed ? 'px-12 py-12' : 'px-9 py-9';

    const body = isGutter ? (
        <div>
            <div className="grid grid-cols-[23%_1fr] gap-x-6 py-3 border-t border-gray-200">
                <h3 className={`${config.uppercaseHeaders !== false ? 'uppercase' : ''} ${heading} text-[10px] font-semibold tracking-[0.2em] pt-0.5 ${theme.text}`}>Contact</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">{contacts('default')}</div>
            </div>
            {bodySections.map(({ section, content }) => (
                <section key={section.id} className="grid grid-cols-[23%_1fr] gap-x-6 py-3.5 border-t border-gray-200 break-inside-avoid">
                    <Editable as="h3" path={`section:${section.id}`} value={getTitle(section)} placeholder="Section title" className={`${config.uppercaseHeaders !== false ? 'uppercase' : ''} ${heading} text-[10px] font-semibold tracking-[0.2em] pt-0.5 ${theme.text}`} />
                    <div>{content}</div>
                </section>
            ))}
        </div>
    ) : (
        <div className={isGrid ? 'grid grid-cols-2 gap-x-7 gap-y-4' : spacing.stack}>
            {bodySections.map(({ section, content }) => (
                <section
                    key={section.id}
                    className={isGrid && ['summary', 'experience'].includes(section.id) ? 'col-span-2 min-w-0' : 'min-w-0'}
                >
                    <SectionHeader
                        title={getTitle(section)}
                        editPath={`section:${section.id}`}
                        icon={sectionIcons[section.id] ?? FileText}
                        config={config}
                        theme={theme}
                    />
                    {content}
                </section>
            ))}
        </div>
    );

    if (headerStyle === 'banner') {
        return (
            <div data-resume-paper={paperRole} className={pageClass}>
                {renderHeader()}
                <div className={padClass}>{body}</div>
            </div>
        );
    }

    return (
        <div data-resume-paper={paperRole} className={pageClass}>
            {frame}
            <div className={padClass}>
                {renderHeader()}
                {body}
            </div>
        </div>
    );
};

export default ResumeDocument;
