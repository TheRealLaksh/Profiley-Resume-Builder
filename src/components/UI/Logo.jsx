import React from 'react';

const Logo = ({ size = 'md' }) => (
  <span className="inline-flex items-center gap-2.5">
    <span
      aria-hidden="true"
      className={`grid place-items-center rounded-lg bg-accent font-display leading-none text-accent-fg ${size === 'md' ? 'h-7 w-7 text-[19px]' : 'h-6 w-6 text-[17px]'}`}
    >
      P
    </span>
    <span className={`font-display leading-none tracking-tight text-ink ${size === 'md' ? 'text-[24px]' : 'text-[21px]'}`}>Profiley</span>
  </span>
);

export default Logo;
