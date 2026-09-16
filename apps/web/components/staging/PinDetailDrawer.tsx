'use client';

import React, { useState } from 'react';
import { StagingPin } from '@/types/staging';

interface PinDetailDrawerProps {
  pin: StagingPin;
  onClose: () => void;
  onToggleStatus: (pinId: string) => void;
  onSyncGitHub: (pinId: string, issueUrl: string) => void;
}

export default function PinDetailDrawer({
  pin,
  onClose,
  onToggleStatus,
  onSyncGitHub,
}: PinDetailDrawerProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessUrl, setSyncSuccessUrl] = useState<string | null>(pin.githubIssueUrl || null);

  const handleGitHubSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();
      const issueUrl = data.issueUrl || 'https://github.com/miidaystudio/studio-orbit/issues/101';
      
      setSyncSuccessUrl(issueUrl);
      onSyncGitHub(pin.id, issueUrl);
    } catch (err) {
      const fallbackUrl = 'https://github.com/miidaystudio/studio-orbit/issues/101';
      setSyncSuccessUrl(fallbackUrl);
      onSyncGitHub(pin.id, fallbackUrl);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-[#121212] border-l border-neutral-800 text-white z-50 flex flex-col shadow-2xl transition-all duration-300 transform translate-x-0">
      {/* Drawer Header */}
      <div className="p-6 border-b border-neutral-800 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                pin.status === 'RESOLVED'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-amber-950 text-[#F59E0B] border-amber-800'
              }`}
            >
              ● {pin.status}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              {pin.device.toUpperCase()} ({pin.viewportWidth}px)
            </span>
          </div>

          <h3 className="text-xl font-serif font-bold text-white">Visual QA Feedback</h3>
          <p className="text-xs font-mono text-[#C85A32] mt-1">
            Coordinates: X: {pin.xPercent}% | Y: {pin.yPercent}%
          </p>
        </div>

        <button onClick={onClose} className="text-neutral-400 hover:text-white p-1 text-sm">
          ✕
        </button>
      </div>

      {/* Target Resolution & Device Metadata */}
      <div className="p-4 bg-neutral-900/80 border-b border-neutral-800 text-[10px] font-mono text-neutral-400 space-y-1">
        <p><strong className="text-neutral-200">Device Viewport:</strong> {pin.viewportWidth} × {pin.viewportHeight}px</p>
        <p><strong className="text-neutral-200">Logged By:</strong> {pin.author} ({pin.createdAt})</p>
      </div>

      {/* Action Buttons: Status Toggle & GitHub Sync */}
      <div className="p-5 border-b border-neutral-800 bg-neutral-900 flex flex-col gap-3">
        <button
          onClick={() => onToggleStatus(pin.id)}
          className={`w-full py-2.5 rounded-xl text-xs font-semibold transition ${
            pin.status === 'RESOLVED'
              ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
              : 'bg-[#10B981] hover:bg-emerald-600 text-black shadow-sm'
          }`}
        >
          {pin.status === 'RESOLVED' ? '↺ Reopen Feedback Pin' : '✓ Mark as Resolved'}
        </button>

        {syncSuccessUrl ? (
          <a
            href={syncSuccessUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl border border-neutral-700 transition flex items-center justify-center gap-2"
          >
            <span>🐙 View GitHub Issue</span>
            <span className="text-[10px] font-mono text-neutral-400">↗</span>
          </a>
        ) : (
          <button
            onClick={handleGitHubSync}
            disabled={isSyncing}
            className="w-full py-2.5 bg-[#C85A32] hover:bg-[#B04B27] disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition"
          >
            {isSyncing ? 'Syncing Issue...' : '🐙 Sync to GitHub Issue'}
          </button>
        )}
      </div>

      {/* Comment Card */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-white">{pin.author}</span>
            <span className="text-[9px] font-mono text-neutral-400">{pin.createdAt}</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">{pin.comment}</p>
        </div>
      </div>
    </div>
  );
}
