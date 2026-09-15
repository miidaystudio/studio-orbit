'use client';

import React from 'react';
import { CanvasPinData } from '@studio-orbit/types';

interface FeedbackPinProps {
  pin: CanvasPinData;
  index: number;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export default function FeedbackPin({ pin, index, isActive, onClick }: FeedbackPinProps) {
  const getStatusColorClass = () => {
    switch (pin.status) {
      case 'OPEN':
        return 'bg-amber-500 ring-amber-500/40 text-black';
      case 'IN_PROGRESS':
        return 'bg-[#C85A32] ring-[#C85A32]/40 text-white';
      case 'RESOLVED':
        return 'bg-emerald-500 ring-emerald-500/40 text-black';
    }
  };

  return (
    <div
      onClick={onClick}
      style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
    >
      <div className="relative flex items-center justify-center">
        {/* Animated Pulse Ring */}
        {pin.status === 'OPEN' && (
          <span className="absolute w-8 h-8 rounded-full animate-ping opacity-75 bg-amber-500" />
        )}

        {/* Circular Numbered Marker */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow-canvas transition-transform duration-200 group-hover:scale-125 ${getStatusColorClass()} ${
            isActive ? 'scale-125 ring-4' : ''
          }`}
        >
          {index}
        </div>
      </div>
    </div>
  );
}
