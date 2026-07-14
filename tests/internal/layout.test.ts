/**
 * @jest-environment node
 */

/**
 * Tests for layout utilities builder
 * Task 3.4: Implement layout utilities builder
 */

import { clearRegistry, generateCSS } from '../../src/internal/generator';
import { registerLayoutUtilities } from '../../src/internal/builders/layout';
import type { ParsedClass } from '../../src/internal/parser';

beforeEach(() => {
  clearRegistry();
  registerLayoutUtilities();
});

describe('Layout Utilities Builder (Task 3.4)', () => {

  describe('Display Utilities', () => {
    it('should generate display: block', () => {
      const parsed: ParsedClass = { utility: 'block', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'block');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'block' });
    });

    it('should generate display: flex', () => {
      const parsed: ParsedClass = { utility: 'flex', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'flex');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'flex' });
    });

    it('should generate display: grid', () => {
      const parsed: ParsedClass = { utility: 'grid', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'grid');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'grid' });
    });

    it('should generate display: inline-block', () => {
      const parsed: ParsedClass = { utility: 'inline-block', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'inline-block');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'inline-block' });
    });

    it('should generate display: inline-flex', () => {
      const parsed: ParsedClass = { utility: 'inline-flex', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'inline-flex');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'inline-flex' });
    });

    it('should generate display: inline-grid', () => {
      const parsed: ParsedClass = { utility: 'inline-grid', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'inline-grid');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'inline-grid' });
    });

    it('should generate display: none for hidden', () => {
      const parsed: ParsedClass = { utility: 'hidden', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'hidden');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'none' });
    });

    it('should generate display: inline', () => {
      const parsed: ParsedClass = { utility: 'inline', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'inline');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'inline' });
    });

    it('should generate display: contents', () => {
      const parsed: ParsedClass = { utility: 'contents', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'contents');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'contents' });
    });

    it('should generate display: flow-root', () => {
      const parsed: ParsedClass = { utility: 'flow-root', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'flow-root');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'flow-root' });
    });

    it('should generate display: list-item', () => {
      const parsed: ParsedClass = { utility: 'list-item', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'list-item');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'list-item' });
    });

    it('should generate table display utilities', () => {
      const tableUtils = [
        'table', 'inline-table', 'table-caption', 'table-cell',
        'table-column', 'table-column-group', 'table-footer-group',
        'table-header-group', 'table-row-group', 'table-row',
      ];
      for (const util of tableUtils) {
        const parsed: ParsedClass = { utility: util, variants: [], modifiers: [] };
        const rule = generateCSS(parsed, util);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ display: util });
      }
    });
  });

  describe('Position Utilities', () => {
    it('should generate position: static', () => {
      const parsed: ParsedClass = { utility: 'static', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'static');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ position: 'static' });
    });

    it('should generate position: fixed', () => {
      const parsed: ParsedClass = { utility: 'fixed', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'fixed');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ position: 'fixed' });
    });

    it('should generate position: absolute', () => {
      const parsed: ParsedClass = { utility: 'absolute', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'absolute');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ position: 'absolute' });
    });

    it('should generate position: relative', () => {
      const parsed: ParsedClass = { utility: 'relative', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'relative');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ position: 'relative' });
    });

    it('should generate position: sticky', () => {
      const parsed: ParsedClass = { utility: 'sticky', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'sticky');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ position: 'sticky' });
    });
  });

  describe('Inset Utilities', () => {
    it('should generate inset for all 4 sides', () => {
      const parsed: ParsedClass = { utility: 'inset', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'inset-4');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        top: '1rem',
        right: '1rem',
        bottom: '1rem',
        left: '1rem',
      });
    });

    it('should generate inset-0', () => {
      const parsed: ParsedClass = { utility: 'inset', value: '0', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'inset-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      });
    });

    it('should generate inset-x for left and right', () => {
      const parsed: ParsedClass = { utility: 'inset-x', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'inset-x-4');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        left: '1rem',
        right: '1rem',
      });
    });

    it('should generate inset-y for top and bottom', () => {
      const parsed: ParsedClass = { utility: 'inset-y', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'inset-y-4');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        top: '1rem',
        bottom: '1rem',
      });
    });

    it('should generate top-*', () => {
      const parsed: ParsedClass = { utility: 'top', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'top-4');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ top: '1rem' });
    });

    it('should generate right-*', () => {
      const parsed: ParsedClass = { utility: 'right', value: '2', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'right-2');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ right: '0.5rem' });
    });

    it('should generate bottom-*', () => {
      const parsed: ParsedClass = { utility: 'bottom', value: '8', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bottom-8');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ bottom: '2rem' });
    });

    it('should generate left-*', () => {
      const parsed: ParsedClass = { utility: 'left', value: '0', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'left-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ left: '0px' });
    });

    it('should support auto value', () => {
      const parsed: ParsedClass = { utility: 'top', value: 'auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'top-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ top: 'auto' });
    });

    it('should support full (100%) value', () => {
      const parsed: ParsedClass = { utility: 'inset', value: 'full', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'inset-full');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        top: '100%',
        right: '100%',
        bottom: '100%',
        left: '100%',
      });
    });

    it('should support fraction values (1/2)', () => {
      const parsed: ParsedClass = { utility: 'left', value: '1/2', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'left-1/2');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ left: '50%' });
    });

    it('should support fraction values (1/3)', () => {
      const parsed: ParsedClass = { utility: 'top', value: '1/3', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'top-1/3');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ top: '33.333333%' });
    });

    it('should support fraction values (2/3)', () => {
      const parsed: ParsedClass = { utility: 'right', value: '2/3', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'right-2/3');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ right: '66.666667%' });
    });

    it('should support fraction values (3/4)', () => {
      const parsed: ParsedClass = { utility: 'bottom', value: '3/4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bottom-3/4');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ bottom: '75%' });
    });

    it('should support negative inset values', () => {
      const parsed: ParsedClass = { utility: 'top', value: '4', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-top-4');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ top: '-1rem' });
    });

    it('should support negative inset with fractions', () => {
      const parsed: ParsedClass = { utility: 'left', value: '1/2', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-left-1/2');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ left: '-50%' });
    });

    it('should support arbitrary inset values', () => {
      const parsed: ParsedClass = { utility: 'top', value: '[20px]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'top-[20px]');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ top: '20px' });
    });

    it('should support negative arbitrary inset values', () => {
      const parsed: ParsedClass = { utility: 'left', value: '[10%]', variants: [], modifiers: ['negative'], arbitrary: true };
      const rule = generateCSS(parsed, '-left-[10%]');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ left: '-10%' });
    });

    it('should return null for invalid inset values', () => {
      const parsed: ParsedClass = { utility: 'top', value: 'invalid', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'top-invalid');
      expect(rule).toBeNull();
    });

    it('should generate inset with px value', () => {
      const parsed: ParsedClass = { utility: 'inset', value: 'px', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'inset-px');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        top: '1px',
        right: '1px',
        bottom: '1px',
        left: '1px',
      });
    });
  });

  describe('Z-Index Utilities', () => {
    it('should generate z-0', () => {
      const parsed: ParsedClass = { utility: 'z', value: '0', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'z-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'z-index': '0' });
    });

    it('should generate z-10', () => {
      const parsed: ParsedClass = { utility: 'z', value: '10', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'z-10');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'z-index': '10' });
    });

    it('should generate z-50', () => {
      const parsed: ParsedClass = { utility: 'z', value: '50', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'z-50');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'z-index': '50' });
    });

    it('should generate z-auto', () => {
      const parsed: ParsedClass = { utility: 'z', value: 'auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'z-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'z-index': 'auto' });
    });

    it('should support negative z-index', () => {
      const parsed: ParsedClass = { utility: 'z', value: '10', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-z-10');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'z-index': '-10' });
    });

    it('should support arbitrary z-index values', () => {
      const parsed: ParsedClass = { utility: 'z', value: '[999]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'z-[999]');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'z-index': '999' });
    });

    it('should return null for invalid z-index values', () => {
      const parsed: ParsedClass = { utility: 'z', value: '15', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'z-15');
      expect(rule).toBeNull();
    });

    it('should return null when z has no value', () => {
      const parsed: ParsedClass = { utility: 'z', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'z');
      expect(rule).toBeNull();
    });
  });

  describe('Overflow Utilities', () => {
    it('should generate overflow-auto', () => {
      const parsed: ParsedClass = { utility: 'overflow', value: 'auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'overflow-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ overflow: 'auto' });
    });

    it('should generate overflow-hidden', () => {
      const parsed: ParsedClass = { utility: 'overflow', value: 'hidden', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'overflow-hidden');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ overflow: 'hidden' });
    });

    it('should generate overflow-clip', () => {
      const parsed: ParsedClass = { utility: 'overflow', value: 'clip', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'overflow-clip');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ overflow: 'clip' });
    });

    it('should generate overflow-visible', () => {
      const parsed: ParsedClass = { utility: 'overflow', value: 'visible', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'overflow-visible');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ overflow: 'visible' });
    });

    it('should generate overflow-scroll', () => {
      const parsed: ParsedClass = { utility: 'overflow', value: 'scroll', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'overflow-scroll');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ overflow: 'scroll' });
    });

    it('should generate overflow-x-auto', () => {
      const parsed: ParsedClass = { utility: 'overflow-x', value: 'auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'overflow-x-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'overflow-x': 'auto' });
    });

    it('should generate overflow-x-hidden', () => {
      const parsed: ParsedClass = { utility: 'overflow-x', value: 'hidden', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'overflow-x-hidden');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'overflow-x': 'hidden' });
    });

    it('should generate overflow-y-scroll', () => {
      const parsed: ParsedClass = { utility: 'overflow-y', value: 'scroll', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'overflow-y-scroll');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'overflow-y': 'scroll' });
    });

    it('should generate overflow-y-visible', () => {
      const parsed: ParsedClass = { utility: 'overflow-y', value: 'visible', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'overflow-y-visible');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'overflow-y': 'visible' });
    });

    it('should return null for invalid overflow values', () => {
      const parsed: ParsedClass = { utility: 'overflow', value: 'invalid', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'overflow-invalid');
      expect(rule).toBeNull();
    });

    it('should return null when overflow has no value', () => {
      const parsed: ParsedClass = { utility: 'overflow', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'overflow');
      expect(rule).toBeNull();
    });
  });

  describe('Variant Integration', () => {
    it('should work with responsive variants', () => {
      const parsed: ParsedClass = { utility: 'hidden', variants: ['md'], modifiers: [] };
      const rule = generateCSS(parsed, 'md:hidden');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'none' });
      expect(rule!.mediaQuery).toBe('@media (min-width: 768px)');
    });

    it('should work with hover variant on position', () => {
      const parsed: ParsedClass = { utility: 'absolute', variants: ['hover'], modifiers: [] };
      const rule = generateCSS(parsed, 'hover:absolute');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ position: 'absolute' });
      expect(rule!.selector).toContain(':hover');
    });
  });
});
