import React from 'react';
import { FileText, Share2, Shield, Zap } from 'lucide-react';

const SEOFooter = ({ darkMode }) => {
  const bgClass = darkMode ? 'bg-neutral-900 border-t border-neutral-800' : 'bg-gray-100 border-t border-gray-200';
  const textHeader = darkMode ? 'text-white' : 'text-gray-900';
  const textBody = darkMode ? 'text-neutral-400' : 'text-gray-600';
  const linkHover = 'hover:text-blue-500 transition-colors cursor-pointer';

  return (
    <footer className={`w-full py-12 px-6 md:px-12 mt-auto ${bgClass}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Column 1: Core Brand & Features */}
        <div className="space-y-4">
          <h3 className={`font-bold text-lg ${textHeader} flex items-center gap-2`}>
            <Zap size={20} className="text-blue-500"/> Profiley Features
          </h3>
          <ul className={`space-y-2 text-sm ${textBody}`}>
             <li className={linkHover}>Free Online Resume Builder</li>
             <li className={linkHover}>ATS Friendly Resume Templates</li>
             <li className={linkHover}>High-Quality PDF Export</li>
             <li className={linkHover}>Shareable Resume Link</li>
             <li className={linkHover}>Real-time React Live Preview</li>
             <li className={linkHover}>Dark Mode Resume Editor</li>
          </ul>
        </div>

        {/* Column 2: Use Cases */}
        <div className="space-y-4">
          <h3 className={`font-bold text-lg ${textHeader} flex items-center gap-2`}>
            <FileText size={20} className="text-blue-500"/> For Everyone
          </h3>
          <ul className={`space-y-2 text-sm ${textBody}`}>
             <li className={linkHover}>Resume Builder for Freshers</li>
             <li className={linkHover}>Resume Builder for Developers</li>
             <li className={linkHover}>Resume Builder for Students</li>
             <li className={linkHover}>Resume Builder for Internships</li>
             <li className={linkHover}>CV Maker for Indian Jobs</li>
             <li className={linkHover}>Professional CV for Remote Jobs</li>
          </ul>
        </div>

        {/* Column 3: Comparisons */}
        <div className="space-y-4">
          <h3 className={`font-bold text-lg ${textHeader} flex items-center gap-2`}>
            <Shield size={20} className="text-blue-500"/> Why Profiley?
          </h3>
          <ul className={`space-y-2 text-sm ${textBody}`}>
             <li className={linkHover}>Best Free Resume Builder 2025</li>
             <li className={linkHover}>No Signup Required</li>
             <li className={linkHover}>No Watermark PDF Export</li>
             <li className={linkHover}>Secure Local Data Storage</li>
             <li className={linkHover}>Open Source CV Maker</li>
             <li className={linkHover}>Fastest React Resume Engine</li>
          </ul>
        </div>

        {/* Column 4: Resources (From your Content List) */}
        <div className="space-y-4">
          <h3 className={`font-bold text-lg ${textHeader} flex items-center gap-2`}>
            <Share2 size={20} className="text-blue-500"/> Resources
          </h3>
          <ul className={`space-y-2 text-sm ${textBody}`}>
             <li className={linkHover}>How to create an ATS resume</li>
             <li className={linkHover}>Best resume format for developers</li>
             <li className={linkHover}>Convert resume to personal website</li>
             <li className={linkHover}>Resume optimization checklist</li>
             <li className={linkHover}>Common resume mistakes to avoid</li>
             <li className={linkHover}>How to host resume online</li>
          </ul>
        </div>
      </div>

      <div className={`pt-8 border-t ${darkMode ? 'border-neutral-800' : 'border-gray-300'} text-center`}>
        <p className={`text-xs ${textBody}`}>
          © {new Date().getFullYear()} Profiley. Built by <span className="font-bold text-blue-500">Laksh Pradhwani</span>. 
          The architect of professional identity.
        </p>
        <p className={`text-[10px] mt-2 opacity-50 ${textBody}`}>
          Keywords: Online Resume Builder, CV Maker India, Free PDF Resume, Resume Link Generator.
        </p>
      </div>
    </footer>
  );
};

export default SEOFooter;
