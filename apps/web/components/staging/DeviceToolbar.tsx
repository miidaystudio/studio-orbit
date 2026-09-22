'use client';

import React from 'react';
import { DevicePreset, DeviceConfig } from '@/types/staging';

export type CreativeOsMode = 'mutations' | 'motion' | 'handoff';

interface DeviceToolbarProps {
  currentDevice: DevicePreset;
  onDeviceChange: (device: DevicePreset) => void;
  stagingUrl: string;
  onStagingUrlChange: (url: string) => void;
  currentZoom: number;
  onZoomChange: (zoom: number) => void;
  openPinsCount: number;
  currentMode: CreativeOsMode;
  onModeChange: (mode: CreativeOsMode) => void;
}

export const DEVICE_CONFIGS: Record<DevicePreset, DeviceConfig> = {
  desktop: { id: 'desktop', label: 'DESKTOP (1440px)', width: 1440, height: 900, scale: 1 },
  tablet: { id: 'tablet', label: 'TABLET (768px)', width: 768, height: 1024, scale: 0.9 },
  mobile: { id: 'mobile', label: 'MOBILE (375px)', width: 375, height: 667, scale: 1 },
};

export default function DeviceToolbar({
  currentDevice,
  onDeviceChange,
  stagingUrl,
  onStagingUrlChange,
  currentZoom,
  onZoomChange,
  openPinsCount,
  currentMode,
  onModeChange,
}: DeviceToolbarProps) {
  return (
    <div className="h-14 bg-[#08090A] border-b border-[#22252A] px-6 flex items-center justify-between text-[#FFFFFF] z-30 shadow-md font-mono">
      {/* Left: Device Presets */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-[#111315] border border-[#22252A] p-1 rounded-xl">
          {(['desktop', 'tablet', 'mobile'] as DevicePreset[]).map((d) => (
            <button
              key={d}
              onClick={() => onDeviceChange(d)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition uppercase ${
                currentDevice === d
                  ? 'bg-[#16181B] text-[#CCFF00] border border-[#22252A] shadow-[0_0_8px_rgba(204,255,0,0.2)]'
                  : 'text-[#828892] hover:text-[#FFFFFF] hover:bg-white/[0.04]'
              }`}
            >
              {DEVICE_CONFIGS[d].label}
            </button>
          ))}
        </div>
      </div>

      {/* Center: The 3-Mode Segmented Tab Pill */}
      <div className="flex items-center bg-[#111315] border border-[#22252A] p-1 rounded-xl shadow-inner">
        <button
          type="button"
          onClick={() => onModeChange('mutations')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition flex items-center gap-1.5 ${
            currentMode === 'mutations'
              ? 'bg-[#16181B] text-[#CCFF00] border border-[#22252A] shadow-[0_0_8px_rgba(204,255,0,0.2)]'
              : 'text-[#828892] hover:text-[#FFFFFF] hover:bg-white/[0.04]'
          }`}
        >
          <span className="text-[#CCFF00]">✦</span>
          <span>Visual Overrides</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('motion')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition flex items-center gap-1.5 ${
            currentMode === 'motion'
              ? 'bg-[#16181B] text-[#CCFF00] border border-[#22252A] shadow-[0_0_8px_rgba(204,255,0,0.2)]'
              : 'text-[#828892] hover:text-[#FFFFFF] hover:bg-white/[0.04]'
          }`}
        >
          <span>∿</span>
          <span>Kinetic Motion</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('handoff')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition flex items-center gap-1.5 ${
            currentMode === 'handoff'
              ? 'bg-[#CCFF00] text-black shadow-[0_0_12px_rgba(204,255,0,0.4)]'
              : 'text-[#828892] hover:text-[#FFFFFF] hover:bg-white/[0.04]'
          }`}
        >
          <span>⬡</span>
          <span>Handoff Vault</span>
        </button>
      </div>

      {/* Right: URL Input & Zoom */}
      <div className="flex items-center gap-3">
        {/* Editable Staging URL Input */}
        <div className="max-w-xs hidden xl:flex items-center">
          <div className="relative flex items-center w-full">
            <span className="absolute left-3 text-xs font-mono text-[#828892] flex items-center gap-1">
              <svg className="w-3 h-3 text-[#CCFF00]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>https://</span>
            </span>
            <input
              type="text"
              value={stagingUrl.replace(/^https?:\/\//, '')}
              onChange={(e) => {
                const clean = e.target.value.trim().replace(/^https?:\/\//, '');
                onStagingUrlChange(clean ? `https://${clean}` : '');
              }}
              placeholder="miidaystudio.online"
              className="w-full bg-[#111315] border border-[#22252A] rounded-xl pl-24 pr-3 py-1.5 text-xs font-mono text-[#FFFFFF] focus:outline-none focus:border-[#CCFF00]"
            />
          </div>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1 bg-[#111315] border border-[#22252A] p-1 rounded-xl">
          {[0.5, 0.75, 1.0].map((z) => (
            <button
              key={z}
              onClick={() => onZoomChange(z)}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition ${
                currentZoom === z
                  ? 'bg-[#16181B] text-[#CCFF00] border border-[#22252A]'
                  : 'text-[#828892] hover:text-[#FFFFFF]'
              }`}
            >
              {Math.round(z * 100)}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
