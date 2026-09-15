import React from 'react';
import RetainerGauge from '@/components/billing/RetainerGauge';

export default async function ClientBillingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center border-b border-[#E9E2D3] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">Client Portal</span>
          <h1 className="text-3xl font-serif font-bold text-[#17140F] mt-1">Invoices & Burn-Down Ledger</h1>
        </div>
        <a href={`/portal/${token}`} className="text-xs font-semibold text-[#7B6E53] hover:text-[#17140F]">
          ← Back to Overview
        </a>
      </header>

      {/* Retainer Burn-Down Gauge */}
      <RetainerGauge totalHours={40} usedHours={24 font-bold} />

      {/* Invoice History */}
      <div className="bg-white border border-[#E9E2D3] rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-[#17140F] mb-4">Billing History & PDFs</h3>
        <div className="divide-y divide-[#E9E2D3] text-sm">
          <div className="py-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-[#17140F]">INV-2026-001 • Monthly Retainer (Sept)</p>
              <p className="text-xs text-[#7B6E53]">Paid on Sep 01, 2026 • Stripe Auto-debit</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-[#17140F]">$12,500.00</span>
              <button className="text-xs font-medium text-[#C85A32] border border-[#E9E2D3] px-3 py-1.5 rounded-lg hover:bg-[#FAF8F5]">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
