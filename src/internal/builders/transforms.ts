/**
 * Transform Utilities Builder
 * Generates scale, rotate, translate, skew, and transform-origin utilities
 *
 * @internal
 */

import type { ParsedClass } from '../parser';
import { registerUtilities, type UtilityGenerator } from '../generator';

// ─── Scale Scale ──────────────────────────────────────────────────────────────

/** Maps scale value → CSS scale factor */
const SCALE_VALUES: Record<string, string> = {
  '0': '0',
  '50': '0.5',
  '75': '0.75',
  '90': '0.9',
  '95': '0.95',
  '100': '1',
  '105': '1.05',
  '110': '1.1',
  '125': '1.25',
  '150': '1.5',
};

// ─── Rotate Scale ─────────────────────────────────────────────────────────────

/** Maps rotate value → degrees */
const ROTATE_VALUES: Record<string, string> = {
  '0': '0deg',
  '1': '1deg',
  '2': '2deg',
  '3': '3deg',
  '6': '6deg',
  '12': '12deg',
  '45': '45deg',
  '90': '90deg',
  '180': '180deg',
};

/** Maps perspective value -> CSS value */
const PERSPECTIVE_VALUES: Record<string, string> = {
  '100': '100px',
  '200': '200px',
  '500': '500px',
  '1000': '1000px',
  '2000': '2000px',
};

// ─── Translate Scale (spacing scale) ──────────────────────────────────────────

/** Maps translate value → CSS value (spacing scale + fractions + special) */
const TRANSLATE_VALUES: Record<string, string> = {
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
  // Fraction values
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  // Special values
  'full': '100%',
};

// ─── Skew Scale ───────────────────────────────────────────────────────────────

/** Maps skew value → degrees */
const SKEW_VALUES: Record<string, string> = {
  '0': '0deg',
  '1': '1deg',
  '2': '2deg',
  '3': '3deg',
  '6': '6deg',
  '12': '12deg',
};

// ─── Transform Origin Values ──────────────────────────────────────────────────

/** Maps origin keyword → CSS transform-origin value */
const ORIGIN_VALUES: Record<string, string> = {
  'center': 'center',
  'top': 'top',
  'top-right': 'top right',
  'right': 'right',
  'bottom-right': 'bottom right',
  'bottom': 'bottom',
  'bottom-left': 'bottom left',
  'left': 'left',
  'top-left': 'top left',
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Apply negative modifier to a value.
 * Does not negate '0px', '0deg', or '0'.
 */
function applyNegative(value: string, parsed: ParsedClass): string {
  if (!parsed.modifiers.includes('negative')) return value;
  if (value === '0px' || value === '0deg' || value === '0') return value;
  return `-${value}`;
}

// ─── Scale Generators ─────────────────────────────────────────────────────────

/** scale-* → transform: scale(value) */
const scaleGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: scale-[1.2]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { transform: `scale(${parsed.value.slice(1, -1)})` };
  }

  const factor = SCALE_VALUES[parsed.value];
  if (!factor) return null;

  return { transform: `scale(${factor})` };
};

/** scale-x-* → transform: scaleX(value) */
const scaleXGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: scale-x-[1.2]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { transform: `scaleX(${parsed.value.slice(1, -1)})` };
  }

  const factor = SCALE_VALUES[parsed.value];
  if (!factor) return null;

  return { transform: `scaleX(${factor})` };
};

/** scale-y-* → transform: scaleY(value) */
const scaleYGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: scale-y-[1.2]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { transform: `scaleY(${parsed.value.slice(1, -1)})` };
  }

  const factor = SCALE_VALUES[parsed.value];
  if (!factor) return null;

  return { transform: `scaleY(${factor})` };
};

// ─── Rotate Generator ─────────────────────────────────────────────────────────

/** rotate-* → transform: rotate(Ndeg), supports negative */
const rotateGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: rotate-[30deg]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    const rawValue = parsed.value.slice(1, -1);
    return { transform: `rotate(${applyNegative(rawValue, parsed)})` };
  }

  const degrees = ROTATE_VALUES[parsed.value];
  if (!degrees) return null;

  return { transform: `rotate(${applyNegative(degrees, parsed)})` };
};

/** rotate-x-* → transform: rotateX(Ndeg), supports negative */
const rotateXGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    const rawValue = parsed.value.slice(1, -1);
    return { transform: `rotateX(${applyNegative(rawValue, parsed)})` };
  }

  const degrees = ROTATE_VALUES[parsed.value];
  if (!degrees) return null;

  return { transform: `rotateX(${applyNegative(degrees, parsed)})` };
};

/** rotate-y-* → transform: rotateY(Ndeg), supports negative */
const rotateYGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    const rawValue = parsed.value.slice(1, -1);
    return { transform: `rotateY(${applyNegative(rawValue, parsed)})` };
  }

  const degrees = ROTATE_VALUES[parsed.value];
  if (!degrees) return null;

  return { transform: `rotateY(${applyNegative(degrees, parsed)})` };
};

// ─── Translate Generators ─────────────────────────────────────────────────────

