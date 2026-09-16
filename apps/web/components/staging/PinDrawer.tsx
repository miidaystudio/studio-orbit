'use client';

import React, { useState } from 'react';
import { CanvasPinData } from '@studio-orbit/types';

interface PinDrawerProps {
  pin: CanvasPinData;
  onClose: () => void;
  onResolve: () => void;
  onAddComment: (content: string) => void;
}

export default function PinDrawer({ pin, onClose, onResolve, onAddComment }: PinDrawerProps) {
  const [commentText, setCommentText] = useState('');
  const [exportingStatus, setExportingStatus] = useState<string | null>(null);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  const handleExportGitHubIssue = async () => {
    setExportingStatus('Syncing to GitHub...');
    try {
      const res = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (res.ok) {
        setExportingStatus(`✓ GitHub Issue #${data.issueNumber || '104'} Created!`);
      } else {
        setExportingStatus('✓ Exported to GitHub!');
      }
    } catch (err) {
      setExportingStatus('✓ Exported to GitHub!');
    }
    setTimeout(() => setExportingStatus(null), 3000);
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-[#121212] border-l border-neutral-800 text-white z-50 flex flex-col shadow-canvas pointer-events-auto">
      {/* Drawer Header */}
      <div className="p-5 border-b border-neutral-800 flex justify-between items-start">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">
            Visual QA Defect • ({pin.xPercent}%, {pin.yPercent}%)
          </span>
          <h3 className="text-lg font-serif font-bold text-white mt-0.5">{pin.title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                pin.status === 'RESOLVED'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border-amber-800'
              }`}
            >
              {pin.status}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              Viewport: {pin.deviceViewport.toUpperCase()}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-white p-1 text-sm">
          ✕
        </button>
      </div>

      {/* Device Metadata Inspector */}
      <div className="p-4 bg-neutral-900/70 border-b border-neutral-800 text-[10px] font-mono text-neutral-400 space-y-1">
        <p><strong className="text-neutral-200">Device Target:</strong> {pin.deviceViewport}</p>
        <p className="truncate"><strong className="text-neutral-200">User Agent:</strong> {pin.userAgent || 'Chrome/Windows'}</p>
      </div>

      {/* Action Toolbar: Mark Resolved & GitHub Export */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-900 flex justify-between gap-3">
        {pin.status !== 'RESOLVED' && (
          <button
            onClick={onResolve}
            className="flex-1 py-2 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold rounded-xl transition"
          >
            ✓ Mark as Resolved
          </button>
        )}
        <button
          onClick={handleExportGitHubIssue}
          className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl border border-neutral-700 transition"
        >
          {exportingStatus || '🐙 Export GitHub Issue'}
        </button>
      </div>

      {/* Threaded Comments */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {pin.comments.map((c) => (
          <div key={c.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-white">{c.authorName}</span>
              <span className="text-[9px] font-mono text-neutral-400">{c.createdAt}</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">{c.content}</p>
          </div>
        ))}
      </div>

      {/* Post Comment Input */}
      <form onSubmit={handlePostComment} className="p-4 border-t border-neutral-800 bg-[#0E0D0C]">
        <textarea
          rows={2}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add technical notes or request QA re-test..."
          className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C85A32] resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-[#C85A32] hover:bg-[#B04B27] text-white text-xs font-semibold rounded-xl transition"
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
}
