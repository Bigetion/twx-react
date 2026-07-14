/**
 * Flexbox Utilities Builder
 * Generates CSS for flex direction, wrap, shorthand, grow/shrink,
 * alignment, and order utilities.
 *
 * @internal
 */

import { registerUtility, registerUtilities } from '../generator';
import type { ParsedClass } from '../parser';

// ─── Flex Direction Utilities ────────────────────────────────────────────────

/** Flex direction utility class names mapped to their CSS flex-direction value */
const FLEX_DIRECTION: Record<string, string> = {
  'flex-row': 'row',
  'flex-row-reverse': 'row-reverse',
  'flex-col': 'column',
  'flex-col-reverse': 'column-reverse',
};

// ─── Flex Wrap Utilities ─────────────────────────────────────────────────────

/** Flex wrap utility class names mapped to their CSS flex-wrap value */
const FLEX_WRAP: Record<string, string> = {
  'flex-wrap': 'wrap',
  'flex-wrap-reverse': 'wrap-reverse',
  'flex-nowrap': 'nowrap',
};

// ─── Flex Shorthand Utilities ────────────────────────────────────────────────

/** Flex shorthand utility class names mapped to their CSS flex value */
const FLEX_SHORTHAND: Record<string, string> = {
  'flex-1': '1 1 0%',
  'flex-auto': '1 1 auto',
  'flex-initial': '0 1 auto',
  'flex-none': 'none',
};

// ─── Alignment Utilities ─────────────────────────────────────────────────────

/** align-items values: items-* */
const ALIGN_ITEMS: Record<string, string> = {
  'start': 'flex-start',
  'end': 'flex-end',
  'center': 'center',
  'baseline': 'baseline',
  'stretch': 'stretch',
};

/** justify-content values: justify-* */
const JUSTIFY_CONTENT: Record<string, string> = {
  'start': 'flex-start',
  'end': 'flex-end',
  'center': 'center',
  'between': 'space-between',
  'around': 'space-around',
  'evenly': 'space-evenly',
  'stretch': 'stretch',
};

/** align-content values: content-* */
const ALIGN_CONTENT: Record<string, string> = {
  'start': 'flex-start',
  'end': 'flex-end',
  'center': 'center',
  'between': 'space-between',
  'around': 'space-around',
  'evenly': 'space-evenly',
  'stretch': 'stretch',
};

/** align-self values: self-* */
const ALIGN_SELF: Record<string, string> = {
  'auto': 'auto',
  'start': 'flex-start',
  'end': 'flex-end',
  'center': 'center',
  'stretch': 'stretch',
  'baseline': 'baseline',
};

/** justify-items values: justify-items-* */
const JUSTIFY_ITEMS: Record<string, string> = {
  'start': 'start',
  'end': 'end',
  'center': 'center',
  'stretch': 'stretch',
};

/** justify-self values: justify-self-* */
const JUSTIFY_SELF: Record<string, string> = {
  'auto': 'auto',
  'start': 'start',
  'end': 'end',
  'center': 'center',
  'stretch': 'stretch',
};

/** place-content values: place-content-* */
const PLACE_CONTENT: Record<string, string> = {
  'start': 'start',
  'end': 'end',
  'center': 'center',
  'between': 'space-between',
  'around': 'space-around',
  'evenly': 'space-evenly',
  'stretch': 'stretch',
};

/** place-items values: place-items-* */
const PLACE_ITEMS: Record<string, string> = {
  'start': 'start',
  'end': 'end',
  'center': 'center',
  'stretch': 'stretch',
};

/** place-self values: place-self-* */
const PLACE_SELF: Record<string, string> = {
  'auto': 'auto',
  'start': 'start',
  'end': 'end',
  'center': 'center',
  'stretch': 'stretch',
};

// ─── Order Utilities ─────────────────────────────────────────────────────────

/** Special order values */
const ORDER_SPECIAL: Record<string, string> = {
  'first': '-9999',
  'last': '9999',
  'none': '0',
};

// ─── Registration ────────────────────────────────────────────────────────────

/**
 * Register all flexbox utilities with the generator registry.
 * Call during initialization to make flexbox utilities available.
 */
