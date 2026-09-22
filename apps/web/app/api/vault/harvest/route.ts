import { NextRequest, NextResponse } from 'next/server';
import { ExtractedSvgAsset, ExtractedColorToken } from '@studio-orbit/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url') || 'https://miidaystudio.online';

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch target URL (${res.status})` },
        { status: 502 }
      );
    }

    const html = await res.text();

    // 1. Extract Inline SVGs
    const svgRegex = /<svg[\s\S]*?<\/svg>/gi;
    const svgMatches = html.match(svgRegex) || [];
    const extractedAssets: ExtractedSvgAsset[] = [];

    svgMatches.slice(0, 16).forEach((rawSvg, index) => {
      const viewBoxMatch = rawSvg.match(/viewBox=["'](.*?)["']/i);
      const widthMatch = rawSvg.match(/width=["'](.*?)["']/i);
      const heightMatch = rawSvg.match(/height=["'](.*?)["']/i);

      let cleanSvg = rawSvg
        .replace(/class="[^"]*"/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Ensure xmlns
      if (!cleanSvg.includes('xmlns=')) {
        cleanSvg = cleanSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      extractedAssets.push({
        id: `svg-${index + 1}`,
        name: `vector-glyph-${String(index + 1).padStart(2, '0')}.svg`,
        svgContent: cleanSvg,
        viewBox: viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24',
        width: widthMatch ? widthMatch[1] : '24',
        height: heightMatch ? heightMatch[1] : '24',
      });
    });

    // If fewer than 4 SVGs found, seed architectural vector fallbacks
    if (extractedAssets.length < 4) {
      const fallbackGlyphs = [
        {
          name: 'reticle-crosshair.svg',
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><line x1="12" y1="3" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="3" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="21" y2="12"/></svg>',
        },
        {
          name: 'geometric-shield.svg',
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        },
        {
          name: 'swatch-cube.svg',
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.9 8.25a2 2 0 0 0-.9 1.68v8.07a2 2 0 0 0 .93 1.7l6.05 4.06a2 2 0 0 0 2.17.05l9.97-5.96a2 2 0 0 0 .98-1.72V8.08a2 2 0 0 0-.98-1.68Z"/><path d="m10 22V12L2 7"/><path d="m10 12 11.5-6.5"/></svg>',
        },
        {
          name: 'aperture-radar.svg',
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="m14.31 8 5.74 9.94"/><path d="M9.69 8h11.48"/><path d="m7.38 12 5.74-9.94"/><path d="M9.69 16 3.95 6.06"/><path d="M14.31 16H2.83"/><path d="m16.62 12-5.74 9.94"/></svg>',
        },
      ];

      fallbackGlyphs.forEach((g, i) => {
        extractedAssets.push({
          id: `svg-fb-${i + 1}`,
          name: g.name,
          svgContent: g.svg,
          viewBox: '0 0 24 24',
          width: '24',
          height: '24',
        });
      });
    }

    // 2. Extract Color Palette (Hex Codes)
    const hexRegex = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
    const allHexes = html.match(hexRegex) || [];
    const hexCounts: Record<string, number> = {};

    allHexes.forEach((hex) => {
      const normalized = hex.toUpperCase();
      if (normalized.length === 4) {
        // Expand 3-digit hex
        const r = normalized[1];
        const g = normalized[2];
        const b = normalized[3];
        const fullHex = `#${r}${r}${g}${g}${b}${b}`;
        hexCounts[fullHex] = (hexCounts[fullHex] || 0) + 1;
      } else if (normalized.length === 7) {
        hexCounts[normalized] = (hexCounts[normalized] || 0) + 1;
      }
    });

    const defaultPalettes: ExtractedColorToken[] = [
      { hex: '#0D1117', name: 'Mineral Obsidian', count: 18 },
      { hex: '#16202A', name: 'Deep Indigo Surface', count: 14 },
      { hex: '#7D8F9A', name: 'Muted Mineral Slate', count: 12 },
      { hex: '#C85A32', name: 'Burnt Terracotta', count: 9 },
      { hex: '#84CC16', name: 'Acid Lime Indicator', count: 8 },
      { hex: '#F5F7F8', name: 'Pale Oyster Alabaster', count: 16 },
    ];

    const detectedColors: ExtractedColorToken[] = Object.entries(hexCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([hex, count], idx) => ({
        hex,
        name: `Token ${String(idx + 1).padStart(2, '0')}`,
        count,
      }));

    const finalColors = detectedColors.length >= 3 ? detectedColors : defaultPalettes;

    return NextResponse.json({
      success: true,
      targetUrl,
      assets: extractedAssets,
      colors: finalColors,
    });
  } catch (err: any) {
    console.error('Error harvesting vault assets:', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Failed to harvest staging DOM assets',
      },
      { status: 500 }
    );
  }
}
