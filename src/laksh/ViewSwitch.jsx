import React from 'react';

// On/off switch between the standard Profiley view (default) and the creative page.
// Plain links so it also works without JavaScript state; the creative page is /laksh?view=creative.
export const CREATIVE_URL = '/laksh?view=creative';
export const STANDARD_URL = '/laksh';

export default function ViewSwitch({ creative = false, className = '' }) {
  return (
    <a
      href={creative ? STANDARD_URL : CREATIVE_URL}
      role="switch"
      aria-checked={creative}
      aria-label="Creative view"
      title={creative ? 'Back to the standard resume' : 'Switch to the creative view'}
      className={`lk-switch ${className}`}
      data-on={creative}
    >
      <span className="lk-switch-label">Creative view</span>
      <span className="lk-switch-track"><span className="lk-switch-thumb" /></span>
    </a>
  );
}
