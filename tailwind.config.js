/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // The Typography picker stores these class names; fonts are loaded in index.html.
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        merriweather: ['Merriweather', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        lora: ['Lora', 'Georgia', 'serif'],
        raleway: ['Raleway', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        oswald: ['Oswald', 'Impact', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}