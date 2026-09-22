'use client';

import React, { useEffect } from 'react';

interface FreezeStateHarnessProps {
  isFrozen: boolean;
  onToggleFreeze: () => void;
}

export default function FreezeStateHarness({ isFrozen, onToggleFreeze }: FreezeStateHarnessProps) {
  // Listen to Spacebar or F key to toggle Freeze State
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key.toLowerCase() === 'f' || e.code === 'Space') &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        onToggleFreeze();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleFreeze]);

  return (
    <>
      {/* Inject CSS override when state is frozen */}
      {isFrozen && (
        <style jsx global>{`
          *, *::before, *::after {
            animation-play-state: paused !important;
            transition-property: none !important;
          }
        `}</style>
      )}

      {isFrozen && (
        <div className="absolute top-4 right-4 z-40 bg-[#C85A32] text-white px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-lg flex items-center gap-2 animate-pulse">
          <span>❄️ FREEZE STATE ACTIVE (Animations Paused)</span>
          <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded">Press [Space] or [F] to Unfreeze</span>
        </div>
      )}
    </>
  );
}
