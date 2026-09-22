'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Overview', href: '/projects' },
    { label: 'Review Sandbox', href: '/staging' },
    { label: 'Launch & Brand', href: '/launch-brand' },
  ];

  return (
    <div className="min-h-screen bg-[#08090A] text-[#FFFFFF] flex flex-col selection:bg-[#CCFF00] selection:text-black font-sans">
      {/* Tactical Cyber-Techwear Sticky Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#08090A]/95 backdrop-blur-md border-b border-[#22252A] px-8 py-3.5 flex items-center justify-between text-[#FFFFFF] shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/projects" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-[#111315] border border-[#22252A] flex items-center justify-center shadow-sm group-hover:border-[#CCFF00] transition-colors">
              <img
                src="/favicon.jpg"
                alt="StudioOrbit Logo"
                className="w-5 h-5 rounded-md object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-[#FFFFFF]">
                StudioOrbit
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#111315] text-[#CCFF00] border border-[#22252A] font-semibold">
                v2.0
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-[#111315] rounded-full border border-[#22252A]">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-mono uppercase tracking-wider px-4 py-1.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-[#16181B] text-[#CCFF00] font-bold border border-[#22252A]'
                      : 'text-[#828892] hover:text-[#FFFFFF] hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Controls & Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {!loading && (
            <>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-3 p-1 rounded-full hover:bg-white/[0.05] transition-colors group focus:outline-none"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-semibold text-[#FFFFFF] group-hover:text-[#CCFF00] transition-colors">
                        {user.name}
                      </p>
                      <p className="text-[10px] font-mono text-[#828892] uppercase">
                        {user.role}
                      </p>
                    </div>

                    {/* Circular Avatar */}
                    <div className="w-8 h-8 rounded-full bg-[#111315] text-[#CCFF00] border border-[#22252A] font-mono text-xs font-bold flex items-center justify-center shadow-sm group-hover:border-[#CCFF00] transition-colors">
                      {user.initials}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-[#111315] border border-[#22252A] rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-[#FFFFFF]">
                      <div className="pb-3 border-b border-[#22252A]">
                        <p className="text-xs font-bold text-[#FFFFFF]">{user.name}</p>
                        <p className="text-[11px] text-[#828892] truncate font-mono">{user.email}</p>
                        <span className="inline-block mt-2 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#16181B] text-[#CCFF00] border border-[#22252A] font-medium">
                          {user.role}
                        </span>
                      </div>

                      <div className="space-y-1 font-mono text-xs">
                        <Link
                          href="/projects"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-3 py-2 text-xs font-medium text-[#FFFFFF] hover:bg-[#16181B] rounded-xl transition"
                        >
                          Studio Cockpit (Overview)
                        </Link>
                        <Link
                          href="/staging"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-3 py-2 text-xs font-medium text-[#FFFFFF] hover:bg-[#16181B] rounded-xl transition"
                        >
                          Review Sandbox
                        </Link>
                        <Link
                          href="/launch-brand"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-3 py-2 text-xs font-medium text-[#FFFFFF] hover:bg-[#16181B] rounded-xl transition"
                        >
                          Launch & Brand
                        </Link>
                        <Link
                          href="/clients"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-3 py-2 text-xs font-medium text-[#CCFF00] hover:bg-[#16181B] rounded-xl transition flex items-center justify-between"
                        >
                          <span>Client Directory</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#16181B] text-[#FFFFFF] border border-[#22252A]">Admin</span>
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-[#22252A]">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 rounded-xl transition flex items-center justify-between"
                        >
                          <span>Log Out ↗</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(204,255,0,0.3)] flex items-center gap-1.5 active:scale-95"
                >
                  <span>Sign In</span>
                  <span className="text-sm">→</span>
                </Link>
              )}
            </>
          )}
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}
