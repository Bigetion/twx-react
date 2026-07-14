/**
 * Typography Utilities Builder
 * Generates CSS for font size, weight, family, line-height, letter-spacing,
 * text alignment, text decoration, text transform, text overflow,
 * whitespace, and word break utilities.
 *
 * @internal
 */

import type { ParsedClass } from '../parser';
import { registerUtility, registerUtilities } from '../generator';

// ─── Font Size Scale ──────────────────────────────────────────────────────────

/**
 * Font size utilities with default line-height.
 * Maps size name → [font-size, line-height]
 */
const FONT_SIZE_SCALE: Record<string, [string, string]> = {
  'xs': ['0.75rem', '1rem'],
  'sm': ['0.875rem', '1.25rem'],
  'base': ['1rem', '1.5rem'],
  'lg': ['1.125rem', '1.75rem'],
  'xl': ['1.25rem', '1.75rem'],
  '2xl': ['1.5rem', '2rem'],
  '3xl': ['1.875rem', '2.25rem'],
  '4xl': ['2.25rem', '2.5rem'],
  '5xl': ['3rem', '1'],
  '6xl': ['3.75rem', '1'],
  '7xl': ['4.5rem', '1'],
  '8xl': ['6rem', '1'],
  '9xl': ['8rem', '1'],
};

// ─── Font Weight Scale ────────────────────────────────────────────────────────

/** Font weight utilities: suffix → CSS font-weight value */
const FONT_WEIGHT_SCALE: Record<string, string> = {
  'thin': '100',
  'extralight': '200',
  'light': '300',
  'normal': '400',
  'medium': '500',
  'semibold': '600',
  'bold': '700',
  'extrabold': '800',
  'black': '900',
};

// ─── Font Family ──────────────────────────────────────────────────────────────

