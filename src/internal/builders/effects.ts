/**
 * Effects Utilities Builder
 * Generates opacity, box-shadow, ring, and inset-shadow utilities
 *
 * @internal
 */

import { registerUtilities, type UtilityGenerator } from '../generator';

// ─── Opacity Scale ────────────────────────────────────────────────────────────

/** Maps opacity value → CSS decimal */
const OPACITY_SCALE: Record<string, string> = {
  '0': '0',
  '5': '0.05',
  '10': '0.1',
  '15': '0.15',
  '20': '0.2',
  '25': '0.25',
  '30': '0.3',
  '35': '0.35',
  '40': '0.4',
  '45': '0.45',
  '50': '0.5',
  '55': '0.55',
  '60': '0.6',
  '65': '0.65',
  '70': '0.7',
  '75': '0.75',
  '80': '0.8',
  '85': '0.85',
  '90': '0.9',
  '95': '0.95',
  '100': '1',
};

// ─── Box Shadow Scale ─────────────────────────────────────────────────────────

/** Maps shadow size → CSS box-shadow value */
const SHADOW_SCALE: Record<string, string> = {
  'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  'none': '0 0 #0000',
};

// ─── Inset Shadow Scale (Tailwind v4) ─────────────────────────────────────────

/** Maps inset-shadow size → CSS box-shadow value */
const INSET_SHADOW_SCALE: Record<string, string> = {
  'xs': 'inset 0 1px 1px rgb(0 0 0 / 0.05)',
  'sm': 'inset 0 2px 4px rgb(0 0 0 / 0.05)',
  'DEFAULT': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

// ─── Ring Width Scale ─────────────────────────────────────────────────────────

/** Maps ring width → CSS box-shadow value (includes white offset gap + ring color) */
const RING_WIDTH_SCALE: Record<string, string> = {
  '0': 'none',
  '1': '0 0 0 2px #fff, 0 0 0 3px rgb(59 130 246 / 0.5)',
  '2': '0 0 0 2px #fff, 0 0 0 4px rgb(59 130 246 / 0.5)',
  'DEFAULT': '0 0 0 2px #fff, 0 0 0 5px rgb(59 130 246 / 0.5)',
  '4': '0 0 0 2px #fff, 0 0 0 6px rgb(59 130 246 / 0.5)',
  '8': '0 0 0 2px #fff, 0 0 0 10px rgb(59 130 246 / 0.5)',
};

// ─── Ring Offset Scale ────────────────────────────────────────────────────────

/** Maps ring-offset width → CSS value */
const RING_OFFSET_SCALE: Record<string, string> = {
  '0': '0px',
  '1': '1px',
  '2': '2px',
  '4': '4px',
  '8': '8px',
};

// ─── Opacity Generator ────────────────────────────────────────────────────────

/** opacity-* → opacity: value */
const opacityGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: opacity-[0.33]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { opacity: parsed.value.slice(1, -1) };
  }

  const opacity = OPACITY_SCALE[parsed.value];
  if (!opacity) return null;

  return { opacity };
};

// ─── Shadow Generator ─────────────────────────────────────────────────────────

/** shadow / shadow-* → box-shadow: value */
const shadowGenerator: UtilityGenerator = (parsed) => {
  // "shadow" with no value → DEFAULT
  if (!parsed.value) {
    return { 'box-shadow': SHADOW_SCALE['DEFAULT'] };
  }

  // Arbitrary value: shadow-[0_4px_6px_rgba(0,0,0,0.1)]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'box-shadow': parsed.value.slice(1, -1).replace(/_/g, ' ') };
  }

  const shadow = SHADOW_SCALE[parsed.value];
  if (!shadow) return null;

  return { 'box-shadow': shadow };
};

// ─── Text Shadow Generator ──────────────────────────────────────────────────

