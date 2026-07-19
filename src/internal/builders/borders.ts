/**
 * Border Utilities Builder
 * Generates border width, border style, border radius, divide, and outline utilities.
 *
 * @internal
 */

import type { ParsedClass } from '../parser';
import { registerUtilities, type UtilityGenerator } from '../generator';

// ─── Border Width Scale ───────────────────────────────────────────────────────

const BORDER_WIDTH_SCALE: Record<string, string> = {
  '0': '0px',
  '2': '2px',
  '4': '4px',
  '8': '8px',
};

// ─── Border Radius Scale ──────────────────────────────────────────────────────

const BORDER_RADIUS_SCALE: Record<string, string> = {
  'none': '0px',
  'sm': '0.125rem',
  'DEFAULT': '0.25rem',
  'md': '0.375rem',
  'lg': '0.5rem',
  'xl': '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  'full': '9999px',
};

// ─── Border Style Values ──────────────────────────────────────────────────────

const BORDER_STYLES = ['solid', 'dashed', 'dotted', 'double', 'hidden', 'none'] as const;

// ─── Helper: Resolve border width value ───────────────────────────────────────

/**
 * Resolve a border width from the scale.
 * If value is undefined, returns '1px' (the default).
 * If value is in the scale, returns the mapped value.
 * Otherwise returns null.
 */
function resolveBorderWidth(value: string | undefined): string | null {
  if (value === undefined) return '1px';
  if (value in BORDER_WIDTH_SCALE) return BORDER_WIDTH_SCALE[value];
  return null;
}

/**
 * Resolve a border radius value from the scale.
 * If value is undefined, returns the DEFAULT value (0.25rem).
 * If value is in the scale, returns the mapped value.
 * Otherwise returns null.
 */
function resolveBorderRadius(value: string | undefined): string | null {
  if (value === undefined) return BORDER_RADIUS_SCALE['DEFAULT'];
  if (value in BORDER_RADIUS_SCALE) return BORDER_RADIUS_SCALE[value];
  return null;
}

// ─── Border Width Generators ──────────────────────────────────────────────────

/**
 * border → border-width (handles both width and style)
 * - border (no value) → border-width: 1px
 * - border-0, border-2, border-4, border-8 → border-width: Npx
 * - border-solid, border-dashed, etc. → border-style: value
 */
const borderAll: UtilityGenerator = (parsed: ParsedClass): Record<string, string> | null => {
  const { value } = parsed;

  // No value → default border-width: 1px
  if (value === undefined) {
    return { 'border-width': '1px' };
  }

  // Check if value is a border style
  if ((BORDER_STYLES as readonly string[]).includes(value)) {
    return { 'border-style': value };
  }

  // Check numeric border width
  const width = resolveBorderWidth(value);
  if (width !== null) return { 'border-width': width };

  return null;
};

/** border-t → border-top-width */
const borderTop: UtilityGenerator = (parsed: ParsedClass) => {
  const width = resolveBorderWidth(parsed.value);
  if (width === null) return null;
  return { 'border-top-width': width };
};

/** border-r → border-right-width */
const borderRight: UtilityGenerator = (parsed: ParsedClass) => {
  const width = resolveBorderWidth(parsed.value);
  if (width === null) return null;
  return { 'border-right-width': width };
};

/** border-b → border-bottom-width */
const borderBottom: UtilityGenerator = (parsed: ParsedClass) => {
  const width = resolveBorderWidth(parsed.value);
  if (width === null) return null;
  return { 'border-bottom-width': width };
};

/** border-l → border-left-width */
const borderLeft: UtilityGenerator = (parsed: ParsedClass) => {
  const width = resolveBorderWidth(parsed.value);
  if (width === null) return null;
  return { 'border-left-width': width };
};

/** border-x → border-left-width + border-right-width */
const borderX: UtilityGenerator = (parsed: ParsedClass) => {
  const width = resolveBorderWidth(parsed.value);
  if (width === null) return null;
  return { 'border-left-width': width, 'border-right-width': width };
};

/** border-y → border-top-width + border-bottom-width */
const borderY: UtilityGenerator = (parsed: ParsedClass) => {
  const width = resolveBorderWidth(parsed.value);
  if (width === null) return null;
  return { 'border-top-width': width, 'border-bottom-width': width };
};

// ─── Border Style Generators ──────────────────────────────────────────────────

/** border-solid → border-style: solid */
const borderSolid: UtilityGenerator = () => ({ 'border-style': 'solid' });

/** border-dashed → border-style: dashed */
const borderDashed: UtilityGenerator = () => ({ 'border-style': 'dashed' });

/** border-dotted → border-style: dotted */
const borderDotted: UtilityGenerator = () => ({ 'border-style': 'dotted' });

/** border-double → border-style: double */
const borderDouble: UtilityGenerator = () => ({ 'border-style': 'double' });