/** Font family utilities: suffix → CSS font-family value */
const FONT_FAMILY: Record<string, string> = {
  'sans': 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  'serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  'mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

// ─── Line Height Scale ────────────────────────────────────────────────────────

/** Named line-height utilities */
const LINE_HEIGHT_NAMED: Record<string, string> = {
  'none': '1',
  'tight': '1.25',
  'snug': '1.375',
  'normal': '1.5',
  'relaxed': '1.625',
  'loose': '2',
};

/** Numeric line-height utilities (leading-3 through leading-10) */
const LINE_HEIGHT_NUMERIC: Record<string, string> = {
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
};

// ─── Letter Spacing Scale ─────────────────────────────────────────────────────

/** Letter spacing utilities: suffix → CSS letter-spacing value */
const LETTER_SPACING: Record<string, string> = {
  'tighter': '-0.05em',
  'tight': '-0.025em',
  'normal': '0em',
  'wide': '0.025em',
  'wider': '0.05em',
  'widest': '0.1em',
};

// ─── Text Alignment Values ────────────────────────────────────────────────────

/** Text alignment values that can follow "text-" prefix */
const TEXT_ALIGNMENT: Record<string, string> = {
  'left': 'left',
  'center': 'center',
  'right': 'right',
  'justify': 'justify',
  'start': 'start',
  'end': 'end',
};

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register all typography utilities with the generator registry.
 * Call during initialization to make typography utilities available.
 */
export function registerTypographyUtilities(): void {
  // ── "text" utility (handles font-size AND text-alignment) ──────────────────
  // The parser parses "text-center" as utility: "text", value: "center"
  // and "text-xs" as utility: "text", value: "xs"
  // We need to disambiguate between font-size and text-alignment.
  registerUtility('text', (parsed: ParsedClass): Record<string, string> | null => {
    if (!parsed.value) return null;

    // Check if it's a font-size value
    if (parsed.value in FONT_SIZE_SCALE) {
      const [fontSize, lineHeight] = FONT_SIZE_SCALE[parsed.value];
      return { 'font-size': fontSize, 'line-height': lineHeight };
    }

    // Check if it's a text-alignment value
    if (parsed.value in TEXT_ALIGNMENT) {
      return { 'text-align': TEXT_ALIGNMENT[parsed.value] };
    }

    // Check if it's a text-overflow value
    if (parsed.value === 'ellipsis') {
      return { 'text-overflow': 'ellipsis' };
    }
    if (parsed.value === 'clip') {
      return { 'text-overflow': 'clip' };
    }

    // Not handled here (could be text-color, handled by color builder)
    return null;
  });

  // ── "font" utility (handles font-weight AND font-family) ───────────────────
  // "font-bold" → utility: "font", value: "bold"
  // "font-sans" → utility: "font", value: "sans"
  registerUtility('font', (parsed: ParsedClass): Record<string, string> | null => {
    if (!parsed.value) return null;

    // Check font-weight
    if (parsed.value in FONT_WEIGHT_SCALE) {
      return { 'font-weight': FONT_WEIGHT_SCALE[parsed.value] };
    }

    // Check font-family
    if (parsed.value in FONT_FAMILY) {
      return { 'font-family': FONT_FAMILY[parsed.value] };
    }

    return null;
  });

  // ── Line height utilities (leading-*) ──────────────────────────────────────
  registerUtility('leading', (parsed: ParsedClass) => {
    if (!parsed.value) return null;

    // Check named values
    if (parsed.value in LINE_HEIGHT_NAMED) {
      return { 'line-height': LINE_HEIGHT_NAMED[parsed.value] };
    }

    // Check numeric values
    if (parsed.value in LINE_HEIGHT_NUMERIC) {
      return { 'line-height': LINE_HEIGHT_NUMERIC[parsed.value] };
    }

    // Arbitrary value
    if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
      return { 'line-height': parsed.value.slice(1, -1) };
    }

    return null;
  });

  // ── Letter spacing utilities (tracking-*) ──────────────────────────────────
  registerUtility('tracking', (parsed: ParsedClass) => {
    if (!parsed.value) return null;

    if (parsed.value in LETTER_SPACING) {
      return { 'letter-spacing': LETTER_SPACING[parsed.value] };
    }

    // Arbitrary value
    if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
      return { 'letter-spacing': parsed.value.slice(1, -1) };
    }

    return null;
  });

  // ── Text decoration utilities ──────────────────────────────────────────────
  // "underline" and "overline" parse as standalone utilities (no hyphen)
  // "line-through" parses as utility: "line", value: "through"
  // "no-underline" parses as utility: "no", value: "underline"
  registerUtilities([
    ['underline', () => ({ 'text-decoration-line': 'underline' })],
    ['overline', () => ({ 'text-decoration-line': 'overline' })],
  ]);

  registerUtility('line', (parsed: ParsedClass): Record<string, string> | null => {
    if (parsed.value === 'through') {
      return { 'text-decoration-line': 'line-through' };
    }
    return null;
  });

  registerUtility('no', (parsed: ParsedClass): Record<string, string> | null => {
    if (parsed.value === 'underline') {
      return { 'text-decoration-line': 'none' };
    }
    return null;
  });

  // ── Text transform utilities ───────────────────────────────────────────────
  // "uppercase", "lowercase", "capitalize" parse as standalone (no hyphen)
  // "normal-case" parses as utility: "normal", value: "case"
  registerUtilities([
    ['uppercase', () => ({ 'text-transform': 'uppercase' })],
    ['lowercase', () => ({ 'text-transform': 'lowercase' })],
    ['capitalize', () => ({ 'text-transform': 'capitalize' })],
  ]);

  registerUtility('normal', (parsed: ParsedClass): Record<string, string> | null => {
    if (parsed.value === 'case') {
      return { 'text-transform': 'none' };
    }
    return null;
  });

  // ── Text overflow utilities ────────────────────────────────────────────────
  // "truncate" parses as standalone utility
  // "text-ellipsis" and "text-clip" are handled by the "text" utility above
  registerUtilities([
    ['truncate', () => ({
      'overflow': 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    })],
  ]);

  // ── Whitespace utilities ───────────────────────────────────────────────────
  // Parser splits on last hyphen:
  // "whitespace-normal" → utility: "whitespace", value: "normal"
  // "whitespace-nowrap" → utility: "whitespace", value: "nowrap"
  // "whitespace-pre" → utility: "whitespace", value: "pre"
  // "whitespace-pre-line" → utility: "whitespace-pre", value: "line"
  // "whitespace-pre-wrap" → utility: "whitespace-pre", value: "wrap"
  // "whitespace-break-spaces" → utility: "whitespace-break", value: "spaces"
  registerUtility('whitespace', (parsed: ParsedClass) => {
    if (!parsed.value) return null;

    const WHITESPACE_VALUES: Record<string, string> = {
      'normal': 'normal',
      'nowrap': 'nowrap',
      'pre': 'pre',
    };

    if (parsed.value in WHITESPACE_VALUES) {
      return { 'white-space': WHITESPACE_VALUES[parsed.value] };
    }

    return null;
  });

  registerUtility('whitespace-pre', (parsed: ParsedClass): Record<string, string> | null => {
    if (parsed.value === 'line') {
      return { 'white-space': 'pre-line' };
    }
    if (parsed.value === 'wrap') {
      return { 'white-space': 'pre-wrap' };
    }
    return null;
  });

  registerUtility('whitespace-break', (parsed: ParsedClass): Record<string, string> | null => {
    if (parsed.value === 'spaces') {
      return { 'white-space': 'break-spaces' };
    }
    return null;
  });

  // ── Word break utilities ───────────────────────────────────────────────────
  // Parser splits "break-normal" as utility: "break", value: "normal"
  // "break-words" → utility: "break", value: "words"
  // "break-all" → utility: "break", value: "all"
  // "break-keep" → utility: "break", value: "keep"
  registerUtility('break', (parsed: ParsedClass): Record<string, string> | null => {
    if (!parsed.value) return null;

    switch (parsed.value) {
      case 'normal':
        return { 'overflow-wrap': 'normal', 'word-break': 'normal' };
      case 'words':
        return { 'overflow-wrap': 'break-word' };
      case 'all':
        return { 'word-break': 'break-all' };
      case 'keep':
        return { 'word-break': 'keep-all' };
      default:
        return null;
    }
  });
}

// Export scales for testing
export {
  FONT_SIZE_SCALE,
  FONT_WEIGHT_SCALE,
  FONT_FAMILY,
  LINE_HEIGHT_NAMED,
  LINE_HEIGHT_NUMERIC,
  LETTER_SPACING,
  TEXT_ALIGNMENT,
};
