import React, { useRef } from 'react';
import { 
    Mail, Phone, MapPin, Linkedin, Globe, 
    Briefcase, User, GraduationCap, Code, Award, Heart 
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { colorThemes } from '../../data/constants';
import { IconRenderer, ContactItem, SectionHeader, SkillTag } from './PreviewHelpers';

const PreviewPanel = ({ data, config, sectionOrder, activeTemplate }) => {
    const resumeRef = useRef();
    const sections = sectionOrder || [];
    const currentTheme = colorThemes[config.themeColor] || colorThemes.midnight;
    const isSidebarLayout = config.layoutType === 'sidebar' || (config.layoutType !== 'single' && config.sidebarBg !== 'none');

    // MAPPING SECTIONS TO ICONS
    const sectionIcons = {
        summary: User,
        experience: Briefcase,
        education: GraduationCap,
        skills: Code,
        achievements: Award,
        community: Heart
    };

    const handleDownload = () => {
        const element = resumeRef.current;
        const opt = {
            margin: 0,
            filename: `${data.personal.name.replace(/\s+/g, '_')}_Resume.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const renderSectionContent = (sectionId) => {
        switch (sectionId) {
            case 'summary':
                return data.personal.summary && (
                    <p className={`text-sm leading-relaxed text-gray-700 whitespace-pre-line text-justify`}>
                        {data.personal.summary}
                    </p>
                );
            case 'experience':
                return data.experience.map((exp, idx) => (
                    <div key={idx} className={`mb-4 break-inside-avoid ${config.entryBox === 'boxed' ? 'p-3 border rounded-lg bg-gray-50' : ''}`}>
                        <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-gray-900">{exp.role}</h4>
                            <span className="text-xs font-mono text-gray-500 whitespace-nowrap ml-2">{exp.year}</span>
                        </div>
                        <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${currentTheme.text}`}>
                            {exp.company}
                        </div>
                        <p className="text-sm text-gray-600 leading-snug">{exp.details}</p>
                    </div>
                ));
            case 'education':
                return data.education.map((edu, idx) => (
                    <div key={idx} className="mb-4 break-inside-avoid">
                        <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-gray-900">{edu.institution}</h4>
                            <span className="text-xs font-mono text-gray-500 whitespace-nowrap ml-2">{edu.year}</span>
                        </div>
                        <div className={`text-xs font-semibold mb-1 ${currentTheme.text}`}>
                            {edu.degree}
                        </div>
                        <p className="text-sm text-gray-600">{edu.details}</p>
                    </div>
                ));
            case 'skills':
                return (
                    <div className={`flex flex-wrap ${config.skillStyle === 'bars' ? 'flex-col' : 'gap-2'}`}>
                        {data.skills.map((skill, idx) => (
                            <SkillTag key={idx} skill={skill} config={config} theme={currentTheme} />
                        ))}
                    </div>
                );
            case 'achievements':
            case 'community':
                const items = sectionId === 'achievements' ? data.achievements : data.community;
                return (
                    <ul className="list-none space-y-2">
                        {items.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${currentTheme.hex}`} />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                );
            default:
                const customSec = data.custom?.[sectionId];
                return customSec ? (
                   <div className="text-sm text-gray-700 whitespace-pre-line">{customSec.content}</div>
                ) : null;
        }
    };

    const renderLayout = () => {
        // Updated to use config-defined sections or fallback to defaults
        const sidebarSectionIds = config.sidebarSections || ['education', 'skills', 'community']; 
        const mainSectionIds = config.mainSections || ['summary', 'experience', 'achievements']; 

        const mainSections = sections.filter(s => s.visible && mainSectionIds.includes(s.id));
        const sidebarSections = sections.filter(s => s.visible && sidebarSectionIds.includes(s.id));
        const allSections = sections.filter(s => s.visible);

        const pageClass = `w-[210mm] min-h-[297mm] bg-white shadow-2xl mx-auto overflow-hidden relative text-gray-800 ${config.fontFamily}`;
        const headerClass = `flex flex-col gap-4 mb-6 ${config.headerAlign === 'text-center' ? 'items-center text-center' : config.headerAlign === 'text-right' ? 'items-end text-right' : 'items-start text-left'}`;

        const renderPhoto = () => {
            if (!config.showPhoto) return null;
            if (data.personal.photoUrl) {
                return (
                    <img 
                        src={data.personal.photoUrl} 
                        alt="Profile" 
                        className={`w-full h-full object-cover`} 
                    />
                );
            }
            return (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <User size={32} />
                </div>
            );
        };

        if (isSidebarLayout) {
            const reverse = config.layoutReverse;
            const sidebarWidth = 'w-[32%]'; 
            
            const sidebarBgClass = config.sidebarBg === 'theme' ? currentTheme.bg : config.sidebarBg === 'gray' ? 'bg-slate-100' : 'bg-transparent border-r border-gray-100';
            const sidebarTextClass = config.sidebarBg === 'theme' || config.sidebarBg === 'gray' ? 'text-gray-800' : 'text-gray-600';

            return (
                <div className={`${pageClass} flex ${reverse ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`${sidebarWidth} flex-shrink-0 p-8 min-h-full ${sidebarBgClass} ${sidebarTextClass} flex flex-col gap-6`}>
                        {config.showPhoto && (
                            <div className={`w-32 h-32 mx-auto mb-4 overflow-hidden border-4 ${currentTheme.border} ${config.photoShape}`}>
                                {renderPhoto()}
                            </div>
                        )}

                        <div className="space-y-3 mb-6">
                            <h3 className={`uppercase tracking-widest text-xs font-bold mb-3 opacity-70 border-b pb-1 ${currentTheme.border}`}>Contact</h3>
                            <ContactItem icon={Mail} text={data.personal.email} config={config} />
                            <ContactItem icon={Phone} text={data.personal.phone} config={config} />
                            <ContactItem icon={MapPin} text={data.personal.location} config={config} />
                            <ContactItem icon={Linkedin} text="LinkedIn" link={data.personal.linkedin} config={config} />
                            <ContactItem icon={Globe} text="Portfolio" link={data.personal.portfolio} config={config} />
                        </div>

                        {sidebarSections.map(section => (
                            <div key={section.id}>
                                <div className={`uppercase tracking-widest text-xs font-bold mb-3 opacity-70 border-b pb-1 ${currentTheme.border} flex items-center gap-2`}>
                                    {section.label}
                                </div>
                                {renderSectionContent(section.id)}
                            </div>
                        ))}
                    </div>

                    <div className={`flex-1 p-10 flex flex-col min-w-0`}>
                        <div className={`${headerClass} border-b pb-6 mb-6 ${currentTheme.border}`}>
                            <h1 className={`${config.nameSize} ${config.nameWeight} ${currentTheme.text} leading-tight`}>
                                {data.personal.name}
                            </h1>
                            <p className="text-xl font-medium text-gray-500 tracking-tight">{data.personal.title}</p>
                        </div>

                        <div className="space-y-8">
                            {mainSections.map(section => (
                                <div key={section.id}>
                                    <SectionHeader title={section.label} icon={sectionIcons[section.id]} config={config} theme={currentTheme} />
                                    {renderSectionContent(section.id)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={`${pageClass} p-10 md:p-14`}>
                     <div className={`${headerClass} ${config.themeColor === 'noir' ? 'border-b-4 border-black pb-6' : ''}`}>
                        <div className="flex items-center gap-6 w-full">
                            {config.showPhoto && (
                                <div className={`w-28 h-28 flex-shrink-0 overflow-hidden border-2 border-gray-100 shadow-sm ${config.photoShape}`}>
                                    {renderPhoto()}
                                </div>
                            )}
                            <div className="flex-grow">
                                <h1 className={`${config.nameSize} ${config.nameWeight} ${currentTheme.text} mb-1`}>
                                    {data.personal.name}
                                </h1>
                                <p className="text-xl text-gray-600 font-medium">{data.personal.title}</p>
                            </div>
                        </div>
                        
                        <div className={`flex flex-wrap gap-4 mt-4 text-sm text-gray-500 ${config.headerAlign === 'text-center' ? 'justify-center' : ''}`}>
                             <ContactItem icon={Mail} text={data.personal.email} config={config} />
                             <ContactItem icon={Phone} text={data.personal.phone} config={config} />
                             <ContactItem icon={MapPin} text={data.personal.location} config={config} />
                             <ContactItem icon={Globe} text="Portfolio" link={data.personal.portfolio} config={config} />
                        </div>
                    </div>

                    <div className="space-y-6 mt-8">
                         {sections.find(s => s.id === 'summary' && s.visible) && (
                            <div>
                                <SectionHeader title="Profile Summary" icon={User} config={config} theme={currentTheme} />
                                {renderSectionContent('summary')}
                            </div>
                         )}

                         {/* 2-column grid for Compact/Academic */}
                         {config.layoutType === 'grid' ? (
                            <div className="grid grid-cols-12 gap-8">
                                <div className="col-span-8 space-y-6">
                                    {sections.filter(s => ['experience', 'education'].includes(s.id) && s.visible).map(section => (
                                        <div key={section.id}>
                                            <SectionHeader title={section.label} icon={sectionIcons[section.id]} config={config} theme={currentTheme} />
                                            {renderSectionContent(section.id)}
                                        </div>
                                    ))}
                                </div>
                                <div className="col-span-4 space-y-6 border-l pl-6 border-gray-100">
                                     {sections.filter(s => ['skills', 'achievements', 'community'].includes(s.id) && s.visible).map(section => (
                                        <div key={section.id}>
                                            <SectionHeader title={section.label} icon={sectionIcons[section.id]} config={config} theme={currentTheme} />
                                            {renderSectionContent(section.id)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                         ) : (
                             allSections.filter(s => s.id !== 'summary').map(section => (
                                <div key={section.id} className={['skills', 'achievements'].includes(section.id) ? 'mb-4' : 'mb-8'}>
                                    <SectionHeader title={section.label} icon={sectionIcons[section.id]} config={config} theme={currentTheme} />
                                    {renderSectionContent(section.id)}
                                </div>
                             ))
                         )}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="flex flex-col gap-4 items-center">
            <div className="w-full max-w-[210mm] flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-500 px-2">
                    A4 Preview • {activeTemplate ? activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1) : 'Modern'}
                </span>
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                >
                    <Briefcase size={16} /> Download PDF
                </button>
            </div>

            <div className="overflow-auto max-w-full pb-10">
                <div ref={resumeRef} className="origin-top scale-[0.6] sm:scale-[0.8] lg:scale-100 transition-transform duration-300">
                    {renderLayout()}
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;