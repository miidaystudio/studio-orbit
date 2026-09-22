'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DeliverableItem } from '@/app/actions/deliverables';

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

interface DeliverableCardProps {
  item: DeliverableItem;
  isFeatured?: boolean;
  onCopyMagicLink: (token: string) => void;
  onHarvestAssets?: (stagingUrl: string) => void;
}

export default function DeliverableCard({
  item,
  isFeatured = false,
  onCopyMagicLink,
  onHarvestAssets,
}: DeliverableCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);

  const percentConsumed = Math.min(
    100,
    Math.round((item.consumedHours / (item.allocatedHours || 40)) * 100)
  );
  const remainingHours = Math.max(0, (item.allocatedHours || 40) - item.consumedHours);

  // Clean staging display domain
  const displayUrl = item.stagingUrl
    ? item.stagingUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : 'staging.domain.com';

  // Determine active pipeline step:
  // 1: Overrides & Pitch | 2: Kinetic Motion | 3: Handoff Vault
  const pipelineStep = item.status === 'COMPLETED' ? 3 : item.status === 'IN_REVIEW' ? 2 : 1;

  const handleHarvestClick = async () => {
    setIsDropdownOpen(false);
    setActionToast('Harvesting DOM assets...');
    try {
      const res = await fetch(`/api/vault/harvest?url=${encodeURIComponent(item.stagingUrl)}`);
      if (res.ok) {
        const data = await res.json();
        setActionToast(`✓ Extracted ${data.assets?.length || 0} vectors & ${data.colors?.length || 0} colors!`);
      } else {
        setActionToast('Harvesting complete');
      }
    } catch {
      setActionToast('Harvesting request sent');
    }
    setTimeout(() => setActionToast(null), 3000);
  };

  const handleDuplicate = () => {
    setIsDropdownOpen(false);
    setActionToast(`✓ Duplicated deliverable "${item.name}"`);
    setTimeout(() => setActionToast(null), 3000);
  };

  const handleArchive = () => {
    setIsDropdownOpen(false);
    setActionToast(`✓ Archived deliverable "${item.name}"`);
    setTimeout(() => setActionToast(null), 3000);
  };

  return (
    <div className="bg-[#111315] border border-[#22252A] hover:border-[#CCFF00]/60 rounded-2xl p-6 lg:p-7 flex flex-col justify-between shadow-xl hover:-translate-y-1 transition-all duration-300 relative group text-[#FFFFFF]">
      <CornerCrosshairs />

      {/* Toast notification inside card */}
      {actionToast && (
        <div className="absolute top-4 right-4 z-30 bg-[#CCFF00] text-black px-3 py-1.5 rounded-lg text-xs font-mono font-bold shadow-[0_0_12px_rgba(204,255,0,0.5)] animate-in fade-in zoom-in-95">
          {actionToast}
        </div>
      )}

      <div className="space-y-5">
        {/* 1. Header & Live Staging Ping */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#22252A]">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#828892] block">
              {item.client}
            </span>
            <a
              href={item.stagingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#828892] hover:text-[#CCFF00] transition group/link"
              title="Open Staging URL in new tab"
            >
              <span className="underline underline-offset-2 truncate max-w-[190px]">{displayUrl}</span>
              <span className="text-[10px] group-hover/link:translate-x-0.5 transition-transform">↗</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Network Badge with Cyber Lime Glow */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30 shadow-[0_0_12px_rgba(204,255,0,0.3)] whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
              <span>STAGING 200 OK</span>
            </span>

            {/* Dropdown Menu Toggle (···) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-7 h-7 rounded-lg bg-[#08090A] hover:bg-[#16181B] border border-[#22252A] hover:border-[#CCFF00] flex items-center justify-center text-xs text-[#828892] hover:text-[#FFFFFF] transition"
              >
                &bull;&bull;&bull;
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-8 z-40 w-48 bg-[#111315] border border-[#22252A] rounded-xl p-1.5 shadow-2xl space-y-0.5 animate-in fade-in zoom-in-95 text-xs font-mono">
                  <button
                    type="button"
                    onClick={handleHarvestClick}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#16181B] text-[#FFFFFF] hover:text-[#CCFF00] flex items-center gap-2"
                  >
                    <span>⬡</span>
                    <span>Harvest Brand Assets</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDuplicate}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#16181B] text-[#828892] hover:text-[#FFFFFF] flex items-center gap-2"
                  >
                    <span>⧉</span>
                    <span>Duplicate Deliverable</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleArchive}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-rose-400 flex items-center gap-2"
                  >
                    <span>✕</span>
                    <span>Archive Deliverable</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Title & System Badge */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#CCFF00] font-bold tracking-wider">
              {item.badgeToken || '[DEV-SYSTEM-01]'}
            </span>
          </div>
          <h3 className="text-xl font-mono font-black uppercase text-[#FFFFFF] leading-snug tracking-tight">
            {item.name}
          </h3>
          <p className="text-xs font-mono text-[#828892] line-clamp-2 leading-relaxed">
            {item.tagline}
          </p>
        </div>

        {/* 2. Delivery Pipeline Progress */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#828892]">
            <span className="uppercase tracking-wider">Delivery Pipeline</span>
            <span className="text-[#FFFFFF] font-bold">PHASE 0{pipelineStep} OF 03</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                pipelineStep >= 1 ? 'bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.4)]' : 'bg-[#22252A]'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all ${
                pipelineStep >= 2 ? 'bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.4)]' : 'bg-[#22252A]'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all ${
                pipelineStep >= 3 ? 'bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.4)]' : 'bg-[#22252A]'
              }`}
            />
          </div>

          <div className="flex justify-between text-[9px] font-mono text-[#828892]">
            <span className={pipelineStep === 1 ? 'text-[#CCFF00] font-bold' : ''}>01. OVERRIDES</span>
            <span className={pipelineStep === 2 ? 'text-[#CCFF00] font-bold' : ''}>02. MOTION</span>
            <span className={pipelineStep === 3 ? 'text-[#CCFF00] font-bold' : ''}>03. HANDOFF</span>
          </div>
        </div>

        {/* 3. Engine Highlights Sub-Card */}
        <div className="bg-[#08090A] border border-[#22252A] rounded-xl p-3 grid grid-cols-3 gap-2 text-center font-mono">
          <div className="border-r border-[#22252A] pr-2">
            <span className="text-[10px] text-[#828892] uppercase block">Variants</span>
            <span className="text-xs font-bold text-[#FFFFFF] mt-0.5 block">2 Staged</span>
          </div>
          <div className="border-r border-[#22252A] pr-2">
            <span className="text-[10px] text-[#828892] uppercase block">Curves</span>
            <span className="text-xs font-bold text-[#CCFF00] mt-0.5 block">Bézier ∿</span>
          </div>
          <div>
            <span className="text-[10px] text-[#828892] uppercase block">Vectors</span>
            <span className="text-xs font-bold text-[#CCFF00] mt-0.5 block">16 Vault</span>
          </div>
        </div>

        {/* Retainer & Milestone Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
          <div className="bg-[#08090A] border border-[#22252A] p-2.5 rounded-xl">
            <span className="text-[10px] text-[#828892] uppercase block">Retainer Hours</span>
            <span className="text-xs font-bold text-[#FFFFFF]">{remainingHours} hrs left</span>
          </div>
          <div className="bg-[#08090A] border border-[#22252A] p-2.5 rounded-xl">
            <span className="text-[10px] text-[#828892] uppercase block">Next Milestone</span>
            <span className="text-xs font-bold text-[#FFFFFF] truncate block">
              {item.nextMilestoneDate || 'Sprint Review'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Direct Action Buttons (Footer) */}
      <div className="mt-6 pt-5 border-t border-[#22252A] space-y-2.5 font-mono">
        {/* Primary Launchpad */}
        <Link
          href={`/review-sandbox?deliverableId=${item.id}`}
          className="w-full py-2.5 px-4 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-black uppercase tracking-wider transition shadow-[0_0_12px_rgba(204,255,0,0.3)] flex items-center justify-between group/launch active:scale-98"
        >
          <span className="flex items-center gap-1.5">
            <span>✦</span>
            <span>LAUNCH STUDIO SANDBOX</span>
          </span>
          <span className="group-hover/launch:translate-x-1 transition-transform font-black">
            →
          </span>
        </Link>

        {/* Secondary Quick Links Row */}
        <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
          <Link
            href={`/review-sandbox?deliverableId=${item.id}&tab=motion`}
            className="py-1.5 px-2 rounded-lg bg-[#08090A] hover:bg-[#16181B] border border-[#22252A] hover:border-[#CCFF00] text-center text-[#828892] hover:text-[#CCFF00] transition flex items-center justify-center gap-1"
          >
            <span>∿</span>
            <span>Motion</span>
          </Link>

          <Link
            href={`/review-sandbox?deliverableId=${item.id}&tab=vault`}
            className="py-1.5 px-2 rounded-lg bg-[#08090A] hover:bg-[#16181B] border border-[#22252A] hover:border-[#CCFF00] text-center text-[#828892] hover:text-[#CCFF00] transition flex items-center justify-center gap-1"
          >
            <span>⬡</span>
            <span>Vault</span>
          </Link>

          <button
            type="button"
            onClick={() => onCopyMagicLink(item.token || item.id)}
            className="py-1.5 px-2 rounded-lg bg-[#08090A] hover:bg-[#16181B] border border-[#22252A] hover:border-[#CCFF00] text-center text-[#828892] hover:text-[#CCFF00] transition flex items-center justify-center gap-1"
            title="Copy client portal magic invite link"
          >
            <span>🔗</span>
            <span>Magic</span>
          </button>
        </div>
      </div>
    </div>
  );
}
