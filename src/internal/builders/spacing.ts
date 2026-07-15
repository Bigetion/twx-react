/**
 * Spacing Utilities Builder
 * Generates margin, padding, gap, and space-between utilities
 *
 * @internal
 */

import type { ParsedClass } from '../parser';
import { registerUtilities, type UtilityGenerator } from '../generator';

// ─── Spacing Scale ────────────────────────────────────────────────────────────

/**
 * Tailwind v4 spacing scale.
 * Maps scale value → CSS value.
 * - 0 = 0px
 * - px = 1px
 * - Others = value * 0.25rem
 */
const SPACING_SCALE: Record<string, string> = {
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
  'auto': 'auto',
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Resolve a spacing value from the scale or an arbitrary value.
 * Returns the CSS value string or null if not resolvable.
 */
function resolveSpacingValue(parsed: ParsedClass): string | null {
  if (!parsed.value) return null;

  // Arbitrary value: [200px], [2.5rem], [calc(100%-2rem)]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return parsed.value.slice(1, -1);
  }

  const scaleValue = SPACING_SCALE[parsed.value];
  if (!scaleValue) return null;

  return scaleValue;
}

/**
 * Negate a CSS value if the parsed class has a 'negative' modifier.
 * Does not negate 'auto' or '0px'.
 */
function applyNegative(value: string, parsed: ParsedClass): string {
  if (!parsed.modifiers.includes('negative')) return value;
  if (value === '0px' || value === 'auto') return value;
  return `-${value}`;
}

// ─── Margin Generators ────────────────────────────────────────────────────────

/** m-* → margin: value (all sides) */
const marginAll: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { margin: applyNegative(value, parsed) };
};

/** mx-* → margin-left + margin-right */
const marginX: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  const v = applyNegative(value, parsed);
  return { 'margin-left': v, 'margin-right': v };
};

/** my-* → margin-top + margin-bottom */
const marginY: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  const v = applyNegative(value, parsed);
  return { 'margin-top': v, 'margin-bottom': v };
};

/** ms-* → margin-inline-start */
const marginStart: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'margin-inline-start': applyNegative(value, parsed) };
};

/** me-* → margin-inline-end */
const marginEnd: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'margin-inline-end': applyNegative(value, parsed) };
};

/** mt-* → margin-top */
const marginTop: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'margin-top': applyNegative(value, parsed) };
};

/** mr-* → margin-right */
const marginRight: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'margin-right': applyNegative(value, parsed) };
};

/** mb-* → margin-bottom */
const marginBottom: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'margin-bottom': applyNegative(value, parsed) };
};

/** ml-* → margin-left */
const marginLeft: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'margin-left': applyNegative(value, parsed) };
};

// ─── Padding Generators ───────────────────────────────────────────────────────

/** p-* → padding: value (all sides) */
const paddingAll: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { padding: value };
};

/** px-* → padding-left + padding-right */
const paddingX: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'padding-left': value, 'padding-right': value };
};

/** py-* → padding-top + padding-bottom */
const paddingY: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'padding-top': value, 'padding-bottom': value };
};

/** ps-* → padding-inline-start */
const paddingStart: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'padding-inline-start': value };
};

/** pe-* → padding-inline-end */
const paddingEnd: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'padding-inline-end': value };
};

/** pt-* → padding-top */
const paddingTop: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'padding-top': value };
};

/** pr-* → padding-right */
const paddingRight: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'padding-right': value };
};

/** pb-* → padding-bottom */
const paddingBottom: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'padding-bottom': value };
};

/** pl-* → padding-left */
const paddingLeft: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'padding-left': value };
};

// ─── Gap Generators ───────────────────────────────────────────────────────────

/** gap-* → gap */
const gapAll: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { gap: value };
};

/** gap-x-* → column-gap */
const gapX: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'column-gap': value };
};

/** gap-y-* → row-gap */
const gapY: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  return { 'row-gap': value };
};

// ─── Space Between Generators ─────────────────────────────────────────────────

/**
 * space-x-* → uses > :not([hidden]) ~ :not([hidden]) selector pattern
 * Sets margin-left on sibling elements (via --tw-space-x-reverse pattern).
 * In Tailwind v4, this uses margin-inline-start on children.
 */
const spaceX: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  const v = applyNegative(value, parsed);
  return {
    properties: {
      'margin-inline-start': `calc(${v} * calc(1 - 2 * var(--tw-space-x-reverse, 0)))`,
    },
    selectorSuffix: ' > :not([hidden]) ~ :not([hidden])',
  };
};

/**
 * space-y-* → uses > :not([hidden]) ~ :not([hidden]) selector pattern
 * Sets margin-top on sibling elements.
 */
const spaceY: UtilityGenerator = (parsed) => {
  const value = resolveSpacingValue(parsed);
  if (!value) return null;
  const v = applyNegative(value, parsed);
  return {
    properties: {
      'margin-top': `calc(${v} * calc(1 - 2 * var(--tw-space-y-reverse, 0)))`,
    },
    selectorSuffix: ' > :not([hidden]) ~ :not([hidden])',
  };
};

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register all spacing utilities with the generator registry.
 * Call this during initialization.
 */
export function registerSpacingUtilities(): void {
  registerUtilities([
    // Margin
    ['m', marginAll],
    ['mx', marginX],
    ['my', marginY],
    ['ms', marginStart],
    ['me', marginEnd],
    ['mt', marginTop],
    ['mr', marginRight],
    ['mb', marginBottom],
    ['ml', marginLeft],

    // Padding
    ['p', paddingAll],
    ['px', paddingX],
    ['py', paddingY],
    ['ps', paddingStart],
    ['pe', paddingEnd],
    ['pt', paddingTop],
    ['pr', paddingRight],
    ['pb', paddingBottom],
    ['pl', paddingLeft],

    // Gap
    ['gap', gapAll],
    ['gap-x', gapX],
    ['gap-y', gapY],

    // Space between
    ['space-x', spaceX],
    ['space-y', spaceY],
  ]);
}

// Export for testing
export { SPACING_SCALE, resolveSpacingValue, applyNegative };
