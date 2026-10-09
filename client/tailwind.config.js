/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        parchment: '#FAF7F2',
        surface: '#FFFFFF',
        ink: '#1C1917',
        stoneMuted: '#78716C',
        borderParchment: '#E8E4DC',
        amberWarm: '#D97706',
        emeraldSoft: '#059669',
        emeraldLight: '#ECFDF5',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        editorial: '0 8px 30px rgba(0, 0, 0, 0.03)',
        subtle: '0 1px 3px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
