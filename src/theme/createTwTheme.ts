/**
 * createTwTheme - Theme factory for TWX-React
 *
 * Creates a theme object with CSS variable generation and extension support.
 * Includes full Tailwind v4 defaults (OKLCH P3 color palette, spacing, font sizes,
 * border radii, box shadows, and responsive breakpoints).
 */

import { COLOR_PALETTE } from '../internal/builders/colors';
import type { ThemeTokens, TwTheme } from '../types/theme';

// ─── CSS Variable Generation ──────────────────────────────────────────────────

/**
 * Convert a flat or nested token object to CSS variable declarations.
 * Nested keys are joined with a hyphen: { colors: { blue: { 500: '...' } } }
 * → { '--twx-colors-blue-500': '...' }
 *
 * Note: font sizes can be a tuple [size, { lineHeight }]. Only the size string
 * is emitted as a CSS variable; the lineHeight is emitted under a separate key.
 */
function tokensToCssVariables(
  tokens: ThemeTokens,
  prefix = '--twx',
): Record<string, string> {
  const vars: Record<string, string> = {};

  function walk(obj: unknown, segments: string[]): void {
    if (obj === null || obj === undefined) return;

    if (Array.isArray(obj)) {
      // Font-size tuple: [size, { lineHeight }]
      const [size, meta] = obj as [string, { lineHeight?: string }?];
      vars[segments.join('-')] = size;
      if (meta && typeof meta === 'object' && meta.lineHeight) {
        vars[`${segments.join('-')}-line-height`] = meta.lineHeight;
      }
      return;
    }

    if (typeof obj === 'string') {
      vars[segments.join('-')] = obj;
      return;
    }

    if (typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        walk(value, [...segments, key]);
      }
    }
  }

  for (const [category, value] of Object.entries(tokens)) {
    walk(value, [prefix, category]);
  }

  return vars;
}

// ─── Deep Merge ───────────────────────────────────────────────────────────────

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K];
};

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: DeepPartial<T> | Record<string, unknown>,
): T {
  const result: Record<string, unknown> = { ...base };

  for (const [key, overrideValue] of Object.entries(override)) {
    const baseValue = result[key];
    if (
      overrideValue !== null &&
      typeof overrideValue === 'object' &&
      !Array.isArray(overrideValue) &&
      baseValue !== null &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
    ) {
      result[key] = deepMerge(
        baseValue as Record<string, unknown>,
        overrideValue as Record<string, unknown>,
      );
    } else {
      result[key] = overrideValue;
    }
  }

  return result as T;
}

// ─── Default Tailwind v4 Theme ────────────────────────────────────────────────

/**
 * Full Tailwind v4 default theme tokens.
 * Colors use the OKLCH P3 palette from the color builder.
 */
export const defaultTailwindTheme: ThemeTokens = {
  colors: {
    ...COLOR_PALETTE,
    white: 'oklch(1 0 0)',
    black: 'oklch(0 0 0)',
    transparent: 'transparent',
    current: 'currentColor',
    inherit: 'inherit',
  },

  spacing: {
    '0': '0px',
    px: '1px',
    '0.5': '0.125rem',
    '1': '0.25rem',
    '1.5': '0.375rem',
    '2': '0.5rem',
    '2.5': '0.625rem',
    '3': '0.75rem',
    '3.5': '0.875rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '7': '1.75rem',
    '8': '2rem',
    '9': '2.25rem',
    '10': '2.5rem',
    '11': '2.75rem',
    '12': '3rem',
    '14': '3.5rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '28': '7rem',
    '32': '8rem',
    '36': '9rem',
    '40': '10rem',
    '44': '11rem',
    '48': '12rem',
    '52': '13rem',
    '56': '14rem',
    '60': '15rem',
    '64': '16rem',
    '72': '18rem',
    '80': '20rem',
    '96': '24rem',
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
  },

  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },

  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  containers: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// ─── Factory Function ─────────────────────────────────────────────────────────

/**
 * Create a theme from the provided tokens.
 * Generates CSS variables with the `--twx-{category}-{key}` naming convention.
 *
 * @example
 * ```ts
 * const theme = createTwTheme({
 *   colors: { primary: 'oklch(0.6 0.15 240)' },
 *   spacing: { xs: '0.25rem' },
 * });
 * // theme.cssVariables → { '--twx-colors-primary': 'oklch(0.6 0.15 240)', '--twx-spacing-xs': '0.25rem' }
 * ```
 */
export function createTwTheme(tokens: ThemeTokens): TwTheme {
  const cssVariables = tokensToCssVariables(tokens);
  return { tokens, cssVariables };
}

// ─── Attach .extend() as a static method ─────────────────────────────────────

/**
 * Extend the default Tailwind v4 theme with custom tokens.
 * Custom tokens are deep-merged on top of the defaults.
 *
 * @example
 * ```ts
 * const customTheme = createTwTheme.extend({
 *   colors: { brand: 'oklch(0.6 0.2 300)' },
 *   spacing: { 18: '4.5rem' },
 * });
 * ```
 */
createTwTheme.extend = function extendTheme(tokens: ThemeTokens): TwTheme {
  const merged = deepMerge(
    defaultTailwindTheme as Record<string, unknown>,
    tokens as Record<string, unknown>,
  ) as ThemeTokens;
  return /*#__PURE__*/ createTwTheme(merged);
};

/**
 * The default Tailwind v4 theme instance.
 * Includes the full OKLCH P3 color palette, spacing, font sizes,
 * border radii, box shadows, and responsive breakpoints.
 *
 * Lazily created on first access to avoid paying the cost when unused.
 */
let _defaultTheme: TwTheme | undefined;
export function getDefaultTheme(): TwTheme {
  if (!_defaultTheme) {
    _defaultTheme = createTwTheme(defaultTailwindTheme);
  }
  return _defaultTheme;
}

/** @deprecated Use `getDefaultTheme()` for lazy evaluation. Eager reference kept for backwards compat. */
export const defaultTheme: TwTheme = /*#__PURE__*/ createTwTheme(defaultTailwindTheme);
