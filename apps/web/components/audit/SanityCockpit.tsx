'use client';

import React, { useState } from 'react';
import { LaunchAuditResult } from '@studio-orbit/types';
import { runPreLaunchAudit } from '@/app/actions/launchAudit';

interface SanityCockpitProps {
  initialAudit?: LaunchAuditResult;
}

export default function SanityCockpit({ initialAudit }: SanityCockpitProps) {
  const [stagingUrl, setStagingUrl] = useState('https://staging.lumina.design');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'twitter' | 'linkedin' | 'whatsapp'>('twitter');

  const [audit, setAudit] = useState<LaunchAuditResult>(
    initialAudit || {
      id: 'audit-101',
      stagingUrl: 'https://staging.lumina.design',
      score: 88,
      metaDetails: {
        title: 'Lumina Digital Portal System | StudioOrbit',
        description: 'Visual QA staging, coordinate-pinned asset review canvas, and retainers ledger.',
        ogTitle: 'Lumina Digital Portal System | StudioOrbit',
        ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        ogDescription: 'Visual QA staging, coordinate-pinned asset review canvas, and retainers ledger.',
        twitterCard: 'summary_large_image',
        canonicalUrl: 'https://staging.lumina.design',
      },
      assetIssues: [
        {
          url: '/hero-background.jpg',
          issueType: 'UNCOMPRESSED_IMAGE',
          sizeBytes: 1024 * 1024 * 3.2,
          recommendation: 'Compress 3.2MB image file to WebP format to save 82% bandwidth.',
        },
        {
          url: '/client-logo-1.png',
          issueType: 'MISSING_ALT',
          recommendation: 'Add missing alt attribute for accessibility and screen-readers.',
        },
      ],
      missingTags: ['<meta name="twitter:card"> missing'],
      scannedAt: 'Just now',
    }
  );

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    try {
      const res = await runPreLaunchAudit(stagingUrl);
      setAudit(res);
    } catch (err) {
      console.error('Audit execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 stroke-emerald-600';
    if (score >= 70) return 'text-amber-600 stroke-amber-500';
    return 'text-rose-600 stroke-rose-600';
  };

  return (
    <div className="space-y-8">
      {/* Top Header & URL Scan Bar */}
      <div className="bg-white border border-[#E5E2DA] rounded-3xl p-8 shadow-editorial space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E5E2DA] pb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">
              Module 3 • Pre-Launch Sanity
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#121212] mt-1">Pre-Launch Cockpit Audit</h2>
            <p className="text-xs text-[#686661] mt-1">
              Automated OpenGraph meta inspection, social card preview simulator, and asset bloat auditor.
            </p>
          </div>

          <form onSubmit={handleRunAudit} className="flex gap-2 w-full md:w-auto">
            <input
              type="url"
              required
              value={stagingUrl}
              onChange={(e) => setStagingUrl(e.target.value)}
              placeholder="https://staging.domain.com"
              className="px-4 py-2.5 bg-[#FAF8F5] border border-[#E5E2DA] rounded-xl text-xs font-mono text-[#121212] focus:outline-none focus:border-[#C85A32] flex-1 md:w-72"
            />
            <button
              type="submit"
              disabled={isRunning}
              className="px-5 py-2.5 bg-[#121212] hover:bg-[#C85A32] disabled:opacity-50 text-white text-xs font-mono uppercase tracking-wider rounded-xl transition shadow-md whitespace-nowrap"
            >
              {isRunning ? 'Auditing DOM...' : '🔍 Scan Staging URL'}
            </button>
          </form>
        </div>

        {/* Audit Overview Metrics & Readiness Dial */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Circular Readiness Dial */}
          <div className="bg-[#FAF8F5] border border-[#E5E2DA] rounded-2xl p-6 flex items-center gap-6 shadow-sm">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle cx="56" cy="56" r="42" stroke="#E5E2DA" strokeWidth="8" fill="transparent" />
                <circle
                  cx="56"
                  cy="56"
                  r="42"
                  stroke={audit.score >= 85 ? '#059669' : '#D97706'}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - audit.score / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className={`absolute text-2xl font-serif font-bold ${getScoreColor(audit.score).split(' ')[0]}`}>
                {audit.score}%
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-[#686661]">Launch Readiness</span>
              <h4 className="text-lg font-serif font-bold text-[#121212] mt-0.5">
                {audit.score >= 90 ? 'Production Ready' : audit.score >= 70 ? 'Minor Fixes Needed' : 'Action Required'}
              </h4>
              <p className="text-[11px] text-[#686661] mt-1 font-mono">Last scanned: {audit.scannedAt}</p>
            </div>
          </div>

          {/* Missing Meta Issues */}
          <div className="bg-[#FAF8F5] border border-[#E5E2DA] rounded-2xl p-6 shadow-sm space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#C85A32]">Meta Tag Diagnostics</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-serif font-bold text-[#121212]">{audit.missingTags.length}</span>
              <span className="text-xs font-mono text-[#686661]">Missing Metadata Tags</span>
            </div>
            <p className="text-xs text-[#686661] leading-relaxed">
              {audit.missingTags.length === 0 ? '✓ All essential OpenGraph meta tags present.' : audit.missingTags.join(', ')}
            </p>
          </div>

          {/* Asset Bloat Issues */}
          <div className="bg-[#FAF8F5] border border-[#E5E2DA] rounded-2xl p-6 shadow-sm space-y-2">
            <span className="text-[10px] font-mono uppercase text-amber-600">Asset Optimization</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-serif font-bold text-[#121212]">{audit.assetIssues.length}</span>
              <span className="text-xs font-mono text-[#686661]">Asset Flags Detected</span>
            </div>
            <p className="text-xs text-[#686661] leading-relaxed">
              Overweight images, uncompressed assets, or missing accessibility attributes.
            </p>
          </div>
        </div>
      </div>

      {/* Social Preview Cards Simulator */}
      <div className="bg-white border border-[#E5E2DA] rounded-3xl p-8 shadow-editorial space-y-6">
        <div className="flex justify-between items-center border-b border-[#E5E2DA] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">Social Card Simulator</span>
            <h3 className="text-2xl font-serif font-bold text-[#121212] mt-0.5">Live OpenGraph Preview Cards</h3>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E5E2DA]">
            {(['twitter', 'linkedin', 'whatsapp'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition ${
                  activeTab === tab ? 'bg-[#121212] text-white shadow-sm' : 'text-[#686661] hover:text-[#121212]'
                }`}
              >
                {tab === 'twitter' ? '𝕏 Twitter/X' : tab === 'linkedin' ? '💼 LinkedIn' : '💬 WhatsApp'}
              </button>
            ))}
          </div>
        </div>

        {/* Card Render Container */}
        <div className="bg-[#FAF8F5] border border-[#E5E2DA] p-8 rounded-2xl flex items-center justify-center">
          {activeTab === 'twitter' && (
            <div className="w-full max-w-md bg-black text-white border border-neutral-800 rounded-2xl overflow-hidden shadow-xl font-sans">
              <img src={audit.metaDetails.ogImage} alt="OG Card Preview" className="w-full h-48 object-cover" />
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">{audit.stagingUrl.replace(/^https?:\/\//, '')}</span>
                <h4 className="text-sm font-bold text-white leading-tight">{audit.metaDetails.ogTitle}</h4>
                <p className="text-xs text-neutral-400 line-clamp-2">{audit.metaDetails.ogDescription}</p>
              </div>
            </div>
          )}

          {activeTab === 'linkedin' && (
            <div className="w-full max-w-md bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-md font-sans">
              <img src={audit.metaDetails.ogImage} alt="LinkedIn Preview" className="w-full h-48 object-cover" />
              <div className="p-4 bg-[#F8F9FA] space-y-1 border-t border-neutral-200">
                <h4 className="text-sm font-bold text-neutral-900 leading-tight">{audit.metaDetails.ogTitle}</h4>
                <span className="text-[11px] font-mono text-neutral-500">{audit.stagingUrl.replace(/^https?:\/\//, '')}</span>
              </div>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="w-full max-w-sm bg-[#DCF8C6] border border-emerald-300 p-3 rounded-2xl shadow-sm text-black font-sans space-y-2">
              <div className="bg-white rounded-xl overflow-hidden border border-emerald-200">
                <img src={audit.metaDetails.ogImage} alt="WhatsApp Preview" className="w-full h-36 object-cover" />
                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-bold text-neutral-900">{audit.metaDetails.ogTitle}</h4>
                  <p className="text-[11px] text-neutral-600 line-clamp-2">{audit.metaDetails.ogDescription}</p>
                  <span className="text-[9px] font-mono text-emerald-800 block">{audit.stagingUrl}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actionable Pre-Launch Checklist */}
      <div className="bg-white border border-[#E5E2DA] rounded-3xl p-8 shadow-editorial space-y-6">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">Pre-Launch Checklist</span>
        <h3 className="text-2xl font-serif font-bold text-[#121212]">Actionable Pre-Launch Fixes</h3>

        <div className="space-y-3">
          {audit.assetIssues.map((issue, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F5] border border-[#E5E2DA] p-4 rounded-xl flex items-start justify-between gap-4 text-xs font-sans"
            >
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ● {issue.issueType.replace('_', ' ')}
                </span>
                <p className="font-semibold text-[#121212] mt-1">Asset: {issue.url}</p>
                <p className="text-[#686661] mt-0.5">{issue.recommendation}</p>
              </div>

              {issue.sizeBytes && (
                <span className="text-[11px] font-mono font-bold text-[#C85A32] shrink-0">
                  {(issue.sizeBytes / (1024 * 1024)).toFixed(1)} MB
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
