/**
 * Internal CSS Generator Module
 * Generates CSS rules from parsed Tailwind classes
 * 
 * @internal
 */

import type { ParsedClass } from './parser';
import { cssCache } from './cache';

// ─── CSS Rule Interface ───────────────────────────────────────────────────────

export interface CSSRule {
  /** The full CSS selector (e.g., ".px-4", ".hover\\:bg-blue-500:hover") */
  selector: string;
  /** CSS property-value pairs */
  properties: Record<string, string>;
  /** Optional media query wrapper (e.g., "@media (min-width: 768px)") */
  mediaQuery?: string;
  /** Optional container query wrapper (e.g., "@container (min-width: 768px)") */
  containerQuery?: string;
}

// ─── Utility Generator Function Type ──────────────────────────────────────────

/**
 * A utility generator function that produces CSS properties from a parsed class.
 * Returns null if the utility/value combination is not handled.
 */
export type UtilityGenerator = (
  parsedClass: ParsedClass
) => Record<string, string> | null;

// ─── Responsive Breakpoints ──────────────────────────────────────────────────

/** Standard responsive breakpoints (min-width media queries) */
export const RESPONSIVE_BREAKPOINTS: Record<string, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/** Container query breakpoints */
export const CONTAINER_BREAKPOINTS: Record<string, string> = {
  '@sm': '640px',
  '@md': '768px',
  '@lg': '1024px',
  '@xl': '1280px',
  '@2xl': '1536px',
};

// ─── Pseudo-Class / Pseudo-Element Mappings ──────────────────────────────────

/** Map of variant names to their CSS pseudo-class/element selectors */
export const VARIANT_SELECTORS: Record<string, string> = {
  // Interactive pseudo-classes
  hover: ':hover',
  focus: ':focus',
  'focus-visible': ':focus-visible',
  'focus-within': ':focus-within',
  active: ':active',
  visited: ':visited',
  target: ':target',
  disabled: ':disabled',
  enabled: ':enabled',
  checked: ':checked',
  indeterminate: ':indeterminate',
  required: ':required',
  valid: ':valid',
  invalid: ':invalid',
  'user-valid': ':user-valid',
  'user-invalid': ':user-invalid',
  'in-range': ':in-range',
  'out-of-range': ':out-of-range',
  'placeholder-shown': ':placeholder-shown',
  autofill: ':autofill',
  'read-only': ':read-only',
  default: ':default',
  optional: ':optional',
  open: '[open]',

  // Pseudo-elements
  before: '::before',
  after: '::after',
  placeholder: '::placeholder',
  selection: '::selection',
  'first-letter': '::first-letter',
  'first-line': '::first-line',
  marker: '::marker',
  file: '::file-selector-button',
  backdrop: '::backdrop',

  // Structural pseudo-classes
  first: ':first-child',
  last: ':last-child',
  odd: ':nth-child(odd)',
  even: ':nth-child(even)',
  'first-of-type': ':first-of-type',
  'last-of-type': ':last-of-type',
  only: ':only-child',
  'only-of-type': ':only-of-type',
  empty: ':empty',
};

// ─── Utility Registry ─────────────────────────────────────────────────────────

/** Registry of utility generators keyed by utility name */
const utilityRegistry = new Map<string, UtilityGenerator>();

/**
 * Register a utility generator for a specific utility name.
 * 
 * @param name - The utility name (e.g., "px", "bg", "flex")
 * @param generator - The function that generates CSS properties
 */
export function registerUtility(name: string, generator: UtilityGenerator): void {
  utilityRegistry.set(name, generator);
}

/**
 * Register multiple utility generators at once.
 * 
 * @param entries - Array of [name, generator] pairs
 */
export function registerUtilities(entries: [string, UtilityGenerator][]): void {
  for (const [name, generator] of entries) {
    utilityRegistry.set(name, generator);
  }
}

