'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Projects', href: '/projects' },
    { label: 'Clients', href: '/clients' },
    { label: 'Invoices & Retainers', href: '/invoices' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F3] flex flex-col">
      {/* Sticky Editorial Header */}
      <header className="sticky top-0 z-40 bg-[#F9F8F3]/90 backdrop-blur-md border-b border-[#E5E2DA] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/projects" className="flex items-center gap-2 group">
            <span className="w-3 h-3 rounded-full bg-[#C85A32] group-hover:scale-110 transition" />
            <span className="text-sm font-bold uppercase tracking-widest text-[#121212]">Orbit Studio</span>
          </Link>

          <nav className="flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-medium uppercase tracking-wider transition ${
                    isActive
                      ? 'text-[#C85A32] border-b-2 border-[#C85A32] pb-1'
                      : 'text-[#686661] hover:text-[#121212]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-[#121212]">Alex Rivera</p>
            <p className="text-[10px] font-mono text-[#686661]">STUDIO_ADMIN</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            alt="Alex Rivera Avatar"
            className="w-8 h-8 rounded-full border border-[#E5E2DA] object-cover"
          />
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        {children}
      </main>
    </div>
  );
}
