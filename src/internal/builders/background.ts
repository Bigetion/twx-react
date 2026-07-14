/**
 * Background Utilities Builder
 * Generates background position, size, repeat, attachment, clip, origin, and gradient utilities
 *
 * @internal
 */

import type { ParsedClass } from '../parser';
import { registerUtility, type UtilityGenerator } from '../generator';

// ─── Background Position Values ───────────────────────────────────────────────

const BG_POSITION_VALUES: Record<string, string> = {
  'bottom': 'bottom',
  'center': 'center',
  'left': 'left',
  'left-bottom': 'left bottom',
  'left-top': 'left top',
  'right': 'right',
  'right-bottom': 'right bottom',
  'right-top': 'right top',
  'top': 'top',
};

// ─── Background Size Values ──────────────────────────────────────────────────

const BG_SIZE_VALUES: Record<string, string> = {
  'auto': 'auto',
  'cover': 'cover',
  'contain': 'contain',
};

// ─── Background Repeat Values ────────────────────────────────────────────────

const BG_REPEAT_VALUES: Record<string, string> = {
  'repeat': 'repeat',
  'no-repeat': 'no-repeat',
  'repeat-x': 'repeat-x',
  'repeat-y': 'repeat-y',
  'repeat-round': 'round',
  'repeat-space': 'space',
};

// ─── Background Attachment Values ────────────────────────────────────────────

const BG_ATTACHMENT_VALUES: Record<string, string> = {
  'fixed': 'fixed',
  'local': 'local',
  'scroll': 'scroll',
};

// ─── Background Clip Values ──────────────────────────────────────────────────

const BG_CLIP_VALUES: Record<string, string> = {
  'border': 'border-box',
  'padding': 'padding-box',
  'content': 'content-box',
  'text': 'text',
};

// ─── Background Origin Values ────────────────────────────────────────────────

const BG_ORIGIN_VALUES: Record<string, string> = {
  'border': 'border-box',
  'padding': 'padding-box',
  'content': 'content-box',
};

// ─── Gradient Direction Values ───────────────────────────────────────────────

const GRADIENT_DIRECTIONS: Record<string, string> = {
  't': 'to top',
  'tr': 'to top right',
  'r': 'to right',
  'br': 'to bottom right',
  'b': 'to bottom',
  'bl': 'to bottom left',
  'l': 'to left',
  'tl': 'to top left',
};

// ─── Basic Color Values (for gradient stops) ─────────────────────────────────

const BASIC_COLORS: Record<string, string> = {
  'transparent': 'transparent',
  'current': 'currentColor',
  'black': '#000000',
  'white': '#ffffff',
  'inherit': 'inherit',
};

// ─── Background Utility Generator ────────────────────────────────────────────

/**
 * bg-* generator that handles position, size, attachment, and repeat.
 * Falls through to null for unrecognized values (which may be colors handled by task 3.8).
 */
const bgGenerator: UtilityGenerator = (parsed: ParsedClass): Record<string, string> | null => {
  if (!parsed.value) return null;

  // Check background position values
  if (parsed.value in BG_POSITION_VALUES) {
    return { 'background-position': BG_POSITION_VALUES[parsed.value] };
  }

  // Check background size values
  if (parsed.value in BG_SIZE_VALUES) {
    return { 'background-size': BG_SIZE_VALUES[parsed.value] };
  }

  // Check background attachment values
  if (parsed.value in BG_ATTACHMENT_VALUES) {
    return { 'background-attachment': BG_ATTACHMENT_VALUES[parsed.value] };
  }

  // Handle arbitrary values
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    const raw = parsed.value.slice(1, -1);
    // Try to determine what kind of background value it is based on content
    if (raw.includes('url(') || raw.startsWith('linear-gradient') || raw.startsWith('radial-gradient')) {
      return { 'background-image': raw };
    }
    // Default to background for arbitrary values
    return { background: raw };
  }

  // Not a known background utility value - return null to allow other generators to handle
  return null;
};

// ─── Background Repeat Generator ─────────────────────────────────────────────

/**
 * bg-repeat → background-repeat: repeat
 * bg-no-repeat → background-repeat: no-repeat
 * bg-repeat-x → background-repeat: repeat-x
 * bg-repeat-y → background-repeat: repeat-y
 * bg-repeat-round → background-repeat: round
 * bg-repeat-space → background-repeat: space
 */
const bgRepeatGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) {
    // "bg-repeat" with no value (registered as standalone)
    return { 'background-repeat': 'repeat' };
  }
  if (parsed.value in BG_REPEAT_VALUES) {
    return { 'background-repeat': BG_REPEAT_VALUES[parsed.value] };
  }
  return null;
};

// ─── Background Clip Generator ───────────────────────────────────────────────

/**
 * bg-clip-* → background-clip
 * bg-clip-text also adds -webkit-background-clip for broader support
 */
