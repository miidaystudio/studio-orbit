import React from 'react';
import Link from 'next/link';

export default async function ClientPortalOverview({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8 max-w-6xl mx-auto space-y-8">
      {/* Portal Header */}
      <header className="flex justify-between items-center border-b border-[#E9E2D3] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">Client Portal</span>
          <h1 className="text-3xl font-serif font-bold text-[#17140F] mt-1">Lumina Tech Private Workspace</h1>
        </div>
        <div className="flex gap-4 text-xs font-medium">
          <Link href={`/portal/${token}`} className="px-3 py-2 bg-white border border-[#E9E2D3] rounded-xl text-[#17140F]">
            Overview & Roadmap
          </Link>
          <Link href={`/portal/${token}/billing`} className="px-3 py-2 bg-white border border-[#E9E2D3] rounded-xl text-[#7B6E53] hover:text-[#17140F]">
            Billing & Retainer
          </Link>
        </div>
      </header>

      {/* Active Review Deliverable Callout */}
      <div className="bg-white border border-[#E9E2D3] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C85A32] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#E9E2D3]">
            Action Required • Review Canvas
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#17140F] mt-3">Lumina Portal Visual System v2</h2>
          <p className="text-sm text-[#7B6E53] mt-1">
            4 open feedback pins waiting for your coordinate review and approval.
          </p>
        </div>
        <Link
          href={`/portal/${token}/canvas/asset-99`}
          className="px-6 py-3 bg-[#17140F] hover:bg-[#2A241B] text-white font-medium text-sm rounded-xl transition shadow-sm whitespace-nowrap"
        >
          Open Review Canvas →
        </Link>
      </div>

      {/* Deliverable Milestones Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E9E2D3] rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7B6E53]">Sprint 1</h3>
          <p className="text-lg font-serif font-bold text-[#17140F] mt-1">Brand Strategy & Moodboard</p>
          <p className="text-xs text-emerald-600 font-medium mt-2">✓ Approved</p>
        </div>

        <div className="bg-white border border-[#E9E2D3] rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7B6E53]">Sprint 2</h3>
          <p className="text-lg font-serif font-bold text-[#17140F] mt-1">Web App Visual System</p>
          <p className="text-xs text-amber-600 font-medium mt-2">● In Client Review</p>
        </div>

        <div className="bg-white border border-[#E9E2D3] rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7B6E53]">Sprint 3</h3>
          <p className="text-lg font-serif font-bold text-[#17140F] mt-1">Component Library & Hand-off</p>
          <p className="text-xs text-[#7B6E53] font-medium mt-2">Upcoming</p>
        </div>
      </div>
    </div>
  );
}
