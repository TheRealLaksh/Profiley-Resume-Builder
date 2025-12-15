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
                justifyContent: 'center',
                color: '#000000' // Force icon color to black for PDF
            }} 
            className={className}
        >
            <Icon size={size} />
        </div>
    );
};

// --- HELPER: Section Headers ---
export const SectionHeader = ({ title, icon, config, theme }) => {
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

// --- FIX: Contact Item (Critical Visibility Fix) ---
export const ContactItem = ({ icon, text, link }) => {
    if (!text) return null;

    // CRITICAL PDF STYLES:
    // 1. color: '#000000' -> Ensures maximum contrast, no grey wash-out.
    // 2. fontFamily: 'Arial...' -> Bypasses variable/web font loading failures.
    // 3. textDecoration: 'none' -> Prevents browser link underlining.
    const safeTextStyle = {
        color: '#000000',
        fontFamily: 'Arial, Helvetica, sans-serif', 
        fontSize: '10px',
        fontWeight: 600, // Semi-bold for readability
        textDecoration: 'none',
        lineHeight: '1.2',
        whiteSpace: 'nowrap' // Keep on one line
    };

    // Remove 'truncate' to prevent text becoming "..." or disappearing.
    const contentClasses = "flex items-center gap-1.5 min-w-0";
    
    // Icon Wrapper
    const iconEl = icon && (
        <div className="flex-shrink-0 flex items-center justify-center">
            {/* Force icon color explicitly */}
            <IconRenderer Icon={icon} size={12} className="text-black" />
        </div>
    );

    // Text Wrapper
    const textEl = (
        <span style={safeTextStyle} className="mt-[1px]">
            {text}
        </span>
    );

    const linkIconEl = link && (
        <ExternalLink size={8} color="#000000" className="flex-shrink-0 opacity-70 ml-0.5" />
    );

    // Render Logic
    if (link) {
        return (
            <div className="break-inside-avoid max-w-full inline-flex">
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={contentClasses}
                    style={{ textDecoration: 'none' }} // Double enforcement
                >
                    {iconEl}
                    {textEl}
                    {linkIconEl}
                </a>
            </div>
        );
    }

    return (
        <div className={`break-inside-avoid max-w-full ${contentClasses}`}>
            {iconEl}
            {textEl}
        </div>
    );
};

// --- HELPER: Skill Tag ---
export const SkillTag = ({ skill, config, theme }) => {
    const skillName = typeof skill === 'object' ? skill.name : skill;
    const skillLevel = typeof skill === 'object' ? skill.level : null;

    const baseClasses = "text-[10px] font-medium break-inside-avoid inline-block";
    const marginStyle = { marginRight: '6px', marginBottom: '6px' };

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

    return (
        <div className="flex items-center break-inside-avoid" style={marginStyle}>
             <span className={`w-1.5 h-1.5 rounded-full mr-2 ${theme.bg}`}></span>
             <span className={`${baseClasses} text-gray-700`}>{skillName}</span>
        </div>
    );
};