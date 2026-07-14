/**
 * Sizing Utilities Builder
 * Generates width, height, min/max variants, and size utilities.
 *
 * @internal
 */

import { registerUtilities, type UtilityGenerator } from '../generator';
import type { ParsedClass } from '../parser';

// ─── Spacing/Sizing Numeric Scale ─────────────────────────────────────────────
// Same scale used by spacing: 0, px, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4 ... 96
// Values map to rem (value * 0.25rem), except `px` which is 1px.

const NUMERIC_SCALE: Record<string, string> = {
  '0': '0px',
  'px': '1px',
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
};

// ─── Fraction Values ──────────────────────────────────────────────────────────

const FRACTION_VALUES: Record<string, string> = {
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
  '1/6': '16.666667%',
  '2/6': '33.333333%',
  '3/6': '50%',
  '4/6': '66.666667%',
  '5/6': '83.333333%',
  '1/12': '8.333333%',
  '2/12': '16.666667%',
  '3/12': '25%',
  '4/12': '33.333333%',
  '5/12': '41.666667%',
  '6/12': '50%',
  '7/12': '58.333333%',
  '8/12': '66.666667%',
  '9/12': '75%',
  '10/12': '83.333333%',
  '11/12': '91.666667%',
};

// ─── Special Values ───────────────────────────────────────────────────────────

const WIDTH_SPECIAL: Record<string, string> = {
  'auto': 'auto',
  'full': '100%',
  'screen': '100vw',
  'min': 'min-content',
  'max': 'max-content',
  'fit': 'fit-content',
  'svw': '100svw',
  'lvw': '100lvw',
  'dvw': '100dvw',
};

const HEIGHT_SPECIAL: Record<string, string> = {
  'auto': 'auto',
  'full': '100%',
  'screen': '100vh',
  'min': 'min-content',
  'max': 'max-content',
  'fit': 'fit-content',
  'svh': '100svh',
  'lvh': '100lvh',
  'dvh': '100dvh',
};

// ─── Max-Width Named Sizes ────────────────────────────────────────────────────

const MAX_WIDTH_NAMED: Record<string, string> = {
  'none': 'none',
  'xs': '20rem',
  'sm': '24rem',
  'md': '28rem',
  'lg': '32rem',
  'xl': '36rem',
  '2xl': '42rem',
  '3xl': '48rem',
  '4xl': '56rem',
  '5xl': '64rem',
  '6xl': '72rem',
  '7xl': '80rem',
  'full': '100%',
  'min': 'min-content',
  'max': 'max-content',
  'fit': 'fit-content',
  'prose': '65ch',
  'screen-sm': '640px',
  'screen-md': '768px',
  'screen-lg': '1024px',
  'screen-xl': '1280px',
  'screen-2xl': '1536px',
};

// ─── Min-Width Named Sizes ────────────────────────────────────────────────────

const MIN_WIDTH_NAMED: Record<string, string> = {
  '0': '0px',
  'full': '100%',
  'min': 'min-content',
  'max': 'max-content',
  'fit': 'fit-content',
};

// ─── Min-Height Named Sizes ───────────────────────────────────────────────────

const MIN_HEIGHT_NAMED: Record<string, string> = {
  '0': '0px',
  'full': '100%',
  'screen': '100vh',
  'min': 'min-content',
  'max': 'max-content',
  'fit': 'fit-content',
  'svh': '100svh',
  'lvh': '100lvh',
  'dvh': '100dvh',
};

// ─── Max-Height Named Sizes ───────────────────────────────────────────────────

const MAX_HEIGHT_NAMED: Record<string, string> = {
  'none': 'none',
  'full': '100%',
  'screen': '100vh',
  'min': 'min-content',
  'max': 'max-content',
  'fit': 'fit-content',
  'svh': '100svh',
  'lvh': '100lvh',
  'dvh': '100dvh',
};

// ─── Helper: Resolve a sizing value ───────────────────────────────────────────

/**
 * Resolve a parsed value into a CSS value using the given lookup tables.
 * Supports numeric scale, fractions, special keywords, and arbitrary values.
 */
function resolveSizingValue(
  parsed: ParsedClass,
  specialValues: Record<string, string>,
  includeFractions: boolean = true
): string | null {
  const { value, arbitrary } = parsed;
  if (!value) return null;

  // Arbitrary value: [200px] → 200px
  if (arbitrary && value.startsWith('[') && value.endsWith(']')) {
    return value.slice(1, -1);
  }

  // Special keyword values
  if (value in specialValues) {
    return specialValues[value];
  }

  // Numeric scale
  if (value in NUMERIC_SCALE) {
    return NUMERIC_SCALE[value];
  }

  // Fraction values (e.g., "1/2")
  if (includeFractions && value in FRACTION_VALUES) {
    return FRACTION_VALUES[value];
  }

  return null;
}

// ─── Width Utility Generator ──────────────────────────────────────────────────

const widthGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  const resolved = resolveSizingValue(parsed, WIDTH_SPECIAL, true);
  if (resolved === null) return null;
  return { width: resolved };
};

// ─── Min-Width Utility Generator ──────────────────────────────────────────────

const minWidthGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  const { value, arbitrary } = parsed;
  if (!value) return null;

  // Arbitrary value
  if (arbitrary && value.startsWith('[') && value.endsWith(']')) {
    return { 'min-width': value.slice(1, -1) };
  }

  // Named values
  if (value in MIN_WIDTH_NAMED) {
    return { 'min-width': MIN_WIDTH_NAMED[value] };
  }

  // Also support numeric scale for min-w
  if (value in NUMERIC_SCALE) {
    return { 'min-width': NUMERIC_SCALE[value] };
  }

  return null;
};

// ─── Max-Width Utility Generator ──────────────────────────────────────────────

const maxWidthGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  const { value, arbitrary } = parsed;
  if (!value) return null;

  // Arbitrary value
  if (arbitrary && value.startsWith('[') && value.endsWith(']')) {
    return { 'max-width': value.slice(1, -1) };
  }

  // Named values (includes none, xs, sm, md, lg, xl, etc.)
  if (value in MAX_WIDTH_NAMED) {
    return { 'max-width': MAX_WIDTH_NAMED[value] };
  }

  // Numeric scale
  if (value in NUMERIC_SCALE) {
    return { 'max-width': NUMERIC_SCALE[value] };
  }

  return null;
};

// ─── Height Utility Generator ─────────────────────────────────────────────────

const heightGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  const resolved = resolveSizingValue(parsed, HEIGHT_SPECIAL, true);
  if (resolved === null) return null;
  return { height: resolved };
};

// ─── Min-Height Utility Generator ─────────────────────────────────────────────

const minHeightGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  const { value, arbitrary } = parsed;
  if (!value) return null;

  // Arbitrary value
  if (arbitrary && value.startsWith('[') && value.endsWith(']')) {
    return { 'min-height': value.slice(1, -1) };
  }

  // Named values
  if (value in MIN_HEIGHT_NAMED) {
    return { 'min-height': MIN_HEIGHT_NAMED[value] };
  }

  // Numeric scale
  if (value in NUMERIC_SCALE) {
    return { 'min-height': NUMERIC_SCALE[value] };
  }

  return null;
};

// ─── Max-Height Utility Generator ─────────────────────────────────────────────

const maxHeightGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  const { value, arbitrary } = parsed;
  if (!value) return null;

  // Arbitrary value
  if (arbitrary && value.startsWith('[') && value.endsWith(']')) {
    return { 'max-height': value.slice(1, -1) };
  }

  // Named values
  if (value in MAX_HEIGHT_NAMED) {
    return { 'max-height': MAX_HEIGHT_NAMED[value] };
  }

  // Numeric scale
  if (value in NUMERIC_SCALE) {
    return { 'max-height': NUMERIC_SCALE[value] };
  }

  return null;
};

// ─── Size Utility Generator (width + height simultaneously) ───────────────────

const sizeGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  const { value, arbitrary } = parsed;
  if (!value) return null;

  let resolved: string | null = null;

  // Arbitrary value
  if (arbitrary && value.startsWith('[') && value.endsWith(']')) {
    resolved = value.slice(1, -1);
  }

  // Use width special values (auto, full, min, max, fit)
  if (resolved === null && value in WIDTH_SPECIAL) {
    resolved = WIDTH_SPECIAL[value];
  }

  // Numeric scale
  if (resolved === null && value in NUMERIC_SCALE) {
    resolved = NUMERIC_SCALE[value];
  }

  // Fractions
  if (resolved === null && value in FRACTION_VALUES) {
    resolved = FRACTION_VALUES[value];
  }

  if (resolved === null) return null;

  return {
    width: resolved,
    height: resolved,
  };
};

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register all sizing utility generators with the global registry.
 * Call this during library initialization.
 */
export function registerSizingUtilities(): void {
  registerUtilities([
    ['w', widthGenerator],
    ['min-w', minWidthGenerator],
    ['max-w', maxWidthGenerator],
    ['h', heightGenerator],
    ['min-h', minHeightGenerator],
    ['max-h', maxHeightGenerator],
    ['size', sizeGenerator],
  ]);
}

// Export for testing
export {
  NUMERIC_SCALE,
  FRACTION_VALUES,
  WIDTH_SPECIAL,
  HEIGHT_SPECIAL,
  MAX_WIDTH_NAMED,
  MIN_WIDTH_NAMED,
  MIN_HEIGHT_NAMED,
  MAX_HEIGHT_NAMED,
  widthGenerator,
  minWidthGenerator,
  maxWidthGenerator,
  heightGenerator,
  minHeightGenerator,
  maxHeightGenerator,
  sizeGenerator,
};
