import React from 'react';
import { Download, FileText, Link2, Loader2, Printer } from 'lucide-react';
import { PanelHeading, Segmented } from '../UI/FormElements';

const SHORTCUTS = [
    ['Undo', ['Ctrl', 'Z']],
    ['Redo', ['Ctrl', 'Shift', 'Z']],
    ['Zoom page', ['Ctrl', 'Scroll']],
    ['Print or save as PDF', ['Ctrl', 'P']]
];

const ExportTab = ({ pdfQuality, setPdfQuality, handleShare, onDownloadPdf, onPrint, isExportingPdf }) => (
    <div className="animate-rise">
        <PanelHeading title="Export" subtitle="Take your resume with you." />

        <div className="space-y-3">
            <section className="card p-4">
                <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-ink"><Download size={17} /></span>
                    <div>
                        <h3 className="text-[13px] font-semibold text-ink">PDF with the exact design</h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-ink-3">A faithful copy of the preview. The text is part of the image, so it can't be selected.</p>
                    </div>
                </div>
                <Segmented
                    className="mt-4"
                    label="Quality"
                    value={pdfQuality}
                    onChange={setPdfQuality}
                    options={[{ value: 'screen', label: 'Standard (faster)' }, { value: 'print', label: 'High (sharper)' }]}
                />
                <button className="btn btn-primary mt-3 h-10 w-full" onClick={onDownloadPdf} disabled={isExportingPdf}>
                    {isExportingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {isExportingPdf ? 'Exporting...' : 'Download PDF'}
                </button>
            </section>

            <section className="card p-4">
                <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sunken text-ink-2"><FileText size={17} /></span>
                    <div>
                        <h3 className="text-[13px] font-semibold text-ink">PDF with selectable text</h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-ink-3">Opens your browser's print dialog. Choose "Save as PDF". Best for applicant tracking systems that read the text.</p>
                    </div>
                </div>
                <button className="btn btn-secondary mt-4 h-10 w-full" onClick={onPrint}>
                    <Printer size={16} /> Print or save as PDF
                </button>
            </section>

            <section className="card p-4">
                <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sunken text-ink-2"><Link2 size={17} /></span>
                    <div>
                        <h3 className="text-[13px] font-semibold text-ink">Shareable link</h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-ink-3">Publish a read-only copy at a link you can send. It is a snapshot: changes you make later won't update it.</p>
                    </div>
                </div>
                <button className="btn btn-secondary mt-4 h-10 w-full" onClick={handleShare}>
                    <Link2 size={16} /> Create link
                </button>
            </section>
        </div>

        <h3 className="eyebrow mb-2 mt-7 px-1">Shortcuts</h3>
        <dl className="card divide-y divide-line">
            {SHORTCUTS.map(([label, keys]) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5">
                    <dt className="text-[13px] text-ink-2">{label}</dt>
                    <dd className="flex gap-1">{keys.map((k) => <kbd key={k} className="kbd">{k}</kbd>)}</dd>
                </div>
            ))}
        </dl>
    </div>
);

export default ExportTab;
