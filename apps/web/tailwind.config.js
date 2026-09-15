const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, './app/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, './components/**/*.{js,ts,jsx,tsx,mdx}'),
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/(dashboard)/**/*.{js,ts,jsx,tsx,mdx}',
    './app/(dashboard)/projects/*.{js,ts,jsx,tsx,mdx}',
    './app/(dashboard)/invoices/*.{js,ts,jsx,tsx,mdx}',
    './app/(dashboard)/clients/*.{js,ts,jsx,tsx,mdx}',
    './app/(portal)/**/*.{js,ts,jsx,tsx,mdx}',
    './app/(auth)/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#F9F8F3',
          50: '#FAF9F6',
          100: '#F9F8F3',
          200: '#F4F0E8',
          300: '#E5E2DA',
          400: '#C8C4B9',
          500: '#9B9688',
        },
        ink: {
          DEFAULT: '#121212',
          dark: '#121212',
          muted: '#686661',
          light: '#8A8780',
        },
        terracotta: {
          DEFAULT: '#C85A32',
          hover: '#B04B27',
          light: '#FDF3E9',
        },
        hairline: '#E5E2DA',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Instrument Serif', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        editorial: '0 4px 20px -2px rgba(18, 18, 18, 0.03)',
        canvas: '0 20px 40px -15px rgba(0, 0, 0, 0.25)',
      },
      borderColor: {
        DEFAULT: '#E5E2DA',
      },
    },
  },
  plugins: [],
};
