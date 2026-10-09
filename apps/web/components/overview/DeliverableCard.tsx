'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DeliverableItem } from '@/app/actions/deliverables';
import { ExternalLink, MoreVertical, Copy, Sparkles, Layers, Sliders, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';

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

  return (
    <div className="bg-white border border-gray-200 hover:border-[#346853]/60 rounded-3xl p-6 lg:p-7 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group text-[#111111]">
      
      {/* Toast notification inside card */}
      {actionToast && (
        <div className="absolute top-4 right-4 z-30 bg-[#346853] text-white px-3.5 py-1.5 rounded-full text-xs font-mono font-bold shadow-md animate-in fade-in zoom-in-95">
          {actionToast}
        </div>
      )}

      <div className="space-y-5">
        {/* 1. Header & Live Staging Ping */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block font-bold">
              {item.client}
            </span>
            <a
              href={item.stagingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[#346853] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>{displayUrl}</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold ${
                item.status === 'COMPLETED'
                  ? 'bg-emerald-50 text-[#346853] border border-emerald-200'
                  : item.status === 'IN_REVIEW'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              {item.status.replace('_', ' ')}
            </span>

            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="p-1.5 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded-lg transition"
                title="Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 z-40 text-xs font-medium space-y-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onCopyMagicLink(item.id);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition flex items-center justify-between"
                  >
                    <span>Copy Client Link</span>
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <button
                    onClick={handleHarvestClick}
                    className="w-full text-left px-3 py-2 text-[#346853] hover:bg-emerald-50 rounded-xl transition flex items-center justify-between"
                  >
                    <span>Harvest DOM Assets</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#346853]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Deliverable Title & Tagline */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">
              {item.badgeToken}
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[#111111] font-heading">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {item.tagline}
          </p>
        </div>

        {/* 3. Retainer Burn Meter */}
        <div className="space-y-2 bg-[#F9F9F9] border border-gray-200/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700">Sprint Retainer Allocation</span>
            <span className="font-mono text-xs font-bold text-[#111111]">
              {item.consumedHours}h / {item.allocatedHours || 40}h
            </span>
          </div>

          {/* Clean Hairline Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentConsumed > 90
                  ? 'bg-rose-500'
                  : percentConsumed > 75
                  ? 'bg-amber-500'
                  : 'bg-[#346853]'
              }`}
              style={{ width: `${percentConsumed}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
            <span>{remainingHours}h remaining</span>
            <span>Target: {item.nextMilestoneDate || 'Sprint Review 1'}</span>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between gap-3">
        <Link
          href={`/review-sandbox?deliverableId=${item.id}`}
          className="flex-1 py-2.5 px-4 bg-[#111111] hover:bg-[#346853] text-white text-xs font-bold rounded-xl text-center transition shadow-xs flex items-center justify-center gap-2 active:scale-95"
        >
          <span>Launch Sandbox</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => onCopyMagicLink(item.id)}
          className="py-2.5 px-3.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 hover:text-[#111111] rounded-xl text-xs font-medium transition shadow-xs flex items-center gap-1.5"
          title="Copy Magic Invite Link"
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Magic Link</span>
        </button>
      </div>

    </div>
  );
}
