import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const scriptContent = `
(function() {
  if (window.__STUDIO_ORBIT_EMBED_LOADED__) return;
  window.__STUDIO_ORBIT_EMBED_LOADED__ = true;

  console.log('🚀 StudioOrbit Visual QA Staging Harness Attached.');

  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'ORBIT_GET_DOM_INFO') {
      const { clientX, clientY } = event.data;
      const target = document.elementFromPoint(clientX, clientY);

      if (target) {
        const rect = target.getBoundingClientRect();
        const info = {
          type: 'ORBIT_DOM_INFO_RESPONSE',
          tagName: target.tagName,
          id: target.id,
          className: target.className,
          textSnippet: (target.innerText || '').slice(0, 100),
          targetWidth: rect.width,
          targetHeight: rect.height,
          targetOffsetX: (clientX - rect.left) / rect.width,
          targetOffsetY: (clientY - rect.top) / rect.height,
          devicePixelRatio: window.devicePixelRatio || 1,
          userAgent: navigator.userAgent
        };
        window.parent.postMessage(info, '*');
      }
    }
  });
})();
`;

  return new NextResponse(scriptContent, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
