import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, ArrowRight } from 'lucide-react';
import { readPaper, runChecks } from '../../../ats/analyze';
import { Segmented } from '../../UI/FormElements';

const STATUS = {
  pass: { icon: CheckCircle2, tone: 'text-accent', label: 'Pass' },
  info: { icon: Info, tone: 'text-ink-3', label: 'Tip' },
  warn: { icon: AlertTriangle, tone: 'text-amber-600 dark:text-amber-400', label: 'Warning' },
  fail: { icon: XCircle, tone: 'text-danger', label: 'Problem' }
};

export const ScoreRing = ({ score, label, caption = 'ATS score' }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const tone = score >= 90 ? 'text-accent' : score >= 75 ? 'text-accent' : score >= 55 ? 'text-amber-500' : 'text-danger';
  return (
    <div className="relative h-24 w-24 shrink-0" role="img" aria-label={`${caption} ${score} out of 100: ${label}`}>
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={radius} fill="none" strokeWidth="6" className="stroke-sunken" />
        <circle
          cx="40" cy="40" r={radius} fill="none" strokeWidth="6" strokeLinecap="round"
          className={`${tone} stroke-current transition-[stroke-dashoffset] duration-700 ease-snap`}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-[34px] leading-none tabular text-ink">{score}</span>
      </div>
    </div>
  );
};

const AtsPanel = ({ data, config, sectionOrder, onAction }) => {
  const [reading, setReading] = useState(null);
  const [view, setView] = useState('basic');

  // Measure the rendered page after edits settle (and once web fonts are in).
  useEffect(() => {
    const timer = setTimeout(async () => {
      await document.fonts?.ready;
      setReading(readPaper(document.querySelector('[data-resume-paper="main"]')));
    }, 350);
    return () => clearTimeout(timer);
  }, [data, config, sectionOrder]);

  const { score, label, checks } = runChecks({ data, config, sectionOrder, reading });
  const problems = checks.filter((c) => c.status === 'fail' || c.status === 'warn');
  const tips = checks.filter((c) => c.status === 'info');
  const passed = checks.filter((c) => c.status === 'pass');
  const lines = reading ? (view === 'basic' ? reading.basic : reading.smart.map((text) => ({ text, merged: false }))) : [];

  const renderCheck = (c) => {
    const { icon: Icon, tone, label: statusLabel } = STATUS[c.status];
    return (
      <li key={c.id} className="card p-3.5">
        <div className="flex items-start gap-3">
          <Icon size={18} className={`mt-0.5 shrink-0 ${tone}`} aria-label={statusLabel} />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-ink">{c.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-3">{c.detail}</p>
            {c.action && (
              <button className="btn btn-secondary btn-sm mt-2.5" onClick={() => onAction(c.action.id)}>
                {c.action.label} <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="space-y-5">
      <div className="card flex items-center gap-4 p-4">
        <ScoreRing score={score} label={label} />
        <div className="min-w-0">
          <p className="eyebrow">ATS readiness</p>
          <p className="font-display text-[26px] leading-tight text-ink">{label}</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-3">
            {problems.length === 0 ? 'Nothing is likely to trip up a parser.' : `${problems.length} ${problems.length === 1 ? 'thing' : 'things'} worth fixing before you apply.`}
          </p>
        </div>
      </div>

      {problems.length > 0 && (
        <section>
          <h3 className="eyebrow mb-2 px-1">To fix</h3>
          <ul className="space-y-2">{problems.map(renderCheck)}</ul>
        </section>
      )}
      {tips.length > 0 && (
        <section>
          <h3 className="eyebrow mb-2 px-1">Worth a look</h3>
          <ul className="space-y-2">{tips.map(renderCheck)}</ul>
        </section>
      )}
      {passed.length > 0 && (
        <section>
          <h3 className="eyebrow mb-2 px-1">Looking good</h3>
          <ul className="space-y-2">{passed.map(renderCheck)}</ul>
        </section>
      )}

      <section>
        <h3 className="eyebrow mb-1 px-1">What a parser reads</h3>
        <p className="mb-3 px-1 text-xs leading-relaxed text-ink-3">
          {view === 'basic'
            ? 'A basic parser reads left to right, top to bottom. A bar (▏) marks where two columns were joined into one line.'
            : 'A smarter parser follows the document structure, so columns stay separate.'}
        </p>
        <Segmented
          value={view}
          onChange={setView}
          options={[{ value: 'basic', label: 'Basic parser' }, { value: 'smart', label: 'Smart parser' }]}
        />
        <div className="mt-3 max-h-[26rem] overflow-auto rounded-2xl border border-line bg-sunken p-3 scroll-quiet" tabIndex={0} aria-label="Text as read by a parser">
          {reading ? (
            <ol className="space-y-px font-numeric text-[11px] leading-relaxed text-ink-2">
              {lines.map((line, i) => (
                <li key={i} className={`flex gap-3 rounded px-1 ${line.merged ? 'bg-amber-500/15 text-ink' : ''}`}>
                  <span className="w-6 shrink-0 select-none text-right text-ink-3">{i + 1}</span>
                  <span className="min-w-0 break-words">{line.text}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="skeleton h-24 w-full" />
          )}
        </div>
      </section>
    </div>
  );
};

export default AtsPanel;
