import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { pinId, action, billableHours, estimatedCostCents } = await req.json();

    if (!pinId) {
      return NextResponse.json({ error: 'Pin ID is required' }, { status: 400 });
    }

    const isApproved = action === 'APPROVE';
    const newStatus = isApproved ? 'APPROVED' : 'REJECTED';
    const hours = billableHours || 1.5;
    const cost = estimatedCostCents || Math.round(hours * 15000); // $150/hr

    console.log(
      `🛡 Scope Firewall Action: Pin ${pinId} -> ${newStatus} (${hours} hrs / $${(cost / 100).toFixed(2)})`
    );

    // Mock ledger record event creation
    const ledgerEntry = {
      id: `ledger-${Date.now()}`,
      eventType: isApproved ? 'SCOPE_DEDUCTION' : 'SCOPE_REJECTION',
      description: isApproved
        ? `Approved Change Request Scope (+${hours} hrs / $${(cost / 100).toFixed(2)})`
        : `Rejected Change Request Scope`,
      hoursDelta: isApproved ? -hours : 0,
      amountInCents: isApproved ? cost : 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      pinId,
      clientApprovalStatus: newStatus,
      ledgerEntry,
    });
  } catch (err) {
    console.error('Scope Approval API Error:', err);
    return NextResponse.json({ error: 'Failed to process scope approval' }, { status: 500 });
  }
}
