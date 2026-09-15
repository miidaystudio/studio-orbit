import React from 'react';
import ReviewCanvas from '@/components/canvas/ReviewCanvas';

export default async function CanvasReviewPage({
  params,
}: {
  params: Promise<{ token: string; assetId: string }>;
}) {
  const { token, assetId } = await params;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#121212] text-white">
      {/* Top Bar Navigation */}
      <header className="h-14 border-b border-neutral-800 px-6 flex items-center justify-between bg-[#1A1A1A]">
        <div className="flex items-center gap-4">
          <a
            href={`/portal/${token}`}
            className="text-xs font-semibold text-neutral-400 hover:text-white transition"
          >
            ← Back to Portal
          </a>
          <span className="text-neutral-600">|</span>
          <span className="text-xs font-bold tracking-widest text-[#C85A32] uppercase">Asset Review Canvas</span>
          <h1 className="text-sm font-semibold text-white">Lumina Portal Hero Dashboard Layout</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-medium">
            Live Room: 2 Viewers
          </span>
          <button className="px-3 py-1.5 bg-[#C85A32] hover:bg-[#b04b27] text-white text-xs font-medium rounded-lg transition">
            Approve Version
          </button>
        </div>
      </header>

      {/* Main Review Viewport */}
      <div className="flex-1 relative overflow-hidden">
        <ReviewCanvas assetId={assetId} />
      </div>
    </div>
  );
}