export function registerFlexboxUtilities(): void {
  // ── Flex Direction Utilities ────────────────────────────────────────────────
  const directionEntries: [string, (parsed: ParsedClass) => Record<string, string> | null][] = [];

  for (const [name, value] of Object.entries(FLEX_DIRECTION)) {
    directionEntries.push([
      name,
      () => ({ 'flex-direction': value }),
    ]);
  }

  registerUtilities(directionEntries);

  // ── Flex Wrap Utilities ────────────────────────────────────────────────────
  const wrapEntries: [string, (parsed: ParsedClass) => Record<string, string> | null][] = [];

  for (const [name, value] of Object.entries(FLEX_WRAP)) {
    wrapEntries.push([
      name,
      () => ({ 'flex-wrap': value }),
    ]);
  }

  registerUtilities(wrapEntries);

  // ── Flex Shorthand Utilities ───────────────────────────────────────────────
  const shorthandEntries: [string, (parsed: ParsedClass) => Record<string, string> | null][] = [];

  for (const [name, value] of Object.entries(FLEX_SHORTHAND)) {
    shorthandEntries.push([
      name,
      () => ({ flex: value }),
    ]);
  }

  registerUtilities(shorthandEntries);

  // ── Flex Grow/Shrink Utilities ─────────────────────────────────────────────
  registerUtilities([
    ['grow', (parsed: ParsedClass) => {
      if (parsed.value === '0') return { 'flex-grow': '0' };
      // No value means "grow" (default = 1)
      if (!parsed.value) return { 'flex-grow': '1' };
      return null;
    }],
    ['shrink', (parsed: ParsedClass) => {
      if (parsed.value === '0') return { 'flex-shrink': '0' };
      // No value means "shrink" (default = 1)
      if (!parsed.value) return { 'flex-shrink': '1' };
      return null;
    }],
  ]);

  // ── Alignment: items-* (align-items) ───────────────────────────────────────
  registerUtility('items', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    const cssValue = ALIGN_ITEMS[parsed.value];
    if (!cssValue) return null;
    return { 'align-items': cssValue };
  });

  // ── Alignment: justify-* (justify-content) ────────────────────────────────
  registerUtility('justify', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    const cssValue = JUSTIFY_CONTENT[parsed.value];
    if (!cssValue) return null;
    return { 'justify-content': cssValue };
  });

  // ── Alignment: content-* (align-content) ──────────────────────────────────
  registerUtility('content', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    const cssValue = ALIGN_CONTENT[parsed.value];
    if (!cssValue) return null;
    return { 'align-content': cssValue };
  });

  // ── Alignment: self-* (align-self) ────────────────────────────────────────
  registerUtility('self', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    const cssValue = ALIGN_SELF[parsed.value];
    if (!cssValue) return null;
    return { 'align-self': cssValue };
  });

  // ── Alignment: justify-items-* (justify-items) ────────────────────────────
  registerUtility('justify-items', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    const cssValue = JUSTIFY_ITEMS[parsed.value];
    if (!cssValue) return null;
    return { 'justify-items': cssValue };
  });

  // ── Alignment: justify-self-* (justify-self) ──────────────────────────────
  registerUtility('justify-self', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    const cssValue = JUSTIFY_SELF[parsed.value];
    if (!cssValue) return null;
    return { 'justify-self': cssValue };
  });

  // ── Alignment: place-content-* (place-content) ────────────────────────────
  registerUtility('place-content', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    const cssValue = PLACE_CONTENT[parsed.value];
    if (!cssValue) return null;
    return { 'place-content': cssValue };
  });

  // ── Alignment: place-items-* (place-items) ────────────────────────────────
  registerUtility('place-items', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    const cssValue = PLACE_ITEMS[parsed.value];
    if (!cssValue) return null;
    return { 'place-items': cssValue };
  });

  // ── Alignment: place-self-* (place-self) ──────────────────────────────────
  registerUtility('place-self', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    const cssValue = PLACE_SELF[parsed.value];
    if (!cssValue) return null;
    return { 'place-self': cssValue };
  });

  // ── Order Utilities ────────────────────────────────────────────────────────
  registerUtility('order', (parsed: ParsedClass) => {
    if (!parsed.value) return null;

    // Handle arbitrary values
    if (parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
      const raw = parsed.value.slice(1, -1);
      return { order: raw };
    }

    // Check special values (first, last, none)
    if (parsed.value in ORDER_SPECIAL) {
      return { order: ORDER_SPECIAL[parsed.value] };
    }

    // Check numeric values (1-12)
    const num = parseInt(parsed.value, 10);
    if (!isNaN(num) && num >= 1 && num <= 12) {
      return { order: String(num) };
    }

    return null;
  });
}
