'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DeliverableItem, createDeliverableAction } from '@/app/actions/deliverables';
import DeliverableCard from '@/components/overview/DeliverableCard';
import Toast from '@/components/ui/Toast';

// --- Tactical Brutalist Corner Crosshairs ---
function CornerCrosshairs() {
  return (
    <>
      <span className="absolute -top-1.5 -left-1.5 text-[11px] font-mono text-[#828892]/50 select-none pointer-events-none leading-none">+</span>
      <span className="absolute -top-1.5 -right-1.5 text-[11px] font-mono text-[#828892]/50 select-none pointer-events-none leading-none">+</span>
      <span className="absolute -bottom-1.5 -left-1.5 text-[11px] font-mono text-[#828892]/50 select-none pointer-events-none leading-none">+</span>
      <span className="absolute -bottom-1.5 -right-1.5 text-[11px] font-mono text-[#828892]/50 select-none pointer-events-none leading-none">+</span>
    </>
  );
}

interface TelemetryMetrics {
  activeNodes: number;
  stagedVariants: number;
  motionProfiles: number;
  pendingHandoffs: number;
}

interface OverviewDeliverablesGridProps {
  initialDeliverables: DeliverableItem[];
  userName?: string;
  telemetry?: TelemetryMetrics;
}

type CreativeFilter = 'ALL' | 'OVERRIDES' | 'MOTION' | 'HANDOFF';

