'use client';

import React, { useState } from 'react';

interface LedgerItem {
  id: string;
  eventType: string;
  description: string;
  hoursDelta: number;
  amountInCents?: number;
  createdAt: string;
}

interface RetainerGaugeProps {
  totalHours: number;
  usedHours: number;
  outOfScopeHours?: number;
}

export default function RetainerGauge({ totalHours, usedHours, outOfScopeHours = 3.5 }: RetainerGaugeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGeneratingTopup, setIsGeneratingTopup] = useState(false);

  const effectiveUsedHours = usedHours + outOfScopeHours;
  const percentage = Math.min(100, Math.round((effectiveUsedHours / totalHours) * 100));
  const remainingHours = Math.max(0, Number((totalHours - effectiveUsedHours).toFixed(1)));
  const isLowBalance = (remainingHours / totalHours) < 0.2;

  // Circular gauge calculations (SVG stroke-dasharray)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const ledgerEvents: LedgerItem[] = [
    {
      id: 'leg-101',
      eventType: 'SCOPE_DEDUCTION',
      description: 'Approved Change Request Scope: Filter Component (+2.0 hrs)',
      hoursDelta: -2.0,
      amountInCents: 30000,
      createdAt: 'Sep 18, 2026 • 14:20 PST',
    },
    {
      id: 'leg-102',
      eventType: 'SCOPE_DEDUCTION',
      description: 'Approved Copy Change: Hero Section Re-brand (+1.5 hrs)',
      hoursDelta: -1.5,
      amountInCents: 22500,
      createdAt: 'Sep 15, 2026 • 10:15 PST',
    },
    {
      id: 'leg-103',
      eventType: 'HOUR_TOPUP',
      description: 'Retainer Monthly Top-Up Allocation (+40.0 hrs)',
      hoursDelta: 40.0,
      amountInCents: 600000,
      createdAt: 'Sep 01, 2026 • 09:00 PST',
    },
  ];

  const handleTopupClick = () => {
    setIsGeneratingTopup(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.open('https://checkout.stripe.com/pay/cs_live_topup_retainer', '_blank');
      }
      setIsGeneratingTopup(false);
    }, 500);
  };

  return (
    <div className="bg-white border border-[#E5E2DA] rounded-3xl p-8 shadow-editorial space-y-6 transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">Agency Retainer</span>
            {isLowBalance && (
              <span className="text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                ⚠️ Low Buffer Warning (&lt;20%)
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-serif font-bold text-[#121212]">Design & Engineering Burn-Down</h3>
              <p className="text-xs text-[#686661] mt-1">
                Prepaid monthly studio retainer hours allocation, out-of-scope pin deductions, and burn rate tracking.
              </p>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-mono text-[#C85A32] hover:underline flex items-center gap-1 shrink-0 ml-4"
            >
              <span>{isExpanded ? 'Hide Activity Log ▲' : 'View Transparency Ledger ▼'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 text-xs font-mono pt-2">
            <div className="flex flex-wrap gap-6">
              <div>
                <span className="text-[#686661] uppercase tracking-wider block">Allocated</span>
                <span className="text-lg font-bold text-[#121212]">{totalHours} hrs</span>
              </div>
              <div className="border-l border-[#E5E2DA] pl-6">
                <span className="text-[#686661] uppercase tracking-wider block">Consumed</span>
                <span className="text-lg font-bold text-[#C85A32]">{effectiveUsedHours} hrs</span>
              </div>
              <div className="border-l border-[#E5E2DA] pl-6">
                <span className="text-[#686661] uppercase tracking-wider block">Out-Of-Scope Pins</span>
                <span className="text-lg font-bold text-amber-600">+{outOfScopeHours} hrs</span>
              </div>
              <div className="border-l border-[#E5E2DA] pl-6">
                <span className="text-[#686661] uppercase tracking-wider block">Remaining Buffer</span>
                <span className={`text-lg font-bold ${isLowBalance ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {remainingHours} hrs
                </span>
              </div>
            </div>

            {isLowBalance && (
              <button
                onClick={handleTopupClick}
                disabled={isGeneratingTopup}
                className="px-4 py-2 bg-[#C85A32] hover:bg-[#B04B27] text-white text-xs font-mono font-semibold rounded-xl transition shadow-sm"
              >
                {isGeneratingTopup ? 'Opening Checkout...' : '💳 Top-Up Retainer (+10 hrs)'}
              </button>
            )}
          </div>
        </div>

        {/* Circular Gauge Graphic */}
        <div className="relative flex items-center justify-center shrink-0">
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
              stroke={isLowBalance ? '#E11D48' : '#C85A32'}
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

      {/* Expandable Chronological Audit Ledger Activity Feed */}
      {isExpanded && (
        <div className="border-t border-[#E5E2DA] pt-6 space-y-3 animate-in fade-in duration-200">
          <div className="flex justify-between items-center text-xs font-mono text-[#686661]">
            <span className="font-bold uppercase text-[#121212]">Chronological Audit Ledger Events</span>
            <span>Real-time Retainer Sync</span>
          </div>

          <div className="space-y-2">
            {ledgerEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-[#FAF8F5] border border-[#E5E2DA] p-3.5 rounded-2xl flex justify-between items-center text-xs font-sans"
              >
                <div>
                  <p className="font-semibold text-[#121212]">{evt.description}</p>
                  <p className="text-[10px] font-mono text-[#686661] mt-0.5">{evt.createdAt}</p>
                </div>

                <div className="text-right font-mono">
                  <span
                    className={`font-bold ${
                      evt.hoursDelta > 0 ? 'text-emerald-700' : 'text-[#C85A32]'
                    }`}
                  >
                    {evt.hoursDelta > 0 ? `+${evt.hoursDelta}` : evt.hoursDelta} hrs
                  </span>
                  {evt.amountInCents && (
                    <span className="block text-[10px] text-[#686661]">
                      ${(evt.amountInCents / 100).toFixed(2)} USD
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
