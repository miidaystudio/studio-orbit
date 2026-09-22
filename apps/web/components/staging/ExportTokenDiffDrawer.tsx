'use client';

import React, { useState } from 'react';
import { DesignTokenSet } from '@studio-orbit/types';

interface ExportTokenDiffDrawerProps {
  tokens: DesignTokenSet;
  onClose: () => void;
}

export default function ExportTokenDiffDrawer({ tokens, onClose }: ExportTokenDiffDrawerProps) {
  const [copied, setCopied] = useState(false);

  const fontStyleCss =
    tokens.fontFamily === 'serif'
      ? '"Instrument Serif", serif'
      : tokens.fontFamily === 'mono'
      ? '"JetBrains Mono", monospace'
      : '"Plus Jakarta Sans", sans-serif';

  const tailwindV4Config = `@theme {
  --color-background: ${tokens.colorTokens.background};
  --color-primary: ${tokens.colorTokens.primary};
  --color-accent: ${tokens.colorTokens.accent};
  --radius-custom: ${tokens.radius}px;
  --font-brand: ${fontStyleCss};
}

/* CSS Variables Root Export */
:root {
  --bg-parchment: ${tokens.colorTokens.background};
  --text-primary: ${tokens.colorTokens.primary};
  --brand-terracotta: ${tokens.colorTokens.accent};
  --border-radius-base: ${tokens.radius}px;
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(tailwindV4Config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-neutral-800 w-full max-w-xl rounded-3xl p-6 text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#C85A32]">Tailwind CSS v4 & Native Export</span>
            <h3 className="text-xl font-serif font-bold text-white">Export Design Token Diff</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1 text-sm">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 relative">
            <pre className="text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {tailwindV4Config}
            </pre>

            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 px-3 py-1.5 bg-[#C85A32] hover:bg-[#B04B27] text-white text-[11px] font-mono font-semibold rounded-lg shadow-sm transition"
            >
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy Config'}
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-700 text-neutral-300 text-xs font-mono rounded-xl hover:bg-neutral-800"
            >
              Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
