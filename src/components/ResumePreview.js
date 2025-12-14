import React from 'react';
import { 
  CheckCircle, User, Briefcase, GraduationCap, Award, Code, Heart, 
  FileText, Mail, Phone, Linkedin, Globe 
} from 'lucide-react';
import { colorThemes } from '../data';

const ResumePreview = ({ data, config, sectionOrder }) => {
  
  const theme = colorThemes[config.themeColor];

  // Helper Styles & Components
  const paddingClass = config.spacingScale === 'compact' 
    ? 'p-6 md:p-8 print:p-6 gap-6'
    : config.spacingScale === 'spacious' 
      ? 'p-10 md:p-14 print:p-12 gap-10'
      : 'p-8 md:p-12 print:p-8 gap-8';

  const sidebarClass = config.sidebarBg === 'none' ? '' :
                       config.sidebarBg === 'gray' ? 'bg-gray-50' : 
                       theme.bg;

  const headerClasses = () => `flex items-center gap-2 ${config.sectionTitleSize} font-bold uppercase tracking-wider mb-4 pb-1 break-inside-avoid-page ${
    config.sectionHeaderStyle === 'underline' ? `border-b-2 ${theme.border} text-gray-800` : 
    config.sectionHeaderStyle === 'box' ? `${theme.bg} p-2 rounded text-gray-900` :
    config.sectionHeaderStyle === 'left-bar' ? `border-l-4 ${theme.border} pl-3 text-gray-800` :
    config.sectionHeaderStyle === 'centered' ? `justify-center border-b-2 ${theme.border} pb-2 text-gray-800` : ''
  } ${config.uppercaseHeaders ? 'uppercase' : 'capitalize'}`;

  const Bullet = () => {
    if (config.bulletStyle === 'none') return null;
    if (config.bulletStyle === 'square') return <span className={`mr-2 text-[0.6em] relative -top-[1px] ${theme.text}`}>■</span>;
    if (config.bulletStyle === 'check') return <CheckCircle size={14} className={`mr-2 inline ${theme.text}`} />;
    return <span className={`mr-2 text-xl leading-none relative top-[2px] ${theme.text}`}>•</span>;
  };

  const Divider = () => {
    if (config.dividerStyle === 'none') return null;
    if (config.dividerStyle === 'gradient') return <div className={`my-6 h-0.5 w-full bg-gradient-to-r from-transparent via-${config.themeColor === 'noir' ? 'gray-400' : theme.hex.replace('bg-', '')} to-transparent opacity-50`}></div>;
    if (config.dividerStyle === 'diamond') return (
      <div className="flex items-center my-6 opacity-60">
        <div className="flex-grow h-px bg-gray-300"></div>
        <div className={`mx-2 text-[10px] transform rotate-45 w-2 h-2 ${theme.fill}`}></div>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>
    );
    if (config.dividerStyle === 'thick') return <hr className={`my-6 border-t-4 ${theme.border} opacity-20`} />;
    
    const borderStyle = config.dividerStyle === 'dotted' ? 'border-dotted' : config.dividerStyle === 'dashed' ? 'border-dashed' : 'border-solid';
    return <hr className={`my-6 border-t ${borderStyle} border-gray-200`} />;
  };

  const SocialIconWrapper = ({ children }) => {
    if (config.socialStyle === 'filled') return <div className={`p-1.5 rounded-full ${theme.fill} text-white`}>{children}</div>;
    if (config.socialStyle === 'circle') return <div className={`p-1.5 rounded-full border ${theme.border} ${theme.text}`}>{children}</div>;
    return <span className={theme.icon}>{children}</span>;
  };

  const EntryWrapper = ({ children }) => {
    if (config.entryBox === 'boxed') return <div className="p-4 border rounded-lg bg-gray-50/50 mb-4 break-inside-avoid">{children}</div>;
    if (config.entryBox === 'line-left') return <div className={`border-l-4 ${theme.border} pl-4 mb-4 break-inside-avoid`}>{children}</div>;
    return <div className="mb-4 break-inside-avoid">{children}</div>;
  };

  const renderSection = (sec) => {
    if (sec.id === 'summary' && data.personal.summary) {
      return (
        <section key={sec.id}>
          <h2 className={headerClasses()}>
              {config.showSectionIcons && <User size={20} className={`${theme.icon} mr-1`} />} {sec.label}
          </h2>
          <p className={`text-gray-700 leading-relaxed text-justify`}>
            {data.personal.summary}
          </p>
          <Divider />
        </section>
      );
    }
    
    if (sec.id === 'experience') {
      return (
        <section key={sec.id} className="relative">
          <h2 className={headerClasses()}>
              {config.showSectionIcons && <Briefcase size={20} className={`${theme.icon} mr-1`} />} {sec.label}
          </h2>
          {config.timeline && <div className={`absolute left-[7px] top-10 bottom-2 w-0.5 bg-gray-200`}></div>}
          <div className={`flex flex-col gap-${config.spacingScale === 'compact' ? '4' : '6'}`}>
            {data.experience.map((exp) => (
              <EntryWrapper key={exp.id}>
                <div className={`relative ${config.timeline ? 'pl-6' : ''}`}>
                  {config.timeline && <div className={`absolute left-[-5px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${theme.fill}`}></div>}
                  
                  <div className={`flex justify-between items-baseline mb-1 ${config.dateAlign === 'below' ? 'flex-col' : ''}`}>
                    <h3 className="font-bold text-gray-900 text-lg">{exp.role}</h3>
                    {config.dateAlign === 'inline' ? null : (
                      <span className={`text-xs font-bold ${theme.text} ${theme.bg} px-2 py-1 rounded whitespace-nowrap ${config.dateAlign === 'below' ? 'mt-1 w-fit' : ''}`}>{exp.year}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`text-sm ${config.companyStyle} ${theme.text}`}>{exp.company}</div>
                    {config.dateAlign === 'inline' && (
                      <span className="text-xs text-gray-500">| {exp.year}</span>
                    )}
                  </div>

                  <p className={`text-gray-600 leading-relaxed text-justify text-sm`}>
                    {exp.details}
                  </p>
                </div>
              </EntryWrapper>
            ))}
          </div>
          <Divider />
        </section>
      );
    }

    if (sec.id === 'achievements') {
      return (
        <section key={sec.id}>
          <h2 className={headerClasses()}>
              {config.showSectionIcons && <Award size={20} className={`${theme.icon} mr-1`} />} {sec.label}
          </h2>
          <ul className="space-y-2">
            {data.achievements.map((ach, idx) => (
              <li key={idx} className="flex items-start text-gray-700 break-inside-avoid">
                <div className="flex-shrink-0 mt-1"><Bullet /></div>
                <span>{ach}</span>
              </li>
            ))}
          </ul>
          <Divider />
        </section>
      );
    }

    if (sec.id === 'education') {
      return (
        <section key={sec.id} className="relative">
          <h2 className={headerClasses()}>
              {config.showSectionIcons && <GraduationCap size={20} className={`${theme.icon} mr-1`} />} {sec.label}
          </h2>
          {config.timeline && <div className={`absolute left-[7px] top-10 bottom-2 w-0.5 bg-gray-200`}></div>}
          <div className={`flex flex-col gap-${config.spacingScale === 'compact' ? '4' : '6'}`}>
            {data.education.map((edu) => (
              <div key={edu.id} className={`break-inside-avoid relative ${config.timeline ? 'pl-6' : ''}`}>
                {config.timeline && <div className={`absolute left-[-5px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${theme.fill}`}></div>}
                <h3 className={`font-bold text-gray-900 leading-tight ${config.companyStyle}`}>{edu.institution}</h3>
                <div className={`text-sm ${theme.text} font-semibold mt-1`}>{edu.degree}</div>
                <div className="text-xs text-gray-500 mt-1 mb-2 font-medium uppercase tracking-wide">{edu.year}</div>
                <p className="text-xs text-gray-600 leading-relaxed">{edu.details}</p>
              </div>
            ))}
          </div>
          <Divider />
        </section>
      );
    }

    if (sec.id === 'skills') {
      return (
        <section key={sec.id}>
          <h2 className={headerClasses()}>
              {config.showSectionIcons && <Code size={20} className={`${theme.icon} mr-1`} />} {sec.label}
          </h2>
          
          {config.skillStyle === 'tags' && (
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, idx) => (
                <span key={idx} className={`${theme.bg} ${theme.text} text-xs font-bold px-3 py-1.5 ${config.skillShape} border border-transparent`}>
                  {skill.name}
                </span>
              ))}
            </div>
          )}

          {config.skillStyle === 'list' && (
            <ul className="space-y-1">
              {data.skills.map((skill, idx) => (
                <li key={idx} className="flex items-start text-gray-700 text-sm">
                  <span className={`mr-2 ${theme.text}`}>›</span> {skill.name}
                </li>
              ))}
            </ul>
          )}

            {config.skillStyle === 'bars' && (
            <div className="space-y-3">
              {data.skills.map((skill, idx) => (
                <div key={idx} className="break-inside-avoid">
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                      <span>{skill.name}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${theme.fill}`} style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {config.skillStyle === 'comma' && (
            <div className="text-gray-700 text-sm leading-relaxed">
              {data.skills.map(s => s.name).join(', ')}.
            </div>
          )}
          <Divider />
        </section>
      );
    }

    if (sec.id === 'community') {
      return (
        <section key={sec.id}>
          <h2 className={headerClasses()}>
              {config.showSectionIcons && <Heart size={20} className={`${theme.icon} mr-1`} />} {sec.label}
          </h2>
          <ul className="space-y-3">
            {data.community.map((item, idx) => (
              <li key={idx} className={`text-sm text-gray-700 ${theme.border} border-l-2 pl-3 leading-snug break-inside-avoid`}>
                {item}
              </li>
            ))}
          </ul>
          <Divider />
        </section>
      );
    }

    if (sec.type === 'custom' && data.custom[sec.id]) {
      return (
       <section key={sec.id}>
          <h2 className={headerClasses()}>
              {config.showSectionIcons && <FileText size={20} className={`${theme.icon} mr-1`} />} {sec.label}
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {data.custom[sec.id].content}
          </div>
          <Divider />
       </section>
      );
    }
    return null;
  };

  return (
    <div 
      id="cv-document"
      className={`${config.paperTint} ${config.fontScale} ${config.fontFamily} w-full max-w-[21cm] min-h-[29.7cm] shadow-2xl md:p-0 print:w-full print:max-w-none print:shadow-none print:m-0 print:absolute print:top-0 print:left-0 print:z-50 relative overflow-hidden transition-colors duration-300`}
    >
      {/* Watermark */}
      {config.watermark && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none overflow-hidden">
           <span className="text-9xl font-black -rotate-45 whitespace-nowrap transform scale-150 text-gray-900 uppercase">{config.watermark}</span>
        </div>
      )}

      {/* Border Styles */}
      {config.borderStyle === 'simple' && <div className={`absolute inset-4 sm:inset-5 md:inset-6 border-2 pointer-events-none ${theme.border}`} style={{ zIndex: 5 }}></div>}
      {config.borderStyle === 'thick' && <div className={`absolute inset-4 sm:inset-5 md:inset-6 border-4 pointer-events-none ${theme.border}`} style={{ zIndex: 5 }}></div>}
      {config.borderStyle === 'double' && <div className={`absolute inset-4 sm:inset-5 md:inset-6 border-4 double pointer-events-none ${theme.border}`} style={{ zIndex: 5, borderStyle: 'double', borderWidth: '4px' }}></div>}
      {config.borderStyle === 'offset' && (
        <>
          <div className={`absolute inset-4 sm:inset-5 md:inset-6 border pointer-events-none ${theme.border}`} style={{ zIndex: 5 }}></div>
          <div className={`absolute inset-6 sm:inset-7 md:inset-8 border pointer-events-none opacity-50 ${theme.border}`} style={{ zIndex: 5 }}></div>
        </>
      )}
      {config.borderStyle === 'rounded' && <div className={`absolute inset-5 sm:inset-6 md:inset-8 border-2 rounded-2xl pointer-events-none ${theme.border}`} style={{ zIndex: 5 }}></div>}
      {config.borderStyle === 'minimal' && (
        <>
          <div className={`absolute top-6 left-6 right-6 border-t-2 pointer-events-none ${theme.border}`} style={{ zIndex: 5 }}></div>
          <div className={`absolute bottom-6 left-6 right-6 border-b-2 pointer-events-none ${theme.border}`} style={{ zIndex: 5 }}></div>
        </>
      )}
      {config.borderStyle === 'corners' && (
        <>
          <div className={`absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 pointer-events-none ${theme.border}`} style={{ zIndex: 5 }}></div>
          <div className={`absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 pointer-events-none ${theme.border}`} style={{ zIndex: 5 }}></div>
          <div className={`absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 pointer-events-none ${theme.border}`} style={{ zIndex: 5 }}></div>
          <div className={`absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 pointer-events-none ${theme.border}`} style={{ zIndex: 5 }}></div>
        </>
      )}

      {/* Main Content */}
      <div className={`relative z-10 flex flex-col flex-grow ${paddingClass}`}>
          <header className={`border-b-2 ${theme.border} pb-6 ${config.headerAlign}`}>
            <div className={`flex gap-6 ${config.headerAlign === 'text-center' ? 'flex-col items-center justify-center' : config.headerAlign === 'text-right' ? 'flex-row-reverse items-center text-right' : 'flex-row items-center'}`}>
              
              {config.showPhoto && data.personal.photoUrl && (
                <div className={`flex-shrink-0 w-32 h-32 overflow-hidden ${config.photoBorder === 'thick' ? `border-4 ${theme.border}` : config.photoBorder === 'thin' ? `border-2 ${theme.border}` : ''} ${config.photoShape} ${config.headerAlign === 'text-center' ? 'mb-2' : ''}`}>
                  <img src={data.personal.photoUrl} alt={data.personal.name} className="w-full h-full object-cover" />
                </div>
              )}
  
              <div className="flex-grow">
                <h1 className={`${config.nameSize} ${config.nameWeight} text-gray-900 uppercase tracking-tight leading-none`}>{data.personal.name}</h1>
                <p className={`text-xl mt-2 font-medium ${config.jobTitleColor === 'theme' ? theme.text : config.jobTitleColor === 'gray' ? 'text-gray-600' : 'text-black'}`}>{data.personal.title}</p>
                
                <div className={`flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-gray-600 ${config.contactLayout === 'grid' ? 'grid grid-cols-2' : config.contactLayout === 'stack' ? 'flex-col' : ''} ${config.headerAlign === 'text-center' ? 'justify-center items-center' : config.headerAlign === 'text-right' ? 'justify-end items-end' : ''}`}>
                  {data.personal.email && (
                    <div className="flex items-center gap-1.5">
                      <SocialIconWrapper><Mail size={14} /></SocialIconWrapper> <span>{data.personal.email}</span>
                    </div>
                  )}
                  {data.personal.phone && (
                    <div className="flex items-center gap-1.5">
                      <SocialIconWrapper><Phone size={14} /></SocialIconWrapper> <span>{data.personal.phone}</span>
                    </div>
                  )}
                  {data.personal.linkedin && (
                    <div className="flex items-center gap-1.5">
                      <SocialIconWrapper><Linkedin size={14} /></SocialIconWrapper> <a href={data.personal.linkedin} className={`hover:underline ${theme.text}`}>LinkedIn</a>
                    </div>
                  )}
                  {data.personal.portfolio && (
                    <div className="flex items-center gap-1.5">
                      <SocialIconWrapper><Globe size={14} /></SocialIconWrapper> <a href={data.personal.portfolio} className={`hover:underline ${theme.text}`}>Portfolio</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
  
          <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 flex-grow ${config.layoutReverse ? 'direction-rtl' : ''}`}>
            
            {/* Main Column */}
            <div className={`md:col-span-8 flex flex-col gap-${config.spacingScale === 'compact' ? '4' : '8'} ${config.layoutReverse ? 'md:order-2' : 'md:order-1'}`}>
               {sectionOrder
                 .filter(s => s.visible && (s.id === 'summary' || s.id === 'experience' || s.id === 'achievements' || s.type === 'custom'))
                 .map(sec => renderSection(sec))
               }
            </div>
  
            {/* Sidebar Column */}
            <div className={`md:col-span-4 flex flex-col gap-${config.spacingScale === 'compact' ? '5' : '8'} ${config.layoutReverse ? 'md:order-1 border-r pr-6' : 'md:order-2 border-l pl-6'} border-gray-200 ${sidebarClass} ${config.sidebarBg !== 'none' ? '-my-8 -mr-8 py-8 pr-8 pl-6' : ''} rounded-r-lg`}>
               {sectionOrder
                 .filter(s => s.visible && (s.id === 'education' || s.id === 'skills' || s.id === 'community'))
                 .map(sec => renderSection(sec))
               }
            </div>
          </div>

          {config.customFooter && (
            <div className={`mt-auto pt-6 text-center text-xs text-gray-400 border-t ${config.dividerStyle === 'none' ? 'border-transparent' : 'border-gray-200'}`}>
              {config.customFooter}
            </div>
          )}
        </div>
    </div>
  );
};

export default ResumePreview;