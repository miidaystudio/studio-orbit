'use client';

import React, { useState } from 'react';
import { CanvasPinData } from '@studio-orbit/types';

interface PinCommentDrawerProps {
  pin: CanvasPinData;
  onClose: () => void;
  onResolve: () => void;
  onAddComment: (content: string) => void;
}

export default function PinCommentDrawer({ pin, onClose, onResolve, onAddComment }: PinCommentDrawerProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddComment(text);
      setText('');
    }
  };

  return (
    <div className="w-80 h-full border-l border-neutral-800 bg-[#141312] flex flex-col z-30 shadow-canvas">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex justify-between items-start">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#C85A32]">
            Pin Thread • ({pin.xPercent}%, {pin.yPercent}%)
          </span>
          <h3 className="text-sm font-serif font-bold text-white mt-0.5">{pin.title}</h3>
          <span
            className={`inline-block mt-1.5 text-[9px] uppercase font-mono px-2 py-0.5 rounded font-semibold border ${
              pin.status === 'RESOLVED'
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                : 'bg-amber-950 text-amber-400 border-amber-800'
            }`}
          >
            {pin.status}
          </span>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-white text-xs p-1">
          ✕
        </button>
      </div>

      {/* Action Controls */}
      {pin.status !== 'RESOLVED' && (
        <div className="p-3 border-b border-neutral-800 bg-neutral-900/60 flex justify-end">
          <button
            onClick={onResolve}
            className="px-3 py-1 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold rounded-lg transition"
          >
            ✓ Mark as Resolved
          </button>
        </div>
      )}

      {/* Threaded Comments */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {pin.comments.map((c) => (
          <div key={c.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-white">{c.authorName}</span>
              <span className="text-[9px] font-mono text-neutral-400">{c.createdAt}</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">{c.content}</p>
          </div>
        ))}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-800 bg-[#121110]">
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Reply or add coordinate note..."
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C85A32] resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#C85A32] hover:bg-[#B04B27] text-white text-xs font-semibold rounded-lg transition"
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
}
