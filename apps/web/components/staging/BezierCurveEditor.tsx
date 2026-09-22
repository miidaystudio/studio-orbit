'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BezierPoints, MotionPresetItem } from '@studio-orbit/types';

interface BezierCurveEditorProps {
  projectId: string;
  initialPreset?: MotionPresetItem;
  onSavePreset?: (preset: {
    selector: string;
    curveName: string;
    bezierPoints: BezierPoints;
    durationMs: number;
    delayMs: number;
  }) => void;
  onTestMotion?: (bezierPoints: BezierPoints, durationMs: number, delayMs: number) => void;
}

const PRESETS: Array<{ name: string; points: BezierPoints }> = [
  { name: 'Ease Out Expo', points: [0.16, 1, 0.3, 1] },
  { name: 'Spring Bounce', points: [0.34, 1.56, 0.64, 1] },
  { name: 'Subtle Editorial', points: [0.25, 0.1, 0.25, 1] },
  { name: 'Snappy Kinetic', points: [0.05, 0.7, 0.1, 1] },
  { name: 'Linear', points: [0, 0, 1, 1] },
];

export default function BezierCurveEditor({
  projectId,
  initialPreset,
  onSavePreset,
  onTestMotion,
}: BezierCurveEditorProps) {
  const [points, setPoints] = useState<BezierPoints>(
    initialPreset?.bezierPoints || [0.16, 1, 0.3, 1]
  );
  const [curveName, setCurveName] = useState(initialPreset?.curveName || 'Ease Out Expo');
  const [selector, setSelector] = useState(initialPreset?.selector || 'h1, [data-hero]');
  const [durationMs, setDurationMs] = useState(initialPreset?.durationMs || 800);
  const [delayMs, setDelayMs] = useState(initialPreset?.delayMs || 0);

  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestAnimating, setIsTestAnimating] = useState(false);

  // SVG Dimension Constants
  const SVG_SIZE = 260;
  const PADDING = 40;
  const PLOT_WIDTH = SVG_SIZE - PADDING * 2;
  const PLOT_HEIGHT = SVG_SIZE - PADDING * 2;

  // Convert normalized point [0..1, 0..1] to SVG coords
  const toSvgCoords = (nx: number, ny: number) => {
    const x = PADDING + nx * PLOT_WIDTH;
    const y = PADDING + (1 - ny) * PLOT_HEIGHT;
    return { x, y };
  };

  // Convert SVG coords to normalized
  const toNormalized = (svgX: number, svgY: number): [number, number] => {
    const nx = Math.max(0, Math.min(1, (svgX - PADDING) / PLOT_WIDTH));
    const ny = (PADDING + PLOT_HEIGHT - svgY) / PLOT_HEIGHT;
    return [parseFloat(nx.toFixed(3)), parseFloat(ny.toFixed(3))];
  };

  const p0 = toSvgCoords(0, 0);
  const p1 = toSvgCoords(points[0], points[1]);
  const p2 = toSvgCoords(points[2], points[3]);
  const p3 = toSvgCoords(1, 1);

  const pathD = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

  // Dragging logic
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingHandle, setDraggingHandle] = useState<'p1' | 'p2' | null>(null);

  const handlePointerDown = (handle: 'p1' | 'p2') => (e: React.PointerEvent) => {
    e.preventDefault();
    setDraggingHandle(handle);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingHandle || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const [nx, ny] = toNormalized(clientX, clientY);

    if (draggingHandle === 'p1') {
      setPoints([nx, ny, points[2], points[3]]);
    } else {
      setPoints([points[0], points[1], nx, ny]);
    }
  };

  const handlePointerUp = () => {
    setDraggingHandle(null);
  };

  const cubicBezierString = `cubic-bezier(${points.join(', ')})`;
  const cssCode = `transition: all ${durationMs}ms ${cubicBezierString}${delayMs > 0 ? ` ${delayMs}ms` : ''};`;
  const gsapCode = `gsap.to(el, { ease: CustomEase.create("custom", "${cubicBezierString}"), duration: ${(durationMs / 1000).toFixed(2)}, delay: ${(delayMs / 1000).toFixed(2)} });`;

  const copyCode = (type: 'CSS' | 'GSAP') => {
    const text = type === 'CSS' ? cssCode : gsapCode;
    navigator.clipboard.writeText(text);
    setCopiedFormat(type);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const triggerTestAnimation = () => {
    setIsTestAnimating(true);
    if (onTestMotion) {
      onTestMotion(points, durationMs, delayMs);
    }
    setTimeout(() => {
      setIsTestAnimating(false);
    }, durationMs + 200);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSavePreset) {
        await onSavePreset({
          selector,
          curveName,
          bezierPoints: points,
          durationMs,
          delayMs,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#111315] border border-[#22252A] rounded-2xl shadow-2xl p-6 text-[#FFFFFF] space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#22252A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.8)] animate-pulse" />
            <h3 className="font-mono font-bold text-sm tracking-wide text-[#FFFFFF] uppercase">
              [BÉZIER_CURVE // KINETIC TELEMETRY]
            </h3>
            <span className="text-[10px] font-mono uppercase bg-[#16181B] border border-[#22252A] px-2 py-0.5 rounded text-[#CCFF00] font-bold">
              SS26
            </span>
          </div>
          <p className="text-xs text-[#828892] mt-0.5">
            Interactive cubic-bezier curve tuner with live telemetry and code generation.
          </p>
        </div>

        {/* Preset Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setPoints(p.points);
                setCurveName(p.name);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition border uppercase font-bold ${
                curveName === p.name
                  ? 'bg-[#16181B] border-[#CCFF00] text-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.2)]'
                  : 'bg-[#08090A] border-[#22252A] text-[#828892] hover:text-[#FFFFFF]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: SVG Canvas + Specimen & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Draggable SVG Canvas (6 cols) */}
        <div className="md:col-span-6 flex flex-col items-center bg-[#08090A] border border-[#22252A] rounded-xl p-4 relative">
          <svg
            ref={svgRef}
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="cursor-crosshair touch-none select-none"
          >
            {/* Grid & Axis */}
            <rect
              x={PADDING}
              y={PADDING}
              width={PLOT_WIDTH}
              height={PLOT_HEIGHT}
              fill="rgba(204, 255, 0, 0.01)"
              stroke="#22252A"
              strokeDasharray="4 4"
            />
            {/* Linear Reference Line */}
            <line
              x1={p0.x}
              y1={p0.y}
              x2={p3.x}
              y2={p3.y}
              stroke="#22252A"
              strokeDasharray="2 2"
            />

            {/* Handle Arms */}
            <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#CCFF00" strokeWidth="1.5" />
            <line x1={p3.x} y1={p3.y} x2={p2.x} y2={p2.y} stroke="#FFFFFF" strokeWidth="1.5" />

            {/* The Bézier Curve */}
            <path
              d={pathD}
              fill="none"
              stroke="#CCFF00"
              strokeWidth="2.5"
              filter="drop-shadow(0px 0px 6px rgba(204,255,0,0.6))"
            />

            {/* Handle P1 */}
            <circle
              cx={p1.x}
              cy={p1.y}
              r="7"
              fill="#CCFF00"
              stroke="#08090A"
              strokeWidth="2"
              className="cursor-grab active:cursor-grabbing shadow-lg"
              onPointerDown={handlePointerDown('p1')}
            />
            {/* Handle P2 */}
            <circle
              cx={p2.x}
              cy={p2.y}
              r="7"
              fill="#FFFFFF"
              stroke="#08090A"
              strokeWidth="2"
              className="cursor-grab active:cursor-grabbing shadow-lg"
              onPointerDown={handlePointerDown('p2')}
            />

            {/* Anchor Points */}
            <circle cx={p0.x} cy={p0.y} r="3.5" fill="#828892" />
            <circle cx={p3.x} cy={p3.y} r="3.5" fill="#828892" />
          </svg>

          {/* Coordinate Readout */}
          <div className="w-full mt-3 pt-2 border-t border-[#22252A] flex items-center justify-between text-[11px] font-mono text-[#828892]">
            <span className="flex items-center gap-1.5 text-[#CCFF00]">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00]" />
              P1: ({points[0]}, {points[1]})
            </span>
            <span className="flex items-center gap-1.5 text-[#FFFFFF]">
              <span className="w-2 h-2 rounded-full bg-[#FFFFFF]" />
              P2: ({points[2]}, {points[3]})
            </span>
          </div>
        </div>

        {/* Right: Specimen Preview & Timing Sliders (6 cols) */}
        <div className="md:col-span-6 space-y-4">
          {/* Specimen Kinetic Box */}
          <div className="bg-[#08090A] border border-[#22252A] rounded-xl p-4 flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
            <span className="absolute top-2 left-3 text-[10px] font-mono text-[#828892] uppercase tracking-wider">
              Live Specimen Motion
            </span>

            {/* Specimen Box */}
            <div
              style={{
                transition: `transform ${durationMs}ms ${cubicBezierString} ${delayMs}ms`,
                transform: isTestAnimating ? 'translateY(-24px) scale(1.04)' : 'translateY(0px) scale(1)',
              }}
              className="w-44 py-3 px-4 bg-[#111315] border border-[#22252A] hover:border-[#CCFF00] rounded-xl text-center shadow-lg cursor-pointer"
              onClick={triggerTestAnimation}
            >
              <div className="text-xs font-mono font-bold text-[#FFFFFF]">SPECIMEN CARD</div>
              <div className="text-[10px] font-mono text-[#CCFF00] mt-0.5">Click to Trigger</div>
            </div>

            <button
              type="button"
              onClick={triggerTestAnimation}
              className="mt-3 px-3.5 py-1.5 rounded-lg bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-mono font-bold uppercase transition shadow-[0_0_10px_rgba(204,255,0,0.3)] inline-flex items-center gap-1.5"
            >
              <span>Test Kinetic Motion</span>
              <span>∿</span>
            </button>
          </div>

          {/* Timing Controls */}
          <div className="grid grid-cols-2 gap-3 bg-[#08090A] border border-[#22252A] rounded-xl p-3 text-xs">
            <div>
              <div className="flex justify-between font-mono text-[#828892] mb-1 text-[11px]">
                <span>Duration</span>
                <span className="text-[#CCFF00] font-bold">{durationMs}ms</span>
              </div>
              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={durationMs}
                onChange={(e) => setDurationMs(Number(e.target.value))}
                className="w-full accent-[#CCFF00] bg-white/10 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono text-[#828892] mb-1 text-[11px]">
                <span>Delay</span>
                <span className="text-[#CCFF00] font-bold">{delayMs}ms</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="25"
                value={delayMs}
                onChange={(e) => setDelayMs(Number(e.target.value))}
                className="w-full accent-[#CCFF00] bg-white/10 rounded-lg cursor-pointer h-1.5"
              />
            </div>
          </div>

          {/* Target Element Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#828892] whitespace-nowrap uppercase">Target:</span>
            <input
              type="text"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              placeholder="e.g. h1, .hero-title"
              className="flex-1 bg-[#08090A] border border-[#22252A] rounded-xl px-3 py-1.5 text-xs font-mono text-[#FFFFFF] focus:outline-none focus:border-[#CCFF00]"
            />
          </div>
        </div>
      </div>

      {/* Code Export Menu & Action Bar */}
      <div className="border-t border-[#22252A] pt-4 flex flex-wrap items-center justify-between gap-4">
        {/* Output Code preview */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#828892] bg-[#08090A] border border-[#22252A] rounded-xl px-3 py-2 flex-1 min-w-[280px] overflow-x-auto">
          <span className="text-[#CCFF00] font-bold select-none">CSS:</span>
          <code className="text-[#FFFFFF]">{cssCode}</code>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => copyCode('CSS')}
            className="px-3.5 py-2 rounded-xl bg-[#16181B] hover:bg-[#22252A] border border-[#22252A] hover:border-[#CCFF00] text-xs font-mono transition text-[#FFFFFF] inline-flex items-center gap-1.5"
          >
            {copiedFormat === 'CSS' ? '✓ Copied CSS' : 'Copy CSS'}
          </button>

          <button
            type="button"
            onClick={() => copyCode('GSAP')}
            className="px-3.5 py-2 rounded-xl bg-[#16181B] hover:bg-[#22252A] border border-[#22252A] hover:border-[#CCFF00] text-xs font-mono transition text-[#FFFFFF] inline-flex items-center gap-1.5"
          >
            {copiedFormat === 'GSAP' ? '✓ Copied GSAP' : 'Copy GSAP'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-mono font-black uppercase transition shadow-[0_0_12px_rgba(204,255,0,0.3)] inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? 'SAVING...' : 'SAVE PRESET'}
          </button>
        </div>
      </div>
    </div>
  );
}
