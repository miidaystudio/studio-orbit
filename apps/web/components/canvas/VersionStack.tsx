'use client';

import React, { useState } from 'react';

export default function VersionStack() {
  const [activeVersion, setActiveVersion] = useState('v2');
  const versions = [
    { id: 'v1', label: 'v1 • Initial Layout Concept' },
    { id: 'v2', label: 'v2 • Editorial Serif Polish' },
    { id: 'v3', label: 'v3 • Final Interactive Hand-off' },
  ];

  return (
    <div className="absolute top-4 right-6 z-20 bg-[#1A1918]/90 backdrop-blur-md border border-neutral-800 p-1.5 rounded-xl shadow-canvas text-xs">
      <div className="flex items-center gap-1">
        {versions.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveVersion(v.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              activeVersion === v.id
                ? 'bg-[#C85A32] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {v.id.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
