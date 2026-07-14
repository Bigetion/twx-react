/**
 * @jest-environment node
 */

/**
 * Tests for grid utilities builder
 * Task 3.6: Grid utilities
 */

import {
  clearRegistry,
  hasUtility,
  generateCSS,
} from '../../../src/internal/generator';
import type { ParsedClass } from '../../../src/internal/parser';
import { registerGridUtilities } from '../../../src/internal/builders/grid';

beforeEach(() => {
  clearRegistry();
  registerGridUtilities();
});

describe('Grid Utilities Builder (Task 3.6)', () => {

  describe('Grid display', () => {
    it('should register grid utility', () => {
      expect(hasUtility('grid')).toBe(true);
    });

    it('should generate display: grid', () => {
      const parsed: ParsedClass = { utility: 'grid', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'grid' });
    });
  });

  describe('Grid Template Columns (grid-cols-*)', () => {
    it('should register grid-cols utility', () => {
      expect(hasUtility('grid-cols')).toBe(true);
    });

    it('should generate grid-cols-1 through grid-cols-12', () => {
      for (let i = 1; i <= 12; i++) {
        const parsed: ParsedClass = { utility: 'grid-cols', value: `${i}`, variants: [], modifiers: [] };
        const rule = generateCSS(parsed, `grid-cols-${i}`);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({
          'grid-template-columns': `repeat(${i}, minmax(0, 1fr))`,
        });
      }
    });

    it('should generate grid-cols-none', () => {
      const parsed: ParsedClass = { utility: 'grid-cols', value: 'none', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid-cols-none');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-template-columns': 'none' });
    });

    it('should generate grid-cols-subgrid', () => {
      const parsed: ParsedClass = { utility: 'grid-cols', value: 'subgrid', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid-cols-subgrid');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-template-columns': 'subgrid' });
    });

    it('should return null for invalid value', () => {
      const parsed: ParsedClass = { utility: 'grid-cols', value: '13', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid-cols-13');
      expect(rule).toBeNull();
    });

    it('should return null when no value is provided', () => {
      const parsed: ParsedClass = { utility: 'grid-cols', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid-cols');
      expect(rule).toBeNull();
    });
  });

  describe('Grid Template Rows (grid-rows-*)', () => {
    it('should register grid-rows utility', () => {
      expect(hasUtility('grid-rows')).toBe(true);
    });

    it('should generate grid-rows-1 through grid-rows-12', () => {
      for (let i = 1; i <= 12; i++) {
        const parsed: ParsedClass = { utility: 'grid-rows', value: `${i}`, variants: [], modifiers: [] };
        const rule = generateCSS(parsed, `grid-rows-${i}`);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({
          'grid-template-rows': `repeat(${i}, minmax(0, 1fr))`,
        });
      }
    });

    it('should generate grid-rows-none', () => {
      const parsed: ParsedClass = { utility: 'grid-rows', value: 'none', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid-rows-none');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-template-rows': 'none' });
    });

    it('should generate grid-rows-subgrid', () => {
      const parsed: ParsedClass = { utility: 'grid-rows', value: 'subgrid', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid-rows-subgrid');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-template-rows': 'subgrid' });
    });
  });

  describe('Column Span (col-span-*)', () => {
    it('should register col-span utility', () => {
      expect(hasUtility('col-span')).toBe(true);
    });

    it('should generate col-span-1 through col-span-12', () => {
      for (let i = 1; i <= 12; i++) {
        const parsed: ParsedClass = { utility: 'col-span', value: `${i}`, variants: [], modifiers: [] };
        const rule = generateCSS(parsed, `col-span-${i}`);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({
          'grid-column': `span ${i} / span ${i}`,
        });
      }
    });

    it('should generate col-span-full', () => {
      const parsed: ParsedClass = { utility: 'col-span', value: 'full', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'col-span-full');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-column': '1 / -1' });
    });

    it('should return null for invalid span value', () => {
      const parsed: ParsedClass = { utility: 'col-span', value: '13', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'col-span-13');
      expect(rule).toBeNull();
    });
  });

  describe('Column Auto (col-auto)', () => {
    it('should register col-auto utility', () => {
      expect(hasUtility('col-auto')).toBe(true);
    });

    it('should generate grid-column: auto', () => {
      const parsed: ParsedClass = { utility: 'col-auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'col-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-column': 'auto' });
    });
  });

  describe('Column Start (col-start-*)', () => {
    it('should register col-start utility', () => {
      expect(hasUtility('col-start')).toBe(true);
    });

    it('should generate col-start-1 through col-start-13', () => {
      for (let i = 1; i <= 13; i++) {
        const parsed: ParsedClass = { utility: 'col-start', value: `${i}`, variants: [], modifiers: [] };
        const rule = generateCSS(parsed, `col-start-${i}`);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ 'grid-column-start': `${i}` });
      }
    });

    it('should generate col-start-auto', () => {
      const parsed: ParsedClass = { utility: 'col-start', value: 'auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'col-start-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-column-start': 'auto' });
    });
  });

  describe('Column End (col-end-*)', () => {
    it('should register col-end utility', () => {
      expect(hasUtility('col-end')).toBe(true);
    });

    it('should generate col-end-1 through col-end-13', () => {
      for (let i = 1; i <= 13; i++) {
        const parsed: ParsedClass = { utility: 'col-end', value: `${i}`, variants: [], modifiers: [] };
        const rule = generateCSS(parsed, `col-end-${i}`);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ 'grid-column-end': `${i}` });
      }
    });

    it('should generate col-end-auto', () => {
      const parsed: ParsedClass = { utility: 'col-end', value: 'auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'col-end-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-column-end': 'auto' });
    });
  });

  describe('Row Span (row-span-*)', () => {
    it('should register row-span utility', () => {
      expect(hasUtility('row-span')).toBe(true);
    });

    it('should generate row-span-1 through row-span-12', () => {
      for (let i = 1; i <= 12; i++) {
        const parsed: ParsedClass = { utility: 'row-span', value: `${i}`, variants: [], modifiers: [] };
        const rule = generateCSS(parsed, `row-span-${i}`);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({
          'grid-row': `span ${i} / span ${i}`,
        });
      }
    });

    it('should generate row-span-full', () => {
      const parsed: ParsedClass = { utility: 'row-span', value: 'full', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'row-span-full');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-row': '1 / -1' });
    });
  });

  describe('Row Auto (row-auto)', () => {
    it('should register row-auto utility', () => {
      expect(hasUtility('row-auto')).toBe(true);
    });

    it('should generate grid-row: auto', () => {
      const parsed: ParsedClass = { utility: 'row-auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'row-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-row': 'auto' });
    });
  });

  describe('Row Start (row-start-*)', () => {
    it('should register row-start utility', () => {
      expect(hasUtility('row-start')).toBe(true);
    });

    it('should generate row-start-1 through row-start-13', () => {
      for (let i = 1; i <= 13; i++) {
        const parsed: ParsedClass = { utility: 'row-start', value: `${i}`, variants: [], modifiers: [] };
        const rule = generateCSS(parsed, `row-start-${i}`);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ 'grid-row-start': `${i}` });
      }
    });

    it('should generate row-start-auto', () => {
      const parsed: ParsedClass = { utility: 'row-start', value: 'auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'row-start-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-row-start': 'auto' });
    });
  });

  describe('Row End (row-end-*)', () => {
    it('should register row-end utility', () => {
      expect(hasUtility('row-end')).toBe(true);
    });

    it('should generate row-end-1 through row-end-13', () => {
      for (let i = 1; i <= 13; i++) {
        const parsed: ParsedClass = { utility: 'row-end', value: `${i}`, variants: [], modifiers: [] };
        const rule = generateCSS(parsed, `row-end-${i}`);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ 'grid-row-end': `${i}` });
      }
    });

    it('should generate row-end-auto', () => {
      const parsed: ParsedClass = { utility: 'row-end', value: 'auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'row-end-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-row-end': 'auto' });
    });
  });

  describe('Grid Auto Columns (auto-cols-*)', () => {
    it('should register auto-cols utility', () => {
      expect(hasUtility('auto-cols')).toBe(true);
    });

    it('should generate auto-cols-auto', () => {
      const parsed: ParsedClass = { utility: 'auto-cols', value: 'auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'auto-cols-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-auto-columns': 'auto' });
    });

    it('should generate auto-cols-min', () => {
      const parsed: ParsedClass = { utility: 'auto-cols', value: 'min', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'auto-cols-min');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-auto-columns': 'min-content' });
    });

    it('should generate auto-cols-max', () => {
      const parsed: ParsedClass = { utility: 'auto-cols', value: 'max', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'auto-cols-max');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-auto-columns': 'max-content' });
    });

    it('should generate auto-cols-fr', () => {
      const parsed: ParsedClass = { utility: 'auto-cols', value: 'fr', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'auto-cols-fr');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-auto-columns': 'minmax(0, 1fr)' });
    });

    it('should return null for invalid auto-cols value', () => {
      const parsed: ParsedClass = { utility: 'auto-cols', value: 'invalid', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'auto-cols-invalid');
      expect(rule).toBeNull();
    });
  });

  describe('Grid Auto Rows (auto-rows-*)', () => {
    it('should register auto-rows utility', () => {
      expect(hasUtility('auto-rows')).toBe(true);
    });

    it('should generate auto-rows-auto', () => {
      const parsed: ParsedClass = { utility: 'auto-rows', value: 'auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'auto-rows-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-auto-rows': 'auto' });
    });

    it('should generate auto-rows-min', () => {
      const parsed: ParsedClass = { utility: 'auto-rows', value: 'min', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'auto-rows-min');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-auto-rows': 'min-content' });
    });

    it('should generate auto-rows-max', () => {
      const parsed: ParsedClass = { utility: 'auto-rows', value: 'max', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'auto-rows-max');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-auto-rows': 'max-content' });
    });

    it('should generate auto-rows-fr', () => {
      const parsed: ParsedClass = { utility: 'auto-rows', value: 'fr', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'auto-rows-fr');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-auto-rows': 'minmax(0, 1fr)' });
    });

    it('should return null for invalid auto-rows value', () => {
      const parsed: ParsedClass = { utility: 'auto-rows', value: 'invalid', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'auto-rows-invalid');
      expect(rule).toBeNull();
    });
  });

  describe('Grid Flow (grid-flow-*)', () => {
    it('should register grid-flow utility', () => {
      expect(hasUtility('grid-flow')).toBe(true);
    });

    it('should generate grid-flow-row', () => {
      const parsed: ParsedClass = { utility: 'grid-flow', value: 'row', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid-flow-row');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-auto-flow': 'row' });
    });

    it('should generate grid-flow-col', () => {
      const parsed: ParsedClass = { utility: 'grid-flow', value: 'col', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid-flow-col');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-auto-flow': 'column' });
    });

    it('should generate grid-flow-dense', () => {
      const parsed: ParsedClass = { utility: 'grid-flow', value: 'dense', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid-flow-dense');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-auto-flow': 'dense' });
    });

    it('should generate grid-flow-row-dense', () => {
      const parsed: ParsedClass = { utility: 'grid-flow', value: 'row-dense', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid-flow-row-dense');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-auto-flow': 'row dense' });
    });

    it('should generate grid-flow-col-dense', () => {
      const parsed: ParsedClass = { utility: 'grid-flow', value: 'col-dense', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid-flow-col-dense');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'grid-auto-flow': 'column dense' });
    });

    it('should return null for invalid grid-flow value', () => {
      const parsed: ParsedClass = { utility: 'grid-flow', value: 'invalid', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid-flow-invalid');
      expect(rule).toBeNull();
    });
  });

  describe('Variant support', () => {
    it('should work with responsive variants', () => {
      const parsed: ParsedClass = { utility: 'grid-cols', value: '3', variants: ['md'], modifiers: [] };
      const rule = generateCSS(parsed, 'md:grid-cols-3');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'grid-template-columns': 'repeat(3, minmax(0, 1fr))',
      });
      expect(rule!.mediaQuery).toBe('@media (min-width: 768px)');
    });

    it('should work with pseudo-class variants', () => {
      const parsed: ParsedClass = { utility: 'col-span', value: '2', variants: ['hover'], modifiers: [] };
      const rule = generateCSS(parsed, 'hover:col-span-2');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'grid-column': 'span 2 / span 2',
      });
      expect(rule!.selector).toContain(':hover');
    });
  });
});
