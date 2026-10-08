import React, { useEffect, useRef, useState } from 'react';
import { FileUp, FileText, Loader2, Sparkles, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AiError, runAiTask } from '../../ai/client';
import { detectJson } from '../../import/formats';
import { aiToData } from '../../import/fromAi';
import { parseResumeText } from '../../import/heuristic';
import { extractPdfText } from '../../import/pdfText';
import { Segmented, Toggle } from '../UI/FormElements';
import AiSetup from '../Editor/review/AiSetup';

const MAX_BYTES = 10 * 1024 * 1024;

const words = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0);

const describe = (data, customSections) => [
  ['Name', data.personal.name || 'not found'],
  ['Headline', data.personal.title || 'not found'],
  ['Contact', [data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join(' · ') || 'not found'],
  ['Summary', data.personal.summary ? `${words(data.personal.summary)} words` : 'not found'],
  ['Experience', `${data.experience.length} ${data.experience.length === 1 ? 'role' : 'roles'}`],
  ['Education', `${data.education.length} ${data.education.length === 1 ? 'entry' : 'entries'}`],
  ['Skills', `${data.skills.length}`],
  ['Achievements', `${data.achievements.length}`],
  ['Activities', `${data.community.length}`],
  ...(customSections.length ? [['Other sections', customSections.map((s) => s.label).join(', ')]] : [])
];

const ImportModal = ({ isOpen, onClose, onApply, ai }) => {
  const [stage, setStage] = useState('pick'); // pick | reading | review | error
  const [mode, setMode] = useState('file'); // file | paste
  const [pasted, setPasted] = useState('');
  const [useAi, setUseAi] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [restoreDesign, setRestoreDesign] = useState(true);
  const source = useRef(null); // { text, links } kept so the same file can be re-read another way
  const abortRef = useRef(null);
  const dialogRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll('button:not([disabled]), input:not([type=file]), textarea, select, a[href]');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => { window.removeEventListener('keydown', onKeyDown); opener?.focus?.(); abortRef.current?.abort(); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fail = (message) => { setError(message); setStage('error'); };
  const reset = () => { abortRef.current?.abort(); setStage('pick'); setResult(null); setError(''); source.current = null; };

  const readText = async (text, links, method) => {
    setStage('reading');
    try {
      if (method === 'ai') {
        const controller = new AbortController();
        abortRef.current = controller;
        const payload = { text: links.length ? `${text}\n\nLinks found in the document:\n${links.join('\n')}` : text };
        const raw = await runAiTask('parse', payload, { signal: controller.signal, serverAvailable: ai.serverAvailable });
        setResult({ ...aiToData(raw), method: 'ai', rereadable: true });
      } else {
        setResult({ ...parseResumeText(text, { links }), method: 'basic', rereadable: true });
      }
      setStage('review');
    } catch (err) {
      if (err.name === 'AbortError') return;
      fail(err instanceof AiError || err instanceof Error ? err.message : 'Something went wrong reading that file.');
    }
  };

  const readFile = async (file) => {
    if (!file) return;
    if (file.size > MAX_BYTES) { fail('That file is over 10 MB.'); return; }
    setFileName(file.name);
    const name = file.name.toLowerCase();

    try {
      if (name.endsWith('.json') || file.type === 'application/json') {
        setStage('reading');
        let parsed;
        try { parsed = JSON.parse(await file.text()); } catch { fail("That file isn't valid JSON."); return; }
        const found = detectJson(parsed);
        if (!found) { fail('That JSON is not a Profiley backup or a JSON Resume file.'); return; }
        setResult({ ...found, customSections: found.customSections || [], method: found.kind });
        setStage('review');
      } else if (name.endsWith('.pdf') || file.type === 'application/pdf') {
        setStage('reading');
        source.current = await extractPdfText(file);
        await readText(source.current.text, source.current.links, useAi && ai.ready ? 'ai' : 'basic');
      } else if (name.endsWith('.txt') || name.endsWith('.md') || file.type.startsWith('text/')) {
        source.current = { text: await file.text(), links: [] };
        await readText(source.current.text, [], useAi && ai.ready ? 'ai' : 'basic');
      } else {
        fail('Use a PDF, a text file, or a JSON file.');
      }
    } catch (err) {
      fail(err.message || 'Could not read that file.');
    }
  };

  const readPasted = () => {
    source.current = { text: pasted, links: [] };
    setFileName('Pasted text');
    return readText(pasted, [], useAi && ai.ready ? 'ai' : 'basic');
  };

  const rereadWithAi = () => readText(source.current.text, source.current.links, 'ai');

  const apply = () => {
    onApply({
      data: result.data,
      customSections: result.customSections,
      config: restoreDesign ? result.config : undefined,
      sectionOrder: restoreDesign ? result.sectionOrder : undefined,
      photoFromFile: result.kind === 'profiley'
    });
    onClose();
  };

  const rows = result ? describe(result.data, result.customSections || []) : [];
  const isBackup = result?.kind === 'profiley';

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-[2px] animate-fade max-sm:p-0 sm:items-center" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="import-title" className="flex max-h-[90dvh] w-full max-w-lg animate-pop flex-col rounded-3xl border border-line bg-panel shadow-pop max-sm:max-h-[92dvh] max-sm:max-w-none max-sm:animate-sheet max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0">
        <span aria-hidden="true" className="mx-auto mt-3 block h-1 w-10 shrink-0 rounded-full bg-line-strong sm:hidden" />
        <div className="flex items-start justify-between gap-4 p-6 pb-3 max-sm:px-5 max-sm:pt-4">
          <div>
            <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent-ink"><FileUp size={18} /></span>
            <h2 id="import-title" className="font-display text-[28px] leading-none tracking-tight text-ink">Import a resume</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-3">Start from a PDF, text, or a JSON file. You'll review it before anything changes.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="btn btn-ghost btn-icon -mr-2 -mt-1"><X size={18} /></button>
        </div>

        <div className="scroll-quiet min-h-0 flex-1 overflow-y-auto px-6 pb-6 max-sm:px-5 max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {stage === 'pick' && (
            <div className="space-y-4">
              <Segmented value={mode} onChange={setMode} options={[{ value: 'file', label: 'Upload a file' }, { value: 'paste', label: 'Paste text' }]} />

              {mode === 'file' ? (
                <>
                  <input ref={fileInputRef} type="file" accept=".pdf,.json,.txt,.md,application/pdf,application/json,text/plain" className="hidden" onChange={(e) => { readFile(e.target.files?.[0]); e.target.value = ''; }} aria-label="Choose a resume file" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); readFile(e.dataTransfer.files?.[0]); }}
                    className="flex w-full flex-col items-center gap-2 rounded-2xl border border-dashed border-line-strong px-5 py-9 text-center transition-colors duration-200 ease-snap hover:border-accent hover:bg-accent-soft/40"
                  >
                    <FileText size={24} className="text-ink-3" />
                    <span className="text-[13px] font-medium text-ink">Drop a file here, or click to choose</span>
                    <span className="text-xs text-ink-3">PDF · JSON (Profiley backup or JSON Resume) · TXT</span>
                  </button>
                </>
              ) : (
                <div>
                  <label htmlFor="import-paste" className="label">Resume text</label>
                  <textarea id="import-paste" className="input" rows={9} value={pasted} onChange={(e) => setPasted(e.target.value)} placeholder="Paste the text of your resume, for example from Word or LinkedIn." />
                  <button className="btn btn-primary mt-3 h-10 w-full" onClick={readPasted} disabled={pasted.trim().length < 80}>Read it</button>
                </div>
              )}

              <div className="rounded-2xl border border-line bg-sunken/40 px-3.5 py-1">
                <Toggle
                  label="Read with the AI assistant"
                  hint={ai.ready ? 'More accurate, especially for columns. Sends the text to Anthropic.' : 'Needs a connection to the assistant (below).'}
                  value={useAi && ai.ready}
                  onChange={(v) => setUseAi(v)}
                />
              </div>
              {!ai.ready && ai.status !== 'checking' && <AiSetup ai={ai} compact />}
              {!(useAi && ai.ready) && <p className="hint !mt-0">Without AI, a basic reader on your device handles the file. It works best on single-column resumes.</p>}
            </div>
          )}

          {stage === 'reading' && (
            <div className="flex flex-col items-center gap-3 py-12 text-center" role="status">
              <Loader2 size={26} className="animate-spin text-accent" />
              <p className="text-[13px] text-ink-2">Reading {fileName || 'your resume'}…</p>
              <button className="btn btn-ghost btn-sm" onClick={reset}>Cancel</button>
            </div>
          )}

          {stage === 'error' && (
            <div className="space-y-4">
              <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger-soft px-3.5 py-3 text-[13px] leading-relaxed text-danger"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{error}</p>
              <button className="btn btn-secondary w-full" onClick={reset}>Try another file</button>
            </div>
          )}

          {stage === 'review' && result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[13px] text-ink-2">
                <CheckCircle2 size={16} className="text-accent" />
                <span className="truncate">{fileName}</span>
                <span className="ml-auto shrink-0 rounded-md bg-accent-soft px-1.5 py-0.5 font-numeric text-[10px] uppercase tracking-wider text-accent-ink">
                  {result.method === 'ai' ? 'Read by AI' : result.method === 'basic' ? 'Basic reader' : result.method === 'jsonresume' ? 'JSON Resume' : 'Profiley backup'}
                </span>
              </div>

              <dl className="card divide-y divide-line">
                {rows.map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 px-3.5 py-2">
                    <dt className="text-xs text-ink-3">{label}</dt>
                    <dd className={`min-w-0 truncate text-right text-[13px] ${value === 'not found' || value === '0' ? 'text-ink-3' : 'text-ink'}`}>{value}</dd>
                  </div>
                ))}
              </dl>

              {result.method === 'basic' && (
                <div className="space-y-2.5 rounded-xl border border-line bg-sunken/40 px-3.5 py-3">
                  <p className="text-xs leading-relaxed text-ink-2">The basic reader guesses where things belong, so check the result after importing. Multi-column resumes are the hardest.</p>
                  {ai.ready && result.rereadable && <button className="btn btn-secondary btn-sm" onClick={rereadWithAi}><Sparkles size={14} /> Read again with AI</button>}
                </div>
              )}

              {isBackup && result.config && (
                <div className="rounded-xl border border-line bg-sunken/40 px-3.5 py-1">
                  <Toggle label="Also restore the design" hint="Template, colours and section order from the backup." value={restoreDesign} onChange={setRestoreDesign} />
                </div>
              )}

              <p className="hint">This replaces the content of your current resume. You can undo it right after.</p>
              <div className="flex gap-2">
                <button className="btn btn-primary h-10 flex-1" onClick={apply}>Replace my resume</button>
                <button className="btn btn-secondary h-10" onClick={reset}>Back</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
