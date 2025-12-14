import React from 'react';
import { ExternalLink } from 'lucide-react';

// --- HELPER: Renders an icon with fixed, PDF-safe sizing ---
export const IconRenderer = ({ Icon, size = 16, className = "" }) => {
    if (!Icon) return null;
    return (
        <div 
            style={{ 
                width: size, 
                height: size, 
                minWidth: size, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }} 
            className={className}
        >
            <Icon size={size} />
        </div>
    );
};

// --- HELPER: Section Headers ---
export const SectionHeader = ({ title, icon, config, theme }) => {
    // Handle alignment classes safely for PDF
    const justifyClass = config.headerAlign === 'text-center' ? 'justify-center' : 
                         config.headerAlign === 'text-right' ? 'justify-end' : 'justify-start';
                         
    return (
        <div className={`flex items-center gap-2 mb-2 border-b pb-1 ${theme.border} ${justifyClass}`}>
            {config.showSectionIcons && icon && (
                <div className={`${theme.text}`}>
                    <IconRenderer Icon={icon} size={18} />
                </div>
            )}
            <h3 className={`uppercase tracking-widest text-xs font-bold ${theme.text}`}>
                {title}
            </h3>
        </div>
    );
};

// --- FIX 1: Contact Item (Links) ---
// Uses inline-flex and explicit decorations to prevent PDF splitting/misalignment
export const ContactItem = ({ icon, text, link }) => {
    if (!text) return null;

    const content = (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                maxWidth: '160px',   // HARD WIDTH — REQUIRED
                overflow: 'hidden',
                whiteSpace: 'nowrap'
            }}
        >
            {icon && (
                <span
                    style={{
                        display: 'flex',
                        marginRight: '6px',
                        flexShrink: 0
                    }}
                >
                    <IconRenderer Icon={icon} size={12} />
                </span>
            )}

            <span
                style={{
                    fontSize: '10px',
                    color: '#374151',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    minWidth: 0
                }}
            >
                {text}
            </span>

            {link && (
                <span
                    style={{
                        display: 'flex',
                        marginLeft: '4px',
                        flexShrink: 0
                    }}
                >
                    <ExternalLink size={8} />
                </span>
            )}
        </div>
    );

    return (
        <div
            className="mb-1 break-inside-avoid"
            style={{
                maxWidth: '160px',   // SAME WIDTH HERE
                overflow: 'hidden',
                whiteSpace: 'nowrap'
            }}
        >
            {link ? (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'block',
                        maxWidth: '160px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textDecoration: 'none',
                        color: 'inherit'
                    }}
                >
                    {content}
                </a>
            ) : (
                content
            )}
        </div>
    );
};

// --- FIX 2: Skill Tag (The Glitch Fix) ---
// 1. Handles object vs string skills safely
// 2. Uses marginRight/Bottom instead of flex-gap to prevent html2canvas overlapping issues
// 3. Restores support for 'tags' and 'bars' styles used in your templates
export const SkillTag = ({ skill, config, theme }) => {
    // SAFEGUARD: Handle both object (new data) and string (old data) formats
    const skillName = typeof skill === 'object' ? skill.name : skill;
    const skillLevel = typeof skill === 'object' ? skill.level : null;

    const baseClasses = "text-[10px] font-medium break-inside-avoid inline-block";
    
    // PDF-Safe Spacing: We use explicit margins on the item, NOT gap on the container
    const marginStyle = { marginRight: '6px', marginBottom: '6px' };

    // STYLE 1: Tags (Pills) - Used in Leafy, Modern, Glitch
    if (config.skillStyle === 'tags') {
        return (
            <span 
                className={`${baseClasses} px-2 py-1 rounded-md border ${theme.border} ${theme.bg} ${theme.text}`}
                style={marginStyle}
            >
                {skillName} {skillLevel ? `• ${skillLevel}%` : ''}
            </span>
        );
    }
    
    // STYLE 2: Bars - Used in Tech, Creative
    if (config.skillStyle === 'bars') {
        return (
            <div className="w-full break-inside-avoid" style={{ marginBottom: '8px' }}>
                <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="font-semibold">{skillName}</span>
                    {skillLevel && <span className="opacity-70">{skillLevel}%</span>}
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${theme.hex}`} 
                        style={{ width: `${skillLevel || 100}%` }}
                    ></div>
                </div>
            </div>
        );
    }

    // STYLE 3: Default / List - Used in Minimal, Elegant
    return (
        <div className="flex items-center break-inside-avoid" style={marginStyle}>
             <span className={`w-1.5 h-1.5 rounded-full mr-2 ${theme.bg}`}></span>
             <span className={`${baseClasses} text-gray-700`}>{skillName}</span>
        </div>
    );
};