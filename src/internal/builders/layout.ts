/**
 * Layout Utilities Builder
 * Generates CSS for display, position, inset, z-index, and overflow utilities
 *
 * @internal
 */

import { registerUtility, registerUtilities } from '../generator';
import type { ParsedClass } from '../parser';

// ─── Spacing Scale (shared) ──────────────────────────────────────────────────

/** Standard spacing scale: value → rem (value * 0.25rem) */
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

/** Special inset values beyond spacing scale */
const INSET_SPECIAL_VALUES: Record<string, string> = {
  'auto': 'auto',
  'full': '100%',
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
};

/**
 * Resolve an inset value from the spacing scale, special values, or arbitrary values.
 * Returns null if the value is not recognized.
 */
function resolveInsetValue(value: string | undefined, isNegative: boolean): string | null {
  if (!value) return null;

  // Handle arbitrary values like [200px]
  if (value.startsWith('[') && value.endsWith(']')) {
    const raw = value.slice(1, -1);
    return isNegative ? `-${raw}` : raw;
  }

  // Check special values
  if (value in INSET_SPECIAL_VALUES) {
    const resolved = INSET_SPECIAL_VALUES[value];
    if (resolved === 'auto') return 'auto';
    return isNegative ? `-${resolved}` : resolved;
  }

  // Check spacing scale
  if (value in SPACING_SCALE) {
    const resolved = SPACING_SCALE[value];
    if (resolved === '0px') return '0px';
    return isNegative ? `-${resolved}` : resolved;
  }

  // Check fraction values (e.g., "1/2" might be parsed differently)
  // The parser splits on last hyphen, so "1/2" would be the value part
  return null;
}

// ─── Display Utilities ───────────────────────────────────────────────────────

/** Display utility class names mapped to their CSS display value */
const DISPLAY_UTILITIES: Record<string, string> = {
  'block': 'block',
  'inline-block': 'inline-block',
  'inline': 'inline',
  'flex': 'flex',
  'inline-flex': 'inline-flex',
  'grid': 'grid',
  'inline-grid': 'inline-grid',
  'table': 'table',
  'inline-table': 'inline-table',
  'table-caption': 'table-caption',
  'table-cell': 'table-cell',
  'table-column': 'table-column',
  'table-column-group': 'table-column-group',
  'table-footer-group': 'table-footer-group',
  'table-header-group': 'table-header-group',
  'table-row-group': 'table-row-group',
  'table-row': 'table-row',
  'flow-root': 'flow-root',
  'contents': 'contents',
  'list-item': 'list-item',
  'hidden': 'none',
};

// ─── Position Utilities ──────────────────────────────────────────────────────

/** Position utility class names mapped to their CSS position value */
const POSITION_UTILITIES: Record<string, string> = {
  'static': 'static',
  'fixed': 'fixed',
  'absolute': 'absolute',
  'relative': 'relative',
  'sticky': 'sticky',
};

// ─── Z-Index Utilities ───────────────────────────────────────────────────────

/** Z-index utility values */
const Z_INDEX_VALUES: Record<string, string> = {
  '0': '0',
  '10': '10',
  '20': '20',
  '30': '30',
  '40': '40',
  '50': '50',
  'auto': 'auto',
};

// ─── Overflow Utilities ──────────────────────────────────────────────────────

/** Overflow values */
const OVERFLOW_VALUES = ['auto', 'hidden', 'clip', 'visible', 'scroll'] as const;

// ─── Registration ────────────────────────────────────────────────────────────

/**
 * Register all layout utilities with the generator registry.
 * Call during initialization to make layout utilities available.
 */
