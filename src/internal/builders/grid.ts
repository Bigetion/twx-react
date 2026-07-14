/**
 * Grid Utilities Builder
 * Generates CSS for grid layout utilities
 *
 * @internal
 */

import { registerUtilities } from '../generator';
import type { UtilityGenerator } from '../generator';
import type { ParsedClass } from '../parser';

// ─── Grid Template Columns ────────────────────────────────────────────────────

const gridColsGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) return null;

  const val = parsed.value;

  if (val === 'none') {
    return { 'grid-template-columns': 'none' };
  }

  if (val === 'subgrid') {
    return { 'grid-template-columns': 'subgrid' };
  }

  const num = Number(val);
  if (!isNaN(num) && num >= 1 && num <= 12) {
    return { 'grid-template-columns': `repeat(${num}, minmax(0, 1fr))` };
  }

  return null;
};

// ─── Grid Template Rows ───────────────────────────────────────────────────────

const gridRowsGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) return null;

  const val = parsed.value;

  if (val === 'none') {
    return { 'grid-template-rows': 'none' };
  }

  if (val === 'subgrid') {
    return { 'grid-template-rows': 'subgrid' };
  }

  const num = Number(val);
  if (!isNaN(num) && num >= 1 && num <= 12) {
    return { 'grid-template-rows': `repeat(${num}, minmax(0, 1fr))` };
  }

  return null;
};

// ─── Column Span ──────────────────────────────────────────────────────────────

const colSpanGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) return null;

  const val = parsed.value;

  if (val === 'full') {
    return { 'grid-column': '1 / -1' };
  }

  const num = Number(val);
  if (!isNaN(num) && num >= 1 && num <= 12) {
    return { 'grid-column': `span ${num} / span ${num}` };
  }

  return null;
};

// ─── Column Auto ──────────────────────────────────────────────────────────────

const colAutoGenerator: UtilityGenerator = () => {
  return { 'grid-column': 'auto' };
};

// ─── Column Start ─────────────────────────────────────────────────────────────

const colStartGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) return null;

  const val = parsed.value;

  if (val === 'auto') {
    return { 'grid-column-start': 'auto' };
  }

  const num = Number(val);
  if (!isNaN(num) && num >= 1 && num <= 13) {
    return { 'grid-column-start': `${num}` };
  }

  return null;
};

// ─── Column End ───────────────────────────────────────────────────────────────

const colEndGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) return null;

  const val = parsed.value;

  if (val === 'auto') {
    return { 'grid-column-end': 'auto' };
  }

  const num = Number(val);
  if (!isNaN(num) && num >= 1 && num <= 13) {
    return { 'grid-column-end': `${num}` };
  }

  return null;
};

// ─── Row Span ─────────────────────────────────────────────────────────────────

const rowSpanGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) return null;

  const val = parsed.value;

  if (val === 'full') {
    return { 'grid-row': '1 / -1' };
  }

  const num = Number(val);
  if (!isNaN(num) && num >= 1 && num <= 12) {
    return { 'grid-row': `span ${num} / span ${num}` };
  }

  return null;
};

// ─── Row Auto ─────────────────────────────────────────────────────────────────

const rowAutoGenerator: UtilityGenerator = () => {
  return { 'grid-row': 'auto' };
};

// ─── Row Start ────────────────────────────────────────────────────────────────

const rowStartGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) return null;

  const val = parsed.value;

  if (val === 'auto') {
    return { 'grid-row-start': 'auto' };
  }

  const num = Number(val);
  if (!isNaN(num) && num >= 1 && num <= 13) {
    return { 'grid-row-start': `${num}` };
  }

  return null;
};

// ─── Row End ──────────────────────────────────────────────────────────────────

const rowEndGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) return null;

  const val = parsed.value;

  if (val === 'auto') {
    return { 'grid-row-end': 'auto' };
  }

  const num = Number(val);
  if (!isNaN(num) && num >= 1 && num <= 13) {
    return { 'grid-row-end': `${num}` };
  }

  return null;
};

// ─── Grid Auto Columns ────────────────────────────────────────────────────────

const autoColsGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) return null;

  const val = parsed.value;

  const autoColsMap: Record<string, string> = {
    auto: 'auto',
    min: 'min-content',
    max: 'max-content',
    fr: 'minmax(0, 1fr)',
  };

  if (val in autoColsMap) {
    return { 'grid-auto-columns': autoColsMap[val] };
  }

  return null;
};

// ─── Grid Auto Rows ───────────────────────────────────────────────────────────

const autoRowsGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) return null;

  const val = parsed.value;

  const autoRowsMap: Record<string, string> = {
    auto: 'auto',
    min: 'min-content',
    max: 'max-content',
    fr: 'minmax(0, 1fr)',
  };

  if (val in autoRowsMap) {
    return { 'grid-auto-rows': autoRowsMap[val] };
  }

  return null;
};

// ─── Grid Flow ────────────────────────────────────────────────────────────────

const gridFlowGenerator: UtilityGenerator = (parsed: ParsedClass) => {
  if (!parsed.value) return null;

  const val = parsed.value;

  const gridFlowMap: Record<string, string> = {
    row: 'row',
    col: 'column',
    dense: 'dense',
    'row-dense': 'row dense',
    'col-dense': 'column dense',
  };

  if (val in gridFlowMap) {
    return { 'grid-auto-flow': gridFlowMap[val] };
  }

  return null;
};

// ─── Grid Display ─────────────────────────────────────────────────────────────

const gridGenerator: UtilityGenerator = () => {
  return { display: 'grid' };
};

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register all grid utilities with the utility registry.
 * Call this during initialization to enable grid CSS generation.
 */
export function registerGridUtilities(): void {
  registerUtilities([
    // Grid display
    ['grid', gridGenerator],

    // Grid template columns & rows
    ['grid-cols', gridColsGenerator],
    ['grid-rows', gridRowsGenerator],

    // Column span, start, end
    ['col-span', colSpanGenerator],
    ['col-auto', colAutoGenerator],
    ['col-start', colStartGenerator],
    ['col-end', colEndGenerator],

    // Row span, start, end
    ['row-span', rowSpanGenerator],
    ['row-auto', rowAutoGenerator],
    ['row-start', rowStartGenerator],
    ['row-end', rowEndGenerator],

    // Grid auto columns & rows
    ['auto-cols', autoColsGenerator],
    ['auto-rows', autoRowsGenerator],

    // Grid flow
    ['grid-flow', gridFlowGenerator],
  ]);
}
