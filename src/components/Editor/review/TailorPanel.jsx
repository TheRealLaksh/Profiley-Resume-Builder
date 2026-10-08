import React, { useEffect, useRef, useState } from 'react';
import { Check, Loader2, Sparkles, X } from 'lucide-react';
import { AiError, runAiTask } from '../../../ai/client';
import { LIMITS, cleanTailorResult, resumeForAi } from '../../../ai/tasks';
import { diffWords } from '../../../utils/diff';
import { TextAreaField } from '../../UI/FormElements';
import AiSetup from './AiSetup';
import { ScoreRing } from './AtsPanel';

const STEPS = ['Reading the job post', 'Comparing it with your experience', 'Drafting honest rewrites'];

const IMPORTANCE = {
  high: { dot: 'bg-danger', label: 'Important' },
  medium: { dot: 'bg-amber-500', label: 'Useful' },
  low: { dot: 'bg-ink-3', label: 'Nice to have' }
};

const verdictLabel = (score) => (score >= 85 ? 'Strong match' : score >= 70 ? 'Good match' : score >= 50 ? 'Partial match' : 'Weak match');

// Light edits read best as an inline diff; when most of the text changed, interleaved
// strikethroughs turn into noise, so show the two versions one above the other instead.
const DiffText = ({ before, after }) => {
  const parts = diffWords(before, after);
  const kept = parts.filter((p) => p.type === 'same').reduce((n, p) => n + p.text.trim().split(/\s+/).filter(Boolean).length, 0);
  const total = Math.max(before.trim().split(/\s+/).length, after.trim().split(/\s+/).length, 1);
  const base = 'whitespace-pre-wrap rounded-xl px-3 py-2.5 text-xs leading-relaxed';

  if (kept / total < 0.5) {
    return (
      <div className="space-y-1.5">
        <div>
          <p className="eyebrow mb-1 px-0.5">Now</p>
          <p className={`${base} bg-sunken text-ink-3`}>{before}</p>
        </div>
        <div>
          <p className="eyebrow mb-1 px-0.5">Suggested</p>
          <p className={`${base} bg-accent-soft text-accent-ink`}>{after}</p>
        </div>
      </div>
    );
  }

  return (
    <p className={`${base} bg-sunken text-ink-2`}>
      {parts.map((part, i) =>
        part.type === 'same' ? <span key={i}>{part.text}</span>
        : part.type === 'add' ? <ins key={i} className="rounded-sm bg-accent-soft text-accent-ink no-underline">{part.text}</ins>
        : <del key={i} className="rounded-sm bg-danger-soft text-danger decoration-danger/50">{part.text}</del>
      )}
    </p>
  );
};

