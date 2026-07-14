/**
 * @jest-environment node
 */

/**
 * Tests for transform utilities builder
 * Task 3.12: Transform utilities (scale, rotate, translate, skew, origin)
 */

import {
  clearRegistry,
  generateCSS,
} from '../../../src/internal/generator';
import type { ParsedClass } from '../../../src/internal/parser';
import {
  registerTransformUtilities,
  SCALE_VALUES,
} from '../../../src/internal/builders/transforms';

beforeEach(() => {
  clearRegistry();
  registerTransformUtilities();
});

describe('Transform Utilities Builder (Task 3.12)', () => {

  describe('Scale Values Map', () => {
    it('should have all expected scale values', () => {
      expect(SCALE_VALUES['0']).toBe('0');
      expect(SCALE_VALUES['50']).toBe('0.5');
      expect(SCALE_VALUES['75']).toBe('0.75');
      expect(SCALE_VALUES['90']).toBe('0.9');
      expect(SCALE_VALUES['95']).toBe('0.95');
      expect(SCALE_VALUES['100']).toBe('1');
      expect(SCALE_VALUES['105']).toBe('1.05');
      expect(SCALE_VALUES['110']).toBe('1.1');
      expect(SCALE_VALUES['125']).toBe('1.25');
      expect(SCALE_VALUES['150']).toBe('1.5');
    });
  });

  describe('Scale Utilities', () => {
    it('should generate scale-0 → transform: scale(0)', () => {
      const parsed: ParsedClass = { utility: 'scale', value: '0', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'scale-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ transform: 'scale(0)' });
    });

    it('should generate scale-50 → transform: scale(0.5)', () => {
      const parsed: ParsedClass = { utility: 'scale', value: '50', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'scale-50');
      expect(rule!.properties).toEqual({ transform: 'scale(0.5)' });
    });

    it('should generate scale-100 → transform: scale(1)', () => {
      const parsed: ParsedClass = { utility: 'scale', value: '100', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'scale-100');
      expect(rule!.properties).toEqual({ transform: 'scale(1)' });
    });

    it('should generate scale-150 → transform: scale(1.5)', () => {
      const parsed: ParsedClass = { utility: 'scale', value: '150', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'scale-150');
      expect(rule!.properties).toEqual({ transform: 'scale(1.5)' });
    });

    it('should generate scale-x-50 → transform: scaleX(0.5)', () => {
      const parsed: ParsedClass = { utility: 'scale-x', value: '50', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'scale-x-50');
      expect(rule!.properties).toEqual({ transform: 'scaleX(0.5)' });
    });

    it('should generate scale-y-75 → transform: scaleY(0.75)', () => {
      const parsed: ParsedClass = { utility: 'scale-y', value: '75', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'scale-y-75');
      expect(rule!.properties).toEqual({ transform: 'scaleY(0.75)' });
    });

    it('should support arbitrary scale values', () => {
      const parsed: ParsedClass = { utility: 'scale', value: '[1.2]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'scale-[1.2]');
      expect(rule!.properties).toEqual({ transform: 'scale(1.2)' });
    });

    it('should return null for unsupported scale value', () => {
      const parsed: ParsedClass = { utility: 'scale', value: '200', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'scale-200');
      expect(rule).toBeNull();
    });
  });

  describe('Rotate Utilities', () => {
    it('should generate rotate-0 → transform: rotate(0deg)', () => {
      const parsed: ParsedClass = { utility: 'rotate', value: '0', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'rotate-0');
      expect(rule!.properties).toEqual({ transform: 'rotate(0deg)' });
    });

    it('should generate rotate-45 → transform: rotate(45deg)', () => {
      const parsed: ParsedClass = { utility: 'rotate', value: '45', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'rotate-45');
      expect(rule!.properties).toEqual({ transform: 'rotate(45deg)' });
    });

    it('should generate rotate-90 → transform: rotate(90deg)', () => {
      const parsed: ParsedClass = { utility: 'rotate', value: '90', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'rotate-90');
      expect(rule!.properties).toEqual({ transform: 'rotate(90deg)' });
    });

    it('should generate rotate-180 → transform: rotate(180deg)', () => {
      const parsed: ParsedClass = { utility: 'rotate', value: '180', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'rotate-180');
      expect(rule!.properties).toEqual({ transform: 'rotate(180deg)' });
    });

    it('should generate -rotate-45 → transform: rotate(-45deg)', () => {
      const parsed: ParsedClass = { utility: 'rotate', value: '45', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-rotate-45');
      expect(rule!.properties).toEqual({ transform: 'rotate(-45deg)' });
    });

    it('should generate -rotate-90 → transform: rotate(-90deg)', () => {
      const parsed: ParsedClass = { utility: 'rotate', value: '90', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-rotate-90');
      expect(rule!.properties).toEqual({ transform: 'rotate(-90deg)' });
    });

    it('should not negate rotate-0', () => {
      const parsed: ParsedClass = { utility: 'rotate', value: '0', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-rotate-0');
      expect(rule!.properties).toEqual({ transform: 'rotate(0deg)' });
    });

    it('should support arbitrary rotate values', () => {
      const parsed: ParsedClass = { utility: 'rotate', value: '[30deg]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'rotate-[30deg]');
      expect(rule!.properties).toEqual({ transform: 'rotate(30deg)' });
    });

    it('should return null for unsupported rotate value', () => {
      const parsed: ParsedClass = { utility: 'rotate', value: '99', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'rotate-99');
      expect(rule).toBeNull();
    });
  });

  describe('Translate Utilities', () => {
    it('should generate translate-x-0 → transform: translateX(0px)', () => {
      const parsed: ParsedClass = { utility: 'translate-x', value: '0', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'translate-x-0');
      expect(rule!.properties).toEqual({ transform: 'translateX(0px)' });
    });

    it('should generate translate-x-1 → transform: translateX(0.25rem)', () => {
      const parsed: ParsedClass = { utility: 'translate-x', value: '1', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'translate-x-1');
      expect(rule!.properties).toEqual({ transform: 'translateX(0.25rem)' });
    });

    it('should generate translate-x-4 → transform: translateX(1rem)', () => {
      const parsed: ParsedClass = { utility: 'translate-x', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'translate-x-4');
      expect(rule!.properties).toEqual({ transform: 'translateX(1rem)' });
    });

    it('should generate translate-x-full → transform: translateX(100%)', () => {
      const parsed: ParsedClass = { utility: 'translate-x', value: 'full', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'translate-x-full');
      expect(rule!.properties).toEqual({ transform: 'translateX(100%)' });
    });

    it('should generate translate-x-1/2 → transform: translateX(50%)', () => {
      const parsed: ParsedClass = { utility: 'translate-x', value: '1/2', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'translate-x-1/2');
      expect(rule!.properties).toEqual({ transform: 'translateX(50%)' });
    });

    it('should generate translate-y-4 → transform: translateY(1rem)', () => {
      const parsed: ParsedClass = { utility: 'translate-y', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'translate-y-4');
      expect(rule!.properties).toEqual({ transform: 'translateY(1rem)' });
    });

    it('should generate -translate-x-4 → transform: translateX(-1rem)', () => {
      const parsed: ParsedClass = { utility: 'translate-x', value: '4', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-translate-x-4');
      expect(rule!.properties).toEqual({ transform: 'translateX(-1rem)' });
    });

    it('should generate -translate-y-8 → transform: translateY(-2rem)', () => {
      const parsed: ParsedClass = { utility: 'translate-y', value: '8', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-translate-y-8');
      expect(rule!.properties).toEqual({ transform: 'translateY(-2rem)' });
    });

    it('should not negate translate-x-0', () => {
      const parsed: ParsedClass = { utility: 'translate-x', value: '0', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-translate-x-0');
      expect(rule!.properties).toEqual({ transform: 'translateX(0px)' });
    });

    it('should support arbitrary translate values', () => {
      const parsed: ParsedClass = { utility: 'translate-x', value: '[20px]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'translate-x-[20px]');
      expect(rule!.properties).toEqual({ transform: 'translateX(20px)' });
    });

    it('should support negative arbitrary translate values', () => {
      const parsed: ParsedClass = { utility: 'translate-x', value: '[20px]', variants: [], modifiers: ['negative'], arbitrary: true };
      const rule = generateCSS(parsed, '-translate-x-[20px]');
      expect(rule!.properties).toEqual({ transform: 'translateX(-20px)' });
    });

    it('should return null for unsupported translate value', () => {
      const parsed: ParsedClass = { utility: 'translate-x', value: 'unknown', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'translate-x-unknown');
      expect(rule).toBeNull();
    });
  });

  describe('Skew Utilities', () => {
    it('should generate skew-x-0 → transform: skewX(0deg)', () => {
      const parsed: ParsedClass = { utility: 'skew-x', value: '0', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'skew-x-0');
      expect(rule!.properties).toEqual({ transform: 'skewX(0deg)' });
    });

    it('should generate skew-x-3 → transform: skewX(3deg)', () => {
      const parsed: ParsedClass = { utility: 'skew-x', value: '3', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'skew-x-3');
      expect(rule!.properties).toEqual({ transform: 'skewX(3deg)' });
    });

    it('should generate skew-x-6 → transform: skewX(6deg)', () => {
      const parsed: ParsedClass = { utility: 'skew-x', value: '6', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'skew-x-6');
      expect(rule!.properties).toEqual({ transform: 'skewX(6deg)' });
    });

    it('should generate skew-x-12 → transform: skewX(12deg)', () => {
      const parsed: ParsedClass = { utility: 'skew-x', value: '12', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'skew-x-12');
      expect(rule!.properties).toEqual({ transform: 'skewX(12deg)' });
    });

    it('should generate skew-y-6 → transform: skewY(6deg)', () => {
      const parsed: ParsedClass = { utility: 'skew-y', value: '6', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'skew-y-6');
      expect(rule!.properties).toEqual({ transform: 'skewY(6deg)' });
    });

    it('should generate -skew-x-6 → transform: skewX(-6deg)', () => {
      const parsed: ParsedClass = { utility: 'skew-x', value: '6', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-skew-x-6');
      expect(rule!.properties).toEqual({ transform: 'skewX(-6deg)' });
    });

    it('should generate -skew-y-3 → transform: skewY(-3deg)', () => {
      const parsed: ParsedClass = { utility: 'skew-y', value: '3', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-skew-y-3');
      expect(rule!.properties).toEqual({ transform: 'skewY(-3deg)' });
    });

    it('should not negate skew-x-0', () => {
      const parsed: ParsedClass = { utility: 'skew-x', value: '0', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-skew-x-0');
      expect(rule!.properties).toEqual({ transform: 'skewX(0deg)' });
    });

    it('should support arbitrary skew values', () => {
      const parsed: ParsedClass = { utility: 'skew-x', value: '[15deg]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'skew-x-[15deg]');
      expect(rule!.properties).toEqual({ transform: 'skewX(15deg)' });
    });

    it('should return null for unsupported skew value', () => {
      const parsed: ParsedClass = { utility: 'skew-x', value: '99', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'skew-x-99');
      expect(rule).toBeNull();
    });
  });

  describe('Transform Origin Utilities', () => {
    it('should generate origin-center → transform-origin: center', () => {
      const parsed: ParsedClass = { utility: 'origin', value: 'center', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'origin-center');
      expect(rule!.properties).toEqual({ 'transform-origin': 'center' });
    });

    it('should generate origin-top → transform-origin: top', () => {
      const parsed: ParsedClass = { utility: 'origin', value: 'top', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'origin-top');
      expect(rule!.properties).toEqual({ 'transform-origin': 'top' });
    });

    it('should generate origin-right → transform-origin: right', () => {
      const parsed: ParsedClass = { utility: 'origin', value: 'right', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'origin-right');
      expect(rule!.properties).toEqual({ 'transform-origin': 'right' });
    });

    it('should generate origin-bottom → transform-origin: bottom', () => {
      const parsed: ParsedClass = { utility: 'origin', value: 'bottom', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'origin-bottom');
      expect(rule!.properties).toEqual({ 'transform-origin': 'bottom' });
    });

    it('should generate origin-left → transform-origin: left', () => {
      const parsed: ParsedClass = { utility: 'origin', value: 'left', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'origin-left');
      expect(rule!.properties).toEqual({ 'transform-origin': 'left' });
    });

    it('should generate origin-top-right → transform-origin: top right', () => {
      const parsed: ParsedClass = { utility: 'origin-top', value: 'right', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'origin-top-right');
      expect(rule!.properties).toEqual({ 'transform-origin': 'top right' });
    });

    it('should generate origin-top-left → transform-origin: top left', () => {
      const parsed: ParsedClass = { utility: 'origin-top', value: 'left', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'origin-top-left');
      expect(rule!.properties).toEqual({ 'transform-origin': 'top left' });
    });

    it('should generate origin-bottom-right → transform-origin: bottom right', () => {
      const parsed: ParsedClass = { utility: 'origin-bottom', value: 'right', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'origin-bottom-right');
      expect(rule!.properties).toEqual({ 'transform-origin': 'bottom right' });
    });

    it('should generate origin-bottom-left → transform-origin: bottom left', () => {
      const parsed: ParsedClass = { utility: 'origin-bottom', value: 'left', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'origin-bottom-left');
      expect(rule!.properties).toEqual({ 'transform-origin': 'bottom left' });
    });

    it('should support arbitrary origin values', () => {
      const parsed: ParsedClass = { utility: 'origin', value: '[33%_75%]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'origin-[33%_75%]');
      expect(rule!.properties).toEqual({ 'transform-origin': '33% 75%' });
    });

    it('should return null for unsupported origin value', () => {
      const parsed: ParsedClass = { utility: 'origin', value: 'unknown', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'origin-unknown');
      expect(rule).toBeNull();
    });
  });

  describe('Integration with Variants', () => {
    it('should work with responsive variant', () => {
      const parsed: ParsedClass = { utility: 'scale', value: '110', variants: ['md'], modifiers: [] };
      const rule = generateCSS(parsed, 'md:scale-110');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ transform: 'scale(1.1)' });
      expect(rule!.mediaQuery).toBe('@media (min-width: 768px)');
    });

    it('should work with hover variant', () => {
      const parsed: ParsedClass = { utility: 'rotate', value: '12', variants: ['hover'], modifiers: [] };
      const rule = generateCSS(parsed, 'hover:rotate-12');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ transform: 'rotate(12deg)' });
      expect(rule!.selector).toBe('.hover\\:rotate-12:hover');
    });
  });
});
