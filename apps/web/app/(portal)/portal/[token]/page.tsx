import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, Layers, Lock } from 'lucide-react';

export default async function ClientPortalOverview({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#111111] p-6 sm:p-12 max-w-6xl mx-auto space-y-8 font-sans antialiased">
      {/* Portal Header */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-[#346853] font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#346853]" />
            <span>Private Client Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-[#111111] uppercase tracking-tight">
            Lumina Tech Workspace
          </h1>
        </div>

        <div className="flex gap-2 text-xs font-semibold">
          <Link href={`/portal/${token}`} className="px-4 py-2 bg-[#111111] text-white rounded-xl shadow-xs">
            Overview & Roadmap
          </Link>
          <Link href={`/portal/${token}/billing`} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:text-[#111111] hover:bg-gray-50 transition">
            Billing & Retainer
          </Link>
        </div>
      </header>

      {/* Active Review Deliverable Callout */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#346853] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            Action Required • Review Canvas
          </span>
          <h2 className="text-2xl font-bold font-heading uppercase text-[#111111] tracking-tight">
            Lumina Portal Visual System v2
          </h2>
          <p className="text-xs text-gray-500 max-w-lg">
            4 coordinate feedback pins are waiting for your review and milestone sign-off.
          </p>
        </div>

        <Link
          href={`/portal/${token}/canvas/asset-99`}
          className="px-6 py-3.5 bg-[#111111] hover:bg-[#346853] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition shadow-sm flex items-center gap-2 whitespace-nowrap active:scale-95"
        >
          <span>Open Review Canvas</span>
          <ArrowRight className="w-4 h-4 text-[#346853]" />
        </Link>
      </div>

      {/* Deliverable Milestones Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Sprint 1</span>
          <p className="text-lg font-bold font-heading uppercase text-[#111111]">Brand Strategy & Moodboard</p>
          <p className="text-xs text-[#346853] font-bold flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved</span>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Sprint 2</span>
          <p className="text-lg font-bold font-heading uppercase text-[#111111]">Web App Visual System</p>
          <p className="text-xs text-amber-700 font-bold flex items-center gap-1.5 pt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>In Client Review</span>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Sprint 3</span>
          <p className="text-lg font-bold font-heading uppercase text-[#111111]">Component Library & Hand-off</p>
          <p className="text-xs text-gray-400 font-bold pt-1">Upcoming</p>
        </div>
      </div>
    </div>
  );
}
