import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing url query parameter' }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: 'Only HTTP and HTTPS URLs are supported' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid target URL format' }, { status: 400 });
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      cache: 'no-store',
    });

    if (!response.ok) {
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head><title>Proxy Error: ${response.status}</title></head>
<body style="font-family:sans-serif;padding:32px;text-align:center;background:#F4F0EB;color:#23201C;">
  <h3>Failed to load staging preview (${response.status} ${response.statusText})</h3>
  <p>The host at <code>${parsedUrl.origin}</code> returned an error.</p>
</body>
</html>`,
        {
          status: response.status,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const contentType = response.headers.get('content-type') || '';
    const newHeaders = new Headers();

    // Copy safe response headers, stripping frame-blocking and compression headers
    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (
        lower === 'x-frame-options' ||
        lower === 'content-security-policy' ||
        lower === 'content-security-policy-report-only' ||
        lower === 'content-encoding' ||
        lower === 'content-length'
      ) {
        return;
      }
      newHeaders.set(key, value);
    });

    // Permissive framing & CORS
    newHeaders.set('Access-Control-Allow-Origin', '*');

    // If HTML, inject <base href="[origin]/"> into <head>
    if (contentType.includes('text/html')) {
      let html = await response.text();
      const originWithSlash = `${parsedUrl.origin}/`;
      const baseTag = `<base href="${originWithSlash}">`;

      // Check for existing <base> tag and replace or inject into <head>
      if (/<base\s+[^>]*>/i.test(html)) {
        html = html.replace(/<base\s+[^>]*>/i, baseTag);
      } else if (/<head[^>]*>/i.test(html)) {
        html = html.replace(/(<head[^>]*>)/i, `$1\n    ${baseTag}`);
      } else {
        html = `${baseTag}\n${html}`;
      }

      const harnessScript = `
<script id="studio-orbit-harness">
(function() {
  let isInspectActive = true;
  let hoveredEl = null;
  let originalStyles = new Map();

  function getUniqueSelector(el) {
    if (!el || el === document.body || el === document.documentElement) return 'body';
    if (el.id) return '#' + el.id;
    if (el.getAttribute('data-testid')) return '[data-testid="' + el.getAttribute('data-testid') + '"]';
    let path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE && el !== document.body) {
      let selector = el.tagName.toLowerCase();
      if (el.className && typeof el.className === 'string') {
        const firstClass = el.className.trim().split(/\\s+/)[0];
        if (firstClass && !firstClass.startsWith('studio-orbit')) {
          selector += '.' + CSS.escape(firstClass);
        }
      }
      let sibling = el;
      let nth = 1;
      while (sibling = sibling.previousElementSibling) {
        if (sibling.tagName === el.tagName) nth++;
      }
      if (nth > 1) selector += ':nth-of-type(' + nth + ')';
      path.unshift(selector);
      el = el.parentElement;
    }
    return path.join(' > ');
  }

  document.addEventListener('mouseover', function(e) {
    if (!isInspectActive) return;
    const target = e.target;
    if (!target || target.id === 'studio-orbit-harness') return;
    if (hoveredEl && hoveredEl !== target) {
      hoveredEl.style.outline = hoveredEl.__prevOutline || '';
      hoveredEl.style.outlineOffset = hoveredEl.__prevOutlineOffset || '';
    }
    hoveredEl = target;
    hoveredEl.__prevOutline = target.style.outline;
    hoveredEl.__prevOutlineOffset = target.style.outlineOffset;
    target.style.outline = '2px dashed #C85A32';
    target.style.outlineOffset = '2px';
  }, true);

  document.addEventListener('mouseout', function(e) {
    if (hoveredEl) {
      hoveredEl.style.outline = hoveredEl.__prevOutline || '';
      hoveredEl.style.outlineOffset = hoveredEl.__prevOutlineOffset || '';
      hoveredEl = null;
    }
  }, true);

  document.addEventListener('click', function(e) {
    if (!isInspectActive) return;
    const target = e.target;
    if (!target || target.id === 'studio-orbit-harness') return;
    e.preventDefault();
    e.stopPropagation();

    const selector = getUniqueSelector(target);
    const computed = window.getComputedStyle(target);

    window.parent.postMessage({
      type: 'ORBIT_ELEMENT_SELECTED',
      selector: selector,
      tag: target.tagName.toLowerCase(),
      text: (target.innerText || target.textContent || '').trim().slice(0, 400),
      background: computed.backgroundColor,
      padding: computed.padding,
    }, '*');
  }, true);

  window.addEventListener('message', function(event) {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'ORBIT_SET_INSPECT') {
      isInspectActive = Boolean(data.enabled);
      if (!isInspectActive && hoveredEl) {
        hoveredEl.style.outline = hoveredEl.__prevOutline || '';
        hoveredEl.style.outlineOffset = hoveredEl.__prevOutlineOffset || '';
        hoveredEl = null;
      }
    }

    if (data.type === 'ORBIT_APPLY_MUTATION') {
      const { selector, newText, newBackground, newPadding } = data;
      const el = document.querySelector(selector);
      if (el) {
        if (!originalStyles.has(el)) {
          originalStyles.set(el, {
            text: el.innerText,
            background: el.style.backgroundColor,
            padding: el.style.padding
          });
        }
        if (newText !== undefined) el.innerText = newText;
        if (newBackground) el.style.backgroundColor = newBackground;
        if (newPadding) el.style.padding = newPadding;
      }
    }

    if (data.type === 'ORBIT_RESET_MUTATIONS') {
      originalStyles.forEach((val, el) => {
        if (val.text !== undefined) el.innerText = val.text;
        el.style.backgroundColor = val.background || '';
        el.style.padding = val.padding || '';
      });
      originalStyles.clear();
    }

    if (data.type === 'ORBIT_TEST_MOTION') {
      const { selector, bezierPoints, durationMs, delayMs } = data;
      const el = selector ? document.querySelector(selector) : hoveredEl || document.querySelector('h1, h2, main, button');
      if (el) {
        const bezierStr = 'cubic-bezier(' + bezierPoints.join(', ') + ')';
        el.style.transition = 'transform ' + durationMs + 'ms ' + bezierStr + ' ' + (delayMs || 0) + 'ms, opacity ' + durationMs + 'ms ' + bezierStr;
        el.style.transform = 'translateY(-12px) scale(1.02)';
        el.style.opacity = '0.7';
        setTimeout(function() {
          el.style.transform = 'translateY(0px) scale(1)';
          el.style.opacity = '1';
        }, durationMs / 2);
      }
    }
  });

  window.parent.postMessage({ type: 'ORBIT_HARNESS_READY' }, '*');
})();
</script>
`;

      // Inject harness right before closing </body> or at end
      if (/<\/body>/i.test(html)) {
        html = html.replace(/<\/body>/i, `${harnessScript}\n</body>`);
      } else {
        html += harnessScript;
      }

      newHeaders.set('Content-Type', 'text/html; charset=utf-8');
      return new NextResponse(html, {
        status: 200,
        headers: newHeaders,
      });
    }

    // For non-HTML binary or asset responses
    const arrayBuffer = await response.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      status: response.status,
      headers: newHeaders,
    });
  } catch (err: any) {
    console.error('Error in proxy route fetching target URL:', err);
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head><title>Proxy Connection Error</title></head>
<body style="font-family:sans-serif;padding:32px;text-align:center;background:#F4F0EB;color:#23201C;">
  <h3>Proxy Connection Error</h3>
  <p>${err?.message || 'Unable to reach target host.'}</p>
</body>
</html>`,
      {
        status: 502,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
