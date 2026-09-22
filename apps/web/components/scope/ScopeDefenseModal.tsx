'use client';

import React, { useState } from 'react';
import { StagingPin, ScopeType } from '@/types/staging';

interface ScopeDefenseModalProps {
  pin: StagingPin;
  onClose: () => void;
  onUpdateScope: (pinId: string, scopeType: ScopeType, hours: number, costInCents: number, stripeUrl?: string) => void;
}

export default function ScopeDefenseModal({ pin, onClose, onUpdateScope }: ScopeDefenseModalProps) {
  const [scopeType, setScopeType] = useState<ScopeType>(pin.scopeType || 'IN_SCOPE');
  const [hours, setHours] = useState<number>(pin.estimatedHours || 1.5);
  const [hourlyRateInCents] = useState<number>(15000); // $150/hr
  const [isGeneratingStripe, setIsGeneratingStripe] = useState(false);
  const [stripeUrl, setStripeUrl] = useState<string | null>(pin.stripePaymentUrl || null);

  const calculatedCostInCents = Math.round(hours * hourlyRateInCents);

  const handleGenerateStripeLink = async () => {
    setIsGeneratingStripe(true);
    try {
      // Simulate draft Stripe Checkout invoice creation
      await new Promise((r) => setTimeout(r, 600));
      const mockStripeLink = `https://checkout.stripe.com/pay/cs_live_${Date.now()}`;
      setStripeUrl(mockStripeLink);
    } catch (err) {
      console.error('Failed to generate Stripe link:', err);
    } finally {
      setIsGeneratingStripe(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateScope(pin.id, scopeType, hours, calculatedCostInCents, stripeUrl || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#E5E2DA]/20 w-full max-w-lg rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-start border-b border-neutral-800 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">
              Agency Scope Defense
            </span>
            <h3 className="text-2xl font-serif font-bold text-white mt-0.5">Triage Scope & Retainer</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Scope Tag Selector */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              Scope Classification
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setScopeType('IN_SCOPE')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  scopeType === 'IN_SCOPE'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white ring-2 ring-emerald-500/50'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono">🟢 IN-SCOPE</span>
                  {scopeType === 'IN_SCOPE' && <span className="text-emerald-400 text-xs">✓</span>}
                </div>
                <p className="text-[11px] text-neutral-300">
                  Defect, typo, alignment, or bug fix covered under existing milestone.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScopeType('OUT_OF_SCOPE')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  scopeType === 'OUT_OF_SCOPE'
                    ? 'bg-amber-950/60 border-[#C85A32] text-white ring-2 ring-[#C85A32]/50'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-[#C85A32]">🔴 OUT-OF-SCOPE</span>
                  {scopeType === 'OUT_OF_SCOPE' && <span className="text-[#C85A32] text-xs">✓</span>}
                </div>
                <p className="text-[11px] text-neutral-300">
                  New feature request, layout change, or addition outside SOW.
                </p>
              </button>
            </div>
          </div>

          {/* Hourly Estimation & Rate */}
          {scopeType === 'OUT_OF_SCOPE' && (
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                    Estimated Time (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={hours}
                    onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#C85A32]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 mb-1">
                    Billable Cost ($150/hr)
                  </label>
                  <div className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400">
                    ${(calculatedCostInCents / 100).toFixed(2)} USD
                  </div>
                </div>
              </div>

              {/* Retainer Burn-down vs Stripe Draft */}
              <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-xs">
                <span className="text-[11px] text-neutral-400">
                  Option: Deduct from <strong className="text-white">Active Retainer</strong>
                </span>
                {stripeUrl ? (
                  <a
                    href={stripeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-mono text-indigo-400 hover:underline"
                  >
                    Stripe Checkout Draft ↗
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateStripeLink}
                    disabled={isGeneratingStripe}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white rounded-lg border border-neutral-700 transition"
                  >
                    {isGeneratingStripe ? 'Creating Link...' : '💳 Draft Stripe Invoice'}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-700 text-neutral-400 text-xs font-semibold rounded-xl hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#C85A32] hover:bg-[#B04B27] text-white text-xs font-semibold rounded-xl transition shadow-md"
            >
              Save Scope Classification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
