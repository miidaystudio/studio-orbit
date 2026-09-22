'use client';

import React, { useState } from 'react';
import { StagingPin } from '@/types/staging';

interface GuidedWalkthroughBarProps {
  pins: StagingPin[];
  isActive: boolean;
  onClose: () => void;
  onSelectPin: (pinId: string) => void;
}

export default function GuidedWalkthroughBar({
  pins,
  isActive,
  onClose,
  onSelectPin,
}: GuidedWalkthroughBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const openPins = pins.filter((p) => p.status === 'OPEN');

  if (!isActive || openPins.length === 0) return null;

  const currentPin = openPins[currentIndex] || openPins[0];

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % openPins.length;
    setCurrentIndex(nextIdx);
    onSelectPin(openPins[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + openPins.length) % openPins.length;
    setCurrentIndex(prevIdx);
    onSelectPin(openPins[prevIdx].id);
  };

  return (
    <div className="fixed bottom-6 inset-x-6 z-50 max-w-2xl mx-auto bg-[#121212]/95 backdrop-blur-md border border-[#C85A32] rounded-2xl p-4 shadow-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-6 duration-200">
      <div className="flex items-center gap-4">
        <span className="w-8 h-8 rounded-full bg-[#C85A32] text-white font-mono text-xs font-bold flex items-center justify-center shadow-md">
          {currentIndex + 1}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">
              Guided Client Tour • Pin {currentIndex + 1} of {openPins.length}
            </span>
          </div>
          <p className="text-xs font-sans text-neutral-200 truncate max-w-sm">
            {currentPin?.comment || 'Review deliverable coordinate pin'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={handlePrev}
          className="px-3 py-1.5 border border-neutral-700 text-neutral-300 text-xs font-mono rounded-xl hover:bg-neutral-800 transition"
        >
          ← Prev
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-1.5 bg-[#C85A32] hover:bg-[#B04B27] text-white text-xs font-mono font-semibold rounded-xl transition shadow-sm"
        >
          Next Pin →
        </button>
        <button
          onClick={onClose}
          className="px-2.5 py-1.5 text-neutral-400 hover:text-white text-xs font-mono"
        >
          Exit Tour ✕
        </button>
      </div>
    </div>
  );
}
