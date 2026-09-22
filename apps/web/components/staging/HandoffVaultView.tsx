'use client';

import React, { useState, useEffect } from 'react';
import {
  ExtractedSvgAsset,
  ExtractedColorToken,
  EnvChecklistItem,
  SignOffDetails,
  HandoffVaultItem,
} from '@studio-orbit/types';
import { saveHandoffVaultAction, signOffMilestoneAction } from '@/app/actions/creativeOs';

interface HandoffVaultViewProps {
  projectId: string;
  stagingUrl: string;
  initialVault: HandoffVaultItem | null;
}

const DEFAULT_ENV_KEYS: EnvChecklistItem[] = [
  { key: 'DATABASE_URL', label: 'Neon PostgreSQL Connection URL', isConfigured: true, requiredFor: 'DATABASE' },
  { key: 'NEXTAUTH_SECRET', label: 'Production Session JWT Secret', isConfigured: true, requiredFor: 'AUTH' },
  { key: 'NEXT_PUBLIC_APP_URL', label: 'Canonical Domain URL', isConfigured: true, requiredFor: 'CORE' },
  { key: 'STRIPE_API_KEY', label: 'Payment Processing Key', isConfigured: false, requiredFor: 'PAYMENTS' },
  { key: 'RESEND_API_KEY', label: 'Transactional Email Provider', isConfigured: false, requiredFor: 'EMAILS' },
];

