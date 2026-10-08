import React, { useId } from 'react';
import { Check, ChevronDown } from 'lucide-react';

/** Label + control wrapper that wires the label to its input. */
export const Field = ({ label, hint, error, optional = false, children, className = '' }) => {
  const id = useId();
  const control = React.isValidElement(children)
    ? React.cloneElement(children, { id, 'aria-describedby': hint || error ? `${id}-note` : undefined, 'aria-invalid': error ? true : undefined })
    : children;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
          {optional && <span className="ml-1 font-normal text-ink-3">(optional)</span>}
        </label>
      )}
      {control}
      {(hint || error) && (
        <p id={`${id}-note`} className={`hint ${error ? '!text-danger' : ''}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
};

export const TextField = ({ label, hint, error, optional, className = '', ...props }) => (
  <Field label={label} hint={hint} error={error} optional={optional} className={className}>
    <input className="input" {...props} />
  </Field>
);

export const TextAreaField = ({ label, hint, error, optional, className = '', ...props }) => (
  <Field label={label} hint={hint} error={error} optional={optional} className={className}>
    <textarea className="input" {...props} />
  </Field>
);

/** Native <select> with the app's styling (keeps mobile pickers and a11y for free). */
export const SelectField = ({ label, value, onChange, options, className = '' }) => (
  <Field label={label} className={className}>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input cursor-pointer appearance-none pr-9"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-3" />
    </div>
  </Field>
);

/** Single-choice pill group. Each option: { value, label, icon? }. */
export const Segmented = ({ label, value, onChange, options, className = '' }) => {
  const id = useId();
  return (
    <div className={className} role="group" aria-labelledby={label ? id : undefined}>
      {label && <span id={id} className="label">{label}</span>}
      <div className="seg">
        {options.map(({ value: v, label: text, icon: Icon, title }) => (
          <button
            key={v}
            type="button"
            className="seg-item"
            aria-pressed={value === v}
            title={title || text}
            onClick={() => onChange(v)}
          >
            {Icon && <Icon size={14} />}
            {text && <span>{text}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

/** Switch row: label (+ optional hint) on the left, control on the right. */
export const Toggle = ({ label, hint, value, onChange }) => {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="min-w-0">
        <span id={id} className="block text-[13px] font-medium text-ink">{label}</span>
        {hint && <span className="block text-xs text-ink-3">{hint}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={Boolean(value)}
        aria-labelledby={id}
        onClick={() => onChange(!value)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 ease-snap ${value ? 'bg-accent' : 'bg-line-strong'}`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.3)] transition-transform duration-200 ease-snap ${value ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
};

/** Colour swatch used by the palette picker. */
export const Swatch = ({ theme, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={theme.name}
    aria-label={`${theme.name} colour`}
    aria-pressed={selected}
    className={`group relative grid h-9 w-9 place-items-center rounded-full transition-transform duration-200 ease-snap hover:scale-110 active:scale-95 ${selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : ''}`}
  >
    <span className={`absolute inset-0 rounded-full ${theme.hex}`} />
    {selected && <Check size={15} strokeWidth={3} className="relative text-white drop-shadow" />}
  </button>
);

/** Collapsible group used to keep long panels scannable. */
export const Group = ({ title, meta, defaultOpen = true, children }) => (
  <details open={defaultOpen} className="group border-b border-line last:border-b-0">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 [&::-webkit-details-marker]:hidden">
      <span className="text-[13px] font-semibold text-ink">{title}</span>
      <span className="flex items-center gap-2 text-xs text-ink-3">
        {meta}
        <ChevronDown size={16} className="transition-transform duration-200 ease-snap group-open:rotate-180" />
      </span>
    </summary>
    <div className="space-y-4 pb-5">{children}</div>
  </details>
);

export const PanelHeading = ({ title, subtitle, action }) => (
  <div className="mb-4 flex items-end justify-between gap-3">
    <div className="min-w-0">
      <h2 className="font-display text-[26px] leading-none tracking-tight text-ink">{title}</h2>
      {subtitle && <p className="mt-1.5 text-[13px] text-ink-3">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const EmptyState = ({ icon: Icon, title, text, action }) => (
  <div className="rounded-2xl border border-dashed border-line-strong px-5 py-8 text-center">
    {Icon && <Icon size={22} className="mx-auto mb-2 text-ink-3" />}
    <p className="text-sm font-medium text-ink">{title}</p>
    {text && <p className="mx-auto mt-1 max-w-[16rem] text-xs text-ink-3">{text}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
