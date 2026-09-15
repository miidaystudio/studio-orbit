/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FAF8F5',
          100: '#F4F0E8',
          200: '#E9E2D3',
          300: '#D8CDB6',
          400: '#BDB094',
          500: '#9B8C6E',
          600: '#7B6E53',
          700: '#5E533E',
          800: '#433B2C',
          900: '#2A241B',
          950: '#17140F',
        },
        editorial: {
          accent: '#C85A32', // Terracotta editorial accent
          dark: '#121212',
          muted: '#8E8E93',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        parchment: '0 4px 20px -2px rgba(42, 36, 27, 0.08)',
        canvas: '0 20px 40px -15px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
