import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { milestoneId, signatureName, clientEmail, commitHashOrUrl, openPinsCount } = await req.json();

    if (!milestoneId || !signatureName) {
      return NextResponse.json({ error: 'Milestone ID and Signature Name are required' }, { status: 400 });
    }

    if (openPinsCount && openPinsCount > 0) {
      return NextResponse.json(
        { error: `Cannot sign milestone. ${openPinsCount} open QA pin(s) remain unresolved.` },
        { status: 422 }
      );
    }

    const clientIp = req.headers.get('x-forwarded-for') || '198.51.100.42';
    const timestamp = new Date().toISOString();
    
    // Generate deterministic audit SHA-256 digest string
    const auditDataString = `${milestoneId}:${signatureName}:${clientEmail || 'client@orbit.design'}:${clientIp}:${timestamp}`;
    const mockAuditHash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(auditDataString))))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    console.log(`📜 Milestone ${milestoneId} Signed Off by "${signatureName}" | SHA-256 Digest: ${mockAuditHash}`);

    return NextResponse.json({
      success: true,
      milestoneId,
      status: 'APPROVED',
      signedAt: timestamp,
      signedBy: signatureName,
      signedByEmail: clientEmail || 'client@lumina.design',
      auditHash: mockAuditHash,
      clientIp,
      certificatePdfUrl: `/api/milestones/certificate/${milestoneId}`,
    });
  } catch (err) {
    console.error('Milestone Signoff API Error:', err);
    return NextResponse.json({ error: 'Failed to sign milestone' }, { status: 500 });
  }
}
