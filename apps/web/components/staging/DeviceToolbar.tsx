'use client';

import React from 'react';
import { DevicePreset, DeviceConfig } from '@/types/staging';
import { Laptop, Tablet, Smartphone, Sparkles, Activity, Lock } from 'lucide-react';

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
    <div className="h-16 bg-white border-b border-gray-200 px-6 sm:px-8 flex flex-wrap items-center justify-between text-[#111111] z-30 shadow-xs font-sans">
      {/* Left: Device Presets */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-[#F9F9F9] border border-gray-200 p-1 rounded-2xl">
          {(['desktop', 'tablet', 'mobile'] as DevicePreset[]).map((d) => (
            <button
              key={d}
              onClick={() => onDeviceChange(d)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition uppercase ${
                currentDevice === d
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-gray-500 hover:text-[#111111] hover:bg-gray-100'
              }`}
            >
              {DEVICE_CONFIGS[d].label}
            </button>
          ))}
        </div>
      </div>

      {/* Center: The 3-Mode Segmented Tab Pill */}
      <div className="flex items-center bg-[#F9F9F9] border border-gray-200 p-1 rounded-2xl shadow-inner">
        <button
          type="button"
          onClick={() => onModeChange('mutations')}
          className={`px-4 py-1.5 rounded-xl text-xs font-mono uppercase font-bold transition flex items-center gap-1.5 ${
            currentMode === 'mutations'
              ? 'bg-[#346853] text-white shadow-xs'
              : 'text-gray-600 hover:text-[#111111] hover:bg-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#346853] dark:text-white" />
          <span>Visual Overrides</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('motion')}
          className={`px-4 py-1.5 rounded-xl text-xs font-mono uppercase font-bold transition flex items-center gap-1.5 ${
            currentMode === 'motion'
              ? 'bg-[#346853] text-white shadow-xs'
              : 'text-gray-600 hover:text-[#111111] hover:bg-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#346853] dark:text-white" />
          <span>Kinetic Motion</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('handoff')}
          className={`px-4 py-1.5 rounded-xl text-xs font-mono uppercase font-bold transition flex items-center gap-1.5 ${
            currentMode === 'handoff'
              ? 'bg-[#111111] text-white shadow-xs'
              : 'text-gray-600 hover:text-[#111111] hover:bg-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Handoff Vault</span>
        </button>
      </div>

      {/* Right: URL Input & Zoom */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F9F9F9] border border-gray-200 text-xs font-mono text-gray-700">
          <span className="w-2 h-2 rounded-full bg-[#346853] animate-pulse" />
          <span className="truncate max-w-[200px]">{stagingUrl}</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-mono text-gray-500 font-bold">
          <span>{openPinsCount} PINS ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
