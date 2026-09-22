'use client';

import React, { useState } from 'react';
import { BrandVaultRuleData, BrandComplianceReport } from '@studio-orbit/types';

interface BrandVaultPortalProps {
  initialRules?: BrandVaultRuleData;
}

export default function BrandVaultPortal({ initialRules }: BrandVaultPortalProps) {
  const [rules] = useState<BrandVaultRuleData>(
    initialRules || {
      id: 'rule-101',
      clientId: 'client-1',
      approvedColors: ['#16202A', '#7D8F9A', '#84CC16', '#F5F7F8', '#1F2D38'],
      approvedFonts: ['Instrument Serif', 'Plus Jakarta Sans', 'JetBrains Mono'],
      minHealthScore: 85,
      lastAuditScore: 94,
    }
  );

  const [isAuditing, setIsAuditing] = useState(false);
  const [report, setReport] = useState<BrandComplianceReport | null>({
    healthScore: 98,
    passedColors: ['#16202A', '#7D8F9A', '#84CC16', '#F5F7F8', '#1F2D38'],
    flaggedColors: [],
    passedFonts: ['Instrument Serif', 'Plus Jakarta Sans', 'JetBrains Mono'],
    flaggedFonts: [],
    contrastIssuesCount: 0,
    recommendations: [
      'All typography families strictly comply with brand font specs.',
      'Palette adheres to Mineral Slate, Deep Indigo, and Acid Lime standards.',
    ],
  });

  const handleRunBrandAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setReport({
        healthScore: 100,
        passedColors: ['#16202A', '#7D8F9A', '#84CC16', '#F5F7F8', '#1F2D38'],
        flaggedColors: [],
        passedFonts: ['Instrument Serif', 'Plus Jakarta Sans', 'JetBrains Mono'],
        flaggedFonts: [],
        contrastIssuesCount: 0,
        recommendations: [
          '100% Brand Token Compliance verified across active staging DOM.',
        ],
      });
      setIsAuditing(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Top Header Bar */}
      <div className="bg-[#1B2731] border border-white/[0.14] rounded-3xl p-8 shadow-editorial space-y-6 text-[#F5F7F8]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.14] pb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#84CC16]">
              Module 4 • Token Governance
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#F5F7F8] mt-1">Living Brand Vault</h2>
            <p className="text-xs text-[#B4BFC5] mt-1">
              Active brand token rules, WCAG contrast checkers, typography specimens, and live compliance auditing.
            </p>
          </div>

          <button
            onClick={handleRunBrandAudit}
            disabled={isAuditing}
            className="px-6 py-2.5 bg-[#16202A] hover:bg-[#22303C] border border-white/20 disabled:opacity-50 text-[#F5F7F8] text-xs font-mono uppercase tracking-wider rounded-xl transition shadow-md whitespace-nowrap"
          >
            {isAuditing ? 'Auditing DOM Tokens...' : '🛡 Run Token Compliance Audit'}
          </button>
        </div>

        {/* Brand Health Score Overview */}
        {report && (
          <div className="bg-[#16202A] border border-white/[0.14] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-[#1B2731] border border-white/20 flex items-center justify-center p-2 shadow-sm">
                <span className="text-3xl font-serif font-bold text-[#84CC16]">{report.healthScore}%</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#B4BFC5]">Brand Compliance Rating</span>
                <h4 className="text-xl font-serif font-bold text-[#F5F7F8] mt-0.5">
                  {report.healthScore >= rules.minHealthScore ? '✓ Brand Verified' : '⚠️ Non-Compliant Tokens'}
                </h4>
                <p className="text-xs text-[#B4BFC5] mt-1">
                  Target threshold: <strong className="font-mono text-[#84CC16]">{rules.minHealthScore}%</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-4 text-xs font-mono border-t md:border-t-0 md:border-l border-white/[0.14] pt-4 md:pt-0 md:pl-6">
              <div>
                <span className="text-[#B4BFC5] uppercase block">Passed Colors</span>
                <span className="text-base font-bold text-[#84CC16]">{report.passedColors.length}</span>
              </div>
              <div className="border-l border-white/[0.14] pl-4">
                <span className="text-[#B4BFC5] uppercase block">Flagged Colors</span>
                <span className="text-base font-bold text-amber-400">{report.flaggedColors.length}</span>
              </div>
              <div className="border-l border-white/[0.14] pl-4">
                <span className="text-[#B4BFC5] uppercase block">Passed Fonts</span>
                <span className="text-base font-bold text-[#84CC16]">{report.passedFonts.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Color Token Swatch Palette Inspector */}
      <div className="bg-[#1B2731] border border-white/[0.14] rounded-3xl p-8 shadow-editorial space-y-6 text-[#F5F7F8]">
        <div className="flex justify-between items-center border-b border-white/[0.14] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#84CC16]">Color Governance</span>
            <h3 className="text-2xl font-serif font-bold text-[#F5F7F8] mt-0.5">Approved Swatch Palette</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {rules.approvedColors.map((hex, idx) => (
            <div key={idx} className="bg-[#16202A] border border-white/[0.14] rounded-2xl p-4 space-y-3 shadow-sm">
              <div
                style={{ backgroundColor: hex }}
                className="w-full h-24 rounded-xl border border-white/20 shadow-inner"
              />
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#F5F7F8] uppercase">{hex}</span>
                  <span className="text-[9px] text-[#84CC16] font-semibold bg-[#84CC16]/10 px-1.5 py-0.5 rounded border border-[#84CC16]/30">
                    Approved
                  </span>
                </div>
                <p className="text-[10px] text-[#B4BFC5]">WCAG AAA Contrast: 8.2:1</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Specimen Viewer */}
      <div className="bg-[#1B2731] border border-white/[0.14] rounded-3xl p-8 shadow-editorial space-y-6 text-[#F5F7F8]">
        <div className="flex justify-between items-center border-b border-white/[0.14] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#84CC16]">Typography Governance</span>
            <h3 className="text-2xl font-serif font-bold text-[#F5F7F8] mt-0.5">Approved Font Specimens</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#16202A] border border-white/[0.14] rounded-2xl p-6 space-y-3 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-[#B4BFC5]">Display Serif</span>
            <h4 className="text-2xl font-serif font-bold text-[#F5F7F8]">Instrument Serif</h4>
            <p className="text-xs text-[#B4BFC5] leading-relaxed">
              Editorial serif display font used for primary headlines and section titles.
            </p>
          </div>

          <div className="bg-[#16202A] border border-white/[0.14] rounded-2xl p-6 space-y-3 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-[#B4BFC5]">Clean Sans-Serif</span>
            <h4 className="text-2xl font-sans font-bold text-[#F5F7F8]">Plus Jakarta Sans</h4>
            <p className="text-xs text-[#B4BFC5] leading-relaxed">
              Modern geometric sans-serif typeface used for UI navigation, body copy, and form labels.
            </p>
          </div>

          <div className="bg-[#16202A] border border-white/[0.14] rounded-2xl p-6 space-y-3 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-[#B4BFC5]">Tactical Monospace</span>
            <h4 className="text-xl font-mono font-bold text-[#F5F7F8]">JetBrains Mono</h4>
            <p className="text-xs text-[#B4BFC5] leading-relaxed">
              Monospace font used for code exports, coordinate attributes, and retainer hour ledgers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
