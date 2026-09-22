'use client';

import React, { useRef } from 'react';

interface SplitViewCanvasProps {
  isSplitView: boolean;
  stagingUrl: string;
}

export default function SplitViewCanvas({ isSplitView, stagingUrl }: SplitViewCanvasProps) {
  const desktopRef = useRef<HTMLDivElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const isSyncingRef = useRef(false);

  const handleScroll = (sourceRef: React.RefObject<HTMLDivElement>) => {
    if (!sourceRef.current || isSyncingRef.current) return;
    isSyncingRef.current = true;

    const source = sourceRef.current;
    const maxScroll = source.scrollHeight - source.clientHeight;
    const scrollPercentage = maxScroll > 0 ? source.scrollTop / maxScroll : 0;

    const targets = [desktopRef, tabletRef, mobileRef].filter((r) => r !== sourceRef);

    targets.forEach((ref) => {
      if (ref.current) {
        const targetMax = ref.current.scrollHeight - ref.current.clientHeight;
        ref.current.scrollTop = scrollPercentage * targetMax;
      }
    });

    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  };

  if (!isSplitView) return null;

  return (
    <div className="absolute inset-0 bg-[#0E0D0C] z-30 p-6 flex gap-6 overflow-x-auto items-start select-none">
      {/* Desktop Frame */}
      <div className="flex flex-col h-full shrink-0 space-y-2" style={{ width: '680px' }}>
        <div className="bg-[#161514] px-4 py-2 border border-neutral-800 rounded-t-xl flex justify-between items-center text-xs font-mono text-neutral-400">
          <span>💻 Desktop (1440px)</span>
          <span className="text-emerald-400">● Scroll Sync</span>
        </div>
        <div
          ref={desktopRef}
          onScroll={() => handleScroll(desktopRef)}
          className="flex-1 bg-[#FAF8F5] border border-neutral-800 rounded-b-xl overflow-y-auto p-6 text-[#121212]"
        >
          <header className="border-b border-[#E5E2DA] pb-4 mb-6">
            <span className="text-[10px] font-mono uppercase text-[#C85A32]">Desktop Viewport</span>
            <h2 className="text-2xl font-serif font-bold text-[#121212]">Lumina Portal System</h2>
          </header>
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E2DA] p-6 rounded-2xl shadow-editorial">
              <h3 className="text-lg font-serif font-bold">Brand Strategy & Editorial Tokens</h3>
              <p className="text-xs text-[#686661] mt-1">Multi-device sync scroll harness active.</p>
            </div>
            <div className="bg-white border border-[#E5E2DA] p-6 rounded-2xl shadow-editorial">
              <h3 className="text-lg font-serif font-bold">Visual QA Staging Canvas</h3>
              <p className="text-xs text-[#686661] mt-1">Relative scroll ratio mirrored in real-time.</p>
            </div>
            <div className="h-96 bg-neutral-100 rounded-2xl flex items-center justify-center text-xs font-mono text-neutral-400">
              [Extended Viewport Canvas Content Buffer]
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Frame */}
      <div className="flex flex-col h-full shrink-0 space-y-2" style={{ width: '420px' }}>
        <div className="bg-[#161514] px-4 py-2 border border-neutral-800 rounded-t-xl flex justify-between items-center text-xs font-mono text-neutral-400">
          <span>📱 Tablet (768px)</span>
          <span className="text-emerald-400">● Scroll Sync</span>
        </div>
        <div
          ref={tabletRef}
          onScroll={() => handleScroll(tabletRef)}
          className="flex-1 bg-[#FAF8F5] border border-neutral-800 rounded-b-xl overflow-y-auto p-5 text-[#121212]"
        >
          <header className="border-b border-[#E5E2DA] pb-4 mb-6">
            <span className="text-[10px] font-mono uppercase text-[#C85A32]">Tablet Viewport</span>
            <h2 className="text-xl font-serif font-bold text-[#121212]">Lumina System</h2>
          </header>
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E2DA] p-5 rounded-2xl shadow-editorial">
              <h3 className="text-base font-serif font-bold">Brand Strategy</h3>
              <p className="text-xs text-[#686661] mt-1">Synchronized viewport layout.</p>
            </div>
            <div className="bg-white border border-[#E5E2DA] p-5 rounded-2xl shadow-editorial">
              <h3 className="text-base font-serif font-bold">QA Staging</h3>
              <p className="text-xs text-[#686661] mt-1">Scroll ratio mirrored.</p>
            </div>
            <div className="h-96 bg-neutral-100 rounded-2xl flex items-center justify-center text-xs font-mono text-neutral-400">
              [Tablet Content Buffer]
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Frame */}
      <div className="flex flex-col h-full shrink-0 space-y-2" style={{ width: '320px' }}>
        <div className="bg-[#161514] px-4 py-2 border border-neutral-800 rounded-t-xl flex justify-between items-center text-xs font-mono text-neutral-400">
          <span>📱 Mobile (375px)</span>
          <span className="text-emerald-400">● Scroll Sync</span>
        </div>
        <div
          ref={mobileRef}
          onScroll={() => handleScroll(mobileRef)}
          className="flex-1 bg-[#FAF8F5] border border-neutral-800 rounded-b-xl overflow-y-auto p-4 text-[#121212]"
        >
          <header className="border-b border-[#E5E2DA] pb-3 mb-4">
            <span className="text-[9px] font-mono uppercase text-[#C85A32]">Mobile Viewport</span>
            <h2 className="text-lg font-serif font-bold text-[#121212]">Lumina Mobile</h2>
          </header>
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E2DA] p-4 rounded-xl shadow-editorial">
              <h3 className="text-sm font-serif font-bold">Brand Mobile</h3>
              <p className="text-[11px] text-[#686661] mt-1">Sync scroll enabled.</p>
            </div>
            <div className="bg-white border border-[#E5E2DA] p-4 rounded-xl shadow-editorial">
              <h3 className="text-sm font-serif font-bold">Mobile QA</h3>
              <p className="text-[11px] text-[#686661] mt-1">Responsive frame.</p>
            </div>
            <div className="h-96 bg-neutral-100 rounded-xl flex items-center justify-center text-[10px] font-mono text-neutral-400">
              [Mobile Content Buffer]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
