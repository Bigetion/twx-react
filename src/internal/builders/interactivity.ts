/**
 * Interactivity Utilities Builder
 * Generates CSS for cursor, pointer-events, user-select, resize,
 * scroll, snap, touch-action, will-change, and appearance utilities
 *
 * @internal
 */

import { registerUtility, registerUtilities } from '../generator';
import type { ParsedClass } from '../parser';

// ─── Spacing Scale (for scroll-margin and scroll-padding) ────────────────────

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
};

/**
 * Resolve a spacing value from the scale or an arbitrary value.
 */
function resolveSpacingValue(parsed: ParsedClass): string | null {
  if (!parsed.value) return null;

  // Arbitrary value: [200px], [2.5rem]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return parsed.value.slice(1, -1);
  }

  const scaleValue = SPACING_SCALE[parsed.value];
  if (!scaleValue) return null;

  return scaleValue;
}

// ─── Cursor Utilities ─────────────────────────────────────────────────────────

/**
 * All cursor values. The key is the suffix after "cursor-" and the value
 * is the CSS cursor value.
 * 
 * Note: The parser splits on last hyphen, so "cursor-not-allowed" becomes
 * utility: "cursor-not", value: "allowed". We handle compound cursor names
 * by registering them as compound utilities.
 */
const CURSOR_VALUES: Record<string, string> = {
  'auto': 'auto',
  'default': 'default',
  'pointer': 'pointer',
  'wait': 'wait',
  'text': 'text',
  'move': 'move',
  'help': 'help',
  'none': 'none',
  'progress': 'progress',
  'cell': 'cell',
  'crosshair': 'crosshair',
  'alias': 'alias',
  'copy': 'copy',
  'grab': 'grab',
  'grabbing': 'grabbing',
};

/**
 * All compound cursor CSS values (values that contain hyphens).
 * These are used to handle the new parser format where cursor-not-allowed
 * is parsed as utility: "cursor", value: "not-allowed".
 */
const ALL_CURSOR_COMPOUND_VALUES = new Set([
  'not-allowed', 'context-menu', 'vertical-text', 'no-drop',
  'all-scroll', 'col-resize', 'row-resize', 'n-resize', 'e-resize',
  's-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize',
  'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize',
  'zoom-in', 'zoom-out',
]);

/**
 * Compound cursor values where the CSS value contains a hyphen.
 * These are parsed with a different utility prefix due to the parser splitting on last hyphen.
 * e.g., "cursor-not-allowed" → utility: "cursor-not", value: "allowed"
 * e.g., "cursor-col-resize" → utility: "cursor-col", value: "resize"
 */
const COMPOUND_CURSOR_MAP: Record<string, Record<string, string>> = {
  'cursor-not': {
    'allowed': 'not-allowed',
  },
  'cursor-context': {
    'menu': 'context-menu',
  },
  'cursor-vertical': {
    'text': 'vertical-text',
  },
  'cursor-no': {
    'drop': 'no-drop',
  },
  'cursor-all': {
    'scroll': 'all-scroll',
  },
  'cursor-col': {
    'resize': 'col-resize',
  },
  'cursor-row': {
    'resize': 'row-resize',
  },
  'cursor-n': {
    'resize': 'n-resize',
  },
  'cursor-e': {
    'resize': 'e-resize',
  },
  'cursor-s': {
    'resize': 's-resize',
  },
  'cursor-w': {
    'resize': 'w-resize',
  },
  'cursor-ne': {
    'resize': 'ne-resize',
  },
  'cursor-nw': {
    'resize': 'nw-resize',
  },
  'cursor-se': {
    'resize': 'se-resize',
  },
  'cursor-sw': {
    'resize': 'sw-resize',
  },
  'cursor-ew': {
    'resize': 'ew-resize',
  },
  'cursor-ns': {
    'resize': 'ns-resize',
  },
  'cursor-nesw': {
    'resize': 'nesw-resize',
  },
  'cursor-nwse': {
    'resize': 'nwse-resize',
  },
  'cursor-zoom': {
    'in': 'zoom-in',
    'out': 'zoom-out',
  },
};

// ─── Pointer Events Utilities ─────────────────────────────────────────────────

const POINTER_EVENTS_VALUES: Record<string, string> = {
  'none': 'none',
  'auto': 'auto',
};

// ─── User Select Utilities ────────────────────────────────────────────────────

const USER_SELECT_VALUES: Record<string, string> = {
  'none': 'none',
  'text': 'text',
  'all': 'all',
  'auto': 'auto',
};

// ─── Resize Utilities ─────────────────────────────────────────────────────────

const RESIZE_VALUES: Record<string, string> = {
  'none': 'none',
  'y': 'vertical',
  'x': 'horizontal',
};

// ─── Scroll Snap Type Values ──────────────────────────────────────────────────

const SNAP_TYPE_VALUES: Record<string, string> = {
  'none': 'none',
  'x': 'x var(--tw-scroll-snap-strictness)',
  'y': 'y var(--tw-scroll-snap-strictness)',
  'both': 'both var(--tw-scroll-snap-strictness)',
  'mandatory': 'mandatory',
  'proximity': 'proximity',
};

