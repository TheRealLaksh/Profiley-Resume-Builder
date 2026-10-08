import React, { useState } from 'react';
import { KeyRound, Sparkles, Trash2 } from 'lucide-react';
import { MODEL_CHOICES, getUserKey, getUserModel, setUserKey, setUserModel } from '../../../ai/client';

/** Lets a person bring their own Anthropic key when the site has no built-in assistant. */
const AiSetup = ({ ai, compact = false }) => {
  const [draft, setDraft] = useState('');
  const [model, setModel] = useState(getUserModel());
  const key = getUserKey();

  const save = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setUserKey(draft);
    setDraft('');
    ai.refresh();
  };
  const remove = () => { setUserKey(''); ai.refresh(); };
  const changeModel = (id) => { setModel(id); setUserModel(id); };

  if (ai.status === 'checking') return <div className="skeleton h-14 w-full" aria-label="Checking assistant" />;

  return (
    <div className={`card ${compact ? 'p-3.5' : 'p-4'}`}>
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-ink"><Sparkles size={17} /></span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] font-semibold text-ink">
            {ai.serverAvailable ? 'Assistant ready' : key ? 'Using your own API key' : 'Connect the assistant'}
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-3">
            {ai.serverAvailable
              ? 'This site includes a built-in assistant. Nothing to set up.'
              : key
                ? <>Key ending <span className="font-numeric">…{key.slice(-4)}</span>. It stays in this browser and is sent only to Anthropic.</>
                : 'This site has no built-in assistant, so bring your own Anthropic API key. It stays in this browser and is sent only to Anthropic.'}
          </p>
        </div>
      </div>

      {!ai.serverAvailable && !key && (
        <form onSubmit={save} className="mt-3.5 space-y-2.5">
          <label htmlFor="ai-key" className="sr-only">Anthropic API key</label>
          <div className="flex gap-2">
            <input
              id="ai-key"
              type="password"
              autoComplete="off"
              spellCheck={false}
              className="input font-numeric text-[13px] phone:text-base"
              placeholder="sk-ant-..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit" className="btn btn-primary shrink-0" disabled={!draft.trim()}><KeyRound size={15} /> Save</button>
          </div>
          <p className="hint !mt-0">
            Create one at <a className="text-accent-ink underline underline-offset-2" href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">console.anthropic.com</a>. You pay Anthropic directly for what you use, usually a few cents per analysis.
          </p>
        </form>
      )}

      {!ai.serverAvailable && key && (
        <div className="mt-3.5 flex items-center gap-2">
          <label htmlFor="ai-model" className="sr-only">Model</label>
          <select id="ai-model" className="input !h-9 text-[13px]" value={model} onChange={(e) => changeModel(e.target.value)}>
            {MODEL_CHOICES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
          <button type="button" className="btn btn-ghost btn-danger btn-sm shrink-0" onClick={remove}><Trash2 size={14} /> Remove key</button>
        </div>
      )}
    </div>
  );
};

export default AiSetup;
