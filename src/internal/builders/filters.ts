/**
 * Filter Utilities Builder
 * Generates blur, brightness, contrast, grayscale, invert, sepia, hue-rotate,
 * saturate, drop-shadow, and backdrop-filter utilities.
 *
 * @internal
 */

import { registerUtilities, type UtilityGenerator } from '../generator';

// ─── Blur Scale ───────────────────────────────────────────────────────────────

/** Maps blur size → CSS blur value */
const BLUR_SCALE: Record<string, string> = {
  'none': '0',
  'sm': '4px',
  'DEFAULT': '8px',
  'md': '12px',
  'lg': '16px',
  'xl': '24px',
  '2xl': '40px',
  '3xl': '64px',
};

// ─── Brightness Scale ─────────────────────────────────────────────────────────

/** Maps brightness value → CSS brightness multiplier */
const BRIGHTNESS_SCALE: Record<string, string> = {
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
  '200': '2',
};

// ─── Contrast Scale ───────────────────────────────────────────────────────────

/** Maps contrast value → CSS contrast multiplier */
const CONTRAST_SCALE: Record<string, string> = {
  '0': '0',
  '50': '0.5',
  '75': '0.75',
  '100': '1',
  '125': '1.25',
  '150': '1.5',
  '200': '2',
};

// ─── Hue-Rotate Scale ─────────────────────────────────────────────────────────

/** Maps hue-rotate value → CSS degrees */
const HUE_ROTATE_SCALE: Record<string, string> = {
  '0': '0deg',
  '15': '15deg',
  '30': '30deg',
  '60': '60deg',
  '90': '90deg',
  '180': '180deg',
};

// ─── Saturate Scale ───────────────────────────────────────────────────────────

/** Maps saturate value → CSS saturate multiplier */
const SATURATE_SCALE: Record<string, string> = {
  '0': '0',
  '50': '0.5',
  '100': '1',
  '150': '1.5',
  '200': '2',
};

// ─── Drop Shadow Scale ────────────────────────────────────────────────────────

/** Maps drop-shadow size → CSS filter drop-shadow value */
const DROP_SHADOW_SCALE: Record<string, string> = {
  'sm': 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))',
  'DEFAULT': 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))',
  'md': 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
  'lg': 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
  'xl': 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))',
  '2xl': 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))',
  'none': 'drop-shadow(0 0 #0000)',
};

// ─── Backdrop Opacity Scale ───────────────────────────────────────────────────

/** Maps backdrop-opacity value → CSS opacity multiplier */
const BACKDROP_OPACITY_SCALE: Record<string, string> = {
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

// ─── Blur Generator ───────────────────────────────────────────────────────────

/** blur / blur-* → filter: blur(value) */
const blurGenerator: UtilityGenerator = (parsed) => {
  // "blur" with no value → DEFAULT
  if (!parsed.value) {
    return { filter: `blur(${BLUR_SCALE['DEFAULT']})` };
  }

  // Arbitrary value: blur-[20px]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { filter: `blur(${parsed.value.slice(1, -1)})` };
  }

  const blur = BLUR_SCALE[parsed.value];
  if (!blur) return null;

  return { filter: `blur(${blur})` };
};

// ─── Brightness Generator ─────────────────────────────────────────────────────

/** brightness-* → filter: brightness(value) */
const brightnessGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: brightness-[1.75]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { filter: `brightness(${parsed.value.slice(1, -1)})` };
  }

  const brightness = BRIGHTNESS_SCALE[parsed.value];
  if (!brightness) return null;

  return { filter: `brightness(${brightness})` };
};

// ─── Contrast Generator ───────────────────────────────────────────────────────

/** contrast-* → filter: contrast(value) */
const contrastGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: contrast-[1.75]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { filter: `contrast(${parsed.value.slice(1, -1)})` };
  }

  const contrast = CONTRAST_SCALE[parsed.value];
  if (!contrast) return null;

  return { filter: `contrast(${contrast})` };
};

// ─── Grayscale Generator ──────────────────────────────────────────────────────

