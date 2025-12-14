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
        <div className={`flex items-center gap-2 ${config.fontScale === 'text-xs' ? 'text-[10px]' : 'text-xs'} opacity-90`}>
            {config.showIcons && icon && <IconRenderer icon={icon} size={14} />}
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

// --- Section Header ---
export const SectionHeader = ({ title, icon, config, theme }) => {
    const style = config.sectionHeaderStyle;
    const alignClass = style === 'centered' ? 'justify-center' : 'justify-start';
    const textClass = config.uppercaseHeaders ? 'uppercase tracking-widest' : '';
    const textSize = config.sectionTitleSize || 'text-lg';

    return (
        <div className={`flex items-center ${alignClass} gap-3 mb-3 mt-6 ${theme.text} ${textClass}`}>
            {config.showSectionIcons && icon && <IconRenderer icon={icon} size={18} />}
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
            <span className={`px-3 py-1 text-xs rounded-md font-medium border ${theme.border} ${theme.bg} ${theme.text}`}>
                {skill.name} {skill.level ? `• ${skill.level}%` : ''}
            </span>
        );
    } else if (config.skillStyle === 'bars') {
         return (
            <div className="w-full mb-2">
                <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">{skill.name}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${theme.hex}`} 
                        style={{ width: `${skill.level}%` }}
                    ></div>
                </div>
            </div>
        );
    } else {
        return (
            <span className="text-sm font-medium mr-4 mb-1 block">
                • {skill.name}
            </span>
        );
    }
};