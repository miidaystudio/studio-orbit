export interface DOMAnchorData {
  selectorPath: string;
  targetOffsetX: number; // 0.0 to 1.0 relative offset
  targetOffsetY: number; // 0.0 to 1.0 relative offset
  domSnippet: string;
}

/**
 * Generates a unique CSS Selector Path for any given HTML element in the DOM tree
 */
export function generateCssSelectorPath(element: HTMLElement): string {
  if (element.id) {
    return `#${element.id}`;
  }

  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current.nodeType === Node.ELEMENT_NODE && current.tagName !== 'BODY') {
    let selector = current.tagName.toLowerCase();

    if (current.className && typeof current.className === 'string') {
      const classes = current.className
        .trim()
        .split(/\s+/)
        .filter((c) => c && !c.includes(':') && !c.startsWith('hover') && !c.startsWith('focus'));
      if (classes.length > 0) {
        selector += `.${classes.slice(0, 2).join('.')}`;
      }
    }

    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (child) => child.tagName === current?.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }

    path.unshift(selector);
    current = parent;
  }

  return path.join(' > ') || 'body';
}

/**
 * Calculates relative offset within target element (0.0 to 1.0)
 */
export function calculateTargetOffset(
  element: HTMLElement,
  clientX: number,
  clientY: number
): { offsetX: number; offsetY: number } {
  const rect = element.getBoundingClientRect();
  const offsetX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  const offsetY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

  return {
    offsetX: Number(offsetX.toFixed(4)),
    offsetY: Number(offsetY.toFixed(4)),
  };
}

/**
 * Extract DOM Text snippet for re-anchoring heuristics
 */
export function extractDomSnippet(element: HTMLElement): string {
  const text = element.innerText || element.textContent || '';
  return text.trim().slice(0, 100);
}

/**
 * Re-anchors a pin if DOM shifts or resizes by finding target element by selector or snippet fallback
 */
export function resolveDOMPinElement(
  selectorPath?: string,
  domSnippet?: string,
  doc: Document = document
): HTMLElement | null {
  if (selectorPath) {
    try {
      const el = doc.querySelector(selectorPath) as HTMLElement;
      if (el) return el;
    } catch (e) {
      // Ignore invalid CSS selector query errors
    }
  }

  // Fallback: search for elements containing the snippet text
  if (domSnippet && domSnippet.length > 3) {
    const allElements = Array.from(doc.querySelectorAll('h1, h2, h3, h4, p, button, a, span, div'));
    for (const el of allElements) {
      const text = (el as HTMLElement).innerText || '';
      if (text.includes(domSnippet)) {
        return el as HTMLElement;
      }
    }
  }

  return null;
}
