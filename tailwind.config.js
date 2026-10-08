/** @type {import('tailwindcss').Config} */

// App chrome colours are CSS variables (see index.css) so one class works in light and dark.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        panel: token('panel'),
        surface: token('surface'),
        sunken: token('sunken'),
        line: token('line'),
        'line-strong': token('line-strong'),
        ink: token('ink'),
        'ink-2': token('ink-2'),
        'ink-3': token('ink-3'),
        accent: token('accent'),
        'accent-hover': token('accent-hover'),
        'accent-soft': token('accent-soft'),
        'accent-fg': token('accent-fg'),
        'accent-ink': token('accent-ink'),
        danger: token('danger'),
        'danger-soft': token('danger-soft'),
      },
      fontFamily: {
        // App chrome
        ui: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        numeric: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        // Resume fonts: the Typography picker stores these class names; fonts are loaded in index.html.
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        merriweather: ['Merriweather', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        lora: ['Lora', 'Georgia', 'serif'],
        raleway: ['Raleway', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        oswald: ['Oswald', 'Impact', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        grotesk: ['"Bricolage Grotesque"', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        pop: 'var(--shadow-pop)',
        paper: 'var(--shadow-paper)',
      },
      transitionTimingFunction: {
        snap: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fade: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pop: {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        sheet: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 420ms cubic-bezier(0.32, 0.72, 0, 1) both',
        fade: 'fade 240ms ease-out both',
        pop: 'pop 260ms cubic-bezier(0.32, 0.72, 0, 1) both',
        shimmer: 'shimmer 1.6s infinite',
        sheet: 'sheet 340ms cubic-bezier(0.32, 0.72, 0, 1) both',
      },
    },
  },
  plugins: [
    // Keep these in step with src/utils/layout.js.
    ({ addVariant }) => {
      addVariant('phone', '@media (max-width: 767px), (pointer: coarse) and (max-height: 500px)');
      addVariant('desk', ['@media (min-width: 768px) and (min-height: 501px)', '@media (min-width: 768px) and (pointer: fine)']);
      addVariant('land', '@media (pointer: coarse) and (max-height: 500px)');
    },
  ],
}
