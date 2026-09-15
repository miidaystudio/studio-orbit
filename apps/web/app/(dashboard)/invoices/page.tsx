'use client';

import React, { useState } from 'react';
import RetainerGauge from '@/components/billing/RetainerGauge';
import InvoicePDF from '@/components/billing/InvoicePDF';
import { Invoice } from '@studio-orbit/types';

export default function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const mockInvoices: Invoice[] = [
    {
      id: 'inv-1',
      invoiceNum: 'INV-2026-001',
      clientName: 'Lumina Tech',
      clientEmail: 'sarah@lumina.io',
      status: 'PAID',
      issueDate: 'Sep 01, 2026',
      dueDate: 'Sep 15, 2026',
      subtotalInCents: 1250000,
      taxInCents: 0,
      totalInCents: 1250000,
      lineItems: [
        { id: 'li-1', description: 'Sprint 1: Brand Strategy & Moodboards', quantity: 1, unitPriceInCents: 1250000, amountInCents: 1250000 },
      ],
    },
    {
      id: 'inv-2',
      invoiceNum: 'INV-2026-002',
      clientName: 'Lumina Tech',
      clientEmail: 'sarah@lumina.io',
      status: 'ISSUED',
      issueDate: 'Sep 10, 2026',
      dueDate: 'Sep 25, 2026',
      subtotalInCents: 800000,
      taxInCents: 0,
      totalInCents: 800000,
      lineItems: [
        { id: 'li-2', description: 'Sprint 2: Web App Visual System & Review Canvas', quantity: 1, unitPriceInCents: 800000, amountInCents: 800000 },
      ],
    },
    {
      id: 'inv-3',
      invoiceNum: 'INV-2026-003',
      clientName: 'Aether Labs',
      clientEmail: 'marcus@aether.design',
      status: 'OVERDUE',
      issueDate: 'Aug 15, 2026',
      dueDate: 'Aug 30, 2026',
      subtotalInCents: 1500000,
      taxInCents: 0,
      totalInCents: 1500000,
      lineItems: [
        { id: 'li-3', description: 'Aether Mobile App Design Sprint', quantity: 1, unitPriceInCents: 1500000, amountInCents: 1500000 },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E5E2DA] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">Finance & Retainers</span>
          <h1 className="text-3xl font-serif font-bold text-[#121212] mt-1">Invoices & Retainers</h1>
          <p className="text-sm text-[#686661] mt-1">
            Prepaid agency hour burn-downs, Stripe settlement automation, and printable PDF invoices.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-[#C85A32] hover:bg-[#B04B27] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-editorial transition">
          + Create Invoice
        </button>
      </div>

      {/* Retainer Burn-Down Gauge */}
      <RetainerGauge totalHours={40} usedHours={24} />

      {/* Invoices Ledger Table */}
      <div className="bg-white border border-[#E5E2DA] rounded-2xl overflow-hidden shadow-editorial">
        <div className="p-6 border-b border-[#E5E2DA]">
          <h2 className="text-lg font-serif font-bold text-[#121212]">Invoices Ledger</h2>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9F8F3] border-b border-[#E5E2DA] text-[10px] uppercase font-mono tracking-wider text-[#686661]">
              <th className="p-4">Invoice #</th>
              <th className="p-4">Client</th>
              <th className="p-4">Issue Date</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E2DA] text-xs">
            {mockInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-[#F9F8F3] transition">
                <td className="p-4 font-mono font-medium text-[#121212]">{inv.invoiceNum}</td>
                <td className="p-4 font-semibold text-[#121212]">{inv.clientName}</td>
                <td className="p-4 text-[#686661]">{inv.issueDate}</td>
                <td className="p-4 text-[#686661]">{inv.dueDate}</td>
                <td className="p-4 font-mono font-bold text-[#121212]">
                  ${(inv.totalInCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4">
                  <span
                    className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-semibold border ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : inv.status === 'ISSUED'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="text-xs font-semibold text-[#C85A32] hover:underline"
                  >
                    Preview PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PDF Modal Preview */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-[#121212]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#F9F8F3] max-w-4xl w-full rounded-2xl p-6 border border-[#E5E2DA] shadow-canvas relative my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-serif font-bold text-[#121212]">PDF Invoice Preview</h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-3 py-1 bg-[#121212] text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
              >
                Close ✕
              </button>
            </div>
            <InvoicePDF invoice={selectedInvoice} />
          </div>
        </div>
      )}
    </div>
  );
}
