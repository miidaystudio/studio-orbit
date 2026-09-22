'use client';

import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-[#0F172A] text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-[0_20px_40px_-15px_rgba(15,23,42,0.3)] border border-white/10 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono">{message}</span>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white text-xs font-mono ml-2 border-l border-white/10 pl-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