const TailorPanel = ({ data, setData, notifyUndo, ai }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [phase, setPhase] = useState('idle'); // idle | running | done | error
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [resolved, setResolved] = useState({}); // suggestion key -> 'accepted' | 'dismissed'
  const abortRef = useRef(null);

  useEffect(() => {
    if (phase !== 'running') return;
    const timer = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 5000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const analyze = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const resume = resumeForAi(data);

    setPhase('running');
    setStep(0);
    setError(null);
    setResolved({});
    try {
      const raw = await runAiTask('tailor', { jobDescription, resume }, { signal: controller.signal, serverAvailable: ai.serverAvailable });
      setResult(cleanTailorResult(raw, resume));
      setPhase('done');
    } catch (err) {
      if (err.name === 'AbortError') { setPhase(result ? 'done' : 'idle'); return; }
      setError(err instanceof AiError ? err : new AiError('failed', 'Something went wrong. Please try again.'));
      setPhase('error');
    }
  };

  const cancel = () => abortRef.current?.abort();

  // ---- applying suggestions ----
  const currentText = (s) =>
    s.target === 'headline' ? data.personal.title
    : s.target === 'summary' ? data.personal.summary
    : data.experience.find((e) => String(e.id) === s.experienceId)?.details ?? null;

  const isStale = (s) => currentText(s) === null || currentText(s).trim() !== s.original.trim();

  const apply = (s) => {
    setData((prev) => {
      if (s.target === 'headline') return { ...prev, personal: { ...prev.personal, title: s.suggested } };
      if (s.target === 'summary') return { ...prev, personal: { ...prev.personal, summary: s.suggested } };
      return { ...prev, experience: prev.experience.map((e) => (String(e.id) === s.experienceId ? { ...e, details: s.suggested } : e)) };
    });
    setResolved((r) => ({ ...r, [s.key]: 'accepted' }));
  };

  const accept = (s) => { apply(s); notifyUndo?.('Suggestion applied'); };
  const dismiss = (s) => setResolved((r) => ({ ...r, [s.key]: 'dismissed' }));
  const open = result ? result.suggestions.filter((s) => !resolved[s.key]) : [];
  const acceptAll = () => {
    const fresh = open.filter((s) => !isStale(s));
    fresh.forEach(apply);
    notifyUndo?.(`${fresh.length} suggestions applied`);
  };

  const label = (s) => {
    if (s.target === 'headline') return 'Headline';
    if (s.target === 'summary') return 'Summary';
    const e = data.experience.find((x) => String(x.id) === s.experienceId);
    return e ? `${e.role || 'Role'}${e.company ? ` · ${e.company}` : ''}` : 'Experience';
  };

  // ---- render ----
  if (!ai.ready && ai.status !== 'checking') return <AiSetup ai={ai} />;
  if (ai.status === 'checking') return <div className="skeleton h-14 w-full" />;

  return (
    <div className="space-y-5">
      {phase !== 'done' && (
        <div className="space-y-3">
          <TextAreaField
            label="Job description"
            rows={9}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={phase === 'running'}
            maxLength={LIMITS.jobDescription}
            placeholder="Paste the whole job post here: responsibilities, requirements, the lot."
            hint={`${jobDescription.length.toLocaleString()} / ${LIMITS.jobDescription.toLocaleString()} characters`}
          />

          {phase === 'running' ? (
            <div className="card flex items-center gap-3 p-3.5" role="status">
              <Loader2 size={18} className="animate-spin text-accent" />
              <p className="flex-1 text-[13px] text-ink-2">{STEPS[step]}…</p>
              <button className="btn btn-ghost btn-sm" onClick={cancel}>Cancel</button>
            </div>
          ) : (
            <button className="btn btn-primary h-10 w-full" onClick={analyze} disabled={jobDescription.trim().length < 40}>
              <Sparkles size={16} /> Analyse the match
            </button>
          )}

          {phase === 'error' && (
            <p role="alert" className="rounded-xl border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-xs leading-relaxed text-danger">{error?.message}</p>
          )}

          <p className="hint">
            Your resume's career content and the job post are sent to Anthropic to write the suggestions. Your contact details and photo are not. Nothing is stored. The assistant only rewords what you've already written and will not invent experience.
          </p>
        </div>
      )}

      {phase === 'done' && result && (
        <>
          <div className="card flex items-center gap-4 p-4">
            <ScoreRing score={result.matchScore} label={verdictLabel(result.matchScore)} caption="Job match" />
            <div className="min-w-0">
              <p className="eyebrow">Job match</p>
              <p className="font-display text-[26px] leading-tight text-ink">{verdictLabel(result.matchScore)}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-3">{result.verdict}</p>
            </div>
          </div>

          {result.matchedKeywords.length > 0 && (
            <section>
              <h3 className="eyebrow mb-2 px-1">Already in your resume</h3>
              <ul className="flex flex-wrap gap-1.5">
                {result.matchedKeywords.map((k) => <li key={k} className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-ink">{k}</li>)}
              </ul>
            </section>
          )}

          {result.missingKeywords.length > 0 && (
            <section>
              <h3 className="eyebrow mb-2 px-1">Missing from your resume</h3>
              <ul className="card divide-y divide-line">
                {result.missingKeywords.map((k) => (
                  <li key={k.keyword} className="flex items-start gap-3 px-3.5 py-2.5">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${IMPORTANCE[k.importance].dot}`} title={IMPORTANCE[k.importance].label} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-ink">{k.keyword} <span className="ml-1 text-[11px] font-normal text-ink-3">{IMPORTANCE[k.importance].label}</span></p>
                      {k.note && <p className="text-xs leading-relaxed text-ink-3">{k.note}</p>}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="hint px-1">Only add these if you really have the experience.</p>
            </section>
          )}

          <section>
            <div className="mb-2 flex items-center justify-between px-1">
              <h3 className="eyebrow">Suggested rewrites {open.length > 0 && `(${open.length})`}</h3>
              {open.filter((s) => !isStale(s)).length > 1 && (
                <button className="btn btn-ghost btn-sm" onClick={acceptAll}><Check size={14} /> Accept all</button>
              )}
            </div>

            {result.suggestions.length === 0 ? (
              <p className="card px-4 py-5 text-center text-[13px] text-ink-3">No rewrites needed. Your resume already speaks this job's language.</p>
            ) : (
              <ul className="space-y-3">
                {result.suggestions.map((s) => {
                  const state = resolved[s.key];
                  const stale = !state && isStale(s);
                  return (
                    <li key={s.key} className={`card p-3.5 transition-opacity duration-200 ${state ? 'opacity-55' : ''}`}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="truncate text-[13px] font-semibold text-ink">{label(s)}</p>
                        {state && <span className="font-numeric text-[11px] uppercase tracking-wider text-ink-3">{state}</span>}
                      </div>
                      <DiffText before={s.original} after={s.suggested} />
                      {s.reason && <p className="mt-2 text-xs leading-relaxed text-ink-3">{s.reason}</p>}
                      {!state && (
                        <div className="mt-3 flex items-center gap-2">
                          <button className="btn btn-primary btn-sm" onClick={() => accept(s)} disabled={stale} title={stale ? 'You edited this since the analysis. Run it again.' : undefined}><Check size={14} /> Accept</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => dismiss(s)}><X size={14} /> Dismiss</button>
                          {stale && <span className="text-xs text-ink-3">Edited since analysis</span>}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div className="flex gap-2">
            <button className="btn btn-secondary flex-1" onClick={analyze}><Sparkles size={15} /> Run again</button>
            <button className="btn btn-ghost" onClick={() => { setPhase('idle'); setResult(null); }}>New job</button>
          </div>
        </>
      )}

      {ai.status !== 'server' && <AiSetup ai={ai} compact />}
    </div>
  );
};

export default TailorPanel;
