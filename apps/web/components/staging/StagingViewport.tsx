'use client';

import React, { useState } from 'react';
import { DeviceViewport, ZoomPreset } from '@studio-orbit/types';
import DOMPinOverlay from './DOMPinOverlay';

export default function StagingViewport() {
  const [viewport, setViewport] = useState<DeviceViewport>('desktop');
  const [zoom, setZoom] = useState<ZoomPreset>('100%');

  const getViewportWidth = () => {
    switch (viewport) {
      case 'desktop':
        return 1440;
      case 'tablet':
        return 768;
      case 'mobile':
        return 375;
    }
  };

  const getScale = () => {
    switch (zoom) {
      case '50%':
        return 0.5;
      case '75%':
        return 0.75;
      case '100%':
        return 1.0;
      case 'fit':
        return 0.65;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0E0D0C] text-white overflow-hidden">
      {/* Device & Zoom Controls Toolbar */}
      <div className="h-14 border-b border-neutral-800 bg-[#161514] px-6 flex items-center justify-between z-30 shadow-md">
        <div className="flex items-center gap-6">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C85A32]">
            Visual QA Sandbox
          </span>

          {/* Device Selector Buttons */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
            <button
              onClick={() => setViewport('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                viewport === 'desktop' ? 'bg-[#C85A32] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              💻 Desktop (1440px)
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                viewport === 'tablet' ? 'bg-[#C85A32] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              📱 Tablet (768px)
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                viewport === 'mobile' ? 'bg-[#C85A32] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              📱 Mobile (375px)
            </button>
          </div>
        </div>

        {/* Zoom Preset Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-neutral-400">Zoom:</span>
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
            {(['50%', '75%', '100%', 'fit'] as ZoomPreset[]).map((z) => (
              <button
                key={z}
                onClick={() => setZoom(z)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition ${
                  zoom === z ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {z.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Viewport Workspace */}
      <div className="flex-1 overflow-auto p-12 flex items-center justify-center relative">
        <div
          style={{
            width: `${getViewportWidth()}px`,
            height: viewport === 'mobile' ? '667px' : '900px',
            transform: `scale(${getScale()})`,
            transformOrigin: 'top center',
          }}
          className="relative bg-white shadow-canvas border border-neutral-800 rounded-xl overflow-hidden transition-all duration-300"
        >
          {/* Staging Render Canvas (Interactive Frame) */}
          <div className="w-full h-full bg-[#FAF8F5] p-8 text-[#121212] overflow-y-auto select-none pointer-events-none">
            <header className="border-b border-[#E5E2DA] pb-6 mb-8 flex justify-between items-center">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">Staging Build v2.4</span>
                <h1 className="text-3xl font-serif font-bold text-[#121212] mt-1">Lumina Portal System</h1>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono rounded-full font-semibold">
                ● Live Staging URL
              </span>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white border border-[#E5E2DA] p-6 rounded-2xl shadow-editorial">
                <span className="text-xs font-mono uppercase text-[#686661]">Phase 1</span>
                <h2 className="text-xl font-serif font-bold text-[#121212] mt-1">Brand Identity System</h2>
                <p className="text-xs text-[#686661] mt-2 leading-relaxed">
                  Editorial serif typography paired with warm parchment layout boundaries and Terracotta accent tokens.
                </p>
              </div>
              <div className="bg-white border border-[#E5E2DA] p-6 rounded-2xl shadow-editorial">
                <span className="text-xs font-mono uppercase text-[#686661]">Phase 2</span>
                <h2 className="text-xl font-serif font-bold text-[#121212] mt-1">Visual QA Sandbox</h2>
                <p className="text-xs text-[#686661] mt-2 leading-relaxed">
                  Click anywhere on the coordinate plane above to drop defect pins and export directly to GitHub Issues.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E5E2DA] p-8 rounded-2xl text-center shadow-editorial">
              <h3 className="text-2xl font-serif font-bold text-[#121212]">Interactive Deliverable Sandbox</h3>
              <p className="text-xs text-[#686661] mt-1">
                Viewport Width: <strong className="text-[#121212] font-mono">{getViewportWidth()}px</strong> • Zoom: <strong className="text-[#121212] font-mono">{zoom}</strong>
              </p>
            </div>
          </div>

          {/* DOM Pin Overlay Layer */}
          <DOMPinOverlay deviceViewport={viewport} scale={getScale()} />
        </div>
      </div>
    </div>
  );
}
