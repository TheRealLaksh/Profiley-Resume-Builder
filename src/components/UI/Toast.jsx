import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';

/** `action` is { label, onClick }, e.g. Undo after deleting something. */
const Toast = ({ show, message, variant = 'success', action, onAction }) => {
  if (!show) return null;

  const isError = variant === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-[110] flex justify-center px-4 md:bottom-8"
    >
      <div className="pointer-events-auto flex max-w-[34rem] animate-pop items-center gap-3 rounded-2xl bg-ink py-2.5 pl-3.5 pr-2.5 text-canvas shadow-pop max-md:min-h-12 max-md:w-full">
        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-white ${isError ? 'bg-danger' : 'bg-accent'}`}>
          {isError ? <AlertTriangle size={11} strokeWidth={3} /> : <Check size={11} strokeWidth={3.5} />}
        </span>
        <span className="text-[13px] font-medium leading-snug max-md:flex-1 max-md:text-sm">{message}</span>
        {action && (
          <button
            onClick={onAction}
            className="ml-1 rounded-lg px-2.5 py-1 text-[13px] font-semibold underline decoration-canvas/40 underline-offset-4 transition-colors hover:bg-canvas/15 max-md:min-h-10 max-md:px-3.5 max-md:text-sm"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
