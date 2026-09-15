'use client';

import React from 'react';

interface RetainerGaugeProps {
  totalHours: number;
  usedHours: number;
}

export default function RetainerGauge({ totalHours, usedHours }: RetainerGaugeProps) {
  const percentage = Math.min(100, Math.round((usedHours / totalHours) * 100));
  const remainingHours = Math.max(0, totalHours - usedHours);

  // Circular gauge calculations (SVG stroke-dasharray)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white border border-[#E5E2DA] rounded-2xl p-8 shadow-editorial flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">Agency Retainer</span>
        <h3 className="text-2xl font-serif font-bold text-[#121212] mt-1">Design & Engineering Burn-Down</h3>
        <p className="text-xs text-[#686661] mt-1">
          Prepaid monthly studio retainer hours allocation and burn rate tracking.
        </p>

        <div className="flex gap-6 mt-6 text-xs font-mono">
          <div>
            <span className="text-[#686661] uppercase tracking-wider block">Allocated</span>
            <span className="text-lg font-bold text-[#121212]">{totalHours} hrs</span>
          </div>
          <div className="border-l border-[#E5E2DA] pl-6">
            <span className="text-[#686661] uppercase tracking-wider block">Consumed</span>
            <span className="text-lg font-bold text-[#C85A32]">{usedHours} hrs</span>
          </div>
          <div className="border-l border-[#E5E2DA] pl-6">
            <span className="text-[#686661] uppercase tracking-wider block">Remaining</span>
            <span className="text-lg font-bold text-emerald-700">{remainingHours} hrs</span>
          </div>
        </div>
      </div>

      {/* Circular Gauge Graphic */}
      <div className="relative flex items-center justify-center">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#F9F8F3"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#C85A32"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-serif font-bold text-[#121212]">{percentage}%</span>
          <span className="text-[9px] font-mono uppercase text-[#686661]">Burned</span>
        </div>
      </div>
    </div>
  );
}
