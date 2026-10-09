'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function VaultHero() {
  return (
    <div className="w-screen h-screen max-h-screen overflow-hidden bg-[#F9F9F9] text-[#111111] font-sans antialiased select-none relative flex flex-col justify-between p-6 sm:p-10 lg:p-12 box-border">
      
      {/* ============================================================ */}
      {/* BACKGROUND WIRE CIRCUIT DIAGRAM LINES & NODES                */}
      {/* ============================================================ */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Top vertical line to dropdown capsule */}
        <line x1="1020" y1="0" x2="1020" y2="120" stroke="#111111" strokeWidth="1" />
        
        {/* Vertical line from dropdown capsule to hero card */}
        <line x1="1020" y1="140" x2="1020" y2="240" stroke="#111111" strokeWidth="1" />

        {/* Wire from bottom of hero card to node */}
        <line x1="1020" y1="520" x2="1020" y2="590" stroke="#111111" strokeWidth="1" />
        <circle cx="1020" cy="590" r="4.5" fill="#111111" />

        {/* Wire from node to bottom right black card */}
        <line x1="1020" y1="590" x2="1020" y2="690" stroke="#111111" strokeWidth="1" />

        {/* Wire branching from node to green circular badge */}
        <line x1="1020" y1="590" x2="1260" y2="640" stroke="#111111" strokeWidth="1" />
        <circle cx="1260" cy="640" r="4" fill="#111111" />

        {/* Wire continuing right from green circle to edge */}
        <line x1="1260" y1="640" x2="1440" y2="660" stroke="#111111" strokeWidth="1" />

        {/* Diagonal wire from award card to spheres */}
        <line x1="180" y1="780" x2="260" y2="840" stroke="#111111" strokeWidth="0.75" />
      </svg>

      {/* ============================================================ */}
      {/* A. TOP HEADER                                                */}
      {/* ============================================================ */}
      <header className="relative z-20 w-full flex items-center justify-between">
        
        {/* Left: Logo + Vertical Divider + 2-Bar Menu */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            {/* Vault Geometric Squircle Icon */}
            <div className="w-8 h-8 rounded-xl bg-[#346853] flex items-center justify-center text-white shadow-xs">
              <div className="w-3.5 h-3.5 rounded-sm bg-white/20 border border-white/60" />
            </div>
            <span className="font-heading font-extrabold text-2xl tracking-tight uppercase text-[#111111]">
              VAULT
            </span>
          </Link>

          {/* Thin Hairline Divider */}
          <div className="h-6 w-px bg-gray-300" />

          {/* Minimalist 2-Bar Horizontal Menu Toggle */}
          <button className="flex flex-col gap-1.5 p-1 cursor-pointer group" title="Menu">
            <span className="w-8 h-[2px] bg-[#111111] transition-all group-hover:w-9" />
            <span className="w-8 h-[2px] bg-[#111111] transition-all group-hover:w-6" />
          </button>
        </div>

        {/* Center-Right: Top Vertical Line Node Capsule */}
        <div className="absolute left-[70.8%] top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 hidden md:flex items-center justify-center">
          <button className="w-7 h-12 rounded-full bg-[#EADCC9] border border-[#111111] flex items-center justify-center shadow-xs hover:scale-105 transition cursor-pointer">
            <ChevronDown className="w-3.5 h-3.5 text-[#111111]" />
          </button>
        </div>

        {/* Right: SEARCH + Divider + CONTACT US + Gift Cards Pill */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6 text-xs font-bold tracking-widest uppercase">
            <button className="text-[#111111] hover:text-[#346853] transition-colors cursor-pointer">
              SEARCH
            </button>

            <div className="h-5 w-px bg-gray-300" />

            <button className="text-[#111111] hover:text-[#346853] transition-colors cursor-pointer">
              CONTACT US
            </button>
          </div>

          {/* Floating Vertical Rounded Pill Badge (Gift Cards) */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-white border border-[#111111] rounded-full px-3.5 py-4 gap-1.5 shadow-xs hover:scale-105 transition cursor-pointer ml-4">
            <div className="w-7 h-7 rounded-lg bg-[#346853] flex items-center justify-center text-white text-xs font-black">
              ⋈
            </div>
            <span className="text-[10px] font-bold text-[#111111] leading-tight text-center">
              Gift<br />Cards
            </span>
          </div>
        </div>

      </header>

      {/* ============================================================ */}
      {/* B. HERO CORE (MIDDLE SECTION)                                */}
      {/* ============================================================ */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto w-full">
        
        {/* Left Side: Headline & Tags */}
        <div className="lg:col-span-7 space-y-4 lg:space-y-6">
          
          {/* Green circular badge with text 'Get exclusives' */}
          <div className="flex items-center gap-2 text-xs font-medium text-gray-800">
            <span className="w-2.5 h-2.5 rounded-full bg-[#346853] inline-block" />
            <span>Get exclusives</span>
          </div>

          {/* Display Headline */}
          <div className="font-heading uppercase text-[#111111] select-none tracking-tight leading-[0.92]">
            
            {/* Row 1: ENHANCE */}
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.2rem] font-normal">
              ENHANCE
            </div>

            {/* Row 2: Y [Sparkle Icon] UR + 7-day trial pill */}
            <div className="flex flex-wrap items-center gap-4 text-6xl sm:text-7xl md:text-8xl lg:text-[7.2rem] font-normal">
              <span className="inline-flex items-center">
                <span>Y</span>
                {/* O with delicate four-point sparkle inside */}
                <span className="relative inline-flex items-center justify-center mx-1">
                  <span className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-2 sm:border-3 border-[#111111] flex items-center justify-center">
                    <span className="text-xl sm:text-2xl md:text-3xl text-[#111111]">✦</span>
                  </span>
                </span>
                <span>UR</span>
              </span>

              {/* Floating Deep Forest Sage Green Pill Badge (7-day trial) */}
              <button className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-[#346853] hover:bg-[#2A5443] text-white text-xs sm:text-sm font-semibold tracking-normal normal-case shadow-[0_16px_30px_rgba(52,104,83,0.38)] hover:scale-105 transition cursor-pointer -mt-2">
                7-day trial
              </button>
            </div>

            {/* Row 3: PRØCESS with Nordic slashed Ø */}
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.2rem] font-normal">
              <span>PR</span>
              <span className="relative inline-block mx-0.5">
                <span>O</span>
                <span className="absolute inset-y-1 left-1/2 -translate-x-1/2 w-[2px] sm:w-[3px] bg-[#111111] rotate-45 transform pointer-events-none" />
              </span>
              <span>CESS</span>
            </div>

          </div>

        </div>

        {/* Right Side: Hero Portrait Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
          <div className="w-full max-w-sm sm:max-w-md h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80 bg-gray-100 relative z-10">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
              alt="Vault Portrait"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* C. BOTTOM METRICS DECK                                       */}
      {/* ============================================================ */}
      <footer className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-end w-full pt-2">
        
        {/* Left Elements: SaaS Awards Card + 1M Moon Phase Metric */}
        <div className="sm:col-span-6 lg:col-span-6 flex flex-wrap sm:flex-nowrap items-center gap-6">
          
          {/* Card: SaaS Awards '23 with metallic 3D dark spheres */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs relative overflow-hidden w-36 h-28 flex-shrink-0 flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-16 h-16 bg-[#F3D5C5]/50 rounded-br-full pointer-events-none" />
            <div className="relative z-10 text-[11px] font-bold text-[#111111] leading-tight">
              <p>SaaS</p>
              <p>Awards &apos;23</p>
            </div>

            {/* Glossy Metallic 3D Spheres cluster */}
            <div className="absolute right-2 bottom-1 flex items-end">
              <div className="relative w-16 h-14">
                <div className="absolute right-0 bottom-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 via-gray-900 to-black shadow-lg" />
                <div className="absolute right-6 bottom-2 w-7 h-7 rounded-full bg-gradient-to-br from-gray-500 via-gray-800 to-black shadow-md" />
                <div className="absolute right-2 bottom-6 w-5 h-5 rounded-full bg-gradient-to-br from-gray-400 via-gray-700 to-black shadow-sm" />
              </div>
            </div>
          </div>

          {/* Metric: 1M ◑ /23 + Description */}
          <div className="space-y-1 max-w-xs">
            <div className="flex items-center gap-2 text-2xl sm:text-3xl font-heading font-medium text-[#111111]">
              <span>1M</span>
              {/* Moon-phase circle icon */}
              <div className="w-6 h-6 rounded-full bg-[#346853] relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-white/40" />
              </div>
              <span>/23</span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-700 leading-snug">
              <strong className="font-semibold text-[#111111]">320+ programs on Vault</strong> mean endless discovery and instant solutions for all of your needs.
            </p>
          </div>

        </div>

        {/* Center/Right Floating Green Circular Button ($14.99 /month) */}
        <div className="sm:col-span-3 lg:col-span-3 flex justify-center lg:justify-end">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#346853] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white hover:scale-105 transition cursor-pointer">
            <span className="text-base sm:text-lg font-bold font-heading">
              $14.99
            </span>
            <span className="text-[9px] sm:text-[10px] text-white/80 font-mono">
              /month
            </span>
          </div>
        </div>

        {/* Right Card: Dark Goals Progress Box */}
        <div className="sm:col-span-3 lg:col-span-3 flex flex-col items-end">
          <div className="bg-[#0B0D0C] text-white rounded-2xl p-4 shadow-xl border border-gray-800 w-full max-w-[200px] space-y-2">
            
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 text-[#346853] font-bold">
                <span>▲</span>
                <span className="text-white font-medium">Your Goals</span>
              </div>
            </div>

            {/* 74% Circular Progress Ring */}
            <div className="flex items-center justify-center py-1">
              <div className="relative w-16 h-16 flex items-center justify-center">
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
                <span className="absolute font-heading font-bold text-sm text-white">
                  74%
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-medium text-gray-600 mt-2 text-right">
            Many programs.<br />One subscription.
          </div>
        </div>

      </footer>

    </div>
  );
}