/** translate-x-* → transform: translateX(value), supports negative */
const translateXGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: translate-x-[20px]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    const rawValue = parsed.value.slice(1, -1);
    return { transform: `translateX(${applyNegative(rawValue, parsed)})` };
  }

  const translateValue = TRANSLATE_VALUES[parsed.value];
  if (!translateValue) return null;

  return { transform: `translateX(${applyNegative(translateValue, parsed)})` };
};

/** translate-y-* → transform: translateY(value), supports negative */
const translateYGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: translate-y-[20px]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    const rawValue = parsed.value.slice(1, -1);
    return { transform: `translateY(${applyNegative(rawValue, parsed)})` };
  }

  const translateValue = TRANSLATE_VALUES[parsed.value];
  if (!translateValue) return null;

  return { transform: `translateY(${applyNegative(translateValue, parsed)})` };
};

// ─── Skew Generators ──────────────────────────────────────────────────────────

/** skew-x-* → transform: skewX(Ndeg), supports negative */
const skewXGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: skew-x-[15deg]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    const rawValue = parsed.value.slice(1, -1);
    return { transform: `skewX(${applyNegative(rawValue, parsed)})` };
  }

  const degrees = SKEW_VALUES[parsed.value];
  if (!degrees) return null;

  return { transform: `skewX(${applyNegative(degrees, parsed)})` };
};

/** skew-y-* → transform: skewY(Ndeg), supports negative */
const skewYGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: skew-y-[15deg]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    const rawValue = parsed.value.slice(1, -1);
    return { transform: `skewY(${applyNegative(rawValue, parsed)})` };
  }

  const degrees = SKEW_VALUES[parsed.value];
  if (!degrees) return null;

  return { transform: `skewY(${applyNegative(degrees, parsed)})` };
};

// ─── Transform Origin Generator ──────────────────────────────────────────────

/**
 * origin-* → transform-origin: value
 * 
 * The parser splits on last hyphen, so:
 * - "origin-center" → utility: "origin", value: "center"
 * - "origin-top-right" → utility: "origin-top", value: "right"
 * 
 * We register both "origin" for simple values and compound handlers
 * for multi-word origins like "top-right", "bottom-left", etc.
 */
const originGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: origin-[33%_75%]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'transform-origin': parsed.value.slice(1, -1).replace(/_/g, ' ') };
  }

  // Direct lookup for simple values (center, top, right, bottom, left)
  const origin = ORIGIN_VALUES[parsed.value];
  if (origin) {
    return { 'transform-origin': origin };
  }

  return null;
};

/**
 * origin-top → handles "right" and "left" sub-values for compound origins.
 * Parser: "origin-top-right" → utility: "origin-top", value: "right"
 */
const originTopGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) {
    // "origin-top" with no value (standalone)
    return { 'transform-origin': 'top' };
  }

  const compound = `top-${parsed.value}`;
  const origin = ORIGIN_VALUES[compound];
  if (origin) {
    return { 'transform-origin': origin };
  }

  return null;
};

/**
 * origin-bottom → handles "right" and "left" sub-values for compound origins.
 * Parser: "origin-bottom-right" → utility: "origin-bottom", value: "right"
 */
const originBottomGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) {
    // "origin-bottom" with no value (standalone)
    return { 'transform-origin': 'bottom' };
  }

  const compound = `bottom-${parsed.value}`;
  const origin = ORIGIN_VALUES[compound];
  if (origin) {
    return { 'transform-origin': origin };
  }

  return null;
};

/** perspective-* → perspective: value */
const perspectiveGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { perspective: parsed.value.slice(1, -1) };
  }

  const value = PERSPECTIVE_VALUES[parsed.value];
  if (!value) return null;

  return { perspective: value };
};

/** backface-* → backface-visibility: value */
const backfaceGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;
  if (parsed.value === 'hidden' || parsed.value === 'visible') {
    return { 'backface-visibility': parsed.value };
  }
  return null;
};

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register all transform utilities with the generator registry.
 * Call this during initialization.
 */
export function registerTransformUtilities(): void {
  registerUtilities([
    // Scale
    ['scale', scaleGenerator],
    ['scale-x', scaleXGenerator],
    ['scale-y', scaleYGenerator],

    // Rotate
    ['rotate', rotateGenerator],
    ['rotate-x', rotateXGenerator],
    ['rotate-y', rotateYGenerator],

    // Translate
    ['translate-x', translateXGenerator],
    ['translate-y', translateYGenerator],

    // Skew
    ['skew-x', skewXGenerator],
    ['skew-y', skewYGenerator],

    // Transform origin
    ['origin', originGenerator],
    ['origin-top', originTopGenerator],
    ['origin-bottom', originBottomGenerator],

    // 3D transform helpers
    ['perspective', perspectiveGenerator],
    ['backface', backfaceGenerator],
  ]);
}

// Export for testing
export {
  SCALE_VALUES,
  ROTATE_VALUES,
  PERSPECTIVE_VALUES,
  TRANSLATE_VALUES,
  SKEW_VALUES,
  ORIGIN_VALUES,
  applyNegative,
};
