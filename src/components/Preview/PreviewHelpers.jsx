import React from 'react';

// --- Icon Renderer ---
export const IconRenderer = ({ icon: Icon, size = 16, className = "" }) => {
    if (!Icon) return null;
    return <Icon size={size} className={className} />;
};

// --- Contact Item ---
export const ContactItem = ({ icon, text, link, config }) => {
    if (!text) return null;
    return (
        <div className={`flex items-center gap-1 ${config.fontScale === 'text-xs' ? 'text-[10px]' : 'text-xs'} opacity-90`}>
            {config.showIcons && icon && <IconRenderer icon={icon} size={12} />}
            {link ? (
                <a href={link} target="_blank" rel="noreferrer" className="hover:underline truncate max-w-[180px] block">
                    {text}
                </a>
            ) : (
                <span>{text}</span>
            )}
        </div>
    );
};

// --- Section Header ---
export const SectionHeader = ({ title, icon, config, theme }) => {
    const style = config.sectionHeaderStyle;
    const alignClass = style === 'centered' ? 'justify-center' : 'justify-start';
    const textClass = config.uppercaseHeaders ? 'uppercase tracking-widest' : '';
    const textSize = config.sectionTitleSize || 'text-sm';

    return (
        <div className={`flex items-center ${alignClass} gap-2 mb-1.5 mt-3 ${theme.text} ${textClass}`}>
            {config.showSectionIcons && icon && <IconRenderer icon={icon} size={14} />}
            <h3 className={`${textSize} font-bold whitespace-nowrap`}>{title}</h3>
            
            {style === 'underline' && <div className={`h-0.5 flex-grow opacity-30 ${theme.bg.replace('bg-', 'bg-current ')}`}></div>}
            {style === 'left-bar' && <div className="hidden"></div>} 
            {style === 'box' && <div className="hidden"></div>}
        </div>
    );
};

// --- Skill Tag ---
export const SkillTag = ({ skill, config, theme }) => {
    if (config.skillStyle === 'tags') {
        return (
            <span className={`px-2 py-0.5 text-[10px] rounded-md font-medium border ${theme.border} ${theme.bg} ${theme.text}`}>
                {skill.name} {skill.level ? `• ${skill.level}%` : ''}
            </span>
        );
    } else if (config.skillStyle === 'bars') {
         return (
            <div className="w-full mb-1">
                <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="font-semibold">{skill.name}</span>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${theme.hex}`} 
                        style={{ width: `${skill.level}%` }}
                    ></div>
                </div>
            </div>
        );
    } else {
        return (
            <span className="text-xs font-medium mr-3 mb-0.5 block">
                • {skill.name}
            </span>
        );
    }
};