/** grayscale / grayscale-0 → filter: grayscale(value) */
const grayscaleGenerator: UtilityGenerator = (parsed) => {
  // "grayscale" with no value → grayscale(1)
  if (!parsed.value) {
    return { filter: 'grayscale(1)' };
  }

  if (parsed.value === '0') {
    return { filter: 'grayscale(0)' };
  }

  // Arbitrary value: grayscale-[0.5]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { filter: `grayscale(${parsed.value.slice(1, -1)})` };
  }

  return null;
};

// ─── Invert Generator ─────────────────────────────────────────────────────────

/** invert / invert-0 → filter: invert(value) */
const invertGenerator: UtilityGenerator = (parsed) => {
  // "invert" with no value → invert(1)
  if (!parsed.value) {
    return { filter: 'invert(1)' };
  }

  if (parsed.value === '0') {
    return { filter: 'invert(0)' };
  }

  // Arbitrary value: invert-[0.5]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { filter: `invert(${parsed.value.slice(1, -1)})` };
  }

  return null;
};

// ─── Sepia Generator ──────────────────────────────────────────────────────────

/** sepia / sepia-0 → filter: sepia(value) */
const sepiaGenerator: UtilityGenerator = (parsed) => {
  // "sepia" with no value → sepia(1)
  if (!parsed.value) {
    return { filter: 'sepia(1)' };
  }

  if (parsed.value === '0') {
    return { filter: 'sepia(0)' };
  }

  // Arbitrary value: sepia-[0.5]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { filter: `sepia(${parsed.value.slice(1, -1)})` };
  }

  return null;
};

// ─── Hue-Rotate Generator ────────────────────────────────────────────────────

/** hue-rotate-* → filter: hue-rotate(value) */
const hueRotateGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: hue-rotate-[45deg]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { filter: `hue-rotate(${parsed.value.slice(1, -1)})` };
  }

  const degrees = HUE_ROTATE_SCALE[parsed.value];
  if (!degrees) return null;

  // Support negative values via the negative modifier
  if (parsed.modifiers.includes('negative')) {
    return { filter: `hue-rotate(-${degrees})` };
  }

  return { filter: `hue-rotate(${degrees})` };
};

// ─── Saturate Generator ───────────────────────────────────────────────────────

/** saturate-* → filter: saturate(value) */
const saturateGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: saturate-[1.75]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { filter: `saturate(${parsed.value.slice(1, -1)})` };
  }

  const saturate = SATURATE_SCALE[parsed.value];
  if (!saturate) return null;

  return { filter: `saturate(${saturate})` };
};

// ─── Drop Shadow Generator ────────────────────────────────────────────────────

/** drop-shadow / drop-shadow-* → filter: drop-shadow(...) */
const dropShadowGenerator: UtilityGenerator = (parsed) => {
  // "drop-shadow" with no value → DEFAULT
  if (!parsed.value) {
    return { filter: DROP_SHADOW_SCALE['DEFAULT'] };
  }

  // Arbitrary value: drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { filter: `drop-shadow(${parsed.value.slice(1, -1)})` };
  }

  const shadow = DROP_SHADOW_SCALE[parsed.value];
  if (!shadow) return null;

  return { filter: shadow };
};

// ─── Backdrop Filter Generators ───────────────────────────────────────────────

/** backdrop-blur / backdrop-blur-* → backdrop-filter: blur(value) */
const backdropBlurGenerator: UtilityGenerator = (parsed) => {
  // "backdrop-blur" with no value → DEFAULT
  if (!parsed.value) {
    return { 'backdrop-filter': `blur(${BLUR_SCALE['DEFAULT']})` };
  }

  // Arbitrary value
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'backdrop-filter': `blur(${parsed.value.slice(1, -1)})` };
  }

  const blur = BLUR_SCALE[parsed.value];
  if (!blur) return null;

  return { 'backdrop-filter': `blur(${blur})` };
};

/** backdrop-brightness-* → backdrop-filter: brightness(value) */
const backdropBrightnessGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'backdrop-filter': `brightness(${parsed.value.slice(1, -1)})` };
  }

  const brightness = BRIGHTNESS_SCALE[parsed.value];
  if (!brightness) return null;

  return { 'backdrop-filter': `brightness(${brightness})` };
};

