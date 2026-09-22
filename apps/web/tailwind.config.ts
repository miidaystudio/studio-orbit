import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pitchBlack: '#08090A',
        tacticalDark: '#111315',
        tacticalPanel: '#16181B',
        tacticalBorder: '#22252A',
        cyberLime: '#CCFF00',
        tacticalAsh: '#828892',
        mineralSlate: '#828892',
        headerSlate: '#111315',
        deepIndigo: '#08090A',
        panelIndigo: '#111315',
        panelAlt: '#16181B',
        cardPrimary: '#111315',
        cardSecondary: '#16181B',
        paleOyster: '#FFFFFF',
        textDarkMuted: '#828892',
        textLightMuted: '#828892',
        acidLime: '#CCFF00',
        hairlineBorder: 'rgba(255, 255, 255, 0.08)',
        terracotta: '#CCFF00',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['var(--font-serif)', 'Instrument Serif', 'serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        editorial: '0 20px 40px -15px rgba(22, 32, 42, 0.15)',
        canvas: '0 25px 50px -12px rgba(11, 15, 20, 0.35)',
        subtle: '0 4px 20px -2px rgba(22, 32, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
