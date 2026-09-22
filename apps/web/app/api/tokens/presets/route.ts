import { NextResponse } from 'next/server';

export async function GET() {
  const defaultPreset = {
    name: 'Parchment Terracotta Default',
    radius: 12,
    fontFamily: 'serif',
    fontScale: 1.0,
    colorTokens: {
      background: '#FAF8F5',
      primary: '#121212',
      accent: '#C85A32',
      surface: '#FFFFFF',
    },
  };

  return NextResponse.json({ success: true, presets: [defaultPreset] });
}

export async function POST(req: Request) {
  try {
    const { name, tokens, createdByClient } = await req.json();

    console.log(`🎨 Design Token Preset "${name}" Saved (Client Created: ${!!createdByClient})`);

    return NextResponse.json({
      success: true,
      preset: {
        id: `preset-${Date.now()}`,
        name,
        tokens,
        createdByClient: !!createdByClient,
      },
    });
  } catch (err) {
    console.error('Token Preset API Error:', err);
    return NextResponse.json({ error: 'Failed to save token preset' }, { status: 500 });
  }
}