/** text-shadow / text-shadow-* → text-shadow: value */
const textShadowGenerator: UtilityGenerator = (parsed) => {
  // No value → none (default)
  if (!parsed.value) {
    return { 'text-shadow': 'none' };
  }

  // Named sizes
  if (parsed.value === 'sm') return { 'text-shadow': '0 1px 1px rgba(0,0,0,0.05)' };
  if (parsed.value === 'DEFAULT' || parsed.value === 'md') return { 'text-shadow': '0 2px 4px rgba(0,0,0,0.1)' };
  if (parsed.value === 'lg') return { 'text-shadow': '0 4px 8px rgba(0,0,0,0.12)' };

  // Arbitrary value: text-shadow-[0_1px_2px_rgba(0,0,0,0.1)]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'text-shadow': parsed.value.slice(1, -1).replace(/_/g, ' ') };
  }

  return null;
};

// ─── Inset Shadow Generator (Tailwind v4) ─────────────────────────────────────

/** inset-shadow / inset-shadow-* → box-shadow: inset ... */
const insetShadowGenerator: UtilityGenerator = (parsed) => {
  // "inset-shadow" with no value → DEFAULT
  if (!parsed.value) {
    return { 'box-shadow': INSET_SHADOW_SCALE['DEFAULT'] };
  }

  // Arbitrary value
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'box-shadow': parsed.value.slice(1, -1) };
  }

  const shadow = INSET_SHADOW_SCALE[parsed.value];
  if (!shadow) return null;

  return { 'box-shadow': shadow };
};

// ─── Ring Generator ───────────────────────────────────────────────────────────

/**
 * ring / ring-* → box-shadow with offset gap + ring
 * 
 * Produces a stacked box-shadow:
 * 1. White offset gap (uses --tw-ring-offset-width if set, defaults to 2px when ring-offset is used)
 * 2. The actual ring with color
 * 
 * Since CSS variables aren't guaranteed in a runtime system, the ring always
 * includes a 2px white offset gap for visual separation from the element.
 */
const ringGenerator: UtilityGenerator = (parsed) => {
  // "ring" with no value → default blue ring with offset
  if (!parsed.value) {
    return { 'box-shadow': '0 0 0 2px #fff, 0 0 0 5px rgb(59 130 246 / 0.5)' };
  }

  // ring-inset → --tw-ring-inset: inset
  if (parsed.value === 'inset') {
    return { '--tw-ring-inset': 'inset' } as Record<string, string>;
  }

  // Arbitrary value: ring-[3px]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    const width = parsed.value.slice(1, -1);
    return { 'box-shadow': `0 0 0 2px #fff, 0 0 0 calc(2px + ${width}) rgb(59 130 246 / 0.5)` };
  }

  const ring = RING_WIDTH_SCALE[parsed.value];
  if (!ring) return null;

  return { 'box-shadow': ring };
};

// ─── Ring Offset Generator ────────────────────────────────────────────────────

/** ring-offset-* → stacked box-shadow: white offset gap + default ring outside */
const ringOffsetGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: ring-offset-[3px]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    const offset = parsed.value.slice(1, -1);
    return { '--tw-ring-offset-width': offset };
  }

  const offset = RING_OFFSET_SCALE[parsed.value];
  if (!offset) return null;

  // Just store the offset width — the actual visual effect comes from 
  // combining with ring utilities via the ring generator
  return { '--tw-ring-offset-width': offset };
};

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register all effects utilities with the generator registry.
 * Call this during initialization.
 */
export function registerEffectsUtilities(): void {
  registerUtilities([
    // Opacity
    ['opacity', opacityGenerator],

    // Box shadow
    ['shadow', shadowGenerator],

    // Inset shadow (Tailwind v4)
    ['inset-shadow', insetShadowGenerator],

    // Ring
    ['ring', ringGenerator],

    // Ring offset
    ['ring-offset', ringOffsetGenerator],
    // Text shadow
    ['text-shadow', textShadowGenerator],
    // Shadow color variants (shadow-{family}-{shade}) will be registered by colors builder via dynamic generators
  ]);
}

// Export for testing
export {
  OPACITY_SCALE,
  SHADOW_SCALE,
  INSET_SHADOW_SCALE,
  RING_WIDTH_SCALE,
  RING_OFFSET_SCALE,
};
