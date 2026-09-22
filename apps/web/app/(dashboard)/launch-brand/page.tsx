'use client';

import React, { useState } from 'react';
import SanityCockpit from '@/components/audit/SanityCockpit';
import BrandVaultPortal from '@/components/brand/BrandVaultPortal';

export default function LaunchAndBrandPage() {
  const [activeTab, setActiveTab] = useState<'audit' | 'brand'>('audit');

  return (
    <div className="space-y-8 max-w-7xl mx-auto selection:bg-[#6366F1] selection:text-white">
      {/* Header & Section Segmented Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/[0.06]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[11px] font-mono font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
            LAUNCH & BRAND GOVERNANCE HUB
          </div>
          <h1 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-[#0F172A]">
            Launch Cockpit & <span className="font-serif italic font-normal text-[#6366F1]">Brand Vault.</span>
          </h1>
          <p className="text-xs text-[#64748B] max-w-lg leading-relaxed">
            Automated OpenGraph SEO checks, social card previews, asset bloat audits, and active brand token governance.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-black/[0.04] rounded-full border border-black/[0.05]">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'audit'
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            🚀 Pre-Launch Sanity Cockpit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'brand'
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            🎨 Living Brand Vault
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'audit' ? (
        <SanityCockpit />
      ) : (
        <BrandVaultPortal />
      )}
    </div>
  );
}
