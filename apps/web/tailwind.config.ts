import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vaultGreen: '#2E5B4B',
        vaultGreenHover: '#23473A',
        vaultPeach: '#F3D5C5',
        vaultCharcoal: '#0F1115',
        vaultBone: '#F8F9FA',
        vaultBorder: '#E5E7EB',
        vaultMuted: '#6B7280',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        heading: ['var(--font-heading)', 'Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'vault-pill': '0 12px 28px -4px rgba(46, 91, 75, 0.38)',
        'vault-card': '0 20px 40px -15px rgba(15, 17, 21, 0.06)',
        'vault-subtle': '0 2px 12px rgba(15, 17, 21, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
