'use client';

import React, { useState, useRef } from 'react';
import DeviceToolbar, { DEVICE_CONFIGS } from '@/components/staging/DeviceToolbar';
import PinDetailDrawer from '@/components/staging/PinDetailDrawer';
import { DevicePreset, StagingPin } from '@/types/staging';

export default function VisualQAStagingPage() {
  const [device, setDevice] = useState<DevicePreset>('desktop');
  const [stagingUrl, setStagingUrl] = useState('https://staging.lumina.design');
  const [zoom, setZoom] = useState(1.0);
  const [activePinId, setActivePinId] = useState<string | null>(null);

  const [draftPin, setDraftPin] = useState<{ xPercent: number; yPercent: number } | null>(null);
  const [draftComment, setDraftComment] = useState('');

  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const [pins, setPins] = useState<StagingPin[]>([
    {
      id: 'pin-101',
      xPercent: 34.5,
      yPercent: 22.8,
      status: 'OPEN',
      device: 'desktop',
      viewportWidth: 1440,
      viewportHeight: 900,
      author: 'Sarah Chen (Client)',
      comment: 'Can we try Playfair Display serif here for the hero headline instead of sans-serif?',
      createdAt: '15 mins ago',
    },
    {
      id: 'pin-102',
      xPercent: 68.4,
      yPercent: 46.2,
      status: 'RESOLVED',
      device: 'desktop',
      viewportWidth: 1440,
      viewportHeight: 900,
      author: 'Alex Rivera (Studio)',
      comment: 'Updated primary CTA hover contrast to Terracotta #C85A32.',
      createdAt: '2 hours ago',
      githubIssueUrl: 'https://github.com/miidaystudio/studio-orbit/issues/102',
    },
  ]);

  const currentDeviceConfig = DEVICE_CONFIGS[device];

  // Capture click coordinates relative to device container and convert to percentages
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!iframeContainerRef.current) return;
    const rect = iframeContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = Number(((clickX / rect.width) * 100).toFixed(1));
    const yPercent = Number(((clickY / rect.height) * 100).toFixed(1));

    setActivePinId(null);
    setDraftPin({ xPercent, yPercent });
    setDraftComment('');
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftPin || !draftComment.trim()) return;

    const newPin: StagingPin = {
      id: `pin-${Date.now()}`,
      xPercent: draftPin.xPercent,
      yPercent: draftPin.yPercent,
      status: 'OPEN',
      device,
      viewportWidth: currentDeviceConfig.width,
      viewportHeight: currentDeviceConfig.height,
      author: 'Sarah Chen (Client)',
      comment: draftComment,
      createdAt: 'Just now',
    };

    setPins((prev) => [...prev, newPin]);
    setActivePinId(newPin.id);
    setDraftPin(null);
    setDraftComment('');
  };

  const handleToggleStatus = (pinId: string) => {
    setPins((prev) =>
      prev.map((p) =>
        p.id === pinId
          ? { ...p, status: p.status === 'RESOLVED' ? ('OPEN' as const) : ('RESOLVED' as const) }
          : p
      )
    );
  };

  const handleSyncGitHub = (pinId: string, issueUrl: string) => {
    setPins((prev) =>
      prev.map((p) => (p.id === pinId ? { ...p, githubIssueUrl: issueUrl } : p))
    );
  };

  const activePin = pins.find((p) => p.id === activePinId);
  const openPinsCount = pins.filter((p) => p.status === 'OPEN').length;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F2EFE9] overflow-hidden">
      {/* Device & Zoom Toolbar */}
      <DeviceToolbar
        currentDevice={device}
        onDeviceChange={setDevice}
        stagingUrl={stagingUrl}
        onStagingUrlChange={setStagingUrl}
        currentZoom={zoom}
        onZoomChange={setZoom}
        openPinsCount={openPinsCount}
      />

      {/* Main Viewport Workspace Container */}
      <div className="flex-1 overflow-auto p-12 flex items-start justify-center relative select-none">
        <div
          style={{
            width: `${currentDeviceConfig.width}px`,
            height: `${currentDeviceConfig.height}px`,
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
          }}
          className="relative bg-white shadow-canvas border border-[#E5E2DA] rounded-2xl overflow-hidden transition-all duration-300"
        >
          {/* Transparent Coordinate Plane Overlay */}
          <div
            ref={iframeContainerRef}
            onClick={handleContainerClick}
            className="absolute inset-0 z-20 cursor-crosshair"
          >
            {/* Numbered Pin Markers */}
            {pins.map((pin, idx) => (
              <div
                key={pin.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setDraftPin(null);
                  setActivePinId(pin.id);
                }}
                style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center">
                  {pin.status === 'OPEN' && (
                    <span className="absolute w-8 h-8 rounded-full animate-ping opacity-75 bg-[#F59E0B]" />
                  )}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow-canvas transition-transform duration-200 group-hover:scale-125 ${
                      pin.status === 'RESOLVED'
                        ? 'bg-[#10B981] text-black ring-2 ring-emerald-400'
                        : 'bg-[#F59E0B] text-black ring-2 ring-amber-400'
                    } ${pin.id === activePinId ? 'scale-125 ring-4' : ''}`}
                  >
                    {idx + 1}
                  </div>
                </div>
              </div>
            ))}

            {/* Click-to-Pin Popover Composer */}
            {draftPin && (
              <div
                style={{ left: `${draftPin.xPercent}%`, top: `${draftPin.yPercent}%` }}
                onClick={(e) => e.stopPropagation()}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-40 w-80 bg-[#121212] border border-[#C85A32] rounded-2xl p-5 shadow-canvas text-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C85A32]">
                    New Pin • ({draftPin.xPercent}%, {draftPin.yPercent}%)
                  </span>
                  <button onClick={() => setDraftPin(null)} className="text-neutral-400 hover:text-white text-xs">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSavePin} className="space-y-3">
                  <textarea
                    rows={3}
                    required
                    autoFocus
                    value={draftComment}
                    onChange={(e) => setDraftComment(e.target.value)}
                    placeholder="Describe design defect or copy change..."
                    className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C85A32] resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setDraftPin(null)}
                      className="px-3 py-1.5 border border-neutral-700 text-neutral-400 text-xs rounded-lg hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#C85A32] hover:bg-[#B04B27] text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      Save Pin
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Staging Sandbox Render Canvas */}
          <div className="w-full h-full bg-[#F9F8F3] p-8 text-[#121212] overflow-y-auto pointer-events-none">
            <header className="border-b border-[#E5E2DA] pb-6 mb-8 flex justify-between items-center">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#C85A32]">Staging Build v2.4</span>
                <h1 className="text-3xl font-serif font-bold text-[#121212] mt-1">Lumina Portal System</h1>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono rounded-full font-semibold">
                ● Live Staging Frame
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
                  Click anywhere on the staging frame to log percentage coordinate pins and sync to GitHub Issues.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E5E2DA] p-8 rounded-2xl text-center shadow-editorial">
              <h3 className="text-2xl font-serif font-bold text-[#121212]">Interactive Deliverable Sandbox</h3>
              <p className="text-xs text-[#686661] mt-1">
                Target Device: <strong className="text-[#121212] font-mono">{currentDeviceConfig.label}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Inspection & GitHub Sync Drawer */}
      {activePin && (
        <PinDetailDrawer
          pin={activePin}
          onClose={() => setActivePinId(null)}
          onToggleStatus={handleToggleStatus}
          onSyncGitHub={handleSyncGitHub}
        />
      )}
    </div>
  );
}
