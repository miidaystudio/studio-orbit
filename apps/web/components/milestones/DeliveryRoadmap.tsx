'use client';

import React, { useState } from 'react';
import { Milestone } from '@studio-orbit/types';

interface DeliveryRoadmapProps {
  milestones?: Milestone[];
}

export default function DeliveryRoadmap({ milestones: initialMilestones }: DeliveryRoadmapProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(
    initialMilestones || [
      {
        id: 'm1',
        projectId: 'proj-1',
        title: 'Sprint 1: Brand Strategy & Moodboard',
        description: 'Visual positioning, editorial serif typography tokens, and color palette.',
        dueDate: 'Aug 15, 2026',
        status: 'APPROVED',
        signedBy: 'Sarah Chen',
        signedAt: 'Aug 14, 2026',
      },
      {
        id: 'm2',
        projectId: 'proj-1',
        title: 'Sprint 2: Web App Visual System & Review Canvas',
        description: 'Interactive review canvas & responsive UI component kit.',
        dueDate: 'Sep 30, 2026',
        status: 'PENDING_APPROVAL',
      },
      {
        id: 'm3',
        projectId: 'proj-1',
        title: 'Sprint 3: Component Library & Hand-off',
        description: 'Production React components and S3 asset pipeline.',
        dueDate: 'Oct 31, 2026',
        status: 'UPCOMING',
      },
    ]
  );

  const handleApprove = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'APPROVED' as const,
              signedBy: 'Sarah Chen (Digital Approval)',
              signedAt: new Date().toLocaleDateString(),
            }
          : m
      )
    );
  };

  return (
    <div className="bg-white border border-[#E5E2DA] rounded-2xl p-8 shadow-editorial space-y-8">
      <div className="flex justify-between items-center border-b border-[#E5E2DA] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">Phase Approvals</span>
          <h3 className="text-2xl font-serif font-bold text-[#121212] mt-1">Delivery & Scope Roadmap</h3>
        </div>
      </div>

      <div className="relative border-l-2 border-[#E5E2DA] ml-4 space-y-10 pl-8">
        {milestones.map((m, idx) => (
          <div key={m.id} className="relative">
            {/* Timeline node */}
            <span
              className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold ${
                m.status === 'APPROVED'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : m.status === 'PENDING_APPROVAL' || m.status === 'IN_PROGRESS'
                  ? 'border-[#C85A32] bg-[#C85A32] text-white'
                  : 'border-[#E5E2DA] bg-[#F9F8F3] text-[#686661]'
              }`}
            >
              {idx + 1}
            </span>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#F9F8F3] border border-[#E5E2DA] p-5 rounded-xl">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-serif font-bold text-[#121212]">{m.title}</h4>
                  <span
                    className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded font-semibold border ${
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
                <p className="text-xs text-[#686661] mt-1">{m.description}</p>
                {m.signedBy && (
                  <p className="text-[10px] font-mono text-emerald-700 mt-2">
                    ✓ Signed by {m.signedBy} on {m.signedAt}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#E5E2DA] pt-3 md:pt-0">
                <span className="text-xs font-mono font-medium text-[#686661]">
                  Due {m.dueDate}
                </span>

                {m.status === 'PENDING_APPROVAL' && (
                  <button
                    onClick={() => handleApprove(m.id)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                  >
                    Approve Sprint
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
