import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        porcelain: '#F7F7F9',
        slate: {
          ink: '#0F172A',
          muted: '#64748B',
          faint: '#94A3B8',
        },
        candy: {
          violet: '#6366F1',
          coral: '#F43F5E',
          blue: '#3B82F6',
          emerald: '#10B981',
        },
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
        amie: '0 20px 40px -15px rgba(15, 23, 42, 0.06)',
        subtle: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;


