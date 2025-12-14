// src/components/Preview/PreviewPanel.jsx
import React, { useRef } from 'react';
import { 
    Mail, Phone, MapPin, Linkedin, Globe, ExternalLink, 
    Github, Award, Calendar, BookOpen, Briefcase, User 
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { colorThemes, templates } from '../../data/constants';

const PreviewPanel = ({ data, config, sections, activeTemplate }) => {
    const resumeRef = useRef();

    // --- Helper: Icon Renderer ---
    const IconRenderer = ({ icon: Icon, size = 16, className = "" }) => (
        <Icon size={size} className={className} />
    );

    // --- Helper: Get Current Theme & Config ---
    const currentTheme = colorThemes[config.themeColor] || colorThemes.midnight;
    const tplConfig = templates[activeTemplate]?.config || templates.modern.config;

    // Merge global config with template defaults if specific overrides exist
    const finalConfig = { ...tplConfig, ...config };

    // --- Helper: Date Formatter ---
    const formatDate = (dateString) => {
        if (!dateString) return '';
        // Add logic here if you want to format "2024-04" to "Apr 2024"
        return dateString;
    };

    // --- PDF Export Function ---
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

    // --- Sub-Component: Contact Item ---
    const ContactItem = ({ icon, text, link }) => {
        if (!text) return null;
        return (
            <div className={`flex items-center gap-2 ${finalConfig.fontScale === 'text-xs' ? 'text-[10px]' : 'text-xs'} opacity-90`}>
                {finalConfig.showIcons && icon && <IconRenderer icon={icon} size={14} />}
                {link ? (
                    <a href={link} target="_blank" rel="noreferrer" className="hover:underline truncate max-w-[200px] block">
                        {text}
                    </a>
                ) : (
                    <span>{text}</span>
                )}
            </div>
        );
    };

    // --- Sub-Component: Section Header ---
    const SectionHeader = ({ title, icon }) => {
        const style = finalConfig.sectionHeaderStyle;
        const alignClass = style === 'centered' ? 'justify-center' : 'justify-start';
        const textClass = finalConfig.uppercaseHeaders ? 'uppercase tracking-widest' : '';
        const textSize = finalConfig.sectionTitleSize || 'text-lg';

        return (
            <div className={`flex items-center ${alignClass} gap-3 mb-3 mt-6 ${currentTheme.text} ${textClass}`}>
                {finalConfig.showSectionIcons && icon && <IconRenderer icon={icon} size={18} />}
                <h3 className={`${textSize} font-bold whitespace-nowrap`}>{title}</h3>
                
                {/* Decorative Elements based on Style */}
                {style === 'underline' && <div className={`h-0.5 flex-grow opacity-30 ${currentTheme.bg.replace('bg-', 'bg-current ')}`}></div>}
                {style === 'left-bar' && <div className="hidden"></div>} {/* Handled in parent usually, or simple text */}
                {style === 'box' && <div className="hidden"></div>} {/* Box style is usually wrapper */}
                {style === 'centered' && <div className="hidden"></div>}
            </div>
        );
    };

    // --- Sub-Component: Skill Tag ---
    const SkillTag = ({ skill }) => {
        if (finalConfig.skillStyle === 'tags') {
            return (
                <span className={`px-3 py-1 text-xs rounded-md font-medium border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text}`}>
                    {skill.name} {skill.level ? `• ${skill.level}%` : ''}
                </span>
            );
        } else if (finalConfig.skillStyle === 'bars') {
             return (
                <div className="w-full mb-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold">{skill.name}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${currentTheme.hex}`} 
                            style={{ width: `${skill.level}%` }}
                        ></div>
                    </div>
                </div>
            );
        } else {
            // List or comma
            return (
                <span className="text-sm font-medium mr-4 mb-1 block">
                    • {skill.name}
                </span>
            );
        }
    };

    // --- Renderers for Data Sections ---
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
                    <div key={idx} className={`mb-4 break-inside-avoid ${finalConfig.entryBox === 'boxed' ? 'p-3 border rounded-lg bg-gray-50' : ''}`}>
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
                    <div className={`flex flex-wrap ${finalConfig.skillStyle === 'bars' ? 'flex-col' : 'gap-2'}`}>
                        {data.skills.map((skill, idx) => (
                            <SkillTag key={idx} skill={skill} />
                        ))}
                    </div>
                );
            case 'achievements':
                return (
                    <ul className="list-none space-y-2">
                        {data.achievements.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${currentTheme.hex}`} />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                );
            case 'community':
                 return (
                    <ul className="list-none space-y-2">
                        {data.community.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${currentTheme.hex}`} />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                );
            default:
                return null;
        }
    };

    // --- Main Layout Renderer ---
    const renderLayout = () => {
        // Group sections by their intended location (sidebar vs main)
        // This is a simplified logic; in a complex builder, you might let users drag-drop.
        // For now, we hardcode sensible defaults based on templates.
        
        const isSidebarLayout = ['modern', 'creative', 'tech', 'executive', 'compact'].includes(activeTemplate);
        
        // Define Sidebar Sections
        const sidebarSectionIds = ['skills', 'achievements', 'community']; 
        const mainSectionIds = ['summary', 'experience', 'education'];

        // Filter visible sections
        const mainSections = sections.filter(s => s.visible && mainSectionIds.includes(s.id));
        const sidebarSections = sections.filter(s => s.visible && sidebarSectionIds.includes(s.id));
        const allSections = sections.filter(s => s.visible);

        // Common classes
        const pageClass = `w-[210mm] min-h-[297mm] bg-white shadow-2xl mx-auto overflow-hidden relative text-gray-800 ${finalConfig.fontFamily}`;
        const headerClass = `flex flex-col gap-4 mb-6 ${finalConfig.headerAlign === 'text-center' ? 'items-center text-center' : finalConfig.headerAlign === 'text-right' ? 'items-end text-right' : 'items-start text-left'}`;

        // --- TEMPLATE SPECIFIC LAYOUTS ---

        // 1. Sidebar Layouts (Modern, Creative, Executive, Tech)
        if (isSidebarLayout) {
            const reverse = finalConfig.layoutReverse; // Sidebar on Right
            const sidebarWidth = 'w-[32%]';
            const mainWidth = 'w-[68%]';
            
            // Sidebar Styling
            const sidebarBgClass = finalConfig.sidebarBg === 'theme' ? currentTheme.bg : finalConfig.sidebarBg === 'gray' ? 'bg-slate-100' : 'bg-transparent border-r border-gray-100';
            const sidebarTextClass = finalConfig.sidebarBg === 'theme' || finalConfig.sidebarBg === 'gray' ? 'text-gray-800' : 'text-gray-600';

            return (
                <div className={`${pageClass} flex ${reverse ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* SIDEBAR */}
                    <div className={`${sidebarWidth} flex-shrink-0 p-8 min-h-full ${sidebarBgClass} ${sidebarTextClass} flex flex-col gap-6`}>
                        {/* Photo in Sidebar for some layouts */}
                        {finalConfig.showPhoto && data.personal.photoUrl && (
                            <div className={`w-32 h-32 mx-auto mb-4 overflow-hidden border-4 ${currentTheme.border} ${finalConfig.photoShape}`}>
                                <img src={data.personal.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Contact Info (if not in header) */}
                        <div className="space-y-3 mb-6">
                            <h3 className={`uppercase tracking-widest text-xs font-bold mb-3 opacity-70 border-b pb-1 ${currentTheme.border}`}>Contact</h3>
                            <ContactItem icon={Mail} text={data.personal.email} />
                            <ContactItem icon={Phone} text={data.personal.phone} />
                            <ContactItem icon={MapPin} text={data.personal.location} />
                            <ContactItem icon={Linkedin} text="LinkedIn" link={data.personal.linkedin} />
                            <ContactItem icon={Globe} text="Portfolio" link={data.personal.portfolio} />
                        </div>

                        {/* Sidebar Sections */}
                        {sidebarSections.map(section => (
                            <div key={section.id}>
                                <div className={`uppercase tracking-widest text-xs font-bold mb-3 opacity-70 border-b pb-1 ${currentTheme.border} flex items-center gap-2`}>
                                    {section.label}
                                </div>
                                {renderSectionContent(section.id)}
                            </div>
                        ))}
                    </div>

                    {/* MAIN CONTENT */}
                    <div className={`${mainWidth} p-10 flex flex-col`}>
                        {/* Header Area */}
                        <div className={`${headerClass} border-b pb-6 mb-6 ${currentTheme.border}`}>
                            <h1 className={`${finalConfig.nameSize} ${finalConfig.nameWeight} ${currentTheme.text} leading-tight`}>
                                {data.personal.name}
                            </h1>
                            <p className="text-xl font-medium text-gray-500 tracking-tight">{data.personal.title}</p>
                        </div>

                        {/* Main Sections */}
                        <div className="space-y-8">
                            {mainSections.map(section => (
                                <div key={section.id}>
                                    <SectionHeader title={section.label} icon={section.icon} />
                                    {renderSectionContent(section.id)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        // 2. Single Column Layouts (Minimal, Elegant, Bold, ATS, Academic)
        else {
            return (
                <div className={`${pageClass} p-10 md:p-14`}>
                     {/* Header */}
                     <div className={`${headerClass} ${activeTemplate === 'bold' ? 'border-b-4 border-black pb-6' : ''}`}>
                        <div className="flex items-center gap-6 w-full">
                            {finalConfig.showPhoto && data.personal.photoUrl && (
                                <img 
                                    src={data.personal.photoUrl} 
                                    alt="Profile" 
                                    className={`w-28 h-28 object-cover border-2 border-gray-100 shadow-sm ${finalConfig.photoShape}`} 
                                />
                            )}
                            <div className="flex-grow">
                                <h1 className={`${finalConfig.nameSize} ${finalConfig.nameWeight} ${currentTheme.text} mb-1`}>
                                    {data.personal.name}
                                </h1>
                                <p className="text-xl text-gray-600 font-medium">{data.personal.title}</p>
                            </div>
                        </div>
                        
                        {/* Contact Row */}
                        <div className={`flex flex-wrap gap-4 mt-4 text-sm text-gray-500 ${finalConfig.headerAlign === 'text-center' ? 'justify-center' : ''}`}>
                             <ContactItem icon={Mail} text={data.personal.email} />
                             <ContactItem icon={Phone} text={data.personal.phone} />
                             <ContactItem icon={MapPin} text={data.personal.location} />
                             <ContactItem icon={Globe} text="Portfolio" link={data.personal.portfolio} />
                        </div>
                    </div>

                    {/* Content Grid (2 col for some sections if needed, or straight list) */}
                    <div className="space-y-6 mt-8">
                         {/* Force Summary First */}
                         {sections.find(s => s.id === 'summary' && s.visible) && (
                            <div>
                                <SectionHeader title="Profile Summary" icon={User} />
                                {renderSectionContent('summary')}
                            </div>
                         )}

                         {/* Two Column Grid for Skills/Languages if Compact */}
                         {activeTemplate === 'compact' || activeTemplate === 'academic' ? (
                            <div className="grid grid-cols-12 gap-8">
                                <div className="col-span-8 space-y-6">
                                    {sections.filter(s => ['experience', 'education'].includes(s.id) && s.visible).map(section => (
                                        <div key={section.id}>
                                            <SectionHeader title={section.label} icon={section.icon} />
                                            {renderSectionContent(section.id)}
                                        </div>
                                    ))}
                                </div>
                                <div className="col-span-4 space-y-6 border-l pl-6 border-gray-100">
                                     {sections.filter(s => ['skills', 'achievements', 'community'].includes(s.id) && s.visible).map(section => (
                                        <div key={section.id}>
                                            <SectionHeader title={section.label} icon={section.icon} />
                                            {renderSectionContent(section.id)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                         ) : (
                             // Standard Flow
                             allSections.filter(s => s.id !== 'summary').map(section => (
                                <div key={section.id} className={['skills', 'achievements'].includes(section.id) ? 'mb-4' : 'mb-8'}>
                                    <SectionHeader title={section.label} icon={section.icon} />
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
            {/* Toolbar */}
            <div className="w-full max-w-[210mm] flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-500 px-2">A4 Preview • {activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1)} Template</span>
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                >
                    <Briefcase size={16} /> Download PDF
                </button>
            </div>

            {/* Resume Page Wrapper */}
            <div className="overflow-auto max-w-full pb-10">
                <div ref={resumeRef} className="origin-top scale-[0.6] sm:scale-[0.8] lg:scale-100 transition-transform duration-300">
                    {renderLayout()}
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;