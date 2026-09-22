'use client';

import React, { useState } from 'react';
import { Milestone } from '@studio-orbit/types';
import MilestoneCertificate from './MilestoneCertificate';

interface MilestoneSignOffProps {
  milestones?: Milestone[];
}

export default function MilestoneSignOff({ milestones: initialMilestones }: MilestoneSignOffProps) {
  const [activeCertificate, setActiveCertificate] = useState<Milestone | null>(null);

  const [milestones, setMilestones] = useState<Milestone[]>(
    initialMilestones || [
      {
        id: 'm1',
        projectId: 'proj-1',
        title: 'Phase 1: Brand Strategy & Editorial Typography',
        description: 'Serif display font selection, color tokens, and parchment grid system.',
        dueDate: 'Aug 15, 2026',
        status: 'APPROVED',
        signedBy: 'Sarah Chen (Client)',
        signedAt: 'Aug 14, 2026 • 14:32 PST',
      },
      {
        id: 'm2',
        projectId: 'proj-1',
        title: 'Phase 2: Visual QA Sandbox & Staging Review',
        description: 'Interactive coordinate pin overlay, device viewports, and GitHub issue export.',
        dueDate: 'Sep 30, 2026',
        status: 'PENDING_APPROVAL',
      },
      {
        id: 'm3',
        projectId: 'proj-1',
        title: 'Phase 3: Drizzle ORM Schema & Production Deployment',
        description: 'PostgreSQL database tables and Retainer hour burn-down ledger.',
        dueDate: 'Oct 31, 2026',
        status: 'UPCOMING',
      },
    ]
  );

  const handleDigitalSignOff = (id: string) => {
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'APPROVED' as const,
              signedBy: 'Sarah Chen (Digital Approval Verified)',
              signedAt: timestamp,
            }
          : m
      )
    );
  };

  return (
    <div className="bg-white border border-[#E5E2DA] rounded-2xl p-8 shadow-editorial space-y-6">
      <div className="flex justify-between items-center border-b border-[#E5E2DA] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">Scope Governance</span>
          <h3 className="text-2xl font-serif font-bold text-[#121212] mt-0.5">Milestone Scope Sign-Off</h3>
        </div>
      </div>

      <div className="space-y-6">
        {milestones.map((m, idx) => (
          <div
            key={m.id}
            className="bg-[#FAF8F5] border border-[#E5E2DA] p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#121212] text-white text-xs font-mono font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h4 className="text-lg font-serif font-bold text-[#121212]">{m.title}</h4>
                <span
                  className={`text-[9px] font-mono uppercase px-2.5 py-0.5 rounded font-semibold border ${
                    m.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : m.status === 'PENDING_APPROVAL'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                  }`}
                >
                  {m.status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-[#686661] ml-9 leading-relaxed">{m.description}</p>

              {m.signedBy && (
                <div className="ml-9 flex flex-wrap items-center gap-3 pt-1">
                  <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg inline-block">
                    ✓ Verified Digital Sign-Off: <strong>{m.signedBy}</strong> on {m.signedAt}
                  </div>
                  <button
                    onClick={() => setActiveCertificate(m)}
                    className="px-3 py-1 bg-[#121212] hover:bg-[#C85A32] text-white text-[10px] font-mono uppercase tracking-wider rounded-lg transition"
                  >
                    📜 View Certificate
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#E5E2DA] pt-3 md:pt-0">
              <span className="text-xs font-mono text-[#686661]">Due {m.dueDate}</span>
              {m.status === 'PENDING_APPROVAL' && (
                <button
                  onClick={() => handleDigitalSignOff(m.id)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                >
                  Sign Off Phase →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Cryptographic Milestone Certificate Modal */}
      {activeCertificate && (
        <MilestoneCertificate
          milestoneTitle={activeCertificate.title}
          projectName="Lumina Portal Workspace"
          clientName="Lumina Tech Inc."
          signedBy={activeCertificate.signedBy || 'Sarah Chen'}
          signedAt={activeCertificate.signedAt || 'Aug 14, 2026'}
          onClose={() => setActiveCertificate(null)}
        />
      )}
    </div>
  );
}
