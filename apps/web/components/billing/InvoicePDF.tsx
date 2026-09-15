'use client';

import React from 'react';
import { Invoice } from '@studio-orbit/types';

interface InvoicePDFProps {
  invoice: Invoice;
}

export default function InvoicePDF({ invoice }: InvoicePDFProps) {
  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-white border border-[#E5E2DA] p-12 max-w-3xl mx-auto rounded-xl shadow-editorial text-[#121212] font-sans print:shadow-none print:border-none">
      {/* Invoice Header */}
      <div className="flex justify-between items-start border-b border-[#E5E2DA] pb-8 mb-8">
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-[#C85A32]">ORBIT STUDIO</span>
          <p className="text-xs text-[#686661] mt-1">Design Systems & Digital Product Studio</p>
          <p className="text-xs text-[#686661]">billing@orbitstudio.design</p>
        </div>

        <div className="text-right">
          <h2 className="text-3xl font-serif font-bold text-[#121212]">INVOICE</h2>
          <p className="text-xs font-mono text-[#686661] mt-1">{invoice.invoiceNum}</p>
        </div>
      </div>

      {/* Bill To & Dates */}
      <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
        <div>
          <span className="font-mono font-semibold uppercase text-[#686661] tracking-wider">Billed To</span>
          <p className="text-sm font-bold text-[#121212] mt-1">{invoice.clientName}</p>
          <p className="text-[#686661]">{invoice.clientEmail}</p>
        </div>
        <div className="text-right space-y-1 font-mono">
          <p><span className="text-[#686661]">Issue Date:</span> <strong className="text-[#121212]">{invoice.issueDate}</strong></p>
          <p><span className="text-[#686661]">Due Date:</span> <strong className="text-[#121212]">{invoice.dueDate}</strong></p>
        </div>
      </div>

      {/* Line Items Table */}
      <table className="w-full text-left text-xs mb-8 border-collapse">
        <thead>
          <tr className="border-b border-[#E5E2DA] text-[#686661] uppercase font-mono tracking-wider">
            <th className="py-3">Description</th>
            <th className="py-3 text-center">Qty</th>
            <th className="py-3 text-right">Unit Price</th>
            <th className="py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E2DA]">
          {invoice.lineItems.map((item) => (
            <tr key={item.id}>
              <td className="py-4 font-medium text-[#121212]">{item.description}</td>
              <td className="py-4 text-center font-mono text-[#686661]">{item.quantity}</td>
              <td className="py-4 text-right font-mono text-[#686661]">{formatCurrency(item.unitPriceInCents)}</td>
              <td className="py-4 text-right font-mono font-bold text-[#121212]">{formatCurrency(item.amountInCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Calculation */}
      <div className="flex justify-end border-t border-[#E5E2DA] pt-6">
        <div className="w-64 space-y-2 text-xs font-mono">
          <div className="flex justify-between text-[#686661]">
            <span>Subtotal:</span>
            <span className="font-semibold text-[#121212]">{formatCurrency(invoice.subtotalInCents)}</span>
          </div>
          <div className="flex justify-between text-[#686661]">
            <span>Tax (0%):</span>
            <span className="font-semibold text-[#121212]">{formatCurrency(invoice.taxInCents)}</span>
          </div>
          <div className="flex justify-between text-base font-serif font-bold text-[#121212] border-t border-[#E5E2DA] pt-3">
            <span>Total Due:</span>
            <span className="text-[#C85A32]">{formatCurrency(invoice.totalInCents)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
