'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ChevronDown, Layers, LayoutDashboard, Sliders, ShieldCheck, LogOut, ExternalLink, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F9F9F9] text-[#111111] flex flex-col selection:bg-[#346853] selection:text-white font-sans antialiased">
      {/* Vault Minimalist Editorial Sticky Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#F9F9F9]/90 backdrop-blur-md border-b border-gray-200/80 px-6 sm:px-12 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-8">
          <Link href="/projects" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-[#346853] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
              <div className="w-3.5 h-3.5 rounded-sm bg-white/20 border border-white/60" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold font-heading tracking-tight uppercase text-[#111111]">
                STUDIO<span className="text-[#346853]">ORBIT</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-[#346853] border border-emerald-200 font-bold">
                COCKPIT
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-white rounded-full border border-gray-200 shadow-xs">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-gray-600 hover:text-[#111111] hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Controls & Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-semibold text-gray-600 hover:text-[#346853] transition hidden sm:inline-flex items-center gap-1"
          >
            <span>Live Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 transition-colors group focus:outline-none"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-[#111111] group-hover:text-[#346853] transition-colors">
                        {user.name}
                      </p>
                      <p className="text-[10px] font-mono text-gray-500 uppercase">
                        {user.role}
                      </p>
                    </div>

                    {/* Circular Avatar */}
                    <div className="w-9 h-9 rounded-full bg-[#111111] text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs group-hover:bg-[#346853] transition-colors">
                      {user.initials}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-3xl shadow-xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-[#111111]">
                      <div className="pb-3 border-b border-gray-100">
                        <p className="text-xs font-bold text-[#111111]">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate font-mono">{user.email}</p>
                        <span className="inline-block mt-2 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-[#346853] border border-emerald-200 font-bold">
                          {user.role}
                        </span>
                      </div>

                      <div className="space-y-1 font-sans text-xs font-medium">
                        <Link
                          href="/projects"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-3 py-2 text-xs text-[#111111] hover:bg-gray-50 rounded-xl transition"
                        >
                          Studio Cockpit (Overview)
                        </Link>
                        <Link
                          href="/staging"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-3 py-2 text-xs text-[#111111] hover:bg-gray-50 rounded-xl transition"
                        >
                          Review Sandbox
                        </Link>
                        <Link
                          href="/launch-brand"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-3 py-2 text-xs text-[#111111] hover:bg-gray-50 rounded-xl transition"
                        >
                          Launch & Brand
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full py-2 px-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl text-left transition flex items-center justify-between"
                        >
                          <span>Sign Out</span>
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full bg-[#111111] hover:bg-[#346853] text-white text-xs font-bold transition shadow-xs"
                >
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </header>

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-12 space-y-8">
        {children}
      </main>
    </div>
  );
}
