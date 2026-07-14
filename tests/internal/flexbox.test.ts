/**
 * @jest-environment node
 */

/**
 * Tests for flexbox utilities builder
 * Task 3.5: Implement flexbox utilities builder
 */

import {
  clearRegistry,
  hasUtility,
  generateCSS,
} from '../../src/internal/generator';
import { registerFlexboxUtilities } from '../../src/internal/builders/flexbox';
import type { ParsedClass } from '../../src/internal/parser';

// Helper to create a ParsedClass
function makeParsed(utility: string, value?: string): ParsedClass {
  return {
    utility,
    value,
    variants: [],
    modifiers: [],
  };
}

beforeEach(() => {
  clearRegistry();
  registerFlexboxUtilities();
});

describe('Flexbox Utilities Builder (Task 3.5)', () => {

  describe('Flex Direction Utilities', () => {
    it('should register flex-row', () => {
      expect(hasUtility('flex-row')).toBe(true);
    });

    it('flex-row → flex-direction: row', () => {
      const rule = generateCSS(makeParsed('flex-row'), 'flex-row');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-direction': 'row' });
    });

    it('flex-row-reverse → flex-direction: row-reverse', () => {
      const rule = generateCSS(makeParsed('flex-row-reverse'), 'flex-row-reverse');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-direction': 'row-reverse' });
    });

    it('flex-col → flex-direction: column', () => {
      const rule = generateCSS(makeParsed('flex-col'), 'flex-col');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-direction': 'column' });
    });

    it('flex-col-reverse → flex-direction: column-reverse', () => {
      const rule = generateCSS(makeParsed('flex-col-reverse'), 'flex-col-reverse');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-direction': 'column-reverse' });
    });
  });

  describe('Flex Wrap Utilities', () => {
    it('flex-wrap → flex-wrap: wrap', () => {
      const rule = generateCSS(makeParsed('flex-wrap'), 'flex-wrap');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-wrap': 'wrap' });
    });

    it('flex-wrap-reverse → flex-wrap: wrap-reverse', () => {
      const rule = generateCSS(makeParsed('flex-wrap-reverse'), 'flex-wrap-reverse');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-wrap': 'wrap-reverse' });
    });

    it('flex-nowrap → flex-wrap: nowrap', () => {
      const rule = generateCSS(makeParsed('flex-nowrap'), 'flex-nowrap');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-wrap': 'nowrap' });
    });
  });

  describe('Flex Shorthand Utilities', () => {
    it('flex-1 → flex: 1 1 0%', () => {
      const rule = generateCSS(makeParsed('flex-1'), 'flex-1');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ flex: '1 1 0%' });
    });

    it('flex-auto → flex: 1 1 auto', () => {
      const rule = generateCSS(makeParsed('flex-auto'), 'flex-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ flex: '1 1 auto' });
    });

    it('flex-initial → flex: 0 1 auto', () => {
      const rule = generateCSS(makeParsed('flex-initial'), 'flex-initial');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ flex: '0 1 auto' });
    });

    it('flex-none → flex: none', () => {
      const rule = generateCSS(makeParsed('flex-none'), 'flex-none');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ flex: 'none' });
    });
  });

  describe('Flex Grow/Shrink Utilities', () => {
    it('grow (no value) → flex-grow: 1', () => {
      const rule = generateCSS(makeParsed('grow'), 'grow');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-grow': '1' });
    });

    it('grow-0 → flex-grow: 0', () => {
      const rule = generateCSS(makeParsed('grow', '0'), 'grow-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-grow': '0' });
    });

    it('shrink (no value) → flex-shrink: 1', () => {
      const rule = generateCSS(makeParsed('shrink'), 'shrink');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-shrink': '1' });
    });

    it('shrink-0 → flex-shrink: 0', () => {
      const rule = generateCSS(makeParsed('shrink', '0'), 'shrink-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-shrink': '0' });
    });

    it('grow with invalid value returns null', () => {
      const rule = generateCSS(makeParsed('grow', 'invalid'), 'grow-invalid');
      expect(rule).toBeNull();
    });
  });

  describe('Alignment: items-* (align-items)', () => {
    it('items-start → align-items: flex-start', () => {
      const rule = generateCSS(makeParsed('items', 'start'), 'items-start');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-items': 'flex-start' });
    });

    it('items-end → align-items: flex-end', () => {
      const rule = generateCSS(makeParsed('items', 'end'), 'items-end');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-items': 'flex-end' });
    });

    it('items-center → align-items: center', () => {
      const rule = generateCSS(makeParsed('items', 'center'), 'items-center');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-items': 'center' });
    });

    it('items-baseline → align-items: baseline', () => {
      const rule = generateCSS(makeParsed('items', 'baseline'), 'items-baseline');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-items': 'baseline' });
    });

    it('items-stretch → align-items: stretch', () => {
      const rule = generateCSS(makeParsed('items', 'stretch'), 'items-stretch');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-items': 'stretch' });
    });

    it('items with invalid value returns null', () => {
      const rule = generateCSS(makeParsed('items', 'invalid'), 'items-invalid');
      expect(rule).toBeNull();
    });
  });

  describe('Alignment: justify-* (justify-content)', () => {
    it('justify-start → justify-content: flex-start', () => {
      const rule = generateCSS(makeParsed('justify', 'start'), 'justify-start');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-content': 'flex-start' });
    });

    it('justify-end → justify-content: flex-end', () => {
      const rule = generateCSS(makeParsed('justify', 'end'), 'justify-end');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-content': 'flex-end' });
    });

    it('justify-center → justify-content: center', () => {
      const rule = generateCSS(makeParsed('justify', 'center'), 'justify-center');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-content': 'center' });
    });

    it('justify-between → justify-content: space-between', () => {
      const rule = generateCSS(makeParsed('justify', 'between'), 'justify-between');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-content': 'space-between' });
    });

    it('justify-around → justify-content: space-around', () => {
      const rule = generateCSS(makeParsed('justify', 'around'), 'justify-around');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-content': 'space-around' });
    });

    it('justify-evenly → justify-content: space-evenly', () => {
      const rule = generateCSS(makeParsed('justify', 'evenly'), 'justify-evenly');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-content': 'space-evenly' });
    });

    it('justify-stretch → justify-content: stretch', () => {
      const rule = generateCSS(makeParsed('justify', 'stretch'), 'justify-stretch');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-content': 'stretch' });
    });
  });

  describe('Alignment: content-* (align-content)', () => {
    it('content-start → align-content: flex-start', () => {
      const rule = generateCSS(makeParsed('content', 'start'), 'content-start');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-content': 'flex-start' });
    });

    it('content-end → align-content: flex-end', () => {
      const rule = generateCSS(makeParsed('content', 'end'), 'content-end');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-content': 'flex-end' });
    });

    it('content-center → align-content: center', () => {
      const rule = generateCSS(makeParsed('content', 'center'), 'content-center');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-content': 'center' });
    });

    it('content-between → align-content: space-between', () => {
      const rule = generateCSS(makeParsed('content', 'between'), 'content-between');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-content': 'space-between' });
    });

    it('content-around → align-content: space-around', () => {
      const rule = generateCSS(makeParsed('content', 'around'), 'content-around');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-content': 'space-around' });
    });

    it('content-evenly → align-content: space-evenly', () => {
      const rule = generateCSS(makeParsed('content', 'evenly'), 'content-evenly');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-content': 'space-evenly' });
    });

    it('content-stretch → align-content: stretch', () => {
      const rule = generateCSS(makeParsed('content', 'stretch'), 'content-stretch');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-content': 'stretch' });
    });
  });

  describe('Alignment: self-* (align-self)', () => {
    it('self-auto → align-self: auto', () => {
      const rule = generateCSS(makeParsed('self', 'auto'), 'self-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-self': 'auto' });
    });

    it('self-start → align-self: flex-start', () => {
      const rule = generateCSS(makeParsed('self', 'start'), 'self-start');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-self': 'flex-start' });
    });

    it('self-end → align-self: flex-end', () => {
      const rule = generateCSS(makeParsed('self', 'end'), 'self-end');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-self': 'flex-end' });
    });

    it('self-center → align-self: center', () => {
      const rule = generateCSS(makeParsed('self', 'center'), 'self-center');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-self': 'center' });
    });

    it('self-stretch → align-self: stretch', () => {
      const rule = generateCSS(makeParsed('self', 'stretch'), 'self-stretch');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-self': 'stretch' });
    });

    it('self-baseline → align-self: baseline', () => {
      const rule = generateCSS(makeParsed('self', 'baseline'), 'self-baseline');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'align-self': 'baseline' });
    });
  });

  describe('Alignment: justify-items-* (justify-items)', () => {
    it('justify-items-start → justify-items: start', () => {
      const rule = generateCSS(makeParsed('justify-items', 'start'), 'justify-items-start');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-items': 'start' });
    });

    it('justify-items-end → justify-items: end', () => {
      const rule = generateCSS(makeParsed('justify-items', 'end'), 'justify-items-end');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-items': 'end' });
    });

    it('justify-items-center → justify-items: center', () => {
      const rule = generateCSS(makeParsed('justify-items', 'center'), 'justify-items-center');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-items': 'center' });
    });

    it('justify-items-stretch → justify-items: stretch', () => {
      const rule = generateCSS(makeParsed('justify-items', 'stretch'), 'justify-items-stretch');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-items': 'stretch' });
    });
  });

  describe('Alignment: justify-self-* (justify-self)', () => {
    it('justify-self-auto → justify-self: auto', () => {
      const rule = generateCSS(makeParsed('justify-self', 'auto'), 'justify-self-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-self': 'auto' });
    });

    it('justify-self-start → justify-self: start', () => {
      const rule = generateCSS(makeParsed('justify-self', 'start'), 'justify-self-start');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-self': 'start' });
    });

    it('justify-self-end → justify-self: end', () => {
      const rule = generateCSS(makeParsed('justify-self', 'end'), 'justify-self-end');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-self': 'end' });
    });

    it('justify-self-center → justify-self: center', () => {
      const rule = generateCSS(makeParsed('justify-self', 'center'), 'justify-self-center');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-self': 'center' });
    });

    it('justify-self-stretch → justify-self: stretch', () => {
      const rule = generateCSS(makeParsed('justify-self', 'stretch'), 'justify-self-stretch');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'justify-self': 'stretch' });
    });
  });

  describe('Alignment: place-content-* (place-content)', () => {
    it('place-content-start → place-content: start', () => {
      const rule = generateCSS(makeParsed('place-content', 'start'), 'place-content-start');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-content': 'start' });
    });

    it('place-content-end → place-content: end', () => {
      const rule = generateCSS(makeParsed('place-content', 'end'), 'place-content-end');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-content': 'end' });
    });

    it('place-content-center → place-content: center', () => {
      const rule = generateCSS(makeParsed('place-content', 'center'), 'place-content-center');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-content': 'center' });
    });

    it('place-content-between → place-content: space-between', () => {
      const rule = generateCSS(makeParsed('place-content', 'between'), 'place-content-between');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-content': 'space-between' });
    });

    it('place-content-around → place-content: space-around', () => {
      const rule = generateCSS(makeParsed('place-content', 'around'), 'place-content-around');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-content': 'space-around' });
    });

    it('place-content-evenly → place-content: space-evenly', () => {
      const rule = generateCSS(makeParsed('place-content', 'evenly'), 'place-content-evenly');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-content': 'space-evenly' });
    });

    it('place-content-stretch → place-content: stretch', () => {
      const rule = generateCSS(makeParsed('place-content', 'stretch'), 'place-content-stretch');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-content': 'stretch' });
    });
  });

  describe('Alignment: place-items-* (place-items)', () => {
    it('place-items-start → place-items: start', () => {
      const rule = generateCSS(makeParsed('place-items', 'start'), 'place-items-start');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-items': 'start' });
    });

    it('place-items-end → place-items: end', () => {
      const rule = generateCSS(makeParsed('place-items', 'end'), 'place-items-end');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-items': 'end' });
    });

    it('place-items-center → place-items: center', () => {
      const rule = generateCSS(makeParsed('place-items', 'center'), 'place-items-center');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-items': 'center' });
    });

    it('place-items-stretch → place-items: stretch', () => {
      const rule = generateCSS(makeParsed('place-items', 'stretch'), 'place-items-stretch');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-items': 'stretch' });
    });
  });

  describe('Alignment: place-self-* (place-self)', () => {
    it('place-self-auto → place-self: auto', () => {
      const rule = generateCSS(makeParsed('place-self', 'auto'), 'place-self-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-self': 'auto' });
    });

    it('place-self-start → place-self: start', () => {
      const rule = generateCSS(makeParsed('place-self', 'start'), 'place-self-start');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-self': 'start' });
    });

    it('place-self-end → place-self: end', () => {
      const rule = generateCSS(makeParsed('place-self', 'end'), 'place-self-end');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-self': 'end' });
    });

    it('place-self-center → place-self: center', () => {
      const rule = generateCSS(makeParsed('place-self', 'center'), 'place-self-center');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-self': 'center' });
    });

    it('place-self-stretch → place-self: stretch', () => {
      const rule = generateCSS(makeParsed('place-self', 'stretch'), 'place-self-stretch');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'place-self': 'stretch' });
    });
  });

  describe('Order Utilities', () => {
    it('order-1 → order: 1', () => {
      const rule = generateCSS(makeParsed('order', '1'), 'order-1');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ order: '1' });
    });

    it('order-6 → order: 6', () => {
      const rule = generateCSS(makeParsed('order', '6'), 'order-6');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ order: '6' });
    });

    it('order-12 → order: 12', () => {
      const rule = generateCSS(makeParsed('order', '12'), 'order-12');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ order: '12' });
    });

    it('order-first → order: -9999', () => {
      const rule = generateCSS(makeParsed('order', 'first'), 'order-first');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ order: '-9999' });
    });

    it('order-last → order: 9999', () => {
      const rule = generateCSS(makeParsed('order', 'last'), 'order-last');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ order: '9999' });
    });

    it('order-none → order: 0', () => {
      const rule = generateCSS(makeParsed('order', 'none'), 'order-none');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ order: '0' });
    });

    it('order with arbitrary value', () => {
      const rule = generateCSS(makeParsed('order', '[99]'), 'order-[99]');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ order: '99' });
    });

    it('order with out-of-range value returns null', () => {
      const rule = generateCSS(makeParsed('order', '13'), 'order-13');
      expect(rule).toBeNull();
    });

    it('order with no value returns null', () => {
      const rule = generateCSS(makeParsed('order'), 'order');
      expect(rule).toBeNull();
    });
  });

  describe('CSS Selector Generation', () => {
    it('should produce correct selector for flex-row', () => {
      const rule = generateCSS(makeParsed('flex-row'), 'flex-row');
      expect(rule).not.toBeNull();
      expect(rule!.selector).toBe('.flex-row');
    });

    it('should produce correct selector for items-center', () => {
      const rule = generateCSS(makeParsed('items', 'center'), 'items-center');
      expect(rule).not.toBeNull();
      expect(rule!.selector).toBe('.items-center');
    });

    it('should produce correct selector for justify-between', () => {
      const rule = generateCSS(makeParsed('justify', 'between'), 'justify-between');
      expect(rule).not.toBeNull();
      expect(rule!.selector).toBe('.justify-between');
    });
  });
});
