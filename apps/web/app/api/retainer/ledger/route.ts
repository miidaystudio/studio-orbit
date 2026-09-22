import { NextResponse } from 'next/server';

export async function GET() {
  const ledgerEvents = [
    {
      id: 'leg-101',
      eventType: 'SCOPE_DEDUCTION',
      description: 'Approved Change Request Scope: Filter Component (+2.0 hrs)',
      hoursDelta: -2.0,
      amountInCents: 30000,
      createdAt: 'Sep 18, 2026 • 14:20 PST',
    },
    {
      id: 'leg-102',
      eventType: 'SCOPE_DEDUCTION',
      description: 'Approved Copy Change: Hero Section Re-brand (+1.5 hrs)',
      hoursDelta: -1.5,
      amountInCents: 22500,
      createdAt: 'Sep 15, 2026 • 10:15 PST',
    },
    {
      id: 'leg-103',
      eventType: 'HOUR_TOPUP',
      description: 'Retainer Monthly Top-Up Allocation (+40.0 hrs)',
      hoursDelta: 40.0,
      amountInCents: 600000,
      createdAt: 'Sep 01, 2026 • 09:00 PST',
    },
  ];

  return NextResponse.json({
    totalHours: 40,
    usedHours: 28.5,
    remainingHours: 11.5,
    burndownPercentage: 71,
    events: ledgerEvents,
  });
}
