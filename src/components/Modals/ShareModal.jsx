import React, { useEffect, useRef } from 'react';
import { X, Link as LinkIcon, Loader2, Copy, Check, Share2 } from 'lucide-react';

const ShareModal = ({
  isOpen, onClose, customSlug, setCustomSlug, shareError,
  handleGenerateLink, isGeneratingLink, shareUrl, linkCopied, handleCopyShareUrl
}) => {
  const dialogRef = useRef(null);

  // Escape closes, Tab stays inside the dialog, and focus returns to what opened it.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll('button:not([disabled]), input, a[href]');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      opener?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-[2px] animate-fade max-sm:p-0 sm:items-center"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        className="w-full max-w-md animate-pop rounded-3xl border border-line bg-panel p-6 shadow-pop max-sm:max-w-none max-sm:animate-sheet max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0 max-sm:px-5 max-sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-sm:pt-3"
      >
        <span aria-hidden="true" className="mx-auto mb-4 block h-1 w-10 rounded-full bg-line-strong sm:hidden" />
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent-ink"><LinkIcon size={18} /></span>
            <h2 id="share-modal-title" className="font-display text-[28px] leading-none tracking-tight text-ink">Share your resume</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
              Anyone with the link can view a read-only copy. It's a snapshot, so later edits won't change it.
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="btn btn-ghost btn-icon -mr-2 -mt-1"><X size={18} /></button>
        </div>

        {shareUrl ? (
          <>
            <label htmlFor="share-url" className="label">Your link {linkCopied && <span className="font-normal text-accent-ink">· copied</span>}</label>
            <div className="flex gap-2">
              <input id="share-url" readOnly value={shareUrl} onFocus={(e) => e.target.select()} className="input font-numeric text-[13px]" />
              <button onClick={handleCopyShareUrl} className="btn btn-primary btn-icon !h-10 !w-10 max-sm:!h-[2.875rem] max-sm:!w-[2.875rem]" aria-label="Copy link">
                {linkCopied ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                type="button"
                onClick={() => navigator.share({ title: 'My resume', url: shareUrl }).catch(() => {})}
                className="btn btn-primary mt-3 h-12 w-full sm:hidden"
              >
                <Share2 size={17} /> Send with…
              </button>
            )}
            <button onClick={onClose} className="btn btn-secondary mt-3 h-10 w-full max-sm:h-12">Done</button>
          </>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleGenerateLink(); }}>
            <label htmlFor="share-slug" className="label">Custom address <span className="font-normal text-ink-3">(optional)</span></label>
            <div className="flex items-stretch max-sm:flex-col max-sm:gap-1.5">
              <span className="flex items-center truncate rounded-l-xl border border-r-0 border-line bg-sunken px-3 font-numeric text-[13px] text-ink-3 max-sm:rounded-xl max-sm:border max-sm:py-2">{window.location.host}/</span>
              <input
                id="share-slug"
                autoFocus={!window.matchMedia('(pointer: coarse)').matches}
                enterKeyHint="go"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="priya-raman"
                maxLength={64}
                autoCapitalize="none"
                spellCheck={false}
                aria-describedby={shareError ? 'share-error' : undefined}
                aria-invalid={shareError ? true : undefined}
                className="input min-w-0 !rounded-l-none max-sm:!rounded-xl"
              />
            </div>
            {shareError && <p id="share-error" role="alert" className="mt-2 text-xs font-medium text-danger">{shareError}</p>}
            <button type="submit" disabled={isGeneratingLink} className="btn btn-primary mt-5 h-10 w-full max-sm:h-12">
              {isGeneratingLink && <Loader2 size={16} className="animate-spin" />}
              {isGeneratingLink ? 'Creating...' : 'Create link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
