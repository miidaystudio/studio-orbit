import React from 'react';
import SanityCockpit from '@/components/audit/SanityCockpit';
import Link from 'next/link';

export default function PreLaunchAuditPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center pb-4 border-b border-black/[0.06]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#6366F1]">Audit Module</span>
          <h1 className="text-2xl font-bold text-[#0F172A]">Pre-Launch Sanity Cockpit</h1>
        </div>
        <Link
          href="/launch-brand"
          className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-semibold hover:bg-indigo-100 transition flex items-center gap-1.5"
        >
          <span>Open Launch & Brand Hub</span>
          <span>→</span>
        </Link>
      </div>
      <SanityCockpit />
    </div>
  );
}
