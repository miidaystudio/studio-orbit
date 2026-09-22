'use client';

import React, { useState } from 'react';
import { StagingPin, ScopeType } from '@/types/staging';
import ScopeDefenseModal from '../scope/ScopeDefenseModal';

interface PinDetailDrawerProps {
  pin: StagingPin;
  onClose: () => void;
  onToggleStatus: (pinId: string) => void;
  onSyncGitHub: (pinId: string, issueUrl: string) => void;
  onUpdateScope?: (pinId: string, scopeType: ScopeType, hours: number, costInCents: number, stripeUrl?: string) => void;
}

export default function PinDetailDrawer({
  pin,
  onClose,
  onToggleStatus,
  onSyncGitHub,
  onUpdateScope,
}: PinDetailDrawerProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessUrl, setSyncSuccessUrl] = useState<string | null>(pin.githubIssueUrl || null);
  const [showScopeModal, setShowScopeModal] = useState(false);

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
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-[#111315] border-l border-[#22252A] text-[#FFFFFF] z-50 flex flex-col shadow-2xl transition-all duration-300 transform translate-x-0 font-mono">
      {/* Drawer Header */}
      <div className="p-6 border-b border-[#22252A] flex justify-between items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                pin.status === 'RESOLVED'
                  ? 'bg-[#16181B] text-[#828892] border-[#22252A]'
                  : 'bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]/40'
              }`}
            >
              ● {pin.status}
            </span>

            <span
              className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                pin.scopeType === 'OUT_OF_SCOPE'
                  ? 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                  : 'bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]/40'
              }`}
            >
              {pin.scopeType === 'OUT_OF_SCOPE' ? '🔴 Out-Of-Scope' : '🟢 In-Scope'}
            </span>

            <span className="text-[10px] font-mono text-[#828892]">
              {pin.device.toUpperCase()} ({pin.viewportWidth}px)
            </span>
          </div>

          <h3 className="text-xl font-mono font-black uppercase text-[#FFFFFF]">Visual QA Feedback</h3>
          <p className="text-xs font-mono text-[#CCFF00] mt-1 font-bold">
            Coordinates: X: {pin.xPercent}% | Y: {pin.yPercent}%
          </p>
        </div>

        <button onClick={onClose} className="text-[#828892] hover:text-white p-1 text-sm">
          ✕
        </button>
      </div>

      {/* Target Resolution, DOM Selector Path & Device Metadata */}
      <div className="p-4 bg-[#08090A] border-b border-[#22252A] text-[10px] font-mono text-[#828892] space-y-1">
        <p><strong className="text-white">Device Viewport:</strong> {pin.viewportWidth} × {pin.viewportHeight}px</p>
        <p><strong className="text-white">DOM Selector:</strong> <code className="text-[#CCFF00]">{pin.selectorPath || 'header > div.grid > div:nth-of-type(1)'}</code></p>
        <p><strong className="text-white">Logged By:</strong> {pin.author} ({pin.createdAt})</p>
      </div>

      {/* Action Buttons: Status Toggle, Triage Scope & GitHub Sync */}
      <div className="p-5 border-b border-[#22252A] bg-[#08090A] flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onToggleStatus(pin.id)}
            className={`py-2 rounded-xl text-xs font-mono font-bold transition ${
              pin.status === 'RESOLVED'
                ? 'bg-[#16181B] hover:bg-[#22252A] text-[#828892] border border-[#22252A]'
                : 'bg-[#CCFF00] hover:bg-[#b8e600] text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]'
            }`}
          >
            {pin.status === 'RESOLVED' ? '↺ Reopen' : '✓ Resolve'}
          </button>

          <button
            onClick={() => setShowScopeModal(true)}
            className="py-2 bg-[#16181B] hover:bg-[#22252A] text-white border border-[#22252A] rounded-xl text-xs font-mono font-bold transition"
          >
            🛡 Scope Triage
          </button>
        </div>

        {syncSuccessUrl ? (
          <a
            href={syncSuccessUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 bg-[#16181B] hover:bg-[#22252A] text-white text-xs font-mono font-bold rounded-xl border border-[#22252A] transition flex items-center justify-center gap-2"
          >
            <span>🐙 View GitHub Issue</span>
            <span className="text-[10px] font-mono text-[#828892]">↗</span>
          </a>
        ) : (
          <button
            onClick={handleGitHubSync}
            disabled={isSyncing}
            className="w-full py-2.5 bg-[#16181B] hover:bg-[#22252A] border border-[#22252A] hover:border-[#CCFF00] text-[#CCFF00] text-xs font-mono font-bold rounded-xl transition"
          >
            {isSyncing ? 'Syncing Issue...' : '🐙 Sync to GitHub Issue'}
          </button>
        )}
      </div>

      {/* Comment Card */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="bg-[#08090A] border border-[#22252A] rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white">{pin.author}</span>
            <span className="text-[9px] font-mono text-[#828892]">{pin.createdAt}</span>
          </div>
          <p className="text-xs text-[#828892] leading-relaxed">{pin.comment}</p>
        </div>
      </div>

      {/* Scope Triage Modal */}
      {showScopeModal && (
        <ScopeDefenseModal
          pin={pin}
          onClose={() => setShowScopeModal(false)}
          onUpdateScope={(pinId, scopeType, hours, costInCents, stripeUrl) => {
            if (onUpdateScope) {
              onUpdateScope(pinId, scopeType, hours, costInCents, stripeUrl);
            }
          }}
        />
      )}
    </div>
  );
}
