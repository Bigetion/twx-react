/**
 * Internal CSS Injector Module
 * Injects generated CSS into the DOM with deduplication.
 * Supports SSR (Server-Side Rendering) by collecting rules in memory
 * when no DOM is available, then exposing them via extractCriticalCSS().
 *
 * @internal
 */

const STYLE_TAG_ID = 'twx-react-styles';

/**
 * Cascade layer names used to keep utility precedence predictable regardless
 * of *when* each rule happens to be discovered/injected at runtime.
 *
 * Without this, two rules with equal selector specificity (e.g. a plain
 * `.bg-red-500` and a `.hover\\:bg-blue-500:hover`) would win or lose purely
 * based on which one was inserted into the stylesheet first — which depends
 * on render order across the whole app, not on source order in JSX. Cascade
 * layers fix this: layers declared later in `LAYER_ORDER_STATEMENT` always
 * beat earlier ones, no matter the order individual rules are appended.
 */
export type TwxCSSLayer = 'preflight' | 'utilities' | 'variants';

/**
 * The single source of truth for the cascade layer order. Exported so
 * `preflight.ts` can declare the exact same order before its own layer block,
 * regardless of which `<style>` tag ends up first in the DOM.
 */
export const LAYER_ORDER_STATEMENT = '@layer twx-preflight, twx-utilities, twx-variants;';

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

/**
 * Inject a CSS rule into a specific cascade layer (`@layer twx-utilities` or
 * `@layer twx-variants`), guaranteeing correct precedence between plain
 * utilities and variant/pseudo-class rules regardless of insertion order.
 *
 * The layer order is declared once (lazily, the first time this is called)
 * via `LAYER_ORDER_STATEMENT` and is a no-op on subsequent calls thanks to
 * the existing dedup mechanism.
 *
 * @param cssRule - The raw CSS rule string (as produced by `generateCSSString`)
 * @param layer - Which cascade layer the rule belongs to (default: `'utilities'`)
 */
export function injectLayeredCSS(
  cssRule: string,
  layer: Exclude<TwxCSSLayer, 'preflight'> = 'utilities'
): void {
  if (!cssRule) return;

  if (!isInjected(LAYER_ORDER_STATEMENT)) {
    injectCSS(LAYER_ORDER_STATEMENT);
  }

  injectCSS(`@layer twx-${layer} {\n${cssRule}\n}`);
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
