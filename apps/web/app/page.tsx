'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// --- Tactical Brutalist Corner Crosshairs ---
function CornerCrosshairs() {
  return (
    <>
      <span className="absolute -top-1.5 -left-1.5 text-[11px] font-mono text-[#828892]/50 select-none pointer-events-none leading-none">+</span>
      <span className="absolute -top-1.5 -right-1.5 text-[11px] font-mono text-[#828892]/50 select-none pointer-events-none leading-none">+</span>
      <span className="absolute -bottom-1.5 -left-1.5 text-[11px] font-mono text-[#828892]/50 select-none pointer-events-none leading-none">+</span>
      <span className="absolute -bottom-1.5 -right-1.5 text-[11px] font-mono text-[#828892]/50 select-none pointer-events-none leading-none">+</span>
    </>
  );
}

// --- Minimalist Tactical SVG Glyphs ---
function CrosshairIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeDasharray="2 2" opacity="0.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function WaveformIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 12h3l3-8 4 16 3-10 2 4h3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TerminalIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <polyline points="4 17 10 11 4 5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="19" x2="20" y2="19" strokeLinecap="round" />
    </svg>
  );
}

function SwatchCubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PadlockIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpRightIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckmarkIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CyberTechwearLandingPage() {
  // 1. Client Access Launcher State
  const [magicToken, setMagicToken] = useState('');

  // 2. Interactive Viewport Hero State
  const [activePin, setActivePin] = useState<number | null>(1);
  const [targetViewport, setTargetViewport] = useState<'desktop' | 'mobile'>('desktop');

  // 3. Bento Card 01: Live Visual Overrides State
  const [activeVariant, setActiveVariant] = useState<'base' | 'v1' | 'v2'>('v1');
  const [elementText, setElementText] = useState('THE FUTURE OF CLIENT DELIVERY IS NOW.');

  // 4. Bento Card 02: Kinetic Motion Scrubber State
  const [curveScrub, setCurveScrub] = useState(65);
  const [isPlayingCurve, setIsPlayingCurve] = useState(false);

  // 5. Bento Card 04: Swatch Copy State
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleLaunchMagicToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicToken.trim()) return;
    const cleanToken = magicToken.trim().replace(/^.*\/portal\//, '');
    window.location.href = `/portal/${cleanToken}`;
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const triggerMotionPlay = () => {
    setIsPlayingCurve(true);
    setCurveScrub(0);
    let val = 0;
    const interval = setInterval(() => {
      val += 5;
      setCurveScrub(val);
      if (val >= 100) {
        clearInterval(interval);
        setIsPlayingCurve(false);
      }
    }, 20);
  };

  return (
    <div className="min-h-screen bg-[#08090A] text-[#FFFFFF] selection:bg-[#CCFF00] selection:text-black font-sans antialiased overflow-x-hidden relative">
      
      {/* Tactical Grid Wireframe Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, #22252A 1px, transparent 1px),
            linear-gradient(to bottom, #22252A 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Cyber Subtle Lime Radial Glow in Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20 mix-blend-screen"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 8%, rgba(204, 255, 0, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 90% 80%, rgba(204, 255, 0, 0.05) 0%, transparent 40%)
          `,
        }}
      />

      {/* 1. Tactical Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full bg-[#08090A]/95 backdrop-blur-md border-b border-[#22252A] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo with Cyber Lime Dot */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#111315] border border-[#22252A] flex items-center justify-center group-hover:border-[#CCFF00] transition-colors relative">
              <span className="text-xs font-mono font-black text-[#FFFFFF] tracking-tighter">SO</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-[#FFFFFF] uppercase">
                StudioOrbit
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#111315] text-[#CCFF00] border border-[#22252A] font-bold shadow-[0_0_10px_rgba(204,255,0,0.2)]">
                [SYS-01 // COCKPIT]
              </span>
            </div>
          </Link>

          {/* Center: Monospace Status Wireframe Pill */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111315] border border-[#22252A] text-[11px] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CCFF00]" />
            </span>
            <span className="text-[#828892]">STAGE_READY //</span>
            <span className="text-[#CCFF00] font-bold">99.8%</span>
          </div>

          {/* Right: Solid Cyber Lime STUDIO LOGIN CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/portal/invite"
              className="text-[#828892] hover:text-[#FFFFFF] transition font-mono uppercase tracking-wider text-[11px] hidden sm:block"
            >
              Client Access
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-lg bg-[#CCFF00] hover:bg-[#b8e600] text-black transition-all font-mono text-xs font-black tracking-wider uppercase shadow-[0_0_16px_rgba(204,255,0,0.4)] flex items-center gap-2 active:scale-95"
            >
              <span>STUDIO LOGIN →</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 pt-16 pb-28 space-y-28">

        {/* 2. Hero Section */}
        <section className="text-center space-y-8 max-w-5xl mx-auto pt-8">
          
          {/* Tactical Monospace Metadata Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#111315] border border-[#22252A] text-[10px] sm:text-[11px] font-mono tracking-widest text-[#CCFF00] uppercase shadow-[0_0_12px_rgba(204,255,0,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
            <span>[SS26 ARCHITECTURE // TACTICAL CLIENT DELIVERY OS]</span>
          </div>

          {/* Ultra-Bold Condensed Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#FFFFFF] leading-[0.95]">
            THE FUTURE OF CLIENT <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] via-[#E6FF80] to-[#FFFFFF]">
              DELIVERY IS NOW.
            </span>
          </h1>

          {/* System Sub-Label */}
          <p className="text-sm sm:text-base text-[#828892] max-w-2xl mx-auto leading-relaxed font-mono">
            Execute live visual DOM overrides, synchronize kinetic Bézier curves, run pre-flight sanity diagnostics, and lock handoff vaults in one high-voltage cockpit.
          </p>

          {/* Client Access Launcher: Matte Dark Pill with Razor-Thin Border & Cyber Lime CTA */}
          <div className="max-w-2xl mx-auto bg-[#111315] border border-[#22252A] rounded-2xl p-3 sm:p-3.5 shadow-2xl relative">
            <CornerCrosshairs />
            <form onSubmit={handleLaunchMagicToken} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={magicToken}
                  onChange={(e) => setMagicToken(e.target.value)}
                  placeholder="ENTER CLIENT TOKEN (e.g. lumina-portal-token-9988)..."
                  className="w-full bg-[#08090A] border border-[#22252A] rounded-xl px-4 py-3 text-xs font-mono text-[#FFFFFF] placeholder-[#828892] focus:outline-none focus:border-[#CCFF00] transition"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-mono uppercase tracking-wider font-black rounded-xl transition-all shadow-[0_0_16px_rgba(204,255,0,0.3)] whitespace-nowrap active:scale-95 flex items-center justify-center gap-2"
              >
                <span>LAUNCH PORTAL →</span>
              </button>
            </form>

            {/* Quick Portal Chips */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-2.5 text-[10px] font-mono text-[#828892]">
              <span className="uppercase tracking-wider">AVAILABLE HUBS:</span>
              <div className="flex items-center gap-2">
                {[
                  { label: 'miidayStudio', token: 'miidaystudio-portal-token-1109' },
                  { label: 'Lumina Tech', token: 'lumina-portal-token-9988' },
                  { label: 'Aether Labs', token: 'aether-labs-token-4421' },
                ].map((chip) => (
                  <button
                    key={chip.token}
                    type="button"
                    onClick={() => setMagicToken(chip.token)}
                    className="px-2.5 py-1 rounded bg-[#08090A] border border-[#22252A] text-[#828892] hover:border-[#CCFF00] hover:text-[#CCFF00] transition text-[10px]"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Interactive Viewport Hero */}
        <section className="relative pt-4">
          
          {/* Tactical Bezel Badge */}
          <div className="flex items-center justify-between mb-3 px-2 text-[11px] font-mono text-[#828892]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.8)] animate-pulse" />
              <span className="text-[#FFFFFF] font-bold">[NODE // STAGING_VIEWPORT_01]</span>
              <span>•</span>
              <span>COORDINATES: 44.02° N, 122.98° W</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTargetViewport('desktop')}
                className={`px-2.5 py-1 rounded border text-[10px] uppercase font-bold transition ${
                  targetViewport === 'desktop'
                    ? 'bg-[#16181B] text-[#CCFF00] border-[#CCFF00]'
                    : 'bg-[#111315] text-[#828892] border-[#22252A]'
                }`}
              >
                DESKTOP (1440px)
              </button>
              <button
                onClick={() => setTargetViewport('mobile')}
                className={`px-2.5 py-1 rounded border text-[10px] uppercase font-bold transition ${
                  targetViewport === 'mobile'
                    ? 'bg-[#16181B] text-[#CCFF00] border-[#CCFF00]'
                    : 'bg-[#111315] text-[#828892] border-[#22252A]'
                }`}
              >
                MOBILE (375px)
              </button>
            </div>
          </div>

          {/* Viewport Frame with Pitch-Black Bezel & Corner Crosshairs */}
          <div className="w-full bg-[#111315] border border-[#22252A] rounded-2xl p-4 sm:p-6 shadow-2xl relative">
            <CornerCrosshairs />

            {/* Pitch-Black Bezel Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#22252A]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22252A] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22252A] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22252A] inline-block" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#08090A] border border-[#22252A] text-[11px] font-mono text-[#828892]">
                  <PadlockIcon className="w-3 h-3 text-[#CCFF00]" />
                  <span className="text-[#FFFFFF]">https://miidaystudio.online/staging</span>
                  <span className="text-[#CCFF00] text-[9px] font-bold">[PROXY_ONLINE]</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-[#828892]">
                <span>SCALE: 100%</span>
                <span>•</span>
                <span className="text-[#CCFF00]">2 ACTIVE QA PINS</span>
              </div>
            </div>

            {/* Simulated Live Viewport Canvas */}
            <div
              className={`mx-auto mt-6 bg-[#08090A] border border-[#22252A] rounded-xl relative min-h-[380px] p-6 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                targetViewport === 'desktop' ? 'w-full' : 'max-w-sm'
              }`}
            >
              {/* Coordinate Grid in Canvas */}
              <div className="absolute top-3 left-4 text-[9px] font-mono text-[#828892]/60">
                X: 142.50 | Y: 88.20 | RESOLUTION: {targetViewport === 'desktop' ? '1440x900' : '375x812'}
              </div>

              {/* Sample Content Inside Canvas */}
              <div className="space-y-4 max-w-lg mt-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] block">
                  // CLIENT DELIVERABLE MOCKUP
                </span>
                <h4 className="text-2xl sm:text-3xl font-black uppercase text-[#FFFFFF] tracking-tight">
                  KINETIC BRAND FRAMEWORK
                </h4>
                <p className="text-xs font-mono text-[#828892] leading-relaxed">
                  Atomic component delivery pipeline with real-time DOM mutation verification and cryptographic handoff checklists.
                </p>
                <div className="flex gap-2 pt-2">
                  <button className="px-4 py-2 bg-[#CCFF00] text-black font-mono text-[10px] font-black uppercase tracking-wider rounded">
                    EXPLORE SPECS →
                  </button>
                  <button className="px-4 py-2 bg-[#111315] text-[#FFFFFF] border border-[#22252A] font-mono text-[10px] uppercase tracking-wider rounded hover:border-[#CCFF00]">
                    VIEW REPO
                  </button>
                </div>
              </div>

              {/* Glowing Pin 01 (Cyber Lime) */}
              <div
                onClick={() => setActivePin(activePin === 1 ? null : 1)}
                className="absolute top-[28%] right-[18%] z-30 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-[#CCFF00] opacity-35 animate-ping" />
                  <div className="w-8 h-8 rounded-full bg-[#CCFF00] text-black font-mono text-xs font-black flex items-center justify-center shadow-[0_0_16px_rgba(204,255,0,0.8)] border-2 border-black group-hover:scale-110 transition">
                    01
                  </div>
                </div>

                {activePin === 1 && (
                  <div className="absolute right-10 top-0 w-72 bg-[#111315] border border-[#CCFF00] rounded-xl p-4 shadow-2xl text-left z-40 animate-in fade-in">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#CCFF00] uppercase font-bold mb-1">
                      <span>PIN #01 // VISUAL QA</span>
                      <span className="text-[#828892]">ACTIVE</span>
                    </div>
                    <p className="text-xs font-mono text-[#FFFFFF]">
                      Typography tracking tuned to -0.03em to maintain high-impact brutalist rhythm.
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-[#22252A] flex justify-between items-center text-[10px] font-mono text-[#828892]">
                      <span>SELECTOR: h1.hero-title</span>
                      <span className="text-[#CCFF00] font-bold">STATUS: FIXED</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Glowing Pin 02 (Cyber Lime) */}
              <div
                onClick={() => setActivePin(activePin === 2 ? null : 2)}
                className="absolute bottom-[24%] left-[22%] z-30 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-[#CCFF00] opacity-35 animate-pulse" />
                  <div className="w-8 h-8 rounded-full bg-[#CCFF00] text-black font-mono text-xs font-black flex items-center justify-center shadow-[0_0_16px_rgba(204,255,0,0.8)] border-2 border-black group-hover:scale-110 transition">
                    <CheckmarkIcon className="w-4 h-4" />
                  </div>
                </div>

                {activePin === 2 && (
                  <div className="absolute left-10 bottom-0 w-72 bg-[#111315] border border-[#CCFF00] rounded-xl p-4 shadow-2xl text-left z-40 animate-in fade-in">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#CCFF00] uppercase font-bold mb-1">
                      <span>PIN #02 // MILESTONE SIGN-OFF</span>
                      <span className="text-[#828892]">VERIFIED</span>
                    </div>
                    <p className="text-xs font-mono text-[#FFFFFF]">
                      Bézier acceleration curve verified across all responsive breakpoints.
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-[#22252A] flex justify-between items-center text-[10px] font-mono text-[#828892]">
                      <span>CURVE: (0.16, 1, 0.3, 1)</span>
                      <span className="text-[#CCFF00] font-bold">APPROVED</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer status line inside canvas */}
              <div className="pt-6 border-t border-[#22252A] flex justify-between items-center text-[10px] font-mono text-[#828892]">
                <span>POSTGRESQL // DRIZZLE SYNC: ATOMIC</span>
                <span className="text-[#CCFF00]">FPS: 60.0 &bull; LATENCY: 12ms</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Bento Grid (4 Pillars) */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22252A] pb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] font-bold">
                [SYSTEM PILLARS // NEXUS MATRIX]
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#FFFFFF] mt-1">
                CORE ENGINEERING CAPABILITIES
              </h2>
            </div>
            <p className="text-xs font-mono text-[#828892] max-w-sm">
              Purpose-built tools for visual mutations, kinetic curves, pre-flight terminal audits, and executive asset vaults.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento Card 01: Live Visual Overrides (Span 7) */}
            <div className="md:col-span-7 bg-[#111315] border border-[#22252A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between relative group hover:border-[#CCFF00]/60 transition">
              <CornerCrosshairs />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CrosshairIcon className="w-4 h-4 text-[#CCFF00]" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#CCFF00] font-bold">
                      01 // LIVE VISUAL OVERRIDES
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#828892]">[MUTATION_ENGINE]</span>
                </div>
                <h3 className="text-2xl font-black uppercase text-[#FFFFFF] tracking-tight">
                  In-Iframe Element Mutator & Variant Stager
                </h3>
                <p className="text-xs font-mono text-[#828892] leading-relaxed">
                  Click any live DOM element to stage copy and style overrides in real time. Switch between variants without deploying code.
                </p>
              </div>

              {/* Glowing Cyber-Lime Selection Bounding Box Simulator */}
              <div className="bg-[#08090A] border border-[#22252A] rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#828892]">ACTIVE VARIANT:</span>
                  <div className="flex gap-1.5 bg-[#111315] p-1 rounded border border-[#22252A]">
                    {(['base', 'v1', 'v2'] as const).map((variant) => (
                      <button
                        key={variant}
                        onClick={() => {
                          setActiveVariant(variant);
                          if (variant === 'base') setElementText('DEFAULT CLIENT HEADLINE');
                          if (variant === 'v1') setElementText('THE FUTURE OF CLIENT DELIVERY IS NOW.');
                          if (variant === 'v2') setElementText('TACTICAL STUDIO ARCHITECTURE');
                        }}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold transition ${
                          activeVariant === variant
                            ? 'bg-[#CCFF00] text-black shadow-[0_0_8px_rgba(204,255,0,0.5)]'
                            : 'text-[#828892] hover:text-white'
                        }`}
                      >
                        {variant.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bounding Box Component */}
                <div className="p-4 rounded border-2 border-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.3)] bg-[#CCFF00]/5 relative">
                  <span className="absolute -top-2.5 left-2 px-1.5 bg-[#CCFF00] text-black text-[9px] font-mono font-black uppercase">
                    SELECTOR: h1.hero-display
                  </span>
                  <p className="text-sm font-mono font-bold text-[#FFFFFF] mt-1">
                    "{elementText}"
                  </p>
                  <div className="flex justify-between items-center text-[9px] font-mono text-[#CCFF00] mt-3 pt-2 border-t border-[#CCFF00]/20">
                    <span>OVERRIDE: TEXT_MUTATION</span>
                    <span className="text-[#828892]">A/B VARIANT ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 02: Kinetic Motion & Waveform (Span 5) */}
            <div className="md:col-span-5 bg-[#111315] border border-[#22252A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between relative group hover:border-[#CCFF00]/60 transition">
              <CornerCrosshairs />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WaveformIcon className="w-4 h-4 text-[#CCFF00]" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#CCFF00] font-bold">
                      02 // KINETIC MOTION
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#828892]">[BÉZIER_TELEMETRY]</span>
                </div>
                <h3 className="text-2xl font-black uppercase text-[#FFFFFF] tracking-tight">
                  Bézier Curve Inspector & Waveform
                </h3>
                <p className="text-xs font-mono text-[#828892] leading-relaxed">
                  Inspect and scrub micro-interaction curves with high-voltage neon Bézier visualization.
                </p>
              </div>

              {/* Neon Lime Waveform / Bézier Visualization */}
              <div className="bg-[#08090A] border border-[#22252A] rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-[#828892]">CURVE: cubic-bezier(0.16, 1, 0.3, 1)</span>
                  <button
                    onClick={triggerMotionPlay}
                    disabled={isPlayingCurve}
                    className="px-2 py-0.5 rounded bg-[#111315] border border-[#22252A] text-[#CCFF00] hover:border-[#CCFF00] font-bold text-[9px]"
                  >
                    {isPlayingCurve ? 'TESTING...' : 'PLAY CURVE ∿'}
                  </button>
                </div>

                {/* SVG Curve Canvas */}
                <div className="h-28 bg-[#111315] rounded-lg border border-[#22252A] relative flex items-center justify-center p-2 overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 300 80">
                    <line x1="0" y1="40" x2="300" y2="40" stroke="#22252A" strokeDasharray="3 3" />
                    {/* Animated Waveform Curve */}
                    <path
                      d="M 10,70 C 60,70 90,10 150,10 C 210,10 240,70 290,70"
                      fill="none"
                      stroke="#CCFF00"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      filter="drop-shadow(0px 0px 6px rgba(204,255,0,0.8))"
                    />
                    {/* Scrubber Ball */}
                    <circle
                      cx={10 + (280 * curveScrub) / 100}
                      cy={curveScrub < 50 ? 70 - (60 * curveScrub) / 50 : 10 + (60 * (curveScrub - 50)) / 50}
                      r="5"
                      fill="#CCFF00"
                      stroke="#08090A"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-[#828892]">
                  <span>DURATION: 450ms</span>
                  <span>PROGRESS: {curveScrub}%</span>
                </div>
              </div>
            </div>

            {/* Bento Card 03: Pre-Flight Sanity Terminal Table (Span 5) */}
            <div className="md:col-span-5 bg-[#111315] border border-[#22252A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between relative group hover:border-[#CCFF00]/60 transition">
              <CornerCrosshairs />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-[#CCFF00]" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#CCFF00] font-bold">
                      03 // PRE-FLIGHT SANITY
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-0.5 rounded border border-[#CCFF00]/30 font-bold shadow-[0_0_8px_rgba(204,255,0,0.2)]">
                    [STAGE_READY // 99.8%]
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase text-[#FFFFFF] tracking-tight">
                  Automated Audit Terminal
                </h3>
                <p className="text-xs font-mono text-[#828892] leading-relaxed">
                  Real-time protocol diagnostics testing staging proxies, headers, and asset health before client review.
                </p>
              </div>

              {/* High-Contrast Terminal Diagnostic Table with Green Checkmarks */}
              <div className="bg-[#08090A] border border-[#22252A] rounded-xl p-3 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-[10px] text-[#828892] border-b border-[#22252A] pb-1.5">
                  <span>DIAGNOSTIC TEST</span>
                  <span>RESULT</span>
                </div>

                {[
                  { test: 'DNS Proxy Forwarding', status: '200 OK', val: 'PASS' },
                  { test: 'X-Frame-Options Stripped', status: 'ALLOW', val: 'PASS' },
                  { test: 'OpenGraph Meta Tags', status: 'RESOLVED', val: 'PASS' },
                  { test: 'SSL Certificate Handshake', status: 'VALID (TLS 1.3)', val: 'PASS' },
                  { test: 'Token Handoff Checklist', status: 'VERIFIED', val: 'PASS' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-1 text-[11px] border-b border-[#22252A]/40 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[#CCFF00] font-bold">✓</span>
                      <span className="text-[#FFFFFF]">{row.test}</span>
                    </div>
                    <span className="text-[#CCFF00] text-[10px] font-bold bg-[#CCFF00]/10 px-1.5 py-0.5 rounded">
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bento Card 04: Handoff Vault (Span 7) */}
            <div className="md:col-span-7 bg-[#111315] border border-[#22252A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between relative group hover:border-[#CCFF00]/60 transition">
              <CornerCrosshairs />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SwatchCubeIcon className="w-4 h-4 text-[#CCFF00]" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#CCFF00] font-bold">
                      04 // HANDOFF VAULT
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#828892]">[TOKEN_GOVERNANCE]</span>
                </div>
                <h3 className="text-2xl font-black uppercase text-[#FFFFFF] tracking-tight">
                  Design Tokens & Asset Vault
                </h3>
                <p className="text-xs font-mono text-[#828892] leading-relaxed">
                  Automated token extraction and WCAG verification featuring the core Cyber-Techwear palette. Click any swatch to copy.
                </p>
              </div>

              {/* Swatch Grid Featuring #08090A, #16181B, #828892, #CCFF00 */}
              <div className="bg-[#08090A] border border-[#22252A] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#828892]">
                  <span>COLOR MATRIX:</span>
                  {copiedHex && (
                    <span className="text-[#CCFF00] font-bold animate-pulse">
                      ✓ COPIED {copiedHex}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { hex: '#08090A', label: 'Pitch Black', role: 'Canvas' },
                    { hex: '#16181B', label: 'Matte Slate', role: 'Containers' },
                    { hex: '#828892', label: 'Tactical Ash', role: 'Labels' },
                    { hex: '#CCFF00', label: 'Cyber Lime', role: 'Primary CTA' },
                  ].map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => handleCopyHex(color.hex)}
                      className="group/swatch text-left space-y-2 bg-[#111315] p-2.5 rounded-lg border border-[#22252A] hover:border-[#CCFF00] transition active:scale-95"
                    >
                      <div
                        style={{ backgroundColor: color.hex }}
                        className={`w-full h-12 rounded border ${
                          color.hex === '#CCFF00'
                            ? 'border-black shadow-[0_0_12px_rgba(204,255,0,0.5)]'
                            : 'border-white/10'
                        }`}
                      />
                      <div className="font-mono text-[10px]">
                        <span className="text-[#FFFFFF] font-bold block">{color.hex}</span>
                        <span className="text-[#828892] text-[9px] block truncate">{color.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Dual Entry Gateways */}
        <section className="space-y-6 pt-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] font-bold">
              [AUTHENTICATION GATEWAYS]
            </span>
            <h3 className="text-3xl font-black uppercase text-[#FFFFFF] tracking-tight">
              SELECT YOUR OPERATING TIER
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Studio Admin Cockpit */}
            <div className="bg-[#111315] border border-[#22252A] rounded-2xl p-8 shadow-xl flex flex-col justify-between space-y-8 relative group hover:border-[#CCFF00] transition">
              <CornerCrosshairs />

              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] bg-[#CCFF00]/10 px-3 py-1 rounded border border-[#CCFF00]/30 font-bold">
                  FOR STUDIO PRINCIPALS
                </span>
                <h4 className="text-2xl font-black uppercase text-[#FFFFFF] tracking-tight">
                  Studio Admin Cockpit
                </h4>
                <p className="text-xs font-mono text-[#828892] leading-relaxed">
                  Full control over client pipelines, staging nodes, live variant overrides, and retainer burndown tracking.
                </p>

                <ul className="space-y-2 text-xs font-mono text-[#828892] pt-2">
                  <li className="flex items-center gap-2">
                    <span className="text-[#CCFF00] font-bold">✓</span>
                    <span>Neon PostgreSQL atomic synchronization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#CCFF00] font-bold">✓</span>
                    <span>Kinetic motion curve exporter (CSS / GSAP)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#CCFF00] font-bold">✓</span>
                    <span>Automated DOM asset harvester & vault</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  href="/login"
                  className="w-full py-3.5 px-6 bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-mono uppercase tracking-wider font-black rounded-xl text-center transition-all shadow-[0_0_16px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2"
                >
                  <span>AUTHENTICATE STUDIO COCKPIT →</span>
                </Link>
              </div>
            </div>

            {/* Client Review Portal */}
            <div className="bg-[#111315] border border-[#22252A] rounded-2xl p-8 shadow-xl flex flex-col justify-between space-y-8 relative group hover:border-[#CCFF00] transition">
              <CornerCrosshairs />

              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFFFFF] bg-white/10 px-3 py-1 rounded border border-white/20 font-bold">
                  FOR CLIENTS & REVIEWERS
                </span>
                <h4 className="text-2xl font-black uppercase text-[#FFFFFF] tracking-tight">
                  Client Review Portal
                </h4>
                <p className="text-xs font-mono text-[#828892] leading-relaxed">
                  Passwordless token-based entry. Pin coordinate feedback, inspect responsive viewports, and sign off deliverables.
                </p>

                <ul className="space-y-2 text-xs font-mono text-[#828892] pt-2">
                  <li className="flex items-center gap-2">
                    <span className="text-[#CCFF00] font-bold">✓</span>
                    <span>One-click passwordless magic token entry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#CCFF00] font-bold">✓</span>
                    <span>Coordinate percentage pin dropper</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#CCFF00] font-bold">✓</span>
                    <span>Milestone cryptographic sign-off</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  href="/portal/invite"
                  className="w-full py-3.5 px-6 bg-[#16181B] hover:bg-[#22252A] border border-[#22252A] hover:border-[#CCFF00] text-[#FFFFFF] text-xs font-mono uppercase tracking-wider font-bold rounded-xl text-center transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>ENTER VIA MAGIC TOKEN →</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Tactical Brutalist Footer */}
      <footer className="relative z-10 border-t border-[#22252A] bg-[#08090A] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-[#828892]">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#FFFFFF]">STUDIOORBIT</span>
            <span>//</span>
            <span>SS26 CYBER-TECHWEAR OS</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/miidaystudio/studio-orbit"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#CCFF00] transition flex items-center gap-1.5"
            >
              <span>GitHub</span>
              <ArrowUpRightIcon className="w-3 h-3" />
            </a>
            <Link href="/overview" className="hover:text-[#CCFF00] transition">
              Overview
            </Link>
            <Link href="/review-sandbox" className="hover:text-[#CCFF00] transition">
              Review Sandbox
            </Link>
            <Link href="/onboarding" className="hover:text-[#CCFF00] transition">
              Onboarding
            </Link>
          </div>

          <div>
            <p>© {new Date().getFullYear()} STUDIOORBIT. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