/** backdrop-contrast-* → backdrop-filter: contrast(value) */
const backdropContrastGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'backdrop-filter': `contrast(${parsed.value.slice(1, -1)})` };
  }

  const contrast = CONTRAST_SCALE[parsed.value];
  if (!contrast) return null;

  return { 'backdrop-filter': `contrast(${contrast})` };
};

/** backdrop-grayscale / backdrop-grayscale-0 → backdrop-filter: grayscale(value) */
const backdropGrayscaleGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) {
    return { 'backdrop-filter': 'grayscale(1)' };
  }

  if (parsed.value === '0') {
    return { 'backdrop-filter': 'grayscale(0)' };
  }

  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'backdrop-filter': `grayscale(${parsed.value.slice(1, -1)})` };
  }

  return null;
};

/** backdrop-hue-rotate-* → backdrop-filter: hue-rotate(value) */
const backdropHueRotateGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'backdrop-filter': `hue-rotate(${parsed.value.slice(1, -1)})` };
  }

  const degrees = HUE_ROTATE_SCALE[parsed.value];
  if (!degrees) return null;

  if (parsed.modifiers.includes('negative')) {
    return { 'backdrop-filter': `hue-rotate(-${degrees})` };
  }

  return { 'backdrop-filter': `hue-rotate(${degrees})` };
};

/** backdrop-invert / backdrop-invert-0 → backdrop-filter: invert(value) */
const backdropInvertGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) {
    return { 'backdrop-filter': 'invert(1)' };
  }

  if (parsed.value === '0') {
    return { 'backdrop-filter': 'invert(0)' };
  }

  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'backdrop-filter': `invert(${parsed.value.slice(1, -1)})` };
  }

  return null;
};

/** backdrop-opacity-* → backdrop-filter: opacity(value) */
const backdropOpacityGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'backdrop-filter': `opacity(${parsed.value.slice(1, -1)})` };
  }

  const opacity = BACKDROP_OPACITY_SCALE[parsed.value];
  if (!opacity) return null;

  return { 'backdrop-filter': `opacity(${opacity})` };
};

/** backdrop-saturate-* → backdrop-filter: saturate(value) */
const backdropSaturateGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'backdrop-filter': `saturate(${parsed.value.slice(1, -1)})` };
  }

  const saturate = SATURATE_SCALE[parsed.value];
  if (!saturate) return null;

  return { 'backdrop-filter': `saturate(${saturate})` };
};

/** backdrop-sepia / backdrop-sepia-0 → backdrop-filter: sepia(value) */
const backdropSepiaGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) {
    return { 'backdrop-filter': 'sepia(1)' };
  }

  if (parsed.value === '0') {
    return { 'backdrop-filter': 'sepia(0)' };
  }

  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'backdrop-filter': `sepia(${parsed.value.slice(1, -1)})` };
  }

  return null;
};

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register all filter utilities with the generator registry.
 * Call this during initialization.
 */
export function registerFilterUtilities(): void {
  registerUtilities([
    // Filter utilities
    ['blur', blurGenerator],
    ['brightness', brightnessGenerator],
    ['contrast', contrastGenerator],
    ['grayscale', grayscaleGenerator],
    ['invert', invertGenerator],
    ['sepia', sepiaGenerator],
    ['hue-rotate', hueRotateGenerator],
    ['saturate', saturateGenerator],
    ['drop-shadow', dropShadowGenerator],

    // Backdrop filter utilities
    ['backdrop-blur', backdropBlurGenerator],
    ['backdrop-brightness', backdropBrightnessGenerator],
    ['backdrop-contrast', backdropContrastGenerator],
    ['backdrop-grayscale', backdropGrayscaleGenerator],
    ['backdrop-hue-rotate', backdropHueRotateGenerator],
    ['backdrop-invert', backdropInvertGenerator],
    ['backdrop-opacity', backdropOpacityGenerator],
    ['backdrop-saturate', backdropSaturateGenerator],
    ['backdrop-sepia', backdropSepiaGenerator],
  ]);
}

// Export for testing
export {
  BLUR_SCALE,
  BRIGHTNESS_SCALE,
  CONTRAST_SCALE,
  HUE_ROTATE_SCALE,
  SATURATE_SCALE,
  DROP_SHADOW_SCALE,
  BACKDROP_OPACITY_SCALE,
};
