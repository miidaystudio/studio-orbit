'use client';

import React, { useState, useRef } from 'react';
import FeedbackPin from './FeedbackPin';
import PinCommentDrawer from './PinCommentDrawer';
import VersionStack from './VersionStack';
import { CanvasPinData } from '@studio-orbit/types';

interface ReviewCanvasProps {
  assetId: string;
}

export default function ReviewCanvas({ assetId }: ReviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [draftPin, setDraftPin] = useState<{ xPercent: number; yPercent: number } | null>(null);
  const [draftComment, setDraftComment] = useState('');

  const [pins, setPins] = useState<CanvasPinData[]>([
    {
      id: 'pin-1',
      assetId,
      xPercent: 35.4,
      yPercent: 28.2,
      status: 'OPEN',
      title: 'Hero Title Serif Typography',
      authorName: 'Sarah Chen (Client)',
      createdAt: '10 mins ago',
      comments: [
        {
          id: 'c1',
          pinId: 'pin-1',
          authorName: 'Sarah Chen',
          role: 'CLIENT',
          authorRole: 'CLIENT',
          content: 'Can we try a warmer serif tone here instead of standard sans?',
          createdAt: '10 mins ago',
        },
        {
          id: 'c2',
          pinId: 'pin-1',
          authorName: 'Alex Rivera',
          role: 'STUDIO_ADMIN',
          authorRole: 'STUDIO_ADMIN',
          content: 'Switched to Playfair Display / Instrument Serif in v2 mockup.',
          createdAt: '5 mins ago',
        },
      ],
    },
    {
      id: 'pin-2',
      assetId,
      xPercent: 62.1,
      yPercent: 55.8,
      status: 'RESOLVED',
      title: 'CTA Contrast & Terracotta Accent',
      authorName: 'Alex Rivera (Studio)',
      createdAt: '1 hour ago',
      comments: [
        {
          id: 'c3',
          pinId: 'pin-2',
          authorName: 'Alex Rivera',
          role: 'STUDIO_ADMIN',
          authorRole: 'STUDIO_ADMIN',
          content: 'Updated primary button hover state to Terracotta #C85A32.',
          createdAt: '1 hour ago',
        },
      ],
    },
  ]);

  // Accurately map mouse clicks to percentage coordinates (0-100%)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = Number(((clickX / rect.width) * 100).toFixed(1));
    const yPercent = Number(((clickY / rect.height) * 100).toFixed(1));

    setActivePinId(null);
    setDraftPin({ xPercent, yPercent });
    setDraftComment('');
  };

  const handleCommitDraftPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftPin || !draftComment.trim()) return;

    const newPin: CanvasPinData = {
      id: `pin-${Date.now()}`,
      assetId,
      xPercent: draftPin.xPercent,
      yPercent: draftPin.yPercent,
      status: 'OPEN',
      title: `Note at (${draftPin.xPercent}%, ${draftPin.yPercent}%)`,
      authorName: 'Sarah Chen (Client)',
      createdAt: 'Just now',
      comments: [
        {
          id: `c-${Date.now()}`,
          pinId: `pin-${Date.now()}`,
          authorName: 'Sarah Chen',
          role: 'CLIENT',
          authorRole: 'CLIENT',
          content: draftComment,
          createdAt: 'Just now',
        },
      ],
    };

    setPins((prev) => [...prev, newPin]);
    setActivePinId(newPin.id);
    setDraftPin(null);
    setDraftComment('');
  };

  const handleResolvePin = (pinId: string) => {
    setPins((prev) =>
      prev.map((p) => (p.id === pinId ? { ...p, status: 'RESOLVED' as const } : p))
    );
  };

  const activePin = pins.find((p) => p.id === activePinId);

  return (
    <div className="relative w-full h-full flex bg-[#0E0D0C] overflow-hidden">
      {/* Zoom Controls & Metadata */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-3 bg-[#1A1918]/90 backdrop-blur-md border border-neutral-800 p-2 rounded-xl shadow-canvas text-xs">
        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
          className="w-7 h-7 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg flex items-center justify-center font-bold"
        >
          -
        </button>
        <span className="text-neutral-300 font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => setScale((s) => Math.min(2, s + 0.1))}
          className="w-7 h-7 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg flex items-center justify-center font-bold"
        >
          +
        </button>
        <button
          onClick={() => setScale(1)}
          className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] uppercase font-mono rounded-lg"
        >
          Reset
        </button>
      </div>

      <VersionStack />

      {/* Main Viewport Container */}
      <div className="flex-1 flex items-center justify-center p-12 overflow-auto select-none">
        <div
          ref={containerRef}
          onClick={handleCanvasClick}
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
          className="relative cursor-crosshair border border-neutral-800 shadow-canvas rounded-xl bg-neutral-900 transition-transform duration-100 max-w-5xl"
        >
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
            alt="Review Asset Deliverable"
            className="w-full h-auto block rounded-xl select-none"
          />

          {/* Existing Pins */}
          {pins.map((pin, idx) => (
            <FeedbackPin
              key={pin.id}
              pin={pin}
              index={idx + 1}
              isActive={pin.id === activePinId}
              onClick={(e) => {
                e.stopPropagation();
                setDraftPin(null);
                setActivePinId(pin.id);
              }}
            />
          ))}

          {/* Draft Pin Popover Composer */}
          {draftPin && (
            <div
              style={{ left: `${draftPin.xPercent}%`, top: `${draftPin.yPercent}%` }}
              onClick={(e) => e.stopPropagation()}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 w-72 bg-[#1A1918] border border-[#C85A32] rounded-2xl p-4 shadow-canvas"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C85A32]">
                  New Pin • ({draftPin.xPercent}%, {draftPin.yPercent}%)
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
                  value={draftComment}
                  onChange={(e) => setDraftComment(e.target.value)}
                  placeholder="Type feedback or design request..."
                  className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C85A32] resize-none"
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
                    className="px-3 py-1.5 bg-[#C85A32] text-white text-xs font-semibold rounded-lg hover:bg-[#B04B27]"
                  >
                    Post Pin
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Side Comment Inspection Drawer */}
      {activePin && (
        <PinCommentDrawer
          pin={activePin}
          onClose={() => setActivePinId(null)}
          onResolve={() => handleResolvePin(activePin.id)}
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
                          role: 'CLIENT',
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
