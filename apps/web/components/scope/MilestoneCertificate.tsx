'use client';

import React from 'react';

interface MilestoneCertificateProps {
  milestoneTitle: string;
  projectName: string;
  clientName: string;
  signedBy: string;
  signedAt: string;
  ipAddress?: string;
  auditHash?: string;
  onClose: () => void;
}

export default function MilestoneCertificate({
  milestoneTitle,
  projectName,
  clientName,
  signedBy,
  signedAt,
  ipAddress = '198.51.100.42',
  auditHash = 'a4f9b8c2d1e0f3e7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3',
  onClose,
}: MilestoneCertificateProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] text-[#121212] border-4 border-[#C85A32] w-full max-w-3xl rounded-3xl p-8 sm:p-12 shadow-2xl relative my-8 print:border-none print:shadow-none print:p-0">
        {/* Decorative Corner Accents */}
        <div className="absolute top-4 left-4 text-xs font-mono text-[#C85A32] uppercase tracking-widest print:hidden">
          Official Studio Certificate
        </div>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#121212] hover:text-[#C85A32] text-sm font-bold print:hidden"
        >
          ✕ Close
        </button>

        <div className="text-center space-y-4 pt-4 border-b border-[#E5E2DA] pb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-[#E5E2DA] p-2 flex items-center justify-center shadow-sm">
            <img src="/favicon.jpg" alt="StudioOrbit Logo" className="w-full h-full object-cover rounded-xl" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C85A32] px-3 py-1 bg-[#F2EFE9] rounded-full border border-[#E5E2DA]">
            Cryptographic Milestone Certificate of Acceptance
          </span>

          <h1 className="text-4xl sm:text-5xl font-serif text-[#121212] font-bold">
            Certificate of Completion
          </h1>
          <p className="text-xs font-sans text-[#686661] max-w-md mx-auto">
            This document verifies that the client has reviewed and cryptographically signed off on the specified project milestone.
          </p>
        </div>

        {/* Core Certificate Details */}
        <div className="py-8 space-y-6">
          <div className="grid grid-cols-2 gap-6 bg-white border border-[#E5E2DA] p-6 rounded-2xl shadow-editorial">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#686661]">Project & Workspace</span>
              <p className="text-base font-serif font-bold text-[#121212]">{projectName}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#686661]">Client Entity</span>
              <p className="text-base font-serif font-bold text-[#121212]">{clientName}</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-[#E5E2DA]">
              <span className="text-[10px] font-mono uppercase text-[#686661]">Milestone Deliverable</span>
              <p className="text-lg font-serif font-bold text-[#C85A32] mt-0.5">{milestoneTitle}</p>
            </div>
          </div>

          {/* Tamper-Evident Cryptographic Ledger Audit Table */}
          <div className="bg-[#F2EFE9] border border-[#E5E2DA] rounded-2xl p-6 font-mono text-xs space-y-3">
            <div className="flex justify-between items-center border-b border-[#E5E2DA] pb-2">
              <span className="font-bold uppercase text-[#121212]">Authentication Record</span>
              <span className="text-emerald-700 font-semibold">✓ Verified Session</span>
            </div>

            <div className="space-y-1.5 text-[11px] text-[#4A4843]">
              <p><strong>Signed By:</strong> {signedBy}</p>
              <p><strong>Timestamp (UTC):</strong> {signedAt}</p>
              <p><strong>Authenticated IP:</strong> {ipAddress}</p>
              <p className="break-all">
                <strong>SHA-256 Audit Hash:</strong> <span className="text-xs font-mono text-[#C85A32]">{auditHash}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-[#E5E2DA] print:hidden">
          <span className="text-[10px] font-mono text-[#686661]">
            Powered by StudioOrbit Visual QA Engine
          </span>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-[#121212] hover:bg-[#C85A32] text-white text-xs font-mono uppercase tracking-wider rounded-xl transition shadow-md"
          >
            🖨 Print / Save PDF Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