export function registerLayoutUtilities(): void {
  // ── Display Utilities ──────────────────────────────────────────────────────
  const displayEntries: [string, (parsed: ParsedClass) => Record<string, string> | null][] = [];

  for (const [name, value] of Object.entries(DISPLAY_UTILITIES)) {
    displayEntries.push([
      name,
      () => ({ display: value }),
    ]);
  }

  registerUtilities(displayEntries);

  // ── Position Utilities ─────────────────────────────────────────────────────
  const positionEntries: [string, (parsed: ParsedClass) => Record<string, string> | null][] = [];

  for (const [name, value] of Object.entries(POSITION_UTILITIES)) {
    positionEntries.push([
      name,
      () => ({ position: value }),
    ]);
  }

  registerUtilities(positionEntries);

  // ── Inset Utilities ────────────────────────────────────────────────────────

  // inset-* (all 4 sides)
  registerUtility('inset', (parsed: ParsedClass) => {
    const isNegative = parsed.modifiers.includes('negative');
    const resolved = resolveInsetValue(parsed.value, isNegative);
    if (resolved === null) return null;
    return {
      top: resolved,
      right: resolved,
      bottom: resolved,
      left: resolved,
    };
  });

  // inset-x-* (left + right)
  registerUtility('inset-x', (parsed: ParsedClass) => {
    const isNegative = parsed.modifiers.includes('negative');
    const resolved = resolveInsetValue(parsed.value, isNegative);
    if (resolved === null) return null;
    return {
      left: resolved,
      right: resolved,
    };
  });

  // inset-y-* (top + bottom)
  registerUtility('inset-y', (parsed: ParsedClass) => {
    const isNegative = parsed.modifiers.includes('negative');
    const resolved = resolveInsetValue(parsed.value, isNegative);
    if (resolved === null) return null;
    return {
      top: resolved,
      bottom: resolved,
    };
  });

  // top-*
  registerUtility('top', (parsed: ParsedClass) => {
    const isNegative = parsed.modifiers.includes('negative');
    const resolved = resolveInsetValue(parsed.value, isNegative);
    if (resolved === null) return null;
    return { top: resolved };
  });

  // right-*
  registerUtility('right', (parsed: ParsedClass) => {
    const isNegative = parsed.modifiers.includes('negative');
    const resolved = resolveInsetValue(parsed.value, isNegative);
    if (resolved === null) return null;
    return { right: resolved };
  });

  // bottom-*
  registerUtility('bottom', (parsed: ParsedClass) => {
    const isNegative = parsed.modifiers.includes('negative');
    const resolved = resolveInsetValue(parsed.value, isNegative);
    if (resolved === null) return null;
    return { bottom: resolved };
  });

  // left-*
  registerUtility('left', (parsed: ParsedClass) => {
    const isNegative = parsed.modifiers.includes('negative');
    const resolved = resolveInsetValue(parsed.value, isNegative);
    if (resolved === null) return null;
    return { left: resolved };
  });

  // ── Z-Index Utilities ──────────────────────────────────────────────────────

  registerUtility('z', (parsed: ParsedClass) => {
    if (!parsed.value) return null;

    const isNegative = parsed.modifiers.includes('negative');

    // Handle arbitrary values
    if (parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
      const raw = parsed.value.slice(1, -1);
      return { 'z-index': isNegative ? `-${raw}` : raw };
    }

    // Check predefined values
    if (parsed.value in Z_INDEX_VALUES) {
      const val = Z_INDEX_VALUES[parsed.value];
      if (val === 'auto') return { 'z-index': 'auto' };
      return { 'z-index': isNegative ? `-${val}` : val };
    }

    return null;
  });

  // ── Overflow Utilities ─────────────────────────────────────────────────────

  // overflow-* (both axes)
  registerUtility('overflow', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    if ((OVERFLOW_VALUES as readonly string[]).includes(parsed.value)) {
      return { overflow: parsed.value };
    }
    return null;
  });

  // overflow-x-*
  registerUtility('overflow-x', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    if ((OVERFLOW_VALUES as readonly string[]).includes(parsed.value)) {
      return { 'overflow-x': parsed.value };
    }
    return null;
  });

  // overflow-y-*
  registerUtility('overflow-y', (parsed: ParsedClass) => {
    if (!parsed.value) return null;
    if ((OVERFLOW_VALUES as readonly string[]).includes(parsed.value)) {
      return { 'overflow-y': parsed.value };
    }
    return null;
  });
}
