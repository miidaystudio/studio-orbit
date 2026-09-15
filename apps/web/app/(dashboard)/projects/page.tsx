'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ProjectCard {
  id: string;
  title: string;
  clientName: string;
  clientToken: string;
  status: 'Active' | 'In Review' | 'Completed';
  budgetFormatted: string;
  spentFormatted: string;
  percentageSpent: number;
  assetId: string;
}

export default function ProjectsOverviewPage() {
  const [showModal, setShowModal] = useState(false);

  const projects: ProjectCard[] = [
    {
      id: 'proj-1',
      title: 'Lumina Brand Identity & Portal System',
      clientName: 'Lumina Tech',
      clientToken: 'lumina-portal-token-9988',
      status: 'Active',
      budgetFormatted: '$35,000',
      spentFormatted: '$18,500',
      percentageSpent: 53,
      assetId: 'asset-99',
    },
    {
      id: 'proj-2',
      title: 'Aether Mobile App Redesign',
      clientName: 'Aether Labs',
      clientToken: 'aether-portal-token-1122',
      status: 'In Review',
      budgetFormatted: '$50,000',
      spentFormatted: '$42,000',
      percentageSpent: 84,
      assetId: 'asset-88',
    },
    {
      id: 'proj-3',
      title: 'Kinesis E-Commerce System',
      clientName: 'Kinesis Co',
      clientToken: 'kinesis-portal-token-3344',
      status: 'Completed',
      budgetFormatted: '$28,000',
      spentFormatted: '$28,000',
      percentageSpent: 100,
      assetId: 'asset-77',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E5E2DA] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">Cockpit</span>
          <h1 className="text-3xl font-serif font-bold text-[#121212] mt-1">Active Projects</h1>
          <p className="text-sm text-[#686661] mt-1">
            Studio deliverable roadmaps, budget burn rates, and coordinate-pinned review canvases.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-[#121212] hover:bg-[#2A241B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-editorial transition"
        >
          + New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-[#E5E2DA] rounded-2xl p-6 shadow-editorial hover:border-[#C85A32] transition flex flex-col justify-between"
          >
            <div>
              {/* Header Badges */}
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono font-semibold text-[#686661] uppercase tracking-wider">
                  {p.clientName}
                </span>
                <span
                  className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-semibold border ${
                    p.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : p.status === 'In Review'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-serif font-bold text-[#121212] mb-6 leading-snug">{p.title}</h2>

              {/* Budget Progress Meter */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs text-[#686661] font-mono">
                  <span>Spent: <strong className="text-[#121212]">{p.spentFormatted}</strong></span>
                  <span>Cap: <strong className="text-[#121212]">{p.budgetFormatted}</strong></span>
                </div>
                <div className="h-2 w-full bg-[#F9F8F3] border border-[#E5E2DA] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${p.percentageSpent}%` }}
                    className={`h-full transition-all duration-500 ${
                      p.percentageSpent >= 100
                        ? 'bg-neutral-800'
                        : p.percentageSpent > 75
                        ? 'bg-amber-600'
                        : 'bg-[#C85A32]'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Action Links */}
            <div className="border-t border-[#E5E2DA] pt-4 flex justify-between items-center text-xs">
              <Link
                href={`/portal/${p.clientToken}`}
                className="font-medium text-[#686661] hover:text-[#121212] transition"
              >
                Client Portal
              </Link>
              <Link
                href={`/portal/${p.clientToken}/canvas/${p.assetId}`}
                className="font-semibold text-[#C85A32] hover:underline"
              >
                Open Workspace →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal Trigger */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#121212]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E2DA] max-w-md w-full rounded-2xl p-6 shadow-canvas">
            <h3 className="text-xl font-serif font-bold text-[#121212] mb-2">Create Studio Project</h3>
            <p className="text-xs text-[#686661] mb-6">Instantly generates client magic token and visual review canvas.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono tracking-wider text-[#686661] mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lumina Brand Identity"
                  className="w-full p-3 bg-[#F9F8F3] border border-[#E5E2DA] rounded-xl text-[#121212] focus:outline-none focus:border-[#C85A32]"
                />
              </div>
              <div>
                <label className="block uppercase font-mono tracking-wider text-[#686661] mb-1">Client Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lumina Tech"
                  className="w-full p-3 bg-[#F9F8F3] border border-[#E5E2DA] rounded-xl text-[#121212] focus:outline-none focus:border-[#C85A32]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E2DA]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#E5E2DA] text-[#686661] rounded-xl hover:bg-[#F9F8F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#121212] text-white rounded-xl font-semibold hover:bg-[#2A241B]"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
