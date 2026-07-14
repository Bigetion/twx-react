/**
 * Internal CSS Injector Module
 * Injects generated CSS into the DOM with deduplication.
 * Supports SSR (Server-Side Rendering) by collecting rules in memory
 * when no DOM is available, then exposing them via extractCriticalCSS().
 *
 * @internal
 */

const STYLE_TAG_ID = 'twx-react-styles';

// ---------------------------------------------------------------------------
// SSR collector
// An ordered list of unique CSS rules accumulated when running on the server.
// ---------------------------------------------------------------------------
let ssrBuffer: string[] = [];
let ssrSeen = new Set<string>();

// ---------------------------------------------------------------------------
// Browser-side deduplication
// Tracks rules already written to the DOM <style> tag.
// ---------------------------------------------------------------------------
let browserSeen = new Set<string>();

// ---------------------------------------------------------------------------
// Public environment helpers
// ---------------------------------------------------------------------------

/**
 * Returns `true` when running in a server (SSR) environment where
 * the global `document` object is not available.
 */
export function isSSR(): boolean {
  return typeof document === 'undefined';
}

// ---------------------------------------------------------------------------
// Style tag management (browser only)
// ---------------------------------------------------------------------------

/**
 * Get or create the `<style>` element used to inject CSS at runtime.
 * Returns `null` in SSR mode.
 */
function getStyleTag(): HTMLStyleElement | null {
  if (isSSR()) {
    return null;
  }

  let styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = STYLE_TAG_ID;
    styleTag.setAttribute('data-twx-react', '');
    document.head.appendChild(styleTag);
  }

  return styleTag;
}

// ---------------------------------------------------------------------------
// Core injection
// ---------------------------------------------------------------------------

/**
 * Inject a single CSS rule.
 *
 * - **Browser**: appends the rule to the `<style>` tag in `<head>`.
 * - **SSR**: stores the rule in the in-memory SSR buffer so it can be
 *   extracted later via `extractCriticalCSS()`.
 *
 * Identical rules are silently deduplicated in both environments.
 *
 * @param cssRule - The CSS rule string to inject (e.g. `.foo { color: red; }`)
 */
export function injectCSS(cssRule: string): void {
  if (!cssRule) {
    return;
  }

  if (isSSR()) {
    // SSR path: accumulate in memory buffer
    if (!ssrSeen.has(cssRule)) {
      ssrSeen.add(cssRule);
      ssrBuffer.push(cssRule);
    }
  } else {
    // Browser path: write to DOM
    if (!browserSeen.has(cssRule)) {
      browserSeen.add(cssRule);
      const styleTag = getStyleTag();
      if (styleTag) {
        styleTag.appendChild(document.createTextNode(cssRule));
      }
    }
  }
}

/**
 * Inject multiple CSS rules at once.
 * Each rule is deduplicated individually.
 *
 * @param rules - Array of CSS rule strings to inject
 */
export function injectCSSRules(rules: string[]): void {
  for (const rule of rules) {
    injectCSS(rule);
  }
}

// ---------------------------------------------------------------------------
// SSR extraction
// ---------------------------------------------------------------------------

/**
 * Extract all CSS rules collected during SSR rendering.
 *
 * Use the returned string to embed a `<style>` tag in your server-rendered
 * HTML for critical-CSS hydration:
 *
 * ```html
 * <style data-twx-react="">${extractCriticalCSS()}</style>
 * ```
 *
 * In browser mode, returns the current `textContent` of the injected
 * `<style>` tag (useful for testing).
 *
 * @returns All collected CSS rules joined by newlines
 */
export function extractCriticalCSS(): string {
  if (isSSR()) {
    return ssrBuffer.join('\n');
  }

  // Browser: read from the DOM style tag
  const styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
  return styleTag ? styleTag.textContent ?? '' : '';
}

/**
 * Reset the SSR in-memory collector (buffer + deduplication set).
 *
 * Call this between requests on the server to avoid CSS leaking between
 * independent render passes.
 */
export function resetSSRCollector(): void {
  ssrBuffer = [];
  ssrSeen = new Set<string>();
}

// ---------------------------------------------------------------------------
// Cleanup helpers (primarily for testing)
// ---------------------------------------------------------------------------

/**
 * Clear all injected styles:
 * - In SSR mode: resets the in-memory buffer and deduplication set.
 * - In browser mode: removes the `<style>` tag from the DOM and resets the
 *   browser deduplication set.
 *
 * Equivalent to `resetSSRCollector()` in SSR mode.
 */
export function clearInjectedStyles(): void {
  // Always reset the SSR collector
  resetSSRCollector();

  if (!isSSR()) {
    browserSeen = new Set<string>();
    const styleTag = document.getElementById(STYLE_TAG_ID);
    if (styleTag) {
      styleTag.remove();
    }
  }
}

/**
 * Alias for `clearInjectedStyles()` kept for backwards compatibility.
 */
export function clearInjectedCSS(): void {
  clearInjectedStyles();
}

/**
 * Check whether a CSS rule has already been injected in the current environment.
 *
 * @param cssRule - The CSS rule string to check
 * @returns `true` if the rule has already been injected
 */
export function isInjected(cssRule: string): boolean {
  if (isSSR()) {
    return ssrSeen.has(cssRule);
  }
  return browserSeen.has(cssRule);
}

/**
 * Return all injected CSS as a single string.
 * Alias for `extractCriticalCSS()`.
 *
 * @returns All injected CSS rules joined with newlines
 */
export function getInjectedCSS(): string {
  return extractCriticalCSS();
}
