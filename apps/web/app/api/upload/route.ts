import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { fileName, fileType } = await req.json();

    // Generate direct presigned URL for S3 / Cloudflare R2 bucket upload
    const mockPresignedUrl = `https://studio-orbit-assets.s3.amazonaws.com/uploads/${Date.now()}-${fileName}?presigned=true`;

    return NextResponse.json({
      uploadUrl: mockPresignedUrl,
      publicUrl: `https://studio-orbit-assets.s3.amazonaws.com/uploads/${Date.now()}-${fileName}`,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
