/**
 * Theme Type Definitions for TWX-React
 *
 * Provides comprehensive TypeScript types for the theme system including
 * token definitions, color palettes, spacing scales, and theme context types.
 *
 * @packageDocumentation
 */

import type { ReactNode } from 'react';

// ─── Utility Types ────────────────────────────────────────────────────────────

/**
 * Recursively makes all properties of `T` optional, including nested objects.
 * Useful for theme extension where you only want to override specific tokens.
 *
 * @example
 * ```ts
 * type PartialTheme = DeepPartial<ThemeTokens>;
 * // All nested properties become optional
 * ```
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K];
};

// ─── Color Types ──────────────────────────────────────────────────────────────

/**
 * Standard Tailwind color shade keys ranging from 50 (lightest) to 950 (darkest).
 * Maps each shade to a CSS color value string (typically OKLCH P3 format).
 *
 * @example
 * ```ts
 * const blueScale: ColorScale = {
 *   '50': 'oklch(0.97 0.01 240)',
 *   '100': 'oklch(0.93 0.03 240)',
 *   // ... through 950
 *   '950': 'oklch(0.15 0.07 240)',
 * };
 * ```
 */
export type ColorScale = {
  '50': string;
  '100': string;
  '200': string;
  '300': string;
  '400': string;
  '500': string;
  '600': string;
  '700': string;
  '800': string;
  '900': string;
  '950': string;
};

/**
 * A named collection of colors, each with a full shade scale or a single value.
 * Supports both flat color values (e.g., `white: '#fff'`) and shade scales
 * (e.g., `blue: { 50: '...', 100: '...', ... }`).
 *
 * @example
 * ```ts
 * const palette: ColorPalette = {
 *   blue: { '50': '...', '100': '...', ... },
 *   white: 'oklch(1 0 0)',
 *   transparent: 'transparent',
 * };
 * ```
 */
export type ColorPalette = Record<string, string | Partial<ColorScale> | Record<string, string>>;

// ─── Spacing Types ────────────────────────────────────────────────────────────

/**
 * Spacing scale mapping size keys to CSS length values.
 * Follows Tailwind's spacing convention with numeric and named keys.
 *
 * @example
 * ```ts
 * const spacing: SpacingScale = {
 *   '0': '0px',
 *   'px': '1px',
 *   '0.5': '0.125rem',
 *   '1': '0.25rem',
 *   '4': '1rem',
 * };
 * ```
 */
export type SpacingScale = Record<string, string>;

// ─── Typography Types ─────────────────────────────────────────────────────────

/**
 * Font size configuration as a tuple of size value and optional metadata.
 * The first element is the font-size CSS value, and the second is an object
 * containing optional line-height configuration.
 *
 * @example
 * ```ts
 * const config: FontSizeConfig = ['1rem', { lineHeight: '1.5rem' }];
 * ```
 */
export type FontSizeConfig = [string, { lineHeight?: string }];

// ─── Responsive Types ─────────────────────────────────────────────────────────

/**
 * Screen breakpoint definitions mapping breakpoint names to min-width values.
 * Used for responsive variants like `sm:`, `md:`, `lg:`, etc.
 *
 * @example
 * ```ts
 * const screens: ScreenBreakpoints = {
 *   sm: '640px',
 *   md: '768px',
 *   lg: '1024px',
 *   xl: '1280px',
 *   '2xl': '1536px',
 * };
 * ```
 */
export type ScreenBreakpoints = Record<string, string>;

// ─── Theme Tokens ─────────────────────────────────────────────────────────────