// ─── Scroll Snap Alignment Values ─────────────────────────────────────────────

const SNAP_ALIGN_VALUES: Record<string, string> = {
  'start': 'start',
  'end': 'end',
  'center': 'center',
};

// ─── Touch Action Values ──────────────────────────────────────────────────────

const TOUCH_ACTION_VALUES: Record<string, string> = {
  'auto': 'auto',
  'none': 'none',
  'manipulation': 'manipulation',
};

/**
 * All compound touch-action CSS values (values that contain hyphens).
 * These are used to handle the new parser format where touch-pan-x
 * is parsed as utility: "touch", value: "pan-x".
 */
const ALL_TOUCH_COMPOUND_VALUES = new Set([
  'pan-x', 'pan-left', 'pan-right', 'pan-y', 'pan-up', 'pan-down', 'pinch-zoom',
]);

/**
 * Compound touch action values (parsed with different utility prefix).
 * e.g., "touch-pan-x" → utility: "touch-pan", value: "x"
 * e.g., "touch-pinch-zoom" → utility: "touch-pinch", value: "zoom"
 */
const COMPOUND_TOUCH_MAP: Record<string, Record<string, string>> = {
  'touch-pan': {
    'x': 'pan-x',
    'left': 'pan-left',
    'right': 'pan-right',
    'y': 'pan-y',
    'up': 'pan-up',
    'down': 'pan-down',
  },
  'touch-pinch': {
    'zoom': 'pinch-zoom',
  },
};

// ─── Will Change Values ───────────────────────────────────────────────────────

const WILL_CHANGE_VALUES: Record<string, string> = {
  'auto': 'auto',
  'scroll': 'scroll-position',
  'contents': 'contents',
  'transform': 'transform',
};

// ─── Appearance Values ────────────────────────────────────────────────────────

const APPEARANCE_VALUES: Record<string, string> = {
  'none': 'none',
  'auto': 'auto',
};

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register all interactivity utilities with the generator registry.
 * Call during initialization to make interactivity utilities available.
 */
