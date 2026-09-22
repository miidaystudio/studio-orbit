'use client';

import React, { useState } from 'react';
import { StagingPin } from '@/types/staging';

interface CopyEditOverlayProps {
  isActive: boolean;
  onClose: () => void;
  onSaveCopyPin: (originalText: string, updatedText: string, selectorPath: string) => void;
}

export default function CopyEditOverlay({ isActive, onClose, onSaveCopyPin }: CopyEditOverlayProps) {
  const [originalText, setOriginalText] = useState('Lumina Portal System');
  const [updatedText, setUpdatedText] = useState('Orbit Digital Cockpit v2');
  const [targetSelector] = useState('header > div > h1');

  if (!isActive) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedText.trim()) return;
    onSaveCopyPin(originalText, updatedText, targetSelector);
    onClose();
  };

  return (
    <div className="absolute inset-x-4 top-4 z-40 bg-[#121212] border border-emerald-500 rounded-2xl p-5 shadow-2xl text-white max-w-lg mx-auto animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="flex justify-between items-center mb-3 border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            ✍️ Copy-Deck Live Sync Mode Active
          </span>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-white text-xs">
          ✕
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
            Selected Target Element
          </label>
          <code className="text-xs font-mono text-[#C85A32] bg-neutral-900 px-2 py-1 rounded border border-neutral-800 block truncate">
            {targetSelector}
          </code>
        </div>

        {/* Visual Diff Rendering */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 space-y-2 text-xs font-sans">
          <span className="text-[9px] font-mono uppercase text-neutral-400 block">Live Visual Diff:</span>
          <div className="space-y-1">
            <p className="line-through text-rose-400 bg-rose-950/40 px-2 py-1 rounded border border-rose-900/50">
              - {originalText}
            </p>
            <p className="text-emerald-300 font-semibold bg-emerald-950/40 px-2 py-1 rounded border border-emerald-900/50">
              + {updatedText}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-mono uppercase text-neutral-400">
            Proposed Replacement Copy
          </label>
          <input
            type="text"
            required
            value={updatedText}
            onChange={(e) => setUpdatedText(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border border-neutral-700 text-neutral-400 text-xs rounded-lg hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            Save Copy Change Pin
          </button>
        </div>
      </form>
    </div>
  );
}
