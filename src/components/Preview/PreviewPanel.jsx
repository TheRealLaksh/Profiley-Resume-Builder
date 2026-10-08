import React from 'react';
import { Download, Loader2 } from 'lucide-react';

import ResumeDocument from './ResumeDocument';

/**
 * Toolbar + A4 page. Zooming is handled by the parent (desktop zoom toolbar /
 * mobile pinch), so nothing in here scales on its own.
 */
const PreviewPanel = ({ data, config, sectionOrder, activeTemplate, onDownloadPdf, isExportingPdf }) => (
    <div className="flex flex-col gap-4 items-center">
        <div className="w-full max-w-[210mm] flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm font-medium text-gray-500 px-2">
                A4 Preview • {activeTemplate ? activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1) : 'Modern'}
            </span>
            {onDownloadPdf && (
                <button
                    onClick={onDownloadPdf}
                    disabled={isExportingPdf}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 disabled:opacity-60 disabled:cursor-wait"
                >
                    {isExportingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {isExportingPdf ? 'Exporting...' : 'Download PDF'}
                </button>
            )}
        </div>

        <div className="pb-10">
            <ResumeDocument data={data} config={config} sectionOrder={sectionOrder} />
        </div>
    </div>
);

export default PreviewPanel;
