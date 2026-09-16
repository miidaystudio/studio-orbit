'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

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
    { label: 'Projects', href: '/projects' },
    { label: 'Visual QA Staging', href: '/staging' },
    { label: 'Clients', href: '/clients' },
    { label: 'Invoices & Retainers', href: '/invoices' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F9] text-[#0F172A] flex flex-col selection:bg-[#6366F1] selection:text-white font-sans">
      {/* Modern Digital Productivity Sticky Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#F7F7F9]/90 backdrop-blur-md border-b border-black/[0.06] px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/projects" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-white border border-black/[0.08] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="StudioOrbit Logo"
                className="w-5 h-5 rounded-md object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-[#0F172A]">
                StudioOrbit
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium">
                v2.0
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-black/[0.03] rounded-full border border-black/[0.04]">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-medium px-4 py-1.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-white text-[#0F172A] shadow-sm font-semibold'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Session User Controls */}
        {!loading && (
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-3 p-1 rounded-full hover:bg-black/[0.04] transition-colors group focus:outline-none"
                  aria-expanded={dropdownOpen}
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-[#0F172A] group-hover:text-[#6366F1] transition-colors">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-mono text-[#64748B] uppercase">
                      {user.role}
                    </p>
                  </div>
                  
                  {/* Circular Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#6366F1] text-white font-mono text-xs font-bold flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    {user.initials}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-black/[0.08] rounded-2xl shadow-[0_20px_40px_-15px_rgba(15,23,42,0.08)] p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="pb-3 border-b border-black/[0.06]">
                      <p className="text-xs font-semibold text-[#0F172A]">{user.name}</p>
                      <p className="text-[11px] text-[#64748B] truncate font-mono">{user.email}</p>
                      <span className="inline-block mt-2 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium">
                        {user.role}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/projects"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full text-left px-3 py-2 text-xs font-medium text-[#0F172A] hover:bg-[#F7F7F9] rounded-xl transition"
                      >
                        Studio Cockpit
                      </Link>
                      <Link
                        href="/staging"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full text-left px-3 py-2 text-xs font-medium text-[#0F172A] hover:bg-[#F7F7F9] rounded-xl transition"
                      >
                        Visual QA Staging
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-black/[0.06]">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition flex items-center justify-between"
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
                className="px-4 py-2 rounded-full bg-[#0F172A] hover:bg-[#6366F1] text-white text-xs font-medium tracking-wide transition-all shadow-sm flex items-center gap-1.5 group active:scale-95"
              >
                <span>Sign In</span>
                <span className="font-serif italic text-sm group-hover:translate-x-0.5 transition-transform">↗</span>
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}

