/**
 * Tests for border utilities builder
 * Task 3.10: Border width, style, radius, divide, and outline utilities
 */

import { clearRegistry } from '../../../src/internal/generator';
import {
  registerBorderUtilities,
  borderAll,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  borderX,
  borderY,
  borderSolid,
  borderDashed,
  borderDotted,
  borderDouble,
  borderHidden,
  borderNone,
  rounded,
  roundedTop,
  roundedRight,
  roundedBottom,
  roundedLeft,
  roundedTopLeft,
  roundedTopRight,
  roundedBottomLeft,
  roundedBottomRight,
  divideX,
  divideY,
  divideSolid,
  divideDashed,
  divideDotted,
  divideDouble,
  divideNone,
  outlineGenerator,
  outlineOffset,
} from '../../../src/internal/builders/borders';
import type { ParsedClass } from '../../../src/internal/parser';

// Helper to create a ParsedClass for testing
function makeParsed(utility: string, value?: string): ParsedClass {
  return {
    utility,
    value,
    variants: [],
    modifiers: [],
  };
}

describe('Border Utilities Builder', () => {
  beforeEach(() => {
    clearRegistry();
  });

  describe('registerBorderUtilities', () => {
    it('should register without errors', () => {
      expect(() => registerBorderUtilities()).not.toThrow();
    });
  });

  // ─── Border Width ─────────────────────────────────────────────────────────

  describe('Border Width - border (all sides)', () => {
    it('border (no value) → border-width: 1px', () => {
      expect(borderAll(makeParsed('border'))).toEqual({ 'border-width': '1px' });
    });

    it('border-0 → border-width: 0px', () => {
      expect(borderAll(makeParsed('border', '0'))).toEqual({ 'border-width': '0px' });
    });

    it('border-2 → border-width: 2px', () => {
      expect(borderAll(makeParsed('border', '2'))).toEqual({ 'border-width': '2px' });
    });

    it('border-4 → border-width: 4px', () => {
      expect(borderAll(makeParsed('border', '4'))).toEqual({ 'border-width': '4px' });
    });

    it('border-8 → border-width: 8px', () => {
      expect(borderAll(makeParsed('border', '8'))).toEqual({ 'border-width': '8px' });
    });

    it('border with style value → border-style', () => {
      expect(borderAll(makeParsed('border', 'solid'))).toEqual({ 'border-style': 'solid' });
      expect(borderAll(makeParsed('border', 'dashed'))).toEqual({ 'border-style': 'dashed' });
    });

    it('border with unknown value → null', () => {
      expect(borderAll(makeParsed('border', 'unknown'))).toBeNull();
    });
  });

  describe('Border Width - directional (top, right, bottom, left)', () => {
    it('border-t (no value) → border-top-width: 1px', () => {
      expect(borderTop(makeParsed('border-t'))).toEqual({ 'border-top-width': '1px' });
    });

    it('border-t-0 → border-top-width: 0px', () => {
      expect(borderTop(makeParsed('border-t', '0'))).toEqual({ 'border-top-width': '0px' });
    });

    it('border-t-2 → border-top-width: 2px', () => {
      expect(borderTop(makeParsed('border-t', '2'))).toEqual({ 'border-top-width': '2px' });
    });

    it('border-t-4 → border-top-width: 4px', () => {
      expect(borderTop(makeParsed('border-t', '4'))).toEqual({ 'border-top-width': '4px' });
    });

    it('border-t-8 → border-top-width: 8px', () => {
      expect(borderTop(makeParsed('border-t', '8'))).toEqual({ 'border-top-width': '8px' });
    });

    it('border-r (no value) → border-right-width: 1px', () => {
      expect(borderRight(makeParsed('border-r'))).toEqual({ 'border-right-width': '1px' });
    });

    it('border-r-4 → border-right-width: 4px', () => {
      expect(borderRight(makeParsed('border-r', '4'))).toEqual({ 'border-right-width': '4px' });
    });

    it('border-b (no value) → border-bottom-width: 1px', () => {
      expect(borderBottom(makeParsed('border-b'))).toEqual({ 'border-bottom-width': '1px' });
    });

    it('border-b-2 → border-bottom-width: 2px', () => {
      expect(borderBottom(makeParsed('border-b', '2'))).toEqual({ 'border-bottom-width': '2px' });
    });

    it('border-l (no value) → border-left-width: 1px', () => {
      expect(borderLeft(makeParsed('border-l'))).toEqual({ 'border-left-width': '1px' });
    });

    it('border-l-8 → border-left-width: 8px', () => {
      expect(borderLeft(makeParsed('border-l', '8'))).toEqual({ 'border-left-width': '8px' });
    });
  });

  describe('Border Width - axis (x, y)', () => {
    it('border-x (no value) → border-left + border-right: 1px', () => {
      expect(borderX(makeParsed('border-x'))).toEqual({
        'border-left-width': '1px',
        'border-right-width': '1px',
      });
    });

    it('border-x-0 → border-left + border-right: 0px', () => {
      expect(borderX(makeParsed('border-x', '0'))).toEqual({
        'border-left-width': '0px',
        'border-right-width': '0px',
      });
    });

    it('border-x-2 → border-left + border-right: 2px', () => {
      expect(borderX(makeParsed('border-x', '2'))).toEqual({
        'border-left-width': '2px',
        'border-right-width': '2px',
      });
    });

    it('border-y (no value) → border-top + border-bottom: 1px', () => {
      expect(borderY(makeParsed('border-y'))).toEqual({
        'border-top-width': '1px',
        'border-bottom-width': '1px',
      });
    });

    it('border-y-4 → border-top + border-bottom: 4px', () => {
      expect(borderY(makeParsed('border-y', '4'))).toEqual({
        'border-top-width': '4px',
        'border-bottom-width': '4px',
      });
    });
  });

  // ─── Border Style ─────────────────────────────────────────────────────────

  describe('Border Style', () => {
    it('border-solid → border-style: solid', () => {
      expect(borderSolid(makeParsed('border-solid'))).toEqual({ 'border-style': 'solid' });
    });

    it('border-dashed → border-style: dashed', () => {
      expect(borderDashed(makeParsed('border-dashed'))).toEqual({ 'border-style': 'dashed' });
    });

    it('border-dotted → border-style: dotted', () => {
      expect(borderDotted(makeParsed('border-dotted'))).toEqual({ 'border-style': 'dotted' });
    });

    it('border-double → border-style: double', () => {
      expect(borderDouble(makeParsed('border-double'))).toEqual({ 'border-style': 'double' });
    });

    it('border-hidden → border-style: hidden', () => {
      expect(borderHidden(makeParsed('border-hidden'))).toEqual({ 'border-style': 'hidden' });
    });

    it('border-none → border-style: none', () => {
      expect(borderNone(makeParsed('border-none'))).toEqual({ 'border-style': 'none' });
    });
  });

  // ─── Border Radius ────────────────────────────────────────────────────────

  describe('Border Radius - rounded (all corners)', () => {
    it('rounded (no value) → border-radius: 0.25rem', () => {
      expect(rounded(makeParsed('rounded'))).toEqual({ 'border-radius': '0.25rem' });
    });

    it('rounded-none → border-radius: 0px', () => {
      expect(rounded(makeParsed('rounded', 'none'))).toEqual({ 'border-radius': '0px' });
    });

    it('rounded-sm → border-radius: 0.125rem', () => {
      expect(rounded(makeParsed('rounded', 'sm'))).toEqual({ 'border-radius': '0.125rem' });
    });

    it('rounded-md → border-radius: 0.375rem', () => {
      expect(rounded(makeParsed('rounded', 'md'))).toEqual({ 'border-radius': '0.375rem' });
    });

    it('rounded-lg → border-radius: 0.5rem', () => {
      expect(rounded(makeParsed('rounded', 'lg'))).toEqual({ 'border-radius': '0.5rem' });
    });

    it('rounded-xl → border-radius: 0.75rem', () => {
      expect(rounded(makeParsed('rounded', 'xl'))).toEqual({ 'border-radius': '0.75rem' });
    });

    it('rounded-2xl → border-radius: 1rem', () => {
      expect(rounded(makeParsed('rounded', '2xl'))).toEqual({ 'border-radius': '1rem' });
    });

    it('rounded-3xl → border-radius: 1.5rem', () => {
      expect(rounded(makeParsed('rounded', '3xl'))).toEqual({ 'border-radius': '1.5rem' });
    });

    it('rounded-full → border-radius: 9999px', () => {
      expect(rounded(makeParsed('rounded', 'full'))).toEqual({ 'border-radius': '9999px' });
    });

    it('rounded with unknown value → null', () => {
      expect(rounded(makeParsed('rounded', 'unknown'))).toBeNull();
    });
  });

  describe('Border Radius - side-specific', () => {
    it('rounded-t-lg → border-top-left-radius + border-top-right-radius: 0.5rem', () => {
      expect(roundedTop(makeParsed('rounded-t', 'lg'))).toEqual({
        'border-top-left-radius': '0.5rem',
        'border-top-right-radius': '0.5rem',
      });
    });

    it('rounded-t (no value) → border-top-left + top-right: 0.25rem', () => {
      expect(roundedTop(makeParsed('rounded-t'))).toEqual({
        'border-top-left-radius': '0.25rem',
        'border-top-right-radius': '0.25rem',
      });
    });

    it('rounded-r-xl → border-top-right + bottom-right: 0.75rem', () => {
      expect(roundedRight(makeParsed('rounded-r', 'xl'))).toEqual({
        'border-top-right-radius': '0.75rem',
        'border-bottom-right-radius': '0.75rem',
      });
    });

    it('rounded-b-full → border-bottom-left + bottom-right: 9999px', () => {
      expect(roundedBottom(makeParsed('rounded-b', 'full'))).toEqual({
        'border-bottom-left-radius': '9999px',
        'border-bottom-right-radius': '9999px',
      });
    });

    it('rounded-l-none → border-top-left + bottom-left: 0px', () => {
      expect(roundedLeft(makeParsed('rounded-l', 'none'))).toEqual({
        'border-top-left-radius': '0px',
        'border-bottom-left-radius': '0px',
      });
    });
  });

  describe('Border Radius - corner-specific', () => {
    it('rounded-tl-lg → border-top-left-radius: 0.5rem', () => {
      expect(roundedTopLeft(makeParsed('rounded-tl', 'lg'))).toEqual({
        'border-top-left-radius': '0.5rem',
      });
    });

    it('rounded-tr-md → border-top-right-radius: 0.375rem', () => {
      expect(roundedTopRight(makeParsed('rounded-tr', 'md'))).toEqual({
        'border-top-right-radius': '0.375rem',
      });
    });

    it('rounded-bl-sm → border-bottom-left-radius: 0.125rem', () => {
      expect(roundedBottomLeft(makeParsed('rounded-bl', 'sm'))).toEqual({
        'border-bottom-left-radius': '0.125rem',
      });
    });

    it('rounded-br-full → border-bottom-right-radius: 9999px', () => {
      expect(roundedBottomRight(makeParsed('rounded-br', 'full'))).toEqual({
        'border-bottom-right-radius': '9999px',
      });
    });

    it('rounded-tl (no value) → border-top-left-radius: 0.25rem', () => {
      expect(roundedTopLeft(makeParsed('rounded-tl'))).toEqual({
        'border-top-left-radius': '0.25rem',
      });
    });
  });

  // ─── Divide Utilities ─────────────────────────────────────────────────────

  describe('Divide Utilities', () => {
    it('divide-x (no value) → border-right: 0px, border-left: 1px', () => {
      expect(divideX(makeParsed('divide-x'))).toEqual({
        'border-right-width': '0px',
        'border-left-width': '1px',
      });
    });

    it('divide-x-0 → border-right: 0px, border-left: 0px', () => {
      expect(divideX(makeParsed('divide-x', '0'))).toEqual({
        'border-right-width': '0px',
        'border-left-width': '0px',
      });
    });

    it('divide-x-2 → border-right: 0px, border-left: 2px', () => {
      expect(divideX(makeParsed('divide-x', '2'))).toEqual({
        'border-right-width': '0px',
        'border-left-width': '2px',
      });
    });

    it('divide-x-4 → border-right: 0px, border-left: 4px', () => {
      expect(divideX(makeParsed('divide-x', '4'))).toEqual({
        'border-right-width': '0px',
        'border-left-width': '4px',
      });
    });

    it('divide-x-8 → border-right: 0px, border-left: 8px', () => {
      expect(divideX(makeParsed('divide-x', '8'))).toEqual({
        'border-right-width': '0px',
        'border-left-width': '8px',
      });
    });

    it('divide-y (no value) → border-bottom: 0px, border-top: 1px', () => {
      expect(divideY(makeParsed('divide-y'))).toEqual({
        'border-bottom-width': '0px',
        'border-top-width': '1px',
      });
    });

    it('divide-y-0 → border-bottom: 0px, border-top: 0px', () => {
      expect(divideY(makeParsed('divide-y', '0'))).toEqual({
        'border-bottom-width': '0px',
        'border-top-width': '0px',
      });
    });

    it('divide-y-4 → border-bottom: 0px, border-top: 4px', () => {
      expect(divideY(makeParsed('divide-y', '4'))).toEqual({
        'border-bottom-width': '0px',
        'border-top-width': '4px',
      });
    });

    it('divide-y-8 → border-bottom: 0px, border-top: 8px', () => {
      expect(divideY(makeParsed('divide-y', '8'))).toEqual({
        'border-bottom-width': '0px',
        'border-top-width': '8px',
      });
    });
  });

  describe('Divide Style', () => {
    it('divide-solid → border-style: solid', () => {
      expect(divideSolid(makeParsed('divide-solid'))).toEqual({ 'border-style': 'solid' });
    });

    it('divide-dashed → border-style: dashed', () => {
      expect(divideDashed(makeParsed('divide-dashed'))).toEqual({ 'border-style': 'dashed' });
    });

    it('divide-dotted → border-style: dotted', () => {
      expect(divideDotted(makeParsed('divide-dotted'))).toEqual({ 'border-style': 'dotted' });
    });

    it('divide-double → border-style: double', () => {
      expect(divideDouble(makeParsed('divide-double'))).toEqual({ 'border-style': 'double' });
    });

    it('divide-none → border-style: none', () => {
      expect(divideNone(makeParsed('divide-none'))).toEqual({ 'border-style': 'none' });
    });
  });

  // ─── Outline Utilities ────────────────────────────────────────────────────

  describe('Outline Utilities', () => {
    it('outline (no value) → outline-style: solid', () => {
      expect(outlineGenerator(makeParsed('outline'))).toEqual({ 'outline-style': 'solid' });
    });

    it('outline-none → outline: 2px solid transparent + outline-offset: 2px', () => {
      expect(outlineGenerator(makeParsed('outline', 'none'))).toEqual({
        'outline': '2px solid transparent',
        'outline-offset': '2px',
      });
    });

    it('outline-dashed → outline-style: dashed', () => {
      expect(outlineGenerator(makeParsed('outline', 'dashed'))).toEqual({ 'outline-style': 'dashed' });
    });

    it('outline-dotted → outline-style: dotted', () => {
      expect(outlineGenerator(makeParsed('outline', 'dotted'))).toEqual({ 'outline-style': 'dotted' });
    });

    it('outline-double → outline-style: double', () => {
      expect(outlineGenerator(makeParsed('outline', 'double'))).toEqual({ 'outline-style': 'double' });
    });

    it('outline-0 → outline-width: 0px', () => {
      expect(outlineGenerator(makeParsed('outline', '0'))).toEqual({ 'outline-width': '0px' });
    });

    it('outline-1 → outline-width: 1px', () => {
      expect(outlineGenerator(makeParsed('outline', '1'))).toEqual({ 'outline-width': '1px' });
    });

    it('outline-2 → outline-width: 2px', () => {
      expect(outlineGenerator(makeParsed('outline', '2'))).toEqual({ 'outline-width': '2px' });
    });

    it('outline-4 → outline-width: 4px', () => {
      expect(outlineGenerator(makeParsed('outline', '4'))).toEqual({ 'outline-width': '4px' });
    });

    it('outline-8 → outline-width: 8px', () => {
      expect(outlineGenerator(makeParsed('outline', '8'))).toEqual({ 'outline-width': '8px' });
    });

    it('outline with unknown value → null', () => {
      expect(outlineGenerator(makeParsed('outline', 'unknown'))).toBeNull();
    });
  });

  describe('Outline Offset', () => {
    it('outline-offset-0 → outline-offset: 0px', () => {
      expect(outlineOffset(makeParsed('outline-offset', '0'))).toEqual({ 'outline-offset': '0px' });
    });

    it('outline-offset-1 → outline-offset: 1px', () => {
      expect(outlineOffset(makeParsed('outline-offset', '1'))).toEqual({ 'outline-offset': '1px' });
    });

    it('outline-offset-2 → outline-offset: 2px', () => {
      expect(outlineOffset(makeParsed('outline-offset', '2'))).toEqual({ 'outline-offset': '2px' });
    });

    it('outline-offset-4 → outline-offset: 4px', () => {
      expect(outlineOffset(makeParsed('outline-offset', '4'))).toEqual({ 'outline-offset': '4px' });
    });

    it('outline-offset-8 → outline-offset: 8px', () => {
      expect(outlineOffset(makeParsed('outline-offset', '8'))).toEqual({ 'outline-offset': '8px' });
    });

    it('outline-offset with no value → null', () => {
      expect(outlineOffset(makeParsed('outline-offset'))).toBeNull();
    });

    it('outline-offset with unknown value → null', () => {
      expect(outlineOffset(makeParsed('outline-offset', 'unknown'))).toBeNull();
    });
  });
});
