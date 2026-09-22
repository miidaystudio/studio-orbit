import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { versionTag, signatureName, clientEmail, status } = await req.json();

    const timestamp = new Date().toISOString();
    console.log(`🚀 Sprint Showcase ${versionTag} -> ${status || 'APPROVED'} by ${signatureName} (${clientEmail})`);

    return NextResponse.json({
      success: true,
      versionTag,
      signatureName,
      clientEmail,
      status: status || 'APPROVED',
      approvedAt: timestamp,
      certificateUrl: `/api/milestones/certificate/${versionTag}`,
    });
  } catch (err) {
    console.error('Sprint Showcase API Error:', err);
    return NextResponse.json({ error: 'Failed to record sprint approval' }, { status: 500 });
  }
}
