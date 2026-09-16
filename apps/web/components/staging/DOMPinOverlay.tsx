'use client';

import React, { useState, useRef } from 'react';
import { CanvasPinData, DeviceViewport } from '@studio-orbit/types';
import PinDrawer from './PinDrawer';

interface DOMPinOverlayProps {
  deviceViewport: DeviceViewport;
  scale: number;
}

export default function DOMPinOverlay({ deviceViewport, scale }: DOMPinOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [draftPin, setDraftPin] = useState<{ xPercent: number; yPercent: number } | null>(null);
  const [draftText, setDraftText] = useState('');

  const [pins, setPins] = useState<CanvasPinData[]>([
    {
      id: 'pin-1',
      projectId: 'proj-1',
      xPercent: 34.5,
      yPercent: 24.2,
      deviceViewport: 'desktop',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      title: 'Hero Typography Serif Styling',
      status: 'OPEN',
      createdAt: '15 mins ago',
      comments: [
        {
          id: 'c1',
          pinId: 'pin-1',
          authorName: 'Sarah Chen',
          authorRole: 'CLIENT',
          content: 'Can we try Playfair Display serif here instead of sans-serif?',
          createdAt: '15 mins ago',
        },
      ],
    },
    {
      id: 'pin-2',
      projectId: 'proj-1',
      xPercent: 68.2,
      yPercent: 48.6,
      deviceViewport: 'desktop',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      title: 'CTA Hover Color Contrast',
      status: 'RESOLVED',
      createdAt: '2 hours ago',
      comments: [
        {
          id: 'c2',
          pinId: 'pin-2',
          authorName: 'Alex Rivera',
          authorRole: 'STUDIO_ADMIN',
          content: 'Updated CTA button hover color to Terracotta #C85A32.',
          createdAt: '2 hours ago',
        },
      ],
    },
  ]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = Number(((clickX / rect.width) * 100).toFixed(1));
    const yPercent = Number(((clickY / rect.height) * 100).toFixed(1));

    setActivePinId(null);
    setDraftPin({ xPercent, yPercent });
    setDraftText('');
  };

  const handleCommitDraftPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftPin || !draftText.trim()) return;

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Browser';

    const newPin: CanvasPinData = {
      id: `pin-${Date.now()}`,
      projectId: 'proj-1',
      xPercent: draftPin.xPercent,
      yPercent: draftPin.yPercent,
      deviceViewport,
      userAgent,
      title: `QA Pin (${draftPin.xPercent}%, ${draftPin.yPercent}%)`,
      status: 'OPEN',
      createdAt: 'Just now',
      comments: [
        {
          id: `c-${Date.now()}`,
          pinId: `pin-${Date.now()}`,
          authorName: 'Sarah Chen (Client)',
          authorRole: 'CLIENT',
          content: draftText,
          createdAt: 'Just now',
        },
      ],
    };

    setPins((prev) => [...prev, newPin]);
    setActivePinId(newPin.id);
    setDraftPin(null);
    setDraftText('');
  };

  const activePin = pins.find((p) => p.id === activePinId);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Click Plane */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="absolute inset-0 pointer-events-auto cursor-crosshair"
      >
        {/* Render Pins */}
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
                <span className="absolute w-8 h-8 rounded-full animate-ping opacity-75 bg-amber-500" />
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow-canvas transition-transform group-hover:scale-125 ${
                  pin.status === 'OPEN'
                    ? 'bg-amber-500 text-black ring-2 ring-amber-400'
                    : 'bg-emerald-500 text-black ring-2 ring-emerald-400'
                } ${pin.id === activePinId ? 'scale-125 ring-4' : ''}`}
              >
                {idx + 1}
              </div>
            </div>
          </div>
        ))}

        {/* Floating Draft Composer Popover */}
        {draftPin && (
          <div
            style={{ left: `${draftPin.xPercent}%`, top: `${draftPin.yPercent}%` }}
            onClick={(e) => e.stopPropagation()}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-40 w-80 bg-[#121212] border border-[#C85A32] rounded-2xl p-4 shadow-canvas text-white"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C85A32]">
                New QA Pin • ({draftPin.xPercent}%, {draftPin.yPercent}%)
              </span>
              <button onClick={() => setDraftPin(null)} className="text-neutral-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleCommitDraftPin} className="space-y-3">
              <textarea
                rows={3}
                required
                autoFocus
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Log visual defect, padding issue, or copy request..."
                className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C85A32] resize-none"
              />
              <div className="flex justify-between items-center pt-1">
                <span className="text-[9px] font-mono text-neutral-400">
                  Logged: {deviceViewport.toUpperCase()}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDraftPin(null)}
                    className="px-3 py-1.5 border border-neutral-700 text-neutral-400 text-xs rounded-lg hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#C85A32] text-white text-xs font-semibold rounded-lg hover:bg-[#B04B27]"
                  >
                    Post Pin
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Inspection Drawer */}
      {activePin && (
        <PinDrawer
          pin={activePin}
          onClose={() => setActivePinId(null)}
          onResolve={() => {
            setPins((prev) =>
              prev.map((p) => (p.id === activePin.id ? { ...p, status: 'RESOLVED' as const } : p))
            );
          }}
          onAddComment={(content) => {
            setPins((prev) =>
              prev.map((p) =>
                p.id === activePin.id
                  ? {
                      ...p,
                      comments: [
                        ...p.comments,
                        {
                          id: `c-${Date.now()}`,
                          pinId: p.id,
                          authorName: 'Sarah Chen',
                          authorRole: 'CLIENT',
                          content,
                          createdAt: 'Just now',
                        },
                      ],
                    }
                  : p
              )
            );
          }}
        />
      )}
    </div>
  );
}
