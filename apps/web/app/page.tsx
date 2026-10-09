'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Sliders,
  ShieldCheck,
  Code2,
  Activity,
  Box,
  Layers,
  Lock,
  Laptop,
  Tablet,
  Smartphone,
  GitBranch,
  Cpu,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Eye,
  Play,
  FileCheck,
  LogIn,
  Search,
  ChevronDown,
  User
} from 'lucide-react';

export default function StudioOrbitLandingPage() {
  // 1. Client Project Hash State
  const [projectHash, setProjectHash] = useState('');

  // 2. Interactive Viewport Hero State
  const [activePin, setActivePin] = useState<number | null>(1);
  const [targetViewport, setTargetViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // 3. Bento Card: Live Visual Overrides State
  const [activeVariant, setActiveVariant] = useState<'base' | 'v1' | 'v2'>('v1');
  const [elementText, setElementText] = useState('THE FUTURE OF CLIENT DELIVERY IS NOW.');

  // 4. Bento Card: Motion Scrubber State
  const [curveScrub, setCurveScrub] = useState(65);
  const [isPlayingCurve, setIsPlayingCurve] = useState(false);

  // 5. Bento Card: Swatch Copy State
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleLaunchProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectHash.trim()) return;
    const cleanToken = projectHash.trim().replace(/^.*\/portal\//, '');
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
    <div className="min-h-screen bg-[#F9F9F9] text-[#111111] font-sans antialiased selection:bg-[#346853] selection:text-white relative overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* 1. TOP NAVIGATION                                            */}
      {/* ============================================================ */}
      <header className="relative z-30 w-full px-6 sm:px-12 py-5 max-w-7xl mx-auto flex items-center justify-between border-b border-gray-200/70">
        
        {/* Left: Brand Logo + Nav Links */}
        <div className="flex items-center gap-8 sm:gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Vault Squircle Dark Green Icon */}
            <div className="w-8 h-8 rounded-xl bg-[#346853] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
              <div className="w-3.5 h-3.5 rounded-sm bg-white/20 border border-white/60" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight uppercase text-[#111111]">
              STUDIO<span className="text-[#346853]">ORBIT</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
            <a
              href="#capabilities"
              className="flex items-center gap-1 hover:text-[#346853] transition-colors"
            >
              <span>Capabilities</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
            </a>
            <a
              href="#staging"
              className="hover:text-[#346853] transition-colors"
            >
              Staging Demo
            </a>
            <a
              href="#vault"
              className="hover:text-[#346853] transition-colors"
            >
              Token Vault
            </a>
            <Link
              href="/overview"
              className="hover:text-[#346853] transition-colors"
            >
              Overview
            </Link>
          </nav>
        </div>

        {/* Right: Client Access + Studio Login Button */}
        <div className="flex items-center gap-5 sm:gap-6 text-sm font-medium">
          <Link
            href="/portal/invite"
            className="text-slate-700 hover:text-[#346853] transition-colors font-medium"
          >
            Client Access
          </Link>

          <Link
            href="/login"
            className="px-5 py-2.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold tracking-wide transition shadow-sm flex items-center gap-2 active:scale-95"
          >
            <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
              <User className="w-2.5 h-2.5 text-white" />
            </div>
            <span>Studio Login</span>
          </Link>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION (VAULT EDITORIAL CONNECTED GRAPH)            */}
      {/* ============================================================ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pt-10 pb-20 overflow-hidden">
        
        {/* Background circuit lines connecting nodes */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block"
          viewBox="0 0 1200 650"
          fill="none"
        >
          <line x1="880" y1="0" x2="880" y2="100" stroke="#111111" strokeWidth="1" />
          <line x1="880" y1="360" x2="880" y2="440" stroke="#111111" strokeWidth="1" />
          <circle cx="880" cy="440" r="4.5" fill="#111111" />
          <line x1="880" y1="440" x2="1060" y2="490" stroke="#111111" strokeWidth="1" />
          <circle cx="1060" cy="490" r="4" fill="#111111" />
          <line x1="880" y1="440" x2="880" y2="520" stroke="#111111" strokeWidth="1" />
        </svg>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[580px]">
          
          {/* Left Side: Headline & Tags */}
          <div className="lg:col-span-7 space-y-6 z-10">
            
            {/* Green dot badge */}
            <div className="flex items-center gap-2 text-xs font-medium text-gray-800">
              <span className="w-2.5 h-2.5 rounded-full bg-[#346853] inline-block" />
              <span>Get exclusives &bull; Production Staging OS</span>
            </div>

            {/* Display Headline */}
            <div className="font-heading uppercase text-[#111111] select-none tracking-tight leading-[0.92]">
              
              {/* Row 1: THE FUTURE */}
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal">
                THE FUTURE
              </div>

              {/* Row 2: OF CLIENT + 7-day trial pill */}
              <div className="flex flex-wrap items-center gap-4 text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal">
                <span className="inline-flex items-center">
                  <span>OF</span>
                  <span className="relative inline-flex items-center justify-center mx-1">
                    <span className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-[#111111] flex items-center justify-center">
                      <span className="text-lg sm:text-xl md:text-2xl text-[#111111]">✦</span>
                    </span>
                  </span>
                  <span>CLIENT</span>
                </span>

                {/* Floating Forest Green Pill Badge */}
                <span className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#346853] text-white text-xs sm:text-sm font-semibold tracking-normal normal-case shadow-[0_12px_24px_rgba(52,104,83,0.35)] -mt-2 hover:scale-105 transition cursor-pointer">
                  7-day trial
                </span>
              </div>

              {/* Row 3: DELIVERY IS NOW. */}
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal">
                <span>DELIVERY IS N</span>
                <span className="relative inline-block mx-0.5">
                  <span>O</span>
                  <span className="absolute inset-y-1 left-1/2 -translate-x-1/2 w-[2px] bg-[#111111] rotate-45 transform pointer-events-none" />
                </span>
                <span>W.</span>
              </div>

            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed pt-1">
              Execute live visual DOM overrides, synchronize kinetic Bézier curves, run pre-flight sanity diagnostics, and lock handoff vaults in one high-voltage cockpit.
            </p>

            {/* Token Quick Launcher */}
            <div id="token-launcher" className="max-w-md pt-1">
              <form onSubmit={handleLaunchProject} className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-xs focus-within:border-[#346853] transition">
                <Search className="w-4 h-4 text-gray-400 ml-2" />
                <input
                  type="text"
                  value={projectHash}
                  onChange={(e) => setProjectHash(e.target.value)}
                  placeholder="Enter project token (e.g. lumina-portal-token-9988)..."
                  className="flex-1 bg-transparent px-2 py-1.5 text-xs font-medium text-[#111111] placeholder-gray-400 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#346853] hover:bg-[#2A5443] text-white text-xs font-bold rounded-xl transition shadow-xs whitespace-nowrap"
                >
                  Launch →
                </button>
              </form>
            </div>

            {/* Bottom Hero Metrics: SaaS Awards + 1M Moon Phase Counter */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center border-t border-gray-200/80">
              
              {/* SaaS Awards Card with 3D Glossy Spheres */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs relative overflow-hidden h-28 flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-16 h-16 bg-[#F3D5C5]/40 rounded-br-full pointer-events-none" />
                <div className="relative z-10 text-xs font-bold text-[#111111] leading-tight">
                  <p>SaaS</p>
                  <p>Awards &apos;23</p>
                </div>

                <div className="absolute right-2 bottom-1 flex items-end">
                  <div className="relative w-16 h-14">
                    <div className="absolute right-0 bottom-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 via-gray-900 to-black shadow-lg" />
                    <div className="absolute right-6 bottom-2 w-7 h-7 rounded-full bg-gradient-to-br from-gray-500 via-gray-800 to-black shadow-md" />
                    <div className="absolute right-2 bottom-6 w-5 h-5 rounded-full bg-gradient-to-br from-gray-400 via-gray-700 to-black shadow-sm" />
                  </div>
                </div>

                <div className="relative z-10 text-[10px] font-mono text-gray-500 font-semibold">
                  AUDITED // PRE-FLIGHT
                </div>
              </div>

              {/* 1M ◑ /23 Metric */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-2xl sm:text-3xl font-heading font-medium text-[#111111]">
                  <span>1M</span>
                  <div className="w-6 h-6 rounded-full bg-[#346853] relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-y-0 left-0 w-1/2 bg-white/40" />
                  </div>
                  <span>/23</span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-snug">
                  <strong className="font-semibold text-[#111111]">720+ active pipelines on Orbit</strong> mean endless discovery and instant review sanity.
                </p>
              </div>

            </div>

          </div>

          {/* Right Side: Hero Portrait Card & Connected Badges */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            
            {/* Center Hero Photo */}
            <div className="w-full max-w-sm sm:max-w-md h-72 sm:h-84 md:h-96 rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80 bg-gray-100 relative z-10">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                alt="Vault Model"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Floating Green Circle Badge */}
            <div className="absolute -bottom-4 -right-2 sm:right-2 z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#346853] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white hover:scale-105 transition cursor-pointer">
              <span className="text-base sm:text-lg font-bold font-heading">
                $14.99
              </span>
              <span className="text-[9px] sm:text-[10px] text-white/80 font-mono">
                /month
              </span>
            </div>

            {/* Bottom Dark Mobile Widget Card (Your Goals 74%) */}
            <div className="w-full max-w-xs mt-6 bg-[#0B0D0C] text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-gray-800 space-y-3 self-start sm:self-center relative z-10">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[#346853] font-bold">
                  <span>▲</span>
                  <span className="text-white">Your Goals</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">ACTIVE</span>
              </div>

              {/* Progress Ring */}
              <div className="flex items-center justify-center py-1">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-800"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#346853]"
                      strokeDasharray="74, 100"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-heading font-bold text-lg text-white">
                    74%
                  </span>
                </div>
              </div>

              <div className="text-center text-[11px] font-mono text-gray-400 border-t border-gray-800 pt-2">
                Many programs. One subscription.
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* 3. INTERACTIVE LIVE STAGING VIEWPORT                         */}
      {/* ============================================================ */}
      <section id="staging" className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#346853]">
              [INTERACTIVE PREVIEW // STAGING RUNTIME]
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] mt-1 font-heading">
              Sandboxed Visual QA Staging Canvas
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setTargetViewport('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                targetViewport === 'desktop'
                  ? 'bg-[#111111] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              DESKTOP 1440px
            </button>
            <button
              onClick={() => setTargetViewport('tablet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                targetViewport === 'tablet'
                  ? 'bg-[#111111] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              TABLET 768px
            </button>
            <button
              onClick={() => setTargetViewport('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                targetViewport === 'mobile'
                  ? 'bg-[#111111] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              MOBILE 390px
            </button>
          </div>
        </div>

        {/* Browser Window Container */}
        <div className="w-full bg-white border border-gray-200 rounded-3xl p-4 sm:p-6 shadow-xl relative">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700">
                <Lock className="w-3 h-3 text-[#346853]" />
                <span>https://miidaystudio.online/staging</span>
                <span className="text-[#346853] text-[10px] font-bold">[PROXY_ONLINE]</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-gray-500 font-bold">
              <span>SCALE: 100%</span>
              <span>•</span>
              <span className="text-[#346853]">2 ACTIVE QA PINS</span>
            </div>
          </div>

          {/* Inner Sandboxed Preview */}
          <div
            className={`mx-auto mt-6 bg-[#F8F9FA] border border-gray-200 rounded-2xl relative min-h-[380px] p-6 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
              targetViewport === 'desktop'
                ? 'w-full'
                : targetViewport === 'tablet'
                ? 'max-w-2xl'
                : 'max-w-sm'
            }`}
          >
            <div className="space-y-4 max-w-lg bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#346853] font-bold block">
                // CLIENT DELIVERABLE MOCKUP
              </span>
              <h4 className="text-2xl sm:text-3xl font-bold uppercase text-[#111111] tracking-tight font-heading">
                KINETIC BRAND FRAMEWORK
              </h4>
              <p className="text-xs font-mono text-gray-600 leading-relaxed">
                Atomic component delivery pipeline with real-time DOM mutation verification and cryptographic handoff checklists.
              </p>
              <div className="flex gap-2 pt-2">
                <button className="px-4 py-2 bg-[#346853] hover:bg-[#2A5443] text-white font-mono text-[11px] font-bold rounded-xl shadow-xs transition">
                  EXPLORE SPECS →
                </button>
                <button className="px-4 py-2 bg-white text-[#111111] border border-gray-300 font-mono text-[11px] font-bold rounded-xl hover:bg-gray-50 transition">
                  VIEW REPO
                </button>
              </div>
            </div>

            {/* Pin 01 */}
            <div
              onClick={() => setActivePin(activePin === 1 ? null : 1)}
              className="absolute top-[28%] right-[16%] z-30 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#346853] text-white font-mono text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition">
                01
              </div>

              {activePin === 1 && (
                <div className="absolute right-10 top-0 w-72 bg-white border border-gray-200 rounded-2xl p-4 shadow-xl text-left z-40">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#346853] font-bold mb-1">
                    <span>PIN #01 // VISUAL QA</span>
                    <span className="text-gray-400">ACTIVE</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    Typography tracking tuned to preserve sharp rhythm across all breakpoints.
                  </p>
                  <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <span>SELECTOR: h1.hero-title</span>
                    <span className="text-[#346853] font-bold">STATUS: FIXED</span>
                  </div>
                </div>
              )}
            </div>

            {/* Pin 02 */}
            <div
              onClick={() => setActivePin(activePin === 2 ? null : 2)}
              className="absolute bottom-[24%] left-[22%] z-30 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#346853] text-white font-mono text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition">
                ✓
              </div>

              {activePin === 2 && (
                <div className="absolute left-10 bottom-0 w-72 bg-white border border-gray-200 rounded-2xl p-4 shadow-xl text-left z-40">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#346853] font-bold mb-1">
                    <span>PIN #02 // MILESTONE SIGN-OFF</span>
                    <span className="text-gray-400">VERIFIED</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    Bézier acceleration curve verified across all responsive breakpoints.
                  </p>
                  <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <span>CURVE: (0.16, 1, 0.3, 1)</span>
                    <span className="text-[#346853] font-bold">APPROVED</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-200 flex justify-between items-center text-[11px] font-mono text-gray-500 font-bold">
              <span>POSTGRESQL // DRIZZLE SYNC: ATOMIC</span>
              <span className="text-[#346853]">FPS: 60.0 &bull; LATENCY: 12ms</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. CORE ENGINEERING CAPABILITIES (BENTO DECK)               */}
      {/* ============================================================ */}
      <section id="capabilities" className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#346853]">
              [SYSTEM PILLARS // NEXUS MATRIX]
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111] mt-1 font-heading">
              CORE ENGINEERING CAPABILITIES
            </h2>
          </div>
          <p className="text-xs font-mono text-gray-600 max-w-sm font-bold">
            Purpose-built tools for visual mutations, kinetic curves, pre-flight terminal audits, and executive asset vaults.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 01: Live Visual Overrides */}
          <div className="md:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#346853]">
                  <Sliders className="w-4 h-4" />
                  <span>01 // LIVE VISUAL OVERRIDES</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">[MUTATION_ENGINE]</span>
              </div>
              <h3 className="text-2xl font-bold uppercase text-[#111111] tracking-tight font-heading">
                In-Iframe Element Mutator & Variant Stager
              </h3>
              <p className="text-xs font-mono text-gray-600 leading-relaxed">
                Click any live DOM element to stage copy and style overrides in real time. Switch between variants without deploying code.
              </p>
            </div>

            <div className="bg-[#F8F9FA] border border-gray-200 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-600 font-bold">ACTIVE VARIANT:</span>
                <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-gray-200">
                  {(['base', 'v1', 'v2'] as const).map((variant) => (
                    <button
                      key={variant}
                      onClick={() => {
                        setActiveVariant(variant);
                        if (variant === 'base') setElementText('DEFAULT CLIENT HEADLINE');
                        if (variant === 'v1') setElementText('THE FUTURE OF CLIENT DELIVERY IS NOW.');
                        if (variant === 'v2') setElementText('TACTICAL STUDIO ARCHITECTURE');
                      }}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase font-bold transition ${
                        activeVariant === variant
                          ? 'bg-[#346853] text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {variant.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#346853] bg-white relative">
                <span className="absolute -top-2.5 left-2 px-1.5 bg-[#346853] text-white text-[9px] font-mono font-bold uppercase rounded">
                  SELECTOR: h1.hero-display
                </span>
                <p className="text-sm font-mono font-bold text-[#111111] mt-1">
                  &ldquo;{elementText}&rdquo;
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono text-[#346853] mt-3 pt-2 border-t border-gray-100 font-bold">
                  <span>OVERRIDE: TEXT_MUTATION</span>
                  <span className="text-gray-500">A/B VARIANT ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 02: Kinetic Motion */}
          <div className="md:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#346853]">
                  <Activity className="w-4 h-4" />
                  <span>02 // KINETIC MOTION</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">[BÉZIER_TELEMETRY]</span>
              </div>
              <h3 className="text-2xl font-bold uppercase text-[#111111] tracking-tight font-heading">
                Bézier Curve Inspector
              </h3>
              <p className="text-xs font-mono text-gray-600 leading-relaxed">
                Inspect and scrub micro-interaction curves with high-voltage Bézier visualization.
              </p>
            </div>

            <div className="bg-[#F8F9FA] border border-gray-200 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                <span className="text-gray-600">cubic-bezier(0.16, 1, 0.3, 1)</span>
                <button
                  onClick={triggerMotionPlay}
                  disabled={isPlayingCurve}
                  className="px-2.5 py-1 rounded-lg bg-white border border-gray-300 text-[#346853] font-bold text-[10px] hover:bg-gray-50 transition"
                >
                  {isPlayingCurve ? 'TESTING...' : 'PLAY CURVE ∿'}
                </button>
              </div>

              <div className="h-28 bg-white rounded-xl border border-gray-200 relative flex items-center justify-center p-2 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 300 80">
                  <line x1="0" y1="40" x2="300" y2="40" stroke="#E5E7EB" strokeDasharray="3 3" />
                  <path
                    d="M 10,70 C 60,70 90,10 150,10 C 210,10 240,70 290,70"
                    fill="none"
                    stroke="#346853"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={10 + (280 * curveScrub) / 100}
                    cy={curveScrub < 50 ? 70 - (60 * curveScrub) / 50 : 10 + (60 * (curveScrub - 50)) / 50}
                    r="6"
                    fill="#346853"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 font-bold">
                <span>DURATION: 450ms</span>
                <span>PROGRESS: {curveScrub}%</span>
              </div>
            </div>
          </div>

          {/* Bento Card 03: Pre-Flight Sanity */}
          <div id="audit" className="md:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#346853]">
                  <Terminal className="w-4 h-4" />
                  <span>03 // PRE-FLIGHT SANITY</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  [STAGE_READY // 99.8%]
                </span>
              </div>
              <h3 className="text-2xl font-bold uppercase text-[#111111] tracking-tight font-heading">
                Automated Audit Terminal
              </h3>
              <p className="text-xs font-mono text-gray-600 leading-relaxed">
                Real-time protocol diagnostics testing staging proxies, headers, and asset health before client review.
              </p>
            </div>

            <div className="bg-[#F8F9FA] border border-gray-200 rounded-2xl p-3 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-[10px] text-gray-500 border-b border-gray-200 pb-1.5 font-bold">
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
                <div key={i} className="flex justify-between items-center py-1 text-[11px] border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[#346853] font-bold">✓</span>
                    <span className="text-[#111111] font-bold">{row.test}</span>
                  </div>
                  <span className="text-emerald-800 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bento Card 04: Token Vault */}
          <div id="vault" className="md:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#346853]">
                  <Code2 className="w-4 h-4" />
                  <span>04 // HANDOFF VAULT</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">[TOKEN_GOVERNANCE]</span>
              </div>
              <h3 className="text-2xl font-bold uppercase text-[#111111] tracking-tight font-heading">
                Design Tokens & Asset Vault
              </h3>
              <p className="text-xs font-mono text-gray-600 leading-relaxed">
                Automated token extraction and WCAG verification featuring the core studio palette. Click any swatch to copy.
              </p>
            </div>

            <div className="bg-[#F8F9FA] border border-gray-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-600 font-bold">
                <span>COLOR MATRIX:</span>
                {copiedHex && (
                  <span className="text-[#346853] font-bold animate-pulse">
                    ✓ COPIED {copiedHex}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { hex: '#111111', label: 'Vault Obsidian', role: 'Typography' },
                  { hex: '#346853', label: 'Forest Green', role: 'Primary CTA' },
                  { hex: '#F3D5C5', label: 'Peach Blush', role: 'Accent Node' },
                  { hex: '#F9F9F9', label: 'Bone Canvas', role: 'Background' },
                ].map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => handleCopyHex(color.hex)}
                    className="group/swatch text-left space-y-2 bg-white p-2.5 rounded-2xl border border-gray-200 hover:scale-105 transition shadow-xs active:scale-95"
                  >
                    <div
                      style={{ backgroundColor: color.hex }}
                      className="w-full h-12 rounded-xl border border-black/5 shadow-inner"
                    />
                    <div className="font-mono text-[10px]">
                      <span className="text-[#111111] font-bold block">{color.hex}</span>
                      <span className="text-gray-500 text-[9px] block truncate font-medium">{color.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. DUAL ACCESS GATEWAYS                                      */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#346853]">
            [AUTHENTICATION GATEWAYS]
          </span>
          <h3 className="text-3xl font-bold uppercase text-[#111111] tracking-tight font-heading">
            SELECT YOUR OPERATING TIER
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Studio Admin Cockpit */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-8 hover:scale-[1.01] transition">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#346853] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold inline-block">
                FOR STUDIO PRINCIPALS
              </span>
              <h4 className="text-2xl font-bold uppercase text-[#111111] tracking-tight font-heading">
                Studio Admin Cockpit
              </h4>
              <p className="text-xs font-mono text-gray-600 leading-relaxed font-medium">
                Full control over client pipelines, staging nodes, live variant overrides, and retainer burndown tracking.
              </p>

              <ul className="space-y-2.5 text-xs font-mono text-gray-700 pt-2 font-bold">
                <li className="flex items-center gap-2">
                  <span className="text-[#346853]">✓</span>
                  <span>Neon PostgreSQL atomic synchronization</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#346853]">✓</span>
                  <span>Kinetic motion curve exporter (CSS / GSAP)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#346853]">✓</span>
                  <span>Automated DOM asset harvester & vault</span>
                </li>
              </ul>
            </div>

            <div>
              <Link
                href="/login"
                className="w-full py-4 px-6 bg-[#346853] hover:bg-[#2A5443] text-white text-xs font-mono uppercase tracking-wider font-bold rounded-2xl text-center transition shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <span>AUTHENTICATE STUDIO COCKPIT →</span>
              </Link>
            </div>
          </div>

          {/* Client Review Portal */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-8 hover:scale-[1.01] transition">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full font-bold inline-block">
                FOR CLIENTS & REVIEWERS
              </span>
              <h4 className="text-2xl font-bold uppercase text-[#111111] tracking-tight font-heading">
                Client Review Portal
              </h4>
              <p className="text-xs font-mono text-gray-600 leading-relaxed font-medium">
                Passwordless token-based entry. Pin coordinate feedback, inspect responsive viewports, and sign off deliverables.
              </p>

              <ul className="space-y-2.5 text-xs font-mono text-gray-700 pt-2 font-bold">
                <li className="flex items-center gap-2">
                  <span className="text-[#346853]">✓</span>
                  <span>One-click passwordless magic token entry</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#346853]">✓</span>
                  <span>Coordinate percentage pin dropper</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#346853]">✓</span>
                  <span>Milestone cryptographic sign-off</span>
                </li>
              </ul>
            </div>

            <div>
              <Link
                href="/portal/invite"
                className="w-full py-4 px-6 bg-white hover:bg-gray-50 border border-gray-300 text-[#111111] text-xs font-mono uppercase tracking-wider font-bold rounded-2xl text-center transition shadow-xs flex items-center justify-center gap-2 active:scale-95"
              >
                <span>ENTER VIA MAGIC TOKEN →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. FOOTER                                                    */}
      {/* ============================================================ */}
      <footer className="border-t border-gray-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-gray-600 font-bold">
          <div className="flex items-center gap-3">
            <span className="text-[#111111] font-black">STUDIOORBIT</span>
            <span>//</span>
            <span>TACTICAL CLIENT DELIVERY OS</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/miidaystudio/studio-orbit"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#346853] transition flex items-center gap-1.5"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <Link href="/overview" className="hover:text-[#346853] transition">
              Overview
            </Link>
            <Link href="/review-sandbox" className="hover:text-[#346853] transition">
              Review Sandbox
            </Link>
            <Link href="/onboarding" className="hover:text-[#346853] transition">
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
