'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ProjectDeliverable {
  id: string;
  client: string;
  name: string;
  tagline: string;
  badgeToken: string;
  status: 'ACTIVE' | 'IN REVIEW' | 'COMPLETED';
  spentInCents: number;
  budgetInCents: number;
  token: string;
  assetId: string;
  pendingPinsCount?: number;
  featured?: boolean;
}

export default function ModernProductivityProjectsCockpitPage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const deliverables: ProjectDeliverable[] = [
    {
      id: 'proj-1',
      client: 'Lumina Tech',
      name: 'Lumina Brand & Portal System',
      tagline: 'Tactile design architectures, kinetic viewport telemetry, and bespoke design systems.',
      badgeToken: 'DEV-SYSTEM-01',
      status: 'ACTIVE',
      spentInCents: 1850000,
      budgetInCents: 3500000,
      token: 'lumina-portal-token-9988',
      assetId: 'asset-99',
      pendingPinsCount: 3,
      featured: true, // Violet gradient featured block
    },
    {
      id: 'proj-2',
      client: 'Aether Labs',
      name: 'Aether Mobile App Redesign',
      tagline: 'Kinetic scroll physics, gesture navigation, and real-time viewport coordinate pins.',
      badgeToken: 'DESIGN-QA-02',
      status: 'IN REVIEW',
      spentInCents: 4200000,
      budgetInCents: 5000000,
      token: 'aether-portal-token-1122',
      assetId: 'asset-88',
      pendingPinsCount: 1,
    },
    {
      id: 'proj-3',
      client: 'Kinesis Co',
      name: 'Kinesis E-Commerce System',
      tagline: 'Custom Stripe billing workflows & automated retainer burn-down ledger.',
      badgeToken: 'FINANCE-03',
      status: 'COMPLETED',
      spentInCents: 2800000,
      budgetInCents: 2800000,
      token: 'kinesis-portal-token-3344',
      assetId: 'asset-77',
      pendingPinsCount: 0,
    },
  ];

  const handleCopyMagicLink = (token: string) => {
    const url = `${window.location.origin}/portal/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-10 selection:bg-[#6366F1] selection:text-white">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-black/[0.06]">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[11px] font-mono font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
            COCKPIT • ACTIVE DELIVERABLES
          </div>

          <h1 className="text-4xl lg:text-5xl font-sans font-bold tracking-tight text-[#0F172A] leading-[1.08]">
            Active <span className="font-serif italic font-normal text-[#6366F1]">Deliverables.</span>
          </h1>

          <p className="text-sm text-[#64748B] max-w-xl leading-relaxed">
            Real-time staging telemetry, visual coordinate QA, and digital milestone sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/staging"
            className="px-4 py-2.5 rounded-full bg-white border border-black/[0.08] hover:bg-black/[0.02] text-xs font-medium text-[#0F172A] transition-all shadow-sm flex items-center gap-2"
          >
            <span>Staging QA</span>
            <span className="font-serif italic text-sm">↗</span>
          </Link>
          <button
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#0F172A] hover:bg-[#6366F1] text-white text-xs font-medium transition-all shadow-sm active:scale-95"
          >
            + New Deliverable
          </button>
        </div>
      </div>

      {/* Deliverables Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deliverables.map((item) => {
          const progressPercent = Math.min(100, Math.round((item.spentInCents / item.budgetInCents) * 100));

          if (item.featured) {
            // Vibrant Candy Violet Featured Card (#6366F1 -> #4F46E5)
            return (
              <div
                key={item.id}
                className="bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white rounded-3xl p-8 flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(99,102,241,0.25)] relative overflow-hidden group border border-indigo-400/30"
              >
                {/* Soft ambient background glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono tracking-wider text-white/80 uppercase">
                      {item.client}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20">
                      ● {item.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 block">
                      [{item.badgeToken}]
                    </span>
                    <h3 className="text-3xl font-sans font-bold leading-tight tracking-tight">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-white/85 leading-relaxed font-sans">
                    {item.tagline}
                  </p>

                  {/* Live Pending QA Pins Badge */}
                  {(item.pendingPinsCount ?? 0) > 0 && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-[10px] font-mono text-white border border-white/20 backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                      [{item.pendingPinsCount}] Pins Pending Review
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/20 space-y-4 relative z-10">
                  <div className="flex justify-between text-xs font-mono text-white/90">
                    <span>Retainer Burndown</span>
                    <span>{progressPercent}%</span>
                  </div>

                  {/* Pure White Burn Progress Bar */}
                  <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => handleCopyMagicLink(item.token)}
                      className="text-xs font-mono uppercase tracking-wider text-white/90 hover:text-white underline underline-offset-4 transition"
                    >
                      {copiedToken === item.token ? '✓ Copied!' : 'Copy Magic Link'}
                    </button>

                    <Link
                      href={`/portal/${item.token}/canvas/${item.assetId}`}
                      className="w-10 h-10 rounded-full bg-white text-[#6366F1] flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform"
                    >
                      ↗
                    </Link>
                  </div>
                </div>
              </div>
            );
          }

          // Pure White Porcelain Bento Cards (#FFFFFF on #F7F7F9)
          return (
            <div
              key={item.id}
              className="bg-white border border-black/[0.06] rounded-3xl p-8 flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#64748B]">
                    {item.client}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-3 py-1 rounded-full font-semibold border ${
                      item.status === 'IN REVIEW'
                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#94A3B8] block">
                    [{item.badgeToken}]
                  </span>
                  <h3 className="text-2xl font-sans font-bold text-[#0F172A] group-hover:text-[#6366F1] transition-colors leading-tight tracking-tight">
                    {item.name}
                  </h3>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed font-sans">
                  {item.tagline}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-black/[0.06] space-y-4">
                <div className="flex justify-between text-xs font-mono text-[#64748B]">
                  <span>Burned</span>
                  <span className="font-semibold text-[#0F172A]">{progressPercent}%</span>
                </div>

                <div className="w-full h-2.5 bg-[#F7F7F9] rounded-full overflow-hidden p-0.5 border border-black/[0.04]">
                  <div
                    className="h-full bg-[#0F172A] rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => handleCopyMagicLink(item.token)}
                    className="text-xs font-mono uppercase tracking-wider text-[#64748B] hover:text-[#0F172A] transition"
                  >
                    {copiedToken === item.token ? '✓ Copied!' : 'Copy Magic Link'}
                  </button>

                  <Link
                    href={`/portal/${item.token}`}
                    className="w-9 h-9 rounded-full border border-black/[0.08] bg-[#F7F7F9] text-[#0F172A] flex items-center justify-center font-bold text-xs group-hover:bg-[#0F172A] group-hover:text-white transition-colors"
                  >
                    →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