/** border-hidden → border-style: hidden */
const borderHidden: UtilityGenerator = () => ({ 'border-style': 'hidden' });

/** border-none → border-style: none */
const borderNone: UtilityGenerator = () => ({ 'border-style': 'none' });

// ─── Border Radius Generators ─────────────────────────────────────────────────

/** rounded → border-radius */
const rounded: UtilityGenerator = (parsed: ParsedClass) => {
  const radius = resolveBorderRadius(parsed.value);
  if (radius === null) return null;
  return { 'border-radius': radius };
};

/** rounded-t-* → border-top-left-radius + border-top-right-radius */
const roundedTop: UtilityGenerator = (parsed: ParsedClass) => {
  const radius = resolveBorderRadius(parsed.value);
  if (radius === null) return null;
  return { 'border-top-left-radius': radius, 'border-top-right-radius': radius };
};

/** rounded-r-* → border-top-right-radius + border-bottom-right-radius */
const roundedRight: UtilityGenerator = (parsed: ParsedClass) => {
  const radius = resolveBorderRadius(parsed.value);
  if (radius === null) return null;
  return { 'border-top-right-radius': radius, 'border-bottom-right-radius': radius };
};

/** rounded-b-* → border-bottom-left-radius + border-bottom-right-radius */
const roundedBottom: UtilityGenerator = (parsed: ParsedClass) => {
  const radius = resolveBorderRadius(parsed.value);
  if (radius === null) return null;
  return { 'border-bottom-left-radius': radius, 'border-bottom-right-radius': radius };
};

/** rounded-l-* → border-top-left-radius + border-bottom-left-radius */
const roundedLeft: UtilityGenerator = (parsed: ParsedClass) => {
  const radius = resolveBorderRadius(parsed.value);
  if (radius === null) return null;
  return { 'border-top-left-radius': radius, 'border-bottom-left-radius': radius };
};

/** rounded-tl-* → border-top-left-radius */
const roundedTopLeft: UtilityGenerator = (parsed: ParsedClass) => {
  const radius = resolveBorderRadius(parsed.value);
  if (radius === null) return null;
  return { 'border-top-left-radius': radius };
};

/** rounded-tr-* → border-top-right-radius */
const roundedTopRight: UtilityGenerator = (parsed: ParsedClass) => {
  const radius = resolveBorderRadius(parsed.value);
  if (radius === null) return null;
  return { 'border-top-right-radius': radius };
};

/** rounded-bl-* → border-bottom-left-radius */
const roundedBottomLeft: UtilityGenerator = (parsed: ParsedClass) => {
  const radius = resolveBorderRadius(parsed.value);
  if (radius === null) return null;
  return { 'border-bottom-left-radius': radius };
};

/** rounded-br-* → border-bottom-right-radius */
const roundedBottomRight: UtilityGenerator = (parsed: ParsedClass) => {
  const radius = resolveBorderRadius(parsed.value);
  if (radius === null) return null;
  return { 'border-bottom-right-radius': radius };
};

// ─── Divide Generators ────────────────────────────────────────────────────────

/**
 * divide-x → Applied on > :not([hidden]) ~ :not([hidden])
 * Uses reverse variable to flip border direction when needed.
 */
const divideX: UtilityGenerator = (parsed: ParsedClass) => {
  const width = resolveBorderWidth(parsed.value);
  if (width === null) return null;

  return {
    properties: {
      'border-left-width': `calc(${width} * calc(1 - var(--tw-divide-x-reverse, 0)))`,
      'border-right-width': `calc(${width} * var(--tw-divide-x-reverse, 0))`,
      'border-style': 'solid',
    },
    selectorSuffix: ' > :not([hidden]) ~ :not([hidden])',
  };
};

/**
 * divide-y → Applied on > :not([hidden]) ~ :not([hidden])
 * Uses reverse variable to flip border direction when needed.
 */
const divideY: UtilityGenerator = (parsed: ParsedClass) => {
  const width = resolveBorderWidth(parsed.value);
  if (width === null) return null;

  return {
    properties: {
      'border-top-width': `calc(${width} * calc(1 - var(--tw-divide-y-reverse, 0)))`,
      'border-bottom-width': `calc(${width} * var(--tw-divide-y-reverse, 0))`,
      'border-style': 'solid',
    },
    selectorSuffix: ' > :not([hidden]) ~ :not([hidden])',
  };
};

const DIVIDE_SELECTOR_SUFFIX = ' > :not([hidden]) ~ :not([hidden])';

/** divide-solid → border-style: solid */
const divideSolid: UtilityGenerator = () => ({
  properties: { 'border-style': 'solid' },
  selectorSuffix: DIVIDE_SELECTOR_SUFFIX,
});

/** divide-dashed → border-style: dashed */
const divideDashed: UtilityGenerator = () => ({
  properties: { 'border-style': 'dashed' },
  selectorSuffix: DIVIDE_SELECTOR_SUFFIX,
});

