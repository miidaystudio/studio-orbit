'use client';

import React from 'react';
import RetainerGauge from '@/components/billing/RetainerGauge';

export default function RetainerBillingPage() {
  const invoices = [
    {
      id: 'inv-1',
      num: 'INV-2026-001',
      client: 'Lumina Tech',
      amountFormatted: '$12,500.00',
      status: 'PAID',
      dueDate: 'Sep 15, 2026',
      stripeUrl: 'https://checkout.stripe.com/pay/inv_001',
    },
    {
      id: 'inv-2',
      num: 'INV-2026-002',
      client: 'Lumina Tech',
      amountFormatted: '$8,000.00',
      status: 'ISSUED',
      dueDate: 'Sep 25, 2026',
      stripeUrl: 'https://checkout.stripe.com/pay/inv_002',
    },
    {
      id: 'inv-3',
      num: 'INV-2026-003',
      client: 'Aether Labs',
      amountFormatted: '$15,000.00',
      status: 'DRAFT',
      dueDate: 'Oct 01, 2026',
      stripeUrl: '#',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E5E2DA] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">Retainer Operations</span>
          <h1 className="text-3xl font-serif font-bold text-[#121212] mt-1">Retainer & Invoicing Hub</h1>
          <p className="text-sm text-[#686661] mt-1">
            Prepaid agency hour burn-downs, Stripe checkout settlement links, and financial ledger.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-[#C85A32] hover:bg-[#B04B27] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-editorial transition">
          + Create Invoice
        </button>
      </div>

      {/* SVG Circular Burn-Down Gauge */}
      <RetainerGauge totalHours={40} usedHours={24} />

      {/* Invoices Ledger Table */}
      <div className="bg-white border border-[#E5E2DA] rounded-2xl overflow-hidden shadow-editorial">
        <div className="p-6 border-b border-[#E5E2DA]">
          <h2 className="text-lg font-serif font-bold text-[#121212]">Invoices & Stripe Checkout Ledger</h2>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#E5E2DA] text-[10px] uppercase font-mono tracking-wider text-[#686661]">
              <th className="p-4">Invoice #</th>
              <th className="p-4">Client</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Stripe Checkout</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E2DA] text-xs">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-[#FAF8F5] transition">
                <td className="p-4 font-mono font-medium text-[#121212]">{inv.num}</td>
                <td className="p-4 font-semibold text-[#121212]">{inv.client}</td>
                <td className="p-4 text-[#686661] font-mono">{inv.dueDate}</td>
                <td className="p-4 font-mono font-bold text-[#121212]">{inv.amountFormatted}</td>
                <td className="p-4">
                  <span
                    className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-semibold border ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : inv.status === 'ISSUED'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <a
                    href={inv.stripeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#C85A32] hover:underline"
                  >
                    Pay via Stripe →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