export function registerInteractivityUtilities(): void {
  // ── Cursor Utilities ───────────────────────────────────────────────────────

  // Simple cursor values (cursor-pointer, cursor-wait, etc.)
  // Also handles compound values now that the parser resolves them correctly
  // e.g., "cursor-not-allowed" → utility: "cursor", value: "not-allowed"
  registerUtility('cursor', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    if (parsed.value in CURSOR_VALUES) {
      return { cursor: CURSOR_VALUES[parsed.value] };
    }
    // Handle compound cursor values (e.g., "not-allowed", "col-resize", etc.)
    if (ALL_CURSOR_COMPOUND_VALUES.has(parsed.value)) {
      return { cursor: parsed.value };
    }
    return null;
  });

  // Compound cursor values via old parser format (cursor-not-allowed → utility: "cursor-not", value: "allowed")
  // Kept for backward compatibility, but the parser now resolves these correctly
  const compoundCursorEntries: [string, (parsed: ParsedClass) => Record<string, string> | null][] = [];
  for (const [prefix, valueMap] of Object.entries(COMPOUND_CURSOR_MAP)) {
    compoundCursorEntries.push([
      prefix,
      (parsed: ParsedClass) => {
        if (!parsed.value) return null;
        const cssValue = valueMap[parsed.value];
        if (!cssValue) return null;
        return { cursor: cssValue };
      },
    ]);
  }
  registerUtilities(compoundCursorEntries);

  // ── Pointer Events Utilities ───────────────────────────────────────────────

  registerUtility('pointer-events', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    if (parsed.value in POINTER_EVENTS_VALUES) {
      return { 'pointer-events': POINTER_EVENTS_VALUES[parsed.value] };
    }
    return null;
  });

  // ── User Select Utilities ──────────────────────────────────────────────────

  registerUtility('select', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    if (parsed.value in USER_SELECT_VALUES) {
      return { 'user-select': USER_SELECT_VALUES[parsed.value] };
    }
    return null;
  });

  // ── Resize Utilities ───────────────────────────────────────────────────────

  registerUtility('resize', (parsed: ParsedClass) => {
    // "resize" with no value → resize: both
    if (!parsed.value) {
      return { resize: 'both' };
    }
    if (parsed.value in RESIZE_VALUES) {
      return { resize: RESIZE_VALUES[parsed.value] };
    }
    return null;
  });

  // ── Scroll Behavior Utilities ──────────────────────────────────────────────

  registerUtility('scroll', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    if (parsed.value === 'auto') return { 'scroll-behavior': 'auto' };
    if (parsed.value === 'smooth') return { 'scroll-behavior': 'smooth' };
    return null;
  });

  // ── Scroll Margin Utilities ────────────────────────────────────────────────

  // scroll-m-{value} → scroll-margin: value
  registerUtility('scroll-m', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-margin': value };
  });

  // scroll-mx-{value} → scroll-margin-left + scroll-margin-right
  registerUtility('scroll-mx', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-margin-left': value, 'scroll-margin-right': value };
  });

  // scroll-my-{value} → scroll-margin-top + scroll-margin-bottom
  registerUtility('scroll-my', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-margin-top': value, 'scroll-margin-bottom': value };
  });

  // scroll-mt-{value} → scroll-margin-top
  registerUtility('scroll-mt', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-margin-top': value };
  });

  // scroll-mr-{value} → scroll-margin-right
  registerUtility('scroll-mr', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-margin-right': value };
  });

  // scroll-mb-{value} → scroll-margin-bottom
  registerUtility('scroll-mb', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-margin-bottom': value };
  });

  // scroll-ml-{value} → scroll-margin-left
  registerUtility('scroll-ml', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-margin-left': value };
  });

  // ── Scroll Padding Utilities ───────────────────────────────────────────────

  // scroll-p-{value} → scroll-padding: value
  registerUtility('scroll-p', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-padding': value };
  });

  // scroll-px-{value} → scroll-padding-left + scroll-padding-right
  registerUtility('scroll-px', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-padding-left': value, 'scroll-padding-right': value };
  });

  // scroll-py-{value} → scroll-padding-top + scroll-padding-bottom
  registerUtility('scroll-py', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-padding-top': value, 'scroll-padding-bottom': value };
  });

  // scroll-pt-{value} → scroll-padding-top
  registerUtility('scroll-pt', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-padding-top': value };
  });

  // scroll-pr-{value} → scroll-padding-right
  registerUtility('scroll-pr', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-padding-right': value };
  });

  // scroll-pb-{value} → scroll-padding-bottom
  registerUtility('scroll-pb', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-padding-bottom': value };
  });

  // scroll-pl-{value} → scroll-padding-left
  registerUtility('scroll-pl', (parsed: ParsedClass) => {
    const value = resolveSpacingValue(parsed);
    if (!value) return null;
    return { 'scroll-padding-left': value };
  });

  // ── Scroll Snap Type Utilities ─────────────────────────────────────────────

  registerUtility('snap', (parsed: ParsedClass): Record<string, string> | null => {
    if (!parsed.value) return null;

    // snap-none, snap-x, snap-y, snap-both
    if (parsed.value in SNAP_TYPE_VALUES) {
      const val = SNAP_TYPE_VALUES[parsed.value];
      // snap-mandatory and snap-proximity set the strictness variable
      if (parsed.value === 'mandatory' || parsed.value === 'proximity') {
        return { '--tw-scroll-snap-strictness': val };
      }
      return { 'scroll-snap-type': val };
    }

    // snap-start, snap-end, snap-center → scroll-snap-align
    if (parsed.value in SNAP_ALIGN_VALUES) {
      return { 'scroll-snap-align': SNAP_ALIGN_VALUES[parsed.value] };
    }

    // snap-normal, snap-always → scroll-snap-stop
    if (parsed.value === 'normal') {
      return { 'scroll-snap-stop': 'normal' };
    }
    if (parsed.value === 'always') {
      return { 'scroll-snap-stop': 'always' };
    }

    return null;
  });

  // snap-align-none → scroll-snap-align: none
  registerUtility('snap-align', (parsed: ParsedClass) => {
    if (parsed.value === 'none') {
      return { 'scroll-snap-align': 'none' };
    }
    return null;
  });

  // ── Touch Action Utilities ─────────────────────────────────────────────────

  // Simple touch action values (touch-auto, touch-none, touch-manipulation)
  // Also handles compound values now that the parser resolves them correctly
  // e.g., "touch-pan-x" → utility: "touch", value: "pan-x"
  registerUtility('touch', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    if (parsed.value in TOUCH_ACTION_VALUES) {
      return { 'touch-action': TOUCH_ACTION_VALUES[parsed.value] };
    }
    // Handle compound touch-action values (pan-x, pan-y, pinch-zoom, etc.)
    if (ALL_TOUCH_COMPOUND_VALUES.has(parsed.value)) {
      return { 'touch-action': parsed.value };
    }
    return null;
  });

  // Compound touch action values via old parser format (touch-pan-x → utility: "touch-pan", value: "x")
  // Kept for backward compatibility
  const compoundTouchEntries: [string, (parsed: ParsedClass) => Record<string, string> | null][] = [];
  for (const [prefix, valueMap] of Object.entries(COMPOUND_TOUCH_MAP)) {
    compoundTouchEntries.push([
      prefix,
      (parsed: ParsedClass) => {
        if (!parsed.value) return null;
        const cssValue = valueMap[parsed.value];
        if (!cssValue) return null;
        return { 'touch-action': cssValue };
      },
    ]);
  }
  registerUtilities(compoundTouchEntries);

  // ── Will Change Utilities ──────────────────────────────────────────────────

  registerUtility('will-change', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    if (parsed.value in WILL_CHANGE_VALUES) {
      return { 'will-change': WILL_CHANGE_VALUES[parsed.value] };
    }
    return null;
  });

  // ── Appearance Utilities ───────────────────────────────────────────────────

  registerUtility('appearance', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    if (parsed.value in APPEARANCE_VALUES) {
      return { appearance: APPEARANCE_VALUES[parsed.value] };
    }
    return null;
  });
}
