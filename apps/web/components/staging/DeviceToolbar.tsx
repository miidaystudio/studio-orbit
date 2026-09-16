'use client';

import React from 'react';
import { DevicePreset, DeviceConfig } from '@/types/staging';

interface DeviceToolbarProps {
  currentDevice: DevicePreset;
  onDeviceChange: (device: DevicePreset) => void;
  stagingUrl: string;
  onStagingUrlChange: (url: string) => void;
  currentZoom: number;
  onZoomChange: (zoom: number) => void;
  openPinsCount: number;
}

export const DEVICE_CONFIGS: Record<DevicePreset, DeviceConfig> = {
  desktop: { id: 'desktop', label: 'Desktop (1440px)', width: 1440, height: 900, scale: 1 },
  tablet: { id: 'tablet', label: 'Tablet (768px)', width: 768, height: 1024, scale: 0.9 },
  mobile: { id: 'mobile', label: 'Mobile (375px)', width: 375, height: 667, scale: 1 },
};

export default function DeviceToolbar({
  currentDevice,
  onDeviceChange,
  stagingUrl,
  onStagingUrlChange,
  currentZoom,
  onZoomChange,
  openPinsCount,
}: DeviceToolbarProps) {
  return (
    <div className="h-14 bg-[#121212] border-b border-neutral-800 px-6 flex items-center justify-between text-white z-30 shadow-md">
      {/* Device Preset Pills */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
          {(['desktop', 'tablet', 'mobile'] as DevicePreset[]).map((d) => (
            <button
              key={d}
              onClick={() => onDeviceChange(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                currentDevice === d
                  ? 'bg-[#C85A32] text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {DEVICE_CONFIGS[d].label}
            </button>
          ))}
        </div>

        {/* Live Open Pins Badge */}
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-pulse" />
          <span className="text-xs font-mono font-semibold text-neutral-200">
            {openPinsCount} Open QA Pins
          </span>
        </div>
      </div>

      {/* Editable Staging URL Input */}
      <div className="flex-1 max-w-md mx-6 hidden lg:block">
        <div className="relative flex items-center">
          <span className="absolute left-3 text-xs font-mono text-neutral-500">🔒 https://</span>
          <input
            type="text"
            value={stagingUrl.replace(/^https?:\/\//, '')}
            onChange={(e) => onStagingUrlChange(`https://${e.target.value}`)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-20 pr-4 py-1.5 text-xs font-mono text-neutral-200 focus:outline-none focus:border-[#C85A32]"
          />
        </div>
      </div>

      {/* Zoom Scale Triggers */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-neutral-400">Scale:</span>
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
          {[0.5, 0.75, 1.0].map((z) => (
            <button
              key={z}
              onClick={() => onZoomChange(z)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition ${
                currentZoom === z
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
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
