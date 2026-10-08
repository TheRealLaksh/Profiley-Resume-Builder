import React from 'react';
import {
    Mail, Phone, MapPin, Linkedin, Globe,
    Briefcase, User, GraduationCap, Code, Award, Heart, FileText
} from 'lucide-react';

import { colorThemes } from '../../data/constants';
import { sanitizeImageSrc, sanitizeUrl } from '../../utils/safeUrl';
import { ContactItem, SectionHeader, SkillTag } from './PreviewHelpers';

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
    compact: { stack: 'space-y-3', entry: 'mb-2' },
    normal: { stack: 'space-y-4', entry: 'mb-3' },
    spacious: { stack: 'space-y-6', entry: 'mb-4' }
};

const isEmptyContent = (content) =>
    content == null || content === false || content === '' || (Array.isArray(content) && content.length === 0);

/**
 * The A4 page itself: no toolbar, no zoom. It is rendered in the editor preview,
 * the mobile preview and the print-only copy, and is what PDF export captures.
 */
const ResumeDocument = ({ data, config, sectionOrder }) => {
    const sections = sectionOrder || [];
    const currentTheme = colorThemes[config.themeColor] || colorThemes.midnight;
    const isSidebarLayout = config.layoutType === 'sidebar' || (config.layoutType == null && config.sidebarBg !== 'none');
    const spacing = SPACING[config.spacingScale] || SPACING.compact;
    const bodyText = config.fontScale || 'text-xs';
    const uppercaseHeaders = config.uppercaseHeaders !== false;
    const contactIcon = (Icon) => (config.showIcons === false ? null : Icon);
    const photoSrc = sanitizeImageSrc(data.personal.photoUrl);
    const linkedinUrl = sanitizeUrl(data.personal.linkedin);
    const portfolioUrl = sanitizeUrl(data.personal.portfolio);

    // Renamed custom sections keep their title in data.custom; everything else uses the section label.
    const getTitle = (section) => data.custom?.[section.id]?.title || section.label;

    const renderSectionContent = (sectionId) => {
        switch (sectionId) {
            case 'summary':
                return data.personal.summary && (
                    <p className={`${bodyText} leading-relaxed text-gray-700 whitespace-pre-line text-justify`}>
                        {data.personal.summary}
                    </p>
                );
            case 'experience':
                return data.experience.map((exp, idx) => (
                    <div key={exp.id ?? idx} className={`${spacing.entry} break-inside-avoid ${config.entryBox === 'boxed' ? 'p-2 border rounded-lg bg-gray-50' : ''}`}>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-gray-900 text-xs">{exp.role}</h4>
                            <span className="text-[10px] font-mono text-gray-500 whitespace-nowrap ml-2">{exp.year}</span>
                        </div>
                        <div className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${currentTheme.text}`}>
                            {exp.company}
                        </div>
                        <p className={`${bodyText} text-gray-600 leading-snug`}>{exp.details}</p>
                    </div>
                ));
            case 'education':
                return data.education.map((edu, idx) => (
                    <div key={edu.id ?? idx} className={`${spacing.entry} break-inside-avoid`}>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-gray-900 text-xs">{edu.institution}</h4>
                            <span className="text-[10px] font-mono text-gray-500 whitespace-nowrap ml-2">{edu.year}</span>
                        </div>
                        <div className={`text-[10px] font-semibold mb-1 ${currentTheme.text}`}>
                            {edu.degree}
                        </div>
                        <p className={`${bodyText} text-gray-600`}>{edu.details}</p>
                    </div>
                ));
            case 'skills':
                return (
                    <div className={`flex flex-wrap ${config.skillStyle === 'bars' ? 'flex-col' : ''}`}>
                        {data.skills.map((skill, idx) => (
                            <SkillTag key={idx} skill={skill} config={config} theme={currentTheme} />
                        ))}
                    </div>
                );
            case 'achievements':
            case 'community': {
                const items = sectionId === 'achievements' ? data.achievements : data.community;
                return (
                    <ul className="list-none space-y-1">
                        {items.map((item, idx) => (
                            <li key={idx} className={`${bodyText} text-gray-700 flex items-start gap-1.5`}>
                                <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${currentTheme.hex}`} />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                );
            }
            default: {
                const customSec = data.custom?.[sectionId];
                return customSec ? (
                    <div className={`${bodyText} text-gray-700 whitespace-pre-line`}>{customSec.content}</div>
                ) : null;
            }
        }
    };

    // Sections without content (e.g. an empty summary) would print a lonely heading.
    const renderableSections = (list) =>
        list
            .map((section) => ({ section, content: renderSectionContent(section.id) }))
            .filter(({ content }) => !isEmptyContent(content));

    const renderPhoto = () => {
        if (!config.showPhoto) return null;
        if (photoSrc) {
            return <img src={photoSrc} alt="Profile" className="w-full h-full object-cover" />;
        }
        return (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                <User size={24} />
            </div>
        );
    };

    const pageClass = `w-[210mm] min-h-[297mm] bg-white shadow-2xl mx-auto overflow-hidden relative text-gray-800 ${config.fontFamily}`;
    const headerClass = `flex flex-col gap-2 mb-3 ${config.headerAlign === 'text-center' ? 'items-center text-center' : config.headerAlign === 'text-right' ? 'items-end text-right' : 'items-start text-left'}`;

    const visibleSections = sections.filter((s) => s.visible);

    if (isSidebarLayout) {
        const sidebarSectionIds = config.sidebarSections || ['education', 'skills', 'community'];
        const sidebarSections = renderableSections(visibleSections.filter((s) => sidebarSectionIds.includes(s.id)));
        const mainSections = renderableSections(visibleSections.filter((s) => !sidebarSectionIds.includes(s.id)));

        const sidebarBgClass = config.sidebarBg === 'theme' ? currentTheme.bg : config.sidebarBg === 'gray' ? 'bg-slate-100' : 'bg-transparent border-r border-gray-100';
        const sidebarTextClass = config.sidebarBg === 'theme' || config.sidebarBg === 'gray' ? 'text-gray-800' : 'text-gray-600';

        return (
            <div data-resume-paper className={`${pageClass} flex ${config.layoutReverse ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-[30%] flex-shrink-0 p-5 min-h-[297mm] ${sidebarBgClass} ${sidebarTextClass} flex flex-col gap-4 min-w-0`}>
                    {config.showPhoto && (
                        <div className={`w-24 h-24 mx-auto mb-2 overflow-hidden border-2 ${currentTheme.border} ${config.photoShape}`}>
                            {renderPhoto()}
                        </div>
                    )}

                    <div className="space-y-2 mb-4">
                        <h3 className={`${uppercaseHeaders ? 'uppercase' : ''} tracking-widest text-[10px] font-bold mb-2 opacity-70 border-b pb-1 ${currentTheme.border}`}>Contact</h3>
                        <ContactItem icon={contactIcon(Mail)} text={data.personal.email} />
                        <ContactItem icon={contactIcon(Phone)} text={data.personal.phone} />
                        <ContactItem icon={contactIcon(MapPin)} text={data.personal.location} />
                        <ContactItem icon={contactIcon(Linkedin)} text={linkedinUrl ? 'LinkedIn' : ''} link={linkedinUrl} />
                        <ContactItem icon={contactIcon(Globe)} text={portfolioUrl ? 'Portfolio' : ''} link={portfolioUrl} />
                    </div>

                    {sidebarSections.map(({ section, content }) => (
                        <div key={section.id}>
                            <div className={`${uppercaseHeaders ? 'uppercase' : ''} tracking-widest text-[10px] font-bold mb-2 opacity-70 border-b pb-1 ${currentTheme.border} flex items-center gap-2`}>
                                {getTitle(section)}
                            </div>
                            {content}
                        </div>
                    ))}
                </div>

                <div className="flex-1 p-6 flex flex-col min-w-0">
                    <div className={`${headerClass} border-b pb-3 mb-3 ${currentTheme.border}`}>
                        <h1 className={`${config.nameSize} ${config.nameWeight} ${currentTheme.text} leading-tight`}>
                            {data.personal.name}
                        </h1>
                        <p className="text-sm font-medium text-gray-500 tracking-tight">{data.personal.title}</p>
                    </div>

                    <div className={spacing.stack}>
                        {mainSections.map(({ section, content }) => (
                            <div key={section.id}>
                                <SectionHeader
                                    title={getTitle(section)}
                                    icon={sectionIcons[section.id] ?? FileText}
                                    config={config}
                                    theme={currentTheme}
                                />
                                {content}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const isGrid = config.layoutType === 'grid';
    const bodySections = renderableSections(visibleSections);

    return (
        <div data-resume-paper className={`${pageClass} p-6 md:p-8`}>
            <div className={`${headerClass} ${config.themeColor === 'noir' ? 'border-b-2 border-black pb-3' : ''}`}>
                <div className="flex items-center gap-4 w-full">
                    {config.showPhoto && (
                        <div className={`w-20 h-20 flex-shrink-0 overflow-hidden border border-gray-100 shadow-sm ${config.photoShape}`}>
                            {renderPhoto()}
                        </div>
                    )}
                    <div className="flex-grow">
                        <h1 className={`${config.nameSize} ${config.nameWeight} ${currentTheme.text} mb-0.5`}>
                            {data.personal.name}
                        </h1>
                        <p className="text-sm text-gray-600 font-medium">{data.personal.title}</p>
                    </div>
                </div>

                <div className={`flex gap-3 mt-2 text-xs text-gray-500 overflow-hidden min-w-0 flex-wrap ${config.headerAlign === 'text-center' ? 'justify-center' : ''}`}>
                    <ContactItem icon={contactIcon(Mail)} text={data.personal.email} />
                    <ContactItem icon={contactIcon(Phone)} text={data.personal.phone} />
                    <ContactItem icon={contactIcon(MapPin)} text={data.personal.location} />
                    <ContactItem icon={contactIcon(Linkedin)} text={linkedinUrl ? 'LinkedIn' : ''} link={linkedinUrl} />
                    <ContactItem icon={contactIcon(Globe)} text={portfolioUrl ? 'Portfolio' : ''} link={portfolioUrl} />
                </div>
            </div>

            <div className={`mt-4 ${isGrid ? 'grid grid-cols-2 gap-x-6 gap-y-3' : spacing.stack}`}>
                {bodySections.map(({ section, content }) => (
                    <div
                        key={section.id}
                        className={isGrid && ['summary', 'experience'].includes(section.id) ? 'col-span-2 min-w-0' : 'min-w-0'}
                    >
                        <SectionHeader
                            title={getTitle(section)}
                            icon={sectionIcons[section.id] ?? FileText}
                            config={config}
                            theme={currentTheme}
                        />
                        {content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResumeDocument;
