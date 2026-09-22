'use client';

import React, { useState } from 'react';
import { DesignTokenSet } from '@studio-orbit/types';
import ExportTokenDiffDrawer from './ExportTokenDiffDrawer';

interface ThemePlaygroundSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTokens: (tokens: DesignTokenSet) => void;
}

export default function ThemePlaygroundSidebar({
  isOpen,
  onClose,
  onApplyTokens,
}: ThemePlaygroundSidebarProps) {
  const [tokens, setTokens] = useState<DesignTokenSet>({
    name: 'Parchment Terracotta',
    radius: 12,
    fontFamily: 'serif',
    fontScale: 1.0,
    colorTokens: {
      background: '#FAF8F5',
      primary: '#121212',
      accent: '#C85A32',
      surface: '#FFFFFF',
    },
  });

  const [showExportDrawer, setShowExportDrawer] = useState(false);

  if (!isOpen) return null;

  const updateColor = (key: 'background' | 'primary' | 'accent', value: string) => {
    const updated = {
      ...tokens,
      colorTokens: { ...tokens.colorTokens, [key]: value },
    };
    setTokens(updated);
    onApplyTokens(updated);
  };

  const updateRadius = (value: number) => {
    const updated = { ...tokens, radius: value };
    setTokens(updated);
    onApplyTokens(updated);
  };

  const updateFont = (fontFamily: 'serif' | 'sans' | 'mono') => {
    const updated = { ...tokens, fontFamily };
    setTokens(updated);
    onApplyTokens(updated);
  };

  return (
    <div className="fixed left-0 top-14 bottom-0 w-80 bg-[#121212] border-r border-neutral-800 text-white z-40 flex flex-col shadow-2xl transition-all duration-300 animate-in slide-in-from-left-8 duration-200">
      <div className="p-5 border-b border-neutral-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-base">🎨</span>
          <div>
            <h3 className="text-base font-serif font-bold">Theme Playground</h3>
            <span className="text-[10px] font-mono text-[#C85A32]">Live CSS Variable Sandbox</span>
          </div>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-white p-1 text-sm">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Corner Radius Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-neutral-300">Corner Radius (--radius)</span>
            <span className="font-mono font-bold text-[#C85A32]">{tokens.radius}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="24"
            value={tokens.radius}
            onChange={(e) => updateRadius(parseInt(e.target.value, 10))}
            className="w-full accent-[#C85A32] cursor-pointer"
          />
        </div>

        {/* Color Token Swatches & Pickers */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-neutral-300 block">Color Tokens</span>

          <div>
            <label className="flex justify-between items-center text-[11px] font-mono text-neutral-400 mb-1">
              <span>Background (--bg)</span>
              <span className="text-white uppercase">{tokens.colorTokens.background}</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={tokens.colorTokens.background}
                onChange={(e) => updateColor('background', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={tokens.colorTokens.background}
                onChange={(e) => updateColor('background', e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs font-mono text-white"
              />
            </div>
          </div>

          <div>
            <label className="flex justify-between items-center text-[11px] font-mono text-neutral-400 mb-1">
              <span>Primary (--primary)</span>
              <span className="text-white uppercase">{tokens.colorTokens.primary}</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={tokens.colorTokens.primary}
                onChange={(e) => updateColor('primary', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={tokens.colorTokens.primary}
                onChange={(e) => updateColor('primary', e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs font-mono text-white"
              />
            </div>
          </div>

          <div>
            <label className="flex justify-between items-center text-[11px] font-mono text-neutral-400 mb-1">
              <span>Accent (--accent)</span>
              <span className="text-white uppercase">{tokens.colorTokens.accent}</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={tokens.colorTokens.accent}
                onChange={(e) => updateColor('accent', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={tokens.colorTokens.accent}
                onChange={(e) => updateColor('accent', e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs font-mono text-white"
              />
            </div>
          </div>
        </div>

        {/* Font Pairing Selection */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-neutral-300 block">Font Pairing Token</span>
          <div className="grid grid-cols-3 gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => updateFont('serif')}
              className={`py-1.5 rounded-lg text-xs font-serif font-medium transition ${
                tokens.fontFamily === 'serif' ? 'bg-[#C85A32] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Editorial
            </button>
            <button
              onClick={() => updateFont('sans')}
              className={`py-1.5 rounded-lg text-xs font-sans font-medium transition ${
                tokens.fontFamily === 'sans' ? 'bg-[#C85A32] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Clean
            </button>
            <button
              onClick={() => updateFont('mono')}
              className={`py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                tokens.fontFamily === 'mono' ? 'bg-[#C85A32] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tactical
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-neutral-800 bg-neutral-950">
        <button
          onClick={() => setShowExportDrawer(true)}
          className="w-full py-2.5 bg-[#C85A32] hover:bg-[#B04B27] text-white text-xs font-mono font-semibold rounded-xl transition shadow-md"
        >
          ⚡ Export Token Diff (Tailwind v4)
        </button>
      </div>

      {showExportDrawer && (
        <ExportTokenDiffDrawer
          tokens={tokens}
          onClose={() => setShowExportDrawer(false)}
        />
      )}
    </div>
  );
}