/**
 * Complete theme token configuration defining all design tokens.
 *
 * Tokens are the primitive values that the theme system uses to generate
 * CSS variables. Each category maps to a specific set of utilities:
 *
 * - `colors` — Color palette with optional shade scales (OKLCH P3 recommended)
 * - `spacing` — Spacing scale for margin, padding, gap, etc.
 * - `fontSize` — Font size definitions with optional line-height
 * - `borderRadius` — Border radius values
 * - `boxShadow` — Box shadow definitions
 * - `screens` — Responsive breakpoint min-widths
 * - `containers` — Container query breakpoint widths
 *
 * The index signature allows custom token categories for extensibility.
 *
 * @example
 * ```ts
 * const tokens: ThemeTokens = {
 *   colors: { primary: 'oklch(0.6 0.15 240)', gray: { '50': '...', '100': '...' } },
 *   spacing: { '1': '0.25rem', '2': '0.5rem' },
 *   fontSize: { base: ['1rem', { lineHeight: '1.5rem' }] },
 *   borderRadius: { md: '0.375rem' },
 *   boxShadow: { sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
 *   screens: { sm: '640px', md: '768px' },
 *   containers: { sm: '640px' },
 * };
 * ```
 */
export interface ThemeTokens {
  /** Color palette with support for flat values and shade scales */
  colors?: ColorPalette;

  /** Spacing scale for margin, padding, gap, and related utilities */
  spacing?: SpacingScale;

  /** Font size definitions, either as plain strings or [size, { lineHeight }] tuples */
  fontSize?: Record<string, string | FontSizeConfig>;

  /** Border radius values */
  borderRadius?: Record<string, string>;

  /** Box shadow definitions */
  boxShadow?: Record<string, string>;

  /** Responsive breakpoint definitions (min-width values) */
  screens?: ScreenBreakpoints;

  /** Container query breakpoint definitions */
  containers?: Record<string, string>;

  /** Extensible: custom token categories */
  [key: string]: unknown;
}

// ─── Theme Object ─────────────────────────────────────────────────────────────

/**
 * The complete theme object produced by `createTwTheme`.
 *
 * Contains the original token definitions and the generated CSS variable map.
 * Pass this to `<TwThemeProvider>` to inject the theme into your application.
 *
 * @example
 * ```ts
 * const theme: TwTheme = createTwTheme({
 *   colors: { primary: 'oklch(0.6 0.15 240)' },
 * });
 * // theme.tokens — the original ThemeTokens input
 * // theme.cssVariables — { '--twx-colors-primary': 'oklch(0.6 0.15 240)' }
 * ```
 */
export interface TwTheme {
  /** The original theme token definitions */
  tokens: ThemeTokens;

  /** Generated CSS variable map (variable name → value) */
  cssVariables: Record<string, string>;
}

// ─── Theme Overrides ──────────────────────────────────────────────────────────

/**
 * Partial theme overrides for extending or customizing an existing theme.
 * All token categories are optional, allowing selective overrides.
 *
 * @example
 * ```ts
 * const overrides: ThemeOverrides = {
 *   colors: { brand: 'oklch(0.7 0.2 300)' },
 *   spacing: { '18': '4.5rem' },
 * };
 * const customTheme = createTwTheme.extend(overrides);
 * ```
 */
export type ThemeOverrides = DeepPartial<ThemeTokens>;

// ─── Provider & Context Types ─────────────────────────────────────────────────

/**
 * Props for the `<TwThemeProvider>` component.
 *
 * @example
 * ```tsx
 * <TwThemeProvider theme={myTheme}>
 *   <App />
 * </TwThemeProvider>
 * ```
 */
export interface TwThemeProviderProps {
  /** The theme object to inject and expose via context */
  theme: TwTheme;

  /** Child elements that can consume the theme context */
  children: ReactNode;
}

/**
 * The value exposed by the theme context.
 * Access via the `useTwTheme()` hook.
 *
 * @example
 * ```tsx
 * const { theme, setTheme } = useTwTheme();
 * // theme — current TwTheme object
 * // setTheme — function to update the active theme at runtime
 * ```
 */
export interface TwThemeContext {
  /** The currently active theme */
  theme: TwTheme;

  /** Update the active theme at runtime (triggers CSS variable re-injection) */
  setTheme: (theme: TwTheme) => void;
}
