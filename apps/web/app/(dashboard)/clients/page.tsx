'use client';

import React from 'react';
import Link from 'next/link';

export default function ClientsDirectoryPage() {
  const clients = [
    {
      id: 'c1',
      companyName: 'Lumina Tech',
      contactName: 'Sarah Chen',
      email: 'sarah@lumina.io',
      portalToken: 'lumina-portal-token-9988',
      activeProjectsCount: 1,
      totalBilledFormatted: '$35,000',
    },
    {
      id: 'c2',
      companyName: 'Aether Labs',
      contactName: 'Marcus Vance',
      email: 'marcus@aether.design',
      portalToken: 'aether-portal-token-1122',
      activeProjectsCount: 1,
      totalBilledFormatted: '$50,000',
    },
    {
      id: 'c3',
      companyName: 'Kinesis Co',
      contactName: 'Elena Rostova',
      email: 'elena@kinesis.io',
      portalToken: 'kinesis-portal-token-3344',
      activeProjectsCount: 1,
      totalBilledFormatted: '$28,000',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E5E2DA] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">Directory</span>
          <h1 className="text-3xl font-serif font-bold text-[#121212] mt-1">Client Directory</h1>
          <p className="text-sm text-[#686661] mt-1">
            Manage client magic workspace access tokens, contact profiles, and private portals.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-[#121212] hover:bg-[#2A241B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-editorial transition">
          + Add Client Profile
        </button>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clients.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-[#E5E2DA] rounded-2xl p-6 shadow-editorial hover:border-[#C85A32] transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-serif font-bold text-[#121212]">{c.companyName}</h3>
                <span className="text-[10px] font-mono bg-[#F9F8F3] border border-[#E5E2DA] px-2 py-0.5 rounded text-[#686661]">
                  Active Client
                </span>
              </div>
              <p className="text-xs text-[#686661] mb-4">
                Primary Contact: <strong className="text-[#121212]">{c.contactName}</strong> ({c.email})
              </p>

              <div className="text-xs space-y-1.5 text-[#686661] border-t border-[#E5E2DA] pt-4 font-mono">
                <div className="flex justify-between">
                  <span>Portal Token:</span>
                  <span className="font-semibold text-[#121212]">{c.portalToken.slice(0, 15)}...</span>
                </div>
                <div className="flex justify-between">
                  <span>Lifetime Billed:</span>
                  <span className="font-semibold text-[#121212]">{c.totalBilledFormatted}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E2DA] flex justify-end">
              <Link
                href={`/portal/${c.portalToken}`}
                className="text-xs font-semibold text-[#C85A32] hover:underline"
              >
                Launch Client Workspace →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