const bgClipGenerator: UtilityGenerator = (parsed: ParsedClass): Record<string, string> | null => {
  if (!parsed.value) return null;
  if (parsed.value in BG_CLIP_VALUES) {
    if (parsed.value === 'text') {
      return {
        '-webkit-background-clip': 'text',
        'background-clip': 'text',
      };
    }
    return { 'background-clip': BG_CLIP_VALUES[parsed.value] };
  }
  return null;
};

// ─── Background Origin Generator ─────────────────────────────────────────────

/**
 * bg-origin-* → background-origin
 */
const bgOriginGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) return null;
  if (parsed.value in BG_ORIGIN_VALUES) {
    return { 'background-origin': BG_ORIGIN_VALUES[parsed.value] };
  }
  return null;
};

// ─── Gradient Direction Generator ────────────────────────────────────────────

/**
 * bg-gradient-to-* → background-image: linear-gradient(to <direction>, var(--tw-gradient-stops))
 */
const bgGradientToGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) return null;
  if (parsed.value in GRADIENT_DIRECTIONS) {
    const direction = GRADIENT_DIRECTIONS[parsed.value];
    return {
      'background-image': `linear-gradient(${direction}, var(--tw-gradient-stops))`,
    };
  }
  return null;
};

// ─── Background None Generator ───────────────────────────────────────────────

/**
 * bg-none → background-image: none
 * Registered separately since "none" could conflict with bg color values.
 */
const bgNoneGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (parsed.value === 'none') {
    return { 'background-image': 'none' };
  }
  return null;
};

// ─── Gradient Color Stop Generators ──────────────────────────────────────────

/**
 * Resolve a basic color value for gradient stops.
 * Supports: transparent, current, black, white, inherit.
 * The value might come as "transparent", "black", etc. from the parser.
 */
function resolveGradientColor(parsed: ParsedClass): string | null {
  if (!parsed.value) return null;

  // Check basic color keywords
  if (parsed.value in BASIC_COLORS) {
    return BASIC_COLORS[parsed.value];
  }

  // Handle arbitrary color values like [#ff0000]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return parsed.value.slice(1, -1);
  }

  return null;
}

/**
 * from-* → sets --tw-gradient-from and --tw-gradient-stops
 */
const fromGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  const color = resolveGradientColor(parsed);
  if (!color) return null;
  return {
    '--tw-gradient-from': color,
    '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
  };
};

/**
 * via-* → sets --tw-gradient-via and updates --tw-gradient-stops
 */
const viaGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  const color = resolveGradientColor(parsed);
  if (!color) return null;
  return {
    '--tw-gradient-via': color,
    '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to)',
  };
};

/**
 * to-* → sets --tw-gradient-to
 */
const toGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  const color = resolveGradientColor(parsed);
  if (!color) return null;
  return {
    '--tw-gradient-to': color,
  };
};

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register all background utilities with the generator registry.
 * Call this during initialization.
 */
export function registerBackgroundUtilities(): void {
  // bg-* handles position, size, attachment, and arbitrary values
  // NOTE: bg color utilities (task 3.8) may also register under "bg" -
  // this generator returns null for unrecognized values to allow fallthrough
  registerUtility('bg', bgGenerator);

  // bg-repeat, bg-no-repeat, bg-repeat-x, bg-repeat-y, bg-repeat-round, bg-repeat-space
  registerUtility('bg-repeat', bgRepeatGenerator);
  registerUtility('bg-no-repeat', () => ({ 'background-repeat': 'no-repeat' }));
  registerUtility('bg-repeat-x', () => ({ 'background-repeat': 'repeat-x' }));
  registerUtility('bg-repeat-y', () => ({ 'background-repeat': 'repeat-y' }));
  registerUtility('bg-repeat-round', () => ({ 'background-repeat': 'round' }));
  registerUtility('bg-repeat-space', () => ({ 'background-repeat': 'space' }));

  // bg-clip-* → background-clip
  registerUtility('bg-clip', bgClipGenerator);

  // bg-origin-* → background-origin
  registerUtility('bg-origin', bgOriginGenerator);

  // bg-gradient-to-* → linear-gradient
  registerUtility('bg-gradient-to', bgGradientToGenerator);

  // bg-none → background-image: none
  registerUtility('bg-none', bgNoneGenerator);

  // Gradient color stops
  registerUtility('from', fromGenerator);
  registerUtility('via', viaGenerator);
  registerUtility('to', toGenerator);
}

// Export for testing
export {
  BG_POSITION_VALUES,
  BG_SIZE_VALUES,
  BG_REPEAT_VALUES,
  BG_ATTACHMENT_VALUES,
  BG_CLIP_VALUES,
  BG_ORIGIN_VALUES,
  GRADIENT_DIRECTIONS,
  BASIC_COLORS,
};