export default function OverviewDeliverablesGrid({
  initialDeliverables,
  userName = 'Alex Rivera',
  telemetry = {
    activeNodes: 2,
    stagedVariants: 2,
    motionProfiles: 1,
    pendingHandoffs: 1,
  },
}: OverviewDeliverablesGridProps) {
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>(initialDeliverables);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<CreativeFilter>('ALL');

  // Modal & Toast State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Clean User Name Formatting
  let formattedName = userName;
  try {
    formattedName = decodeURIComponent(userName);
  } catch {
    formattedName = userName;
  }

  // Form State
  const [formState, setFormState] = useState({
    clientName: 'miidayStudio',
    name: '',
    tagline: '',
    badgeToken: '[DEV-SYSTEM-01]',
    stagingUrl: 'https://miidaystudio.online',
    allocatedHours: 40,
  });

  const handleCopyMagicLink = (token: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const url = `${origin}/review-sandbox?deliverableId=${token}`;
    navigator.clipboard.writeText(url);
    setToastMessage('✓ Client review workspace magic link copied!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('clientName', formState.clientName);
    formData.append('name', formState.name);
    formData.append('tagline', formState.tagline);
    formData.append('badgeToken', formState.badgeToken);
    formData.append('stagingUrl', formState.stagingUrl);
    formData.append('allocatedHours', formState.allocatedHours.toString());

    const result = await createDeliverableAction(formData);

    if (result.success && result.deliverable) {
      setDeliverables((prev) => [result.deliverable, ...prev]);
      setIsModalOpen(false);
      setToastMessage(`✓ Deliverable "${formState.name}" created successfully!`);
      setTimeout(() => setToastMessage(null), 3000);
      setFormState({
        clientName: 'miidayStudio',
        name: '',
        tagline: '',
        badgeToken: '[DEV-SYSTEM-01]',
        stagingUrl: 'https://miidaystudio.online',
        allocatedHours: 40,
      });
    }

    setIsSubmitting(false);
  };

  // Filter & Search Logic
  const filteredDeliverables = deliverables.filter((item) => {
    const matchesFilter =
      activeFilter === 'ALL' ||
      (activeFilter === 'OVERRIDES' && item.status !== 'COMPLETED') ||
      (activeFilter === 'MOTION' && item.status === 'IN_REVIEW') ||
      (activeFilter === 'HANDOFF' && item.status === 'COMPLETED');

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      item.client.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      (item.badgeToken && item.badgeToken.toLowerCase().includes(query)) ||
      (item.tagline && item.tagline.toLowerCase().includes(query));

    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-8 selection:bg-[#CCFF00] selection:text-black max-w-7xl mx-auto text-[#FFFFFF] font-sans">
      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#22252A]">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded bg-[#111315] border border-[#22252A] text-[11px] font-mono font-bold tracking-wide text-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
            <span>[SYS-01 // COCKPIT &bull; {formattedName.toUpperCase()}]</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#FFFFFF] leading-[1.05]">
            CREATIVE ENGINEERING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-[#FFFFFF]">DELIVERY OS.</span>
          </h1>

          <p className="text-xs text-[#828892] max-w-xl leading-relaxed font-mono">
            Visual mutation telemetry, live kinetic curve tuning, and automated executive client handoff vaults.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <Link
            href={deliverables.length > 0 ? `/review-sandbox?deliverableId=${deliverables[0].id}` : '/review-sandbox'}
            className="px-4 py-2.5 rounded-xl bg-[#111315] border border-[#22252A] hover:border-[#CCFF00] text-xs font-bold text-[#FFFFFF] transition-all shadow-sm flex items-center gap-2"
          >
            <span>LAUNCH SANDBOX</span>
            <span className="text-[#CCFF00]">→</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_16px_rgba(204,255,0,0.35)] active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>+ NEW DELIVERABLE</span>
          </button>
        </div>
      </div>

      {/* 1. Global Telemetry Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Staging Nodes */}
        <div className="bg-[#111315] border border-[#22252A] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-[#CCFF00]/50 transition">
          <CornerCrosshairs />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#828892]">
              Active Staging Nodes
            </span>
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.8)] animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-[#FFFFFF]">
              {telemetry.activeNodes} NODES
            </div>
            <div className="text-[10px] font-mono text-[#CCFF00] mt-0.5 font-bold">
              ● VERIFIED 200 OK (PROXY LIVE)
            </div>
          </div>
        </div>

        {/* Metric 2: Staged Variants */}
        <div className="bg-[#111315] border border-[#22252A] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-[#CCFF00]/50 transition">
          <CornerCrosshairs />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#828892]">
              Staged Variants
            </span>
            <span className="text-[#CCFF00] text-xs font-mono font-bold">✦</span>
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-[#FFFFFF]">
              {telemetry.stagedVariants} OVERRIDES
            </div>
            <div className="text-[10px] font-mono text-[#828892] mt-0.5">
              Live DOM Mutations Active
            </div>
          </div>
        </div>

        {/* Metric 3: Motion Profiles */}
        <div className="bg-[#111315] border border-[#22252A] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-[#CCFF00]/50 transition">
          <CornerCrosshairs />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#828892]">
              Motion Profiles
            </span>
            <span className="text-[#CCFF00] text-xs font-mono font-bold">∿</span>
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-[#FFFFFF]">
              {telemetry.motionProfiles} CURVES
            </div>
            <div className="text-[10px] font-mono text-[#828892] mt-0.5">
              Bézier Presets (CSS/GSAP)
            </div>
          </div>
        </div>

        {/* Metric 4: Pending Handoffs */}
        <div className="bg-[#111315] border border-[#22252A] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-[#CCFF00]/50 transition">
          <CornerCrosshairs />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#828892]">
              Pending Handoffs
            </span>
            <span className="text-[#CCFF00] text-xs font-mono font-bold">⬡</span>
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-[#FFFFFF]">
              {telemetry.pendingHandoffs} VAULTS
            </div>
            <div className="text-[10px] font-mono text-[#CCFF00] mt-0.5 font-bold">
              [STAGE_READY // 99.8%]
            </div>
          </div>
        </div>
      </div>

      {/* 2. Modernized Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#111315] p-3 rounded-2xl border border-[#22252A] shadow-sm relative">
        <CornerCrosshairs />
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 p-1 bg-[#08090A] rounded-xl border border-[#22252A]">
          {[
            { id: 'ALL', label: 'ALL PROJECTS' },
            { id: 'OVERRIDES', label: 'IN REVIEW / OVERRIDES' },
            { id: 'MOTION', label: 'KINETIC MOTION QA' },
            { id: 'HANDOFF', label: 'READY FOR HANDOFF' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as CreativeFilter)}
                className={`text-xs font-mono px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap uppercase font-bold ${
                  isActive
                    ? 'bg-[#16181B] text-[#CCFF00] border border-[#22252A] shadow-[0_0_8px_rgba(204,255,0,0.2)]'
                    : 'text-[#828892] hover:text-[#FFFFFF] hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Instant Client / Title Search Bar */}
        <div className="relative min-w-[260px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH CLIENT, TITLE, TAG..."
            className="w-full text-xs font-mono bg-[#08090A] border border-[#22252A] rounded-xl px-3.5 py-2 pl-9 text-[#FFFFFF] placeholder-[#828892] focus:outline-none focus:border-[#CCFF00] transition"
          />
          <span className="absolute left-3 top-2.5 text-xs text-[#828892] flex items-center">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 text-xs text-[#828892] hover:text-[#CCFF00]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. Deliverables Grid */}
      {filteredDeliverables.length === 0 ? (
        <div className="bg-[#111315] border border-dashed border-[#22252A] rounded-2xl p-12 text-center space-y-4 shadow-sm text-[#FFFFFF] relative">
          <CornerCrosshairs />
          <div className="w-12 h-12 rounded-2xl bg-[#08090A] text-[#CCFF00] border border-[#22252A] flex items-center justify-center mx-auto text-xl font-mono shadow-[0_0_12px_rgba(204,255,0,0.2)]">
            ⬡
          </div>
          <h3 className="text-xl font-mono font-black uppercase text-[#FFFFFF]">No Deliverables Found</h3>
          <p className="text-xs font-mono text-[#828892] max-w-md mx-auto">
            {searchQuery || activeFilter !== 'ALL'
              ? 'No projects match your current search query or filter selection.'
              : 'There are no active deliverables in your PostgreSQL database yet.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            {searchQuery || activeFilter !== 'ALL' ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('ALL');
                }}
                className="px-4 py-2 rounded-xl border border-[#22252A] text-xs font-mono text-[#FFFFFF] hover:border-[#CCFF00]"
              >
                Reset Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-mono font-black uppercase shadow-[0_0_12px_rgba(204,255,0,0.3)]"
              >
                Create First Deliverable →
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeliverables.map((item, idx) => (
            <DeliverableCard
              key={item.id}
              item={item}
              isFeatured={idx === 0}
              onCopyMagicLink={handleCopyMagicLink}
            />
          ))}
        </div>
      )}

      {/* Modal for "+ New Deliverable" */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#111315] border border-[#22252A] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-150 text-[#FFFFFF]">
            <CornerCrosshairs />
            <div className="flex justify-between items-center border-b border-[#22252A] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] font-bold">
                  [STUDIO CREATOR // SYS-INIT]
                </span>
                <h3 className="text-xl font-mono font-black uppercase text-[#FFFFFF] mt-0.5">
                  New Client Deliverable
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-[#828892] hover:text-[#CCFF00] font-mono p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeliverable} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="font-bold text-[#FFFFFF] uppercase text-[10px]">
                  Client Account
                </label>
                <input
                  type="text"
                  required
                  value={formState.clientName}
                  onChange={(e) => setFormState({ ...formState, clientName: e.target.value })}
                  placeholder="e.g. miidayStudio"
                  className="w-full p-2.5 bg-[#08090A] border border-[#22252A] rounded-xl text-xs text-[#FFFFFF] focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#FFFFFF] uppercase text-[10px]">
                  Deliverable Title
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g. Brand System & Client Portal"
                  className="w-full p-2.5 bg-[#08090A] border border-[#22252A] rounded-xl text-xs text-[#FFFFFF] focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#FFFFFF] uppercase text-[10px]">
                  Staging / Preview URL
                </label>
                <input
                  type="text"
                  required
                  value={formState.stagingUrl}
                  onChange={(e) => setFormState({ ...formState, stagingUrl: e.target.value })}
                  placeholder="https://miidaystudio.online"
                  className="w-full p-2.5 bg-[#08090A] border border-[#22252A] rounded-xl text-xs text-[#FFFFFF] focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#FFFFFF] uppercase text-[10px]">
                    System Token
                  </label>
                  <input
                    type="text"
                    value={formState.badgeToken}
                    onChange={(e) => setFormState({ ...formState, badgeToken: e.target.value })}
                    className="w-full p-2.5 bg-[#08090A] border border-[#22252A] rounded-xl text-xs text-[#FFFFFF] focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#FFFFFF] uppercase text-[10px]">
                    Allocated Hours
                  </label>
                  <input
                    type="number"
                    value={formState.allocatedHours}
                    onChange={(e) => setFormState({ ...formState, allocatedHours: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#08090A] border border-[#22252A] rounded-xl text-xs text-[#FFFFFF] focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#FFFFFF] uppercase text-[10px]">
                  Scope Description
                </label>
                <textarea
                  rows={2}
                  value={formState.tagline}
                  onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
                  placeholder="Describe scope deliverables and telemetry..."
                  className="w-full p-2.5 bg-[#08090A] border border-[#22252A] rounded-xl text-xs text-[#FFFFFF] focus:outline-none focus:border-[#CCFF00] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#22252A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#22252A] text-xs font-mono text-[#828892] hover:text-[#FFFFFF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formState.name.trim()}
                  className="px-5 py-2 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-mono font-black uppercase transition disabled:opacity-50 shadow-[0_0_12px_rgba(204,255,0,0.3)]"
                >
                  {isSubmitting ? 'Creating...' : 'Create Deliverable →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
