'use client';

import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('studio_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('studio_theme', nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white/60 dark:bg-neutral-800/60" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === 'light' ? 'Switch to Dark mode' : 'Switch to Light mode'}
      aria-label="Toggle theme"
      className="relative p-2 rounded-full border border-black/[0.08] dark:border-white/[0.12] bg-white/80 dark:bg-neutral-900/80 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-[#0F172A] dark:text-[#F8FAFC] transition-all duration-200 shadow-sm active:scale-95 group focus:outline-none"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {theme === 'light' ? (
          /* Moon Icon for Light Mode (click to go dark) */
          <svg
            className="w-4 h-4 transition-transform duration-300 transform group-hover:rotate-12 text-[#0F172A]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          /* Sun Icon for Dark Mode (click to go light) */
          <svg
            className="w-4 h-4 transition-transform duration-300 transform group-hover:rotate-45 text-[#F8FAFC]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </div>
    </button>
  );
}