/** divide-dotted → border-style: dotted */
const divideDotted: UtilityGenerator = () => ({
  properties: { 'border-style': 'dotted' },
  selectorSuffix: DIVIDE_SELECTOR_SUFFIX,
});

/** divide-double → border-style: double */
const divideDouble: UtilityGenerator = () => ({
  properties: { 'border-style': 'double' },
  selectorSuffix: DIVIDE_SELECTOR_SUFFIX,
});

/** divide-none → border-style: none */
const divideNone: UtilityGenerator = () => ({
  properties: { 'border-style': 'none' },
  selectorSuffix: DIVIDE_SELECTOR_SUFFIX,
});

// ─── Outline Generators ───────────────────────────────────────────────────────

/**
 * outline → handles both outline-style and outline-width
 * - outline (no value) → outline-style: solid
 * - outline-none → outline: 2px solid transparent; outline-offset: 2px
 * - outline-dashed → outline-style: dashed
 * - outline-dotted → outline-style: dotted
 * - outline-double → outline-style: double
 * - outline-0, outline-1, outline-2, outline-4, outline-8 → outline-width
 */
const outlineGenerator: UtilityGenerator = (parsed: ParsedClass): Record<string, string> | null => {
  const { value } = parsed;

  // No value → outline-style: solid
  if (value === undefined) {
    return { 'outline-style': 'solid' };
  }

  // outline-none → special case
  if (value === 'none') {
    return { 'outline': '2px solid transparent', 'outline-offset': '2px' };
  }

  // Outline styles
  const outlineStyles = ['dashed', 'dotted', 'double'];
  if (outlineStyles.includes(value)) {
    return { 'outline-style': value };
  }

  // Outline width values
  const outlineWidths: Record<string, string> = {
    '0': '0px',
    '1': '1px',
    '2': '2px',
    '4': '4px',
    '8': '8px',
  };
  if (value in outlineWidths) {
    return { 'outline-width': outlineWidths[value] };
  }

  return null;
};

/** outline-offset-* → outline-offset */
const outlineOffset: UtilityGenerator = (parsed: ParsedClass) => {
  const { value } = parsed;
  if (value === undefined) return null;

  const offsetValues: Record<string, string> = {
    '0': '0px',
    '1': '1px',
    '2': '2px',
    '4': '4px',
    '8': '8px',
  };

  if (value in offsetValues) {
    return { 'outline-offset': offsetValues[value] };
  }

  return null;
};

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register all border utilities with the generator registry.
 * Call this during initialization.
 */
export function registerBorderUtilities(): void {
  registerUtilities([
    // Border width (handles both width values and style values)
    ['border', borderAll],
    ['border-t', borderTop],
    ['border-r', borderRight],
    ['border-b', borderBottom],
    ['border-l', borderLeft],
    ['border-x', borderX],
    ['border-y', borderY],

    // Border style (explicit utility names for direct parsing)
    ['border-solid', borderSolid],
    ['border-dashed', borderDashed],
    ['border-dotted', borderDotted],
    ['border-double', borderDouble],
    ['border-hidden', borderHidden],
    ['border-none', borderNone],

    // Border radius
    ['rounded', rounded],
    ['rounded-t', roundedTop],
    ['rounded-r', roundedRight],
    ['rounded-b', roundedBottom],
    ['rounded-l', roundedLeft],
    ['rounded-tl', roundedTopLeft],
    ['rounded-tr', roundedTopRight],
    ['rounded-bl', roundedBottomLeft],
    ['rounded-br', roundedBottomRight],

    // Divide utilities
    ['divide-x', divideX],
    ['divide-y', divideY],
    ['divide-solid', divideSolid],
    ['divide-dashed', divideDashed],
    ['divide-dotted', divideDotted],
    ['divide-double', divideDouble],
    ['divide-none', divideNone],

    // Divide reverse variables
    ['divide-x-reverse', () => ({ '--tw-divide-x-reverse': '1' })],
    ['divide-y-reverse', () => ({ '--tw-divide-y-reverse': '1' })],

    // Outline utilities
    ['outline', outlineGenerator],
    ['outline-offset', outlineOffset],
  ]);
}

// Export for testing
export {
  BORDER_WIDTH_SCALE,
  BORDER_RADIUS_SCALE,
  resolveBorderWidth,
  resolveBorderRadius,
  borderAll,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  borderX,
  borderY,
  borderSolid,
  borderDashed,
  borderDotted,
  borderDouble,
  borderHidden,
  borderNone,
  rounded,
  roundedTop,
  roundedRight,
  roundedBottom,
  roundedLeft,
  roundedTopLeft,
  roundedTopRight,
  roundedBottomLeft,
  roundedBottomRight,
  divideX,
  divideY,
  divideSolid,
  divideDashed,
  divideDotted,
  divideDouble,
  divideNone,
  outlineGenerator,
  outlineOffset,
};
