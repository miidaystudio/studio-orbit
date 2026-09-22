'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ClientRecord, regenerateClientTokenAction } from '@/app/actions/deliverables';
import Toast from '@/components/ui/Toast';

interface ClientDirectoryGridProps {
  initialClients: ClientRecord[];
}

export default function ClientDirectoryGrid({ initialClients }: ClientDirectoryGridProps) {
  const [clients, setClients] = useState<ClientRecord[]>(initialClients);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loadingTokenId, setLoadingTokenId] = useState<string | null>(null);

  const handleCopyMagicLink = (token: string) => {
    const url = `${window.location.origin}/portal/${token}`;
    navigator.clipboard.writeText(url);
    setToastMessage('✓ Client magic link copied to clipboard!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRegenerateToken = async (clientId: string, companyName: string) => {
    setLoadingTokenId(clientId);
    const result = await regenerateClientTokenAction(clientId);

    if (result.success && result.newToken) {
      setClients((prev) =>
        prev.map((c) => (c.id === clientId ? { ...c, portalToken: result.newToken } : c))
      );
      setToastMessage(`🔒 Token regenerated for ${companyName}! Previous link invalidated.`);
      setTimeout(() => setToastMessage(null), 3500);
    }

    setLoadingTokenId(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto selection:bg-[#6366F1] selection:text-white">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/[0.06] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[11px] font-mono font-medium tracking-wide mb-2">
            <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
            STUDIO ADMIN • CLIENT ROSTER & WORKSPACE PORTALS
          </div>
          <h1 className="text-3xl md:text-4xl font-sans font-bold text-[#0F172A] tracking-tight">
            Client <span className="font-serif italic font-normal text-[#6366F1]">Directory.</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-xl">
            Manage magic workspace access links, rotate security tokens, monitor retainer consumption, and inspect live launch readiness.
          </p>
        </div>
        <button
          type="button"
          className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#6366F1] text-white text-xs font-medium rounded-full shadow-sm transition-all active:scale-95"
        >
          + Add Client Workspace
        </button>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((c) => {
          const remainingHours = c.retainerTotal - c.retainerConsumed;
          const retainerPercent = Math.round((c.retainerConsumed / c.retainerTotal) * 100);

          return (
            <div
              key={c.id}
              className="bg-white border border-black/[0.06] rounded-3xl p-6 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Header: Company Name + Active Badge */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-sans font-bold text-[#0F172A] group-hover:text-[#6366F1] transition-colors">
                      {c.companyName}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {c.contactName} ({c.email})
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      [ {c.status} ]
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8]">
                      Active {c.lastActive}
                    </span>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-3 pt-4 border-t border-black/[0.06] text-xs font-sans">
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Current Sprint:</span>
                    <span className="font-semibold text-[#0F172A] font-mono">{c.currentSprint}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#64748B]">Retainer:</span>
                      <span className="font-mono font-semibold text-[#0F172A]">
                        {c.retainerConsumed} / {c.retainerTotal} hrs consumed ({remainingHours}h remaining)
                      </span>
                    </div>
                    {/* Retainer Progress Bar */}
                    <div className="w-full h-2 bg-[#F7F7F9] rounded-full overflow-hidden border border-black/[0.04]">
                      <div
                        className="h-full bg-[#6366F1] rounded-full transition-all duration-500"
                        style={{ width: `${retainerPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Launch Sanity:</span>
                    <span className="inline-flex items-center gap-1.5 font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      <span>✓</span> {c.launchSanityScore}% Launch Ready
                    </span>
                  </div>
                </div>

                {/* Security Token Management */}
                <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                  <span className="truncate max-w-[160px]" title={c.portalToken}>
                    Token: <strong className="text-[#0F172A]">{c.portalToken.slice(0, 12)}...</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRegenerateToken(c.id, c.companyName)}
                    disabled={loadingTokenId === c.id}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 underline font-medium"
                  >
                    {loadingTokenId === c.id ? 'Regenerating...' : 'Regenerate Token 🔄'}
                  </button>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyMagicLink(c.portalToken)}
                  className="px-3.5 py-1.5 rounded-full bg-[#F7F7F9] border border-black/[0.08] hover:bg-black/[0.04] text-[11px] font-mono uppercase tracking-wider text-[#0F172A] font-medium transition"
                >
                  Copy Magic Link
                </button>

                <Link
                  href={`/portal/${c.portalToken}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] transition group/link"
                >
                  <span>Launch Client View</span>
                  <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