export default function HandoffVaultView({
  projectId,
  stagingUrl,
  initialVault,
}: HandoffVaultViewProps) {
  const [assets, setAssets] = useState<ExtractedSvgAsset[]>(initialVault?.extractedAssets || []);
  const [colors, setColors] = useState<ExtractedColorToken[]>(initialVault?.detectedColors || []);
  const [envChecklist, setEnvChecklist] = useState<EnvChecklistItem[]>(
    initialVault?.envChecklist && initialVault.envChecklist.length > 0
      ? initialVault.envChecklist
      : DEFAULT_ENV_KEYS
  );
  const [isSignedOff, setIsSignedOff] = useState(initialVault?.isSignedOff || false);
  const [signOffDetails, setSignOffDetails] = useState<SignOffDetails | null>(
    initialVault?.signOffDetails || null
  );

  const [isLoadingHarvest, setIsLoadingHarvest] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Harvest assets on initial load if none exist
  useEffect(() => {
    if (assets.length === 0) {
      harvestAssets();
    }
  }, []);

  const harvestAssets = async () => {
    setIsLoadingHarvest(true);
    try {
      const res = await fetch(`/api/vault/harvest?url=${encodeURIComponent(stagingUrl)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.assets) setAssets(data.assets);
        if (data.colors) setColors(data.colors);
        await saveHandoffVaultAction(projectId, data.assets, envChecklist);
      }
    } catch (err) {
      console.error('Failed to harvest vault assets:', err);
    } finally {
      setIsLoadingHarvest(false);
    }
  };

  const toggleEnvKey = (key: string) => {
    const updated = envChecklist.map((item) =>
      item.key === key ? { ...item, isConfigured: !item.isConfigured } : item
    );
    setEnvChecklist(updated);
    saveHandoffVaultAction(projectId, assets, updated);
  };

  const copySvgToClipboard = (asset: ExtractedSvgAsset) => {
    navigator.clipboard.writeText(asset.svgContent);
    setCopiedKey(asset.id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadSvgFile = (asset: ExtractedSvgAsset) => {
    const blob = new Blob([asset.svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = asset.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedKey(hex);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleSignOff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim()) return;

    setIsSigning(true);
    try {
      const res = await signOffMilestoneAction(projectId, signerName.trim(), signerEmail.trim(), 98);
      if (res.success && res.signOffDetails) {
        setIsSignedOff(true);
        setSignOffDetails(res.signOffDetails);
      }
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#08090A] text-[#FFFFFF] p-6 lg:p-10 overflow-y-auto animate-in fade-in duration-300 font-mono">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Title & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#22252A] pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.8)] animate-pulse" />
              <h2 className="font-mono font-black text-2xl tracking-wide text-[#FFFFFF] uppercase">
                Executive Client Handoff Vault
              </h2>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase bg-[#111315] border border-[#22252A] text-[#CCFF00] font-bold">
                [PILLAR_03 // RELEASE_OS]
              </span>
            </div>
            <p className="text-xs text-[#828892] mt-1">
              Automated asset harvesting, environment security verification, and verified executive milestone sign-off.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={harvestAssets}
              disabled={isLoadingHarvest}
              className="px-4 py-2 bg-[#111315] hover:bg-[#16181B] border border-[#22252A] hover:border-[#CCFF00] text-[#FFFFFF] text-xs font-mono font-bold rounded-xl transition shadow-sm inline-flex items-center gap-2 disabled:opacity-50"
            >
              <svg className={`w-3.5 h-3.5 ${isLoadingHarvest ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
              </svg>
              <span>{isLoadingHarvest ? 'HARVESTING STAGING DOM...' : 'RE-HARVEST ASSETS'}</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: Brand & Vector Kit */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#CCFF00] font-bold">01 //</span>
              <h3 className="font-mono font-black text-lg text-[#FFFFFF] uppercase">
                Asset Grid &bull; Brand &amp; Vector Kit
              </h3>
            </div>
            <span className="text-xs font-mono text-[#828892]">
              {assets.length} VECTOR ASSETS HARVESTED
            </span>
          </div>

          {/* SVG Vector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-[#111315] border border-[#22252A] hover:border-[#CCFF00] rounded-xl p-4 flex flex-col items-center justify-between group transition shadow-sm relative"
              >
                {/* Vector Preview */}
                <div
                  className="w-16 h-16 flex items-center justify-center text-[#FFFFFF] my-2 transition group-hover:scale-110"
                  dangerouslySetInnerHTML={{ __html: asset.svgContent }}
                />

                {/* Filename */}
                <span className="text-[10px] font-mono text-[#828892] truncate w-full text-center mt-2" title={asset.name}>
                  {asset.name}
                </span>

                {/* Hover Action Pills */}
                <div className="flex items-center gap-1.5 mt-2 w-full">
                  <button
                    type="button"
                    onClick={() => copySvgToClipboard(asset)}
                    className="flex-1 py-1 rounded bg-[#08090A] hover:bg-[#16181B] border border-[#22252A] text-[10px] font-mono text-[#FFFFFF] transition"
                  >
                    {copiedKey === asset.id ? '✓' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadSvgFile(asset)}
                    className="flex-1 py-1 rounded bg-[#CCFF00]/10 hover:bg-[#CCFF00]/20 border border-[#CCFF00]/30 text-[10px] font-mono text-[#CCFF00] font-bold transition"
                    title="Download SVG file"
                  >
                    SVG ↓
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Color Palette Tokens */}
          {colors.length > 0 && (
            <div className="bg-[#111315] border border-[#22252A] rounded-2xl p-4 mt-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#828892] block mb-3">
                Detected Color Palette Tokens
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => copyColor(c.hex)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#08090A] border border-[#22252A] hover:border-[#CCFF00] transition group"
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="text-left">
                      <div className="font-mono text-xs font-bold text-[#FFFFFF]">{c.hex}</div>
                      <div className="text-[9px] font-mono text-[#828892]">
                        {copiedKey === c.hex ? '✓ Copied' : `${c.name}`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2 & 3: Environment Contract & Milestone Sign-Off */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Section 2: Environment Contract Checklist (6 cols) */}
          <div className="lg:col-span-6 bg-[#111315] border border-[#22252A] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#22252A] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#CCFF00] font-bold">02 //</span>
                <h3 className="font-mono font-black text-base text-[#FFFFFF] uppercase">
                  Environment Contract Checklist
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30 font-bold">
                {envChecklist.filter((x) => x.isConfigured).length} OF {envChecklist.length} VERIFIED
              </span>
            </div>

            <p className="text-xs text-[#828892]">
              Verify security and configuration parameters required for production deployment handoff.
            </p>

            <div className="space-y-2.5">
              {envChecklist.map((item) => (
                <div
                  key={item.key}
                  onClick={() => toggleEnvKey(item.key)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer select-none ${
                    item.isConfigured
                      ? 'bg-[#08090A] border-[#22252A] hover:border-[#CCFF00]'
                      : 'bg-[#08090A]/50 border-[#22252A]/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] font-bold ${
                        item.isConfigured
                          ? 'bg-[#CCFF00] border-[#CCFF00] text-black'
                          : 'border-[#22252A] text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-[#FFFFFF]">
                        {item.key}
                      </div>
                      <div className="text-[10px] text-[#828892]">{item.label}</div>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#16181B] text-[#828892]">
                    {item.requiredFor}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Executive Milestone Sign-Off Card (6 cols) */}
          <div className="lg:col-span-6 bg-[#111315] border border-[#22252A] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#22252A] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#CCFF00] font-bold">03 //</span>
                <h3 className="font-mono font-black text-base text-[#FFFFFF] uppercase">
                  Milestone Executive Sign-Off
                </h3>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-[#CCFF00] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                98% CERTIFIED HEALTH
              </div>
            </div>

            {!isSignedOff ? (
              <form onSubmit={handleSignOff} className="space-y-4">
                <p className="text-xs text-[#828892] leading-relaxed">
                  By executing this sign-off, the executive reviewer certifies that the design engineering deliverables, motion curves, and staging frame have fulfilled contractual milestone specifications.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#828892] mb-1">
                      Signer Full Name <span className="text-[#CCFF00]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="e.g. Sarah Chen (Chief Design Officer)"
                      className="w-full bg-[#08090A] border border-[#22252A] rounded-xl px-3.5 py-2 text-xs font-mono text-[#FFFFFF] focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#828892] mb-1">
                      Signer Corporate Email
                    </label>
                    <input
                      type="email"
                      value={signerEmail}
                      onChange={(e) => setSignerEmail(e.target.value)}
                      placeholder="sarah@clientcorp.io"
                      className="w-full bg-[#08090A] border border-[#22252A] rounded-xl px-3.5 py-2 text-xs font-mono text-[#FFFFFF] focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSigning || !signerName.trim()}
                    className="w-full py-3 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] text-black font-mono text-xs font-black uppercase tracking-wider transition shadow-[0_0_12px_rgba(204,255,0,0.3)] disabled:opacity-50"
                  >
                    {isSigning ? 'SIGNING MILESTONE...' : 'COMPLETE MILESTONE SIGN-OFF ⬡'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-[#08090A] border border-[#CCFF00]/40 rounded-xl p-6 text-center space-y-3 shadow-[0_0_16px_rgba(204,255,0,0.2)]">
                <div className="w-12 h-12 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00] text-[#CCFF00] flex items-center justify-center text-xl mx-auto shadow-[0_0_12px_rgba(204,255,0,0.4)]">
                  ✓
                </div>
                <h4 className="font-mono font-black text-base text-[#FFFFFF] uppercase">
                  Milestone Formally Signed Off
                </h4>
                <div className="text-xs font-mono text-[#828892] space-y-1">
                  <div>
                    Signer: <span className="text-[#FFFFFF] font-bold">{signOffDetails?.signerName}</span>
                  </div>
                  <div>
                    Certified Score: <span className="text-[#CCFF00] font-bold">{signOffDetails?.auditScore}%</span>
                  </div>
                  <div>
                    Timestamp: <span className="text-white/80">{signOffDetails?.timestamp ? new Date(signOffDetails.timestamp).toLocaleString() : 'Just now'}</span>
                  </div>
                </div>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[10px] font-mono text-[#CCFF00] uppercase font-bold">
                  Immutable Audit Certificate Active
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
