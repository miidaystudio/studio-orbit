'use client';

import React, { useState } from 'react';
import { ShowcaseStop } from '@studio-orbit/types';
import ApproveSprintModal from './ApproveSprintModal';

interface SprintShowcaseBarProps {
  isActive: boolean;
  versionTag?: string;
  stops?: ShowcaseStop[];
  onClose: () => void;
  onNavigateStop: (stop: ShowcaseStop) => void;
  onApproveSprint?: (signature: string) => void;
}

export default function SprintShowcaseBar({
  isActive,
  versionTag = 'v2.4-Sprint-3',
  stops: customStops,
  onClose,
  onNavigateStop,
  onApproveSprint,
}: SprintShowcaseBarProps) {
  const defaultStops: ShowcaseStop[] = [
    {
      id: 'stop-1',
      title: 'Kinetic Hero & Editorial Serif Typography',
      selectorPath: 'header > div > h1',
      scrollPercentage: 0,
      designerNotes: 'Redesigned hero section with Playfair Display serif display tokens and terracotta accents.',
    },
    {
      id: 'stop-2',
      title: 'Visual QA Staging Sandbox',
      selectorPath: 'div.grid > div:nth-of-type(2)',
      scrollPercentage: 35,
      designerNotes: 'Coordinate percentage pin overlay allowing client feedback and direct GitHub issue export.',
    },
    {
      id: 'stop-3',
      title: 'Scope Defense & Retainer Burndown Ledger',
      selectorPath: 'div.sandbox-frame > div:nth-of-type(3)',
      scrollPercentage: 70,
      designerNotes: 'Real-time hour burndown transparency feed with automated out-of-scope pin triage.',
    },
    {
      id: 'stop-4',
      title: 'Milestone Cryptographic Sign-Off Certificate',
      selectorPath: 'div.sandbox-frame > div:nth-of-type(4)',
      scrollPercentage: 100,
      designerNotes: 'Tamper-evident milestone approval generation complete with SHA-256 audit digest.',
    },
  ];

  const stops = customStops || defaultStops;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showApproveModal, setShowApproveModal] = useState(false);

  if (!isActive) return null;

  const currentStop = stops[currentIndex] || stops[0];

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % stops.length;
    setCurrentIndex(nextIdx);
    onNavigateStop(stops[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + stops.length) % stops.length;
    setCurrentIndex(prevIdx);
    onNavigateStop(stops[prevIdx]);
  };

  return (
    <div className="fixed bottom-6 inset-x-6 z-50 max-w-4xl mx-auto bg-[#121212]/95 backdrop-blur-md border border-[#C85A32] rounded-3xl p-5 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-5 animate-in slide-in-from-bottom-6 duration-200">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 rounded-2xl bg-[#C85A32] text-white font-mono text-sm font-bold flex items-center justify-center shadow-md shrink-0">
          {currentIndex + 1}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32] px-2.5 py-0.5 bg-[#C85A32]/10 rounded-full border border-[#C85A32]/30 font-semibold">
              Sprint Showcase • {versionTag}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              Stop {currentIndex + 1} of {stops.length}
            </span>
          </div>

          <h4 className="text-sm font-serif font-bold text-white truncate">
            {currentStop.title}
          </h4>
          <p className="text-xs font-sans text-neutral-300 line-clamp-1 leading-relaxed">
            {currentStop.designerNotes}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-neutral-800 pt-3 md:pt-0">
        <div className="flex gap-1.5">
          <button
            onClick={handlePrev}
            className="px-3 py-1.5 border border-neutral-700 text-neutral-300 text-xs font-mono rounded-xl hover:bg-neutral-800 transition"
          >
            ← Prev
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono font-semibold rounded-xl border border-neutral-700 transition"
          >
            Next Stop →
          </button>
        </div>

        <button
          onClick={() => setShowApproveModal(true)}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold rounded-xl transition shadow-md whitespace-nowrap"
        >
          ✓ Approve Sprint
        </button>

        <button onClick={onClose} className="text-neutral-400 hover:text-white p-1 text-xs">
          ✕
        </button>
      </div>

      {showApproveModal && (
        <ApproveSprintModal
          versionTag={versionTag}
          onClose={() => setShowApproveModal(false)}
          onApprove={(signature) => {
            if (onApproveSprint) onApproveSprint(signature);
            setShowApproveModal(false);
          }}
        />
      )}
    </div>
  );
}