/**
 * Check if a utility generator is registered.
 * 
 * @param name - The utility name to check
 */
export function hasUtility(name: string): boolean {
  return utilityRegistry.has(name);
}

/**
 * Get a registered utility generator.
 * 
 * @param name - The utility name to look up
 */
export function getUtility(name: string): UtilityGenerator | undefined {
  return utilityRegistry.get(name);
}

/**
 * Get all registered utility names (for debugging/testing).
 */
export function getRegisteredUtilities(): string[] {
  return Array.from(utilityRegistry.keys());
}

/**
 * Clear all registered utilities (primarily for testing).
 */
export function clearRegistry(): void {
  utilityRegistry.clear();
}

// ─── CSS Selector Escaping ────────────────────────────────────────────────────

/**
 * Escape a class name for use in a CSS selector.
 * Handles special characters like colons, dots, brackets, slashes, @, etc.
 * 
 * @param className - The raw class name to escape
 * @returns The escaped class name safe for use in CSS selectors
 */
export function escapeClassName(className: string): string {
  return className.replace(/([.:[\]/@#%(),!>~+*=^$|{}])/g, '\\$1');
}

// ─── Media Query Wrapper ──────────────────────────────────────────────────────

/**
 * Wrap a CSS rule string inside a media query block.
 * Used for responsive variants (sm, md, lg, xl, 2xl).
 * 
 * @param minWidth - The breakpoint min-width value (e.g., "768px")
 * @returns The media query string (e.g., "@media (min-width: 768px)")
 */
export function buildMediaQuery(minWidth: string): string {
  return `@media (min-width: ${minWidth})`;
}

/**
 * Wrap a CSS rule string inside a container query block.
 * Used for container query variants (@sm, @md, @lg, @xl, @2xl).
 * 
 * @param minWidth - The breakpoint min-width value (e.g., "768px")
 * @returns The container query string (e.g., "@container (min-width: 768px)")
 */
export function buildContainerQuery(minWidth: string): string {
  return `@container (min-width: ${minWidth})`;
}

// ─── Pseudo-Class Selector Builder ───────────────────────────────────────────

/**
 * Build a selector with pseudo-class/element suffix.
 * 
 * @param baseSelector - The base CSS selector (e.g., ".hover\\:bg-blue-500")
 * @param pseudoSelector - The pseudo selector to append (e.g., ":hover")
 * @returns The combined selector (e.g., ".hover\\:bg-blue-500:hover")
 */
export function buildPseudoSelector(baseSelector: string, pseudoSelector: string): string {
  return `${baseSelector}${pseudoSelector}`;
}

/**
 * Build a group variant selector.
 * Group variants target an element when its ancestor `.group` matches a state.
 * 
 * @param baseSelector - The element's own selector
 * @param state - The pseudo-class state (e.g., "hover", "focus")
 * @returns The group variant selector (e.g., ".group:hover .group-hover\\:...")
 */
export function buildGroupSelector(baseSelector: string, state: string): string {
  const pseudoState = VARIANT_SELECTORS[state] || `:${state}`;
  return `.group${pseudoState} ${baseSelector}`;
}

/**
 * Build a peer variant selector.
 * Peer variants target an element when its sibling `.peer` matches a state.
 * 
 * @param baseSelector - The element's own selector
 * @param state - The pseudo-class state (e.g., "checked", "focus")
 * @returns The peer variant selector (e.g., ".peer:checked ~ .peer-checked\\:...")
 */
export function buildPeerSelector(baseSelector: string, state: string): string {
  const pseudoState = VARIANT_SELECTORS[state] || `:${state}`;
  return `.peer${pseudoState} ~ ${baseSelector}`;
}

/**
 * Build a negation variant selector.
 * 
 * @param baseSelector - The element's own selector
 * @param state - The pseudo-class state to negate (e.g., "hover", "disabled")
 * @returns The negation selector (e.g., ".not-hover\\:...:not(:hover)")
 */
export function buildNotSelector(baseSelector: string, state: string): string {
  const pseudoState = VARIANT_SELECTORS[state] || `:${state}`;
  return `${baseSelector}:not(${pseudoState})`;
}

/**
 * Build a dark mode selector.
 * Uses ancestor `.dark` class strategy.
 * 
 * @param baseSelector - The element's own selector
 * @returns The dark mode selector (e.g., ".dark .dark\\:bg-gray-800")
 */
export function buildDarkSelector(baseSelector: string): string {
  return `.dark ${baseSelector}`;
}

// ─── Variant Resolution ──────────────────────────────────────────────────────

/**
 * Resolve variants from a parsed class and produce the final selector, media query,
 * and container query. Supports variant stacking (e.g., md:hover:disabled:...).
 * 
 * @param className - The original full class name (for escaping into selector)
 * @param variants - Array of variant names from the parsed class
 * @returns An object with the resolved selector, mediaQuery, and containerQuery
 */
export function resolveVariants(
  className: string,
  variants: string[]
): { selector: string; mediaQuery?: string; containerQuery?: string } {
  const escapedClass = escapeClassName(className);
  let selector = `.${escapedClass}`;
  let mediaQuery: string | undefined;
  let containerQuery: string | undefined;

  for (const variant of variants) {
    // Check responsive breakpoint
    if (variant in RESPONSIVE_BREAKPOINTS) {
      mediaQuery = buildMediaQuery(RESPONSIVE_BREAKPOINTS[variant]);
      continue;
    }

    // Check container query breakpoint
    if (variant in CONTAINER_BREAKPOINTS) {
      containerQuery = buildContainerQuery(CONTAINER_BREAKPOINTS[variant]);
      continue;
    }

    // Dark mode
    if (variant === 'dark') {
      selector = buildDarkSelector(selector);
      continue;
    }

    // Group variants (group-hover, group-focus, etc.)
    if (variant.startsWith('group-')) {
      const state = variant.slice(6); // Remove "group-" prefix
      selector = buildGroupSelector(selector, state);
      continue;
    }

    // In-* variants (aliases for group-*)
    if (variant.startsWith('in-')) {
      const state = variant.slice(3); // Remove "in-" prefix
      selector = buildGroupSelector(selector, state);
      continue;
    }

    // Peer variants (peer-hover, peer-checked, etc.)
    if (variant.startsWith('peer-')) {
      const state = variant.slice(5); // Remove "peer-" prefix
      selector = buildPeerSelector(selector, state);
      continue;
    }

    // Negation variants (not-hover, not-disabled, etc.)
    if (variant.startsWith('not-')) {
      const state = variant.slice(4); // Remove "not-" prefix
      selector = buildNotSelector(selector, state);
      continue;
    }

    // Standard pseudo-class/element variant
    if (variant in VARIANT_SELECTORS) {
      selector = buildPseudoSelector(selector, VARIANT_SELECTORS[variant]);
      continue;
    }

    // Unknown variant - treat as pseudo-class
    selector = buildPseudoSelector(selector, `:${variant}`);
  }

  return { selector, mediaQuery, containerQuery };
}

// ─── Main Generate Function ──────────────────────────────────────────────────

/**
 * Generate a CSS rule from a parsed class.
 * Looks up the utility in the registry, resolves variants, and produces the full CSS rule.
 * 
 * @param parsedClass - The parsed class structure from the parser
 * @param originalClassName - The original class name string (for selector generation)
 * @returns Generated CSS rule, or null if the utility is not registered
 */
export function generateCSS(parsedClass: ParsedClass, originalClassName?: string): CSSRule | null {
  if (!parsedClass.utility) {
    return null;
  }

  let generator: UtilityGenerator | undefined;
  let useCompound = false;

  if (parsedClass.value) {
    // When there's a value, try compound key FIRST (e.g., "flex-col", "rounded-lg", "inline-flex")
    // This prevents prefix conflicts where e.g. "flex" (display:flex) shadows "flex-col" (flex-direction:column)
    const compoundKey = `${parsedClass.utility}-${parsedClass.value}`;
    generator = utilityRegistry.get(compoundKey);
    if (generator) {
      useCompound = true;
    } else {
      // Fall back to simple utility with value (e.g., "px" with value "4")
      generator = utilityRegistry.get(parsedClass.utility);
    }
  } else {
    // No value — just look up the utility directly (e.g., "flex", "block", "hidden")
    generator = utilityRegistry.get(parsedClass.utility);
  }

  if (!generator) {
    return null;
  }

  // Generate CSS properties
  let properties: Record<string, string> | null;
  if (useCompound) {
    // For compound lookups, the value was part of the utility name
    const modifiedParsed = { ...parsedClass, value: undefined };
    properties = generator(modifiedParsed);
    if (!properties) {
      // Compound generator returned null — fall back to simple utility with the value
      const fallbackGenerator = utilityRegistry.get(parsedClass.utility);
      if (fallbackGenerator) {
        properties = fallbackGenerator(parsedClass);
      }
    }
  } else {
    properties = generator(parsedClass);
  }

  if (!properties) {
    return null;
  }

  // Resolve the class name for the selector
  const className = originalClassName || parsedClass.utility + (parsedClass.value ? `-${parsedClass.value}` : '');

  // Resolve variants to get selector, media query, and container query
  const { selector, mediaQuery, containerQuery } = resolveVariants(
    className,
    parsedClass.variants
  );

  const rule: CSSRule = { selector, properties };
  if (mediaQuery) rule.mediaQuery = mediaQuery;
  if (containerQuery) rule.containerQuery = containerQuery;

  return rule;
}

// ─── CSS Stringification ─────────────────────────────────────────────────────

/**
 * Generate CSS string from a CSSRule.
 * Handles media query and container query wrapping.
 * 
 * @param rule - The CSS rule to stringify
 * @returns Formatted CSS string
 */
export function stringifyRule(rule: CSSRule): string {
  const properties = Object.entries(rule.properties)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  const ruleBlock = `${rule.selector} {\n${properties}\n}`;

  // Wrap in container query if present
  let css = ruleBlock;
  if (rule.containerQuery) {
    css = `${rule.containerQuery} {\n  ${ruleBlock.replace(/\n/g, '\n  ')}\n}`;
  }

  // Wrap in media query if present
  if (rule.mediaQuery) {
    css = `${rule.mediaQuery} {\n  ${css.replace(/\n/g, '\n  ')}\n}`;
  }

  return css;
}

// ─── Cache-Integrated CSS String Generation ───────────────────────────────────

/**
 * Generate a CSS string for a parsed class, using the LRU cache for performance.
 *
 * On a **cache hit** the previously generated string is returned immediately.
 * On a **cache miss** the CSS is generated via `generateCSS` + `stringifyRule`,
 * stored in the cache, and then returned.
 *
 * The cache key is the full original class name string (e.g. `md:hover:bg-blue-500`).
 * Returns `null` when the utility is unrecognised or the generator returns no properties.
 *
 * @param parsedClass - The parsed class structure from the parser
 * @param originalClassName - The original class name string (used as cache key and selector)
 * @returns The CSS string, or null if the utility is not registered
 */
export function generateCSSString(
  parsedClass: ParsedClass,
  originalClassName: string
): string | null {
  // Cache hit — return early without regenerating
  const cached = cssCache.get(originalClassName);
  if (cached !== undefined) {
    return cached;
  }

  // Cache miss — generate the CSS rule
  const rule = generateCSS(parsedClass, originalClassName);
  if (!rule) {
    return null;
  }

  const css = stringifyRule(rule);

  // Store in cache for future lookups
  cssCache.set(originalClassName, css);

  return css;
}
