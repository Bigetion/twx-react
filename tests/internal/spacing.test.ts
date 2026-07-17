/**
 * @jest-environment node
 */

/**
 * Tests for spacing utilities builder
 * Task 3.2: Spacing utilities (margin, padding, gap, space-between)
 */

import {
  clearRegistry,
  generateCSS,
} from '../../src/internal/generator';
import type { ParsedClass } from '../../src/internal/parser';
import {
  registerSpacingUtilities,
  SPACING_SCALE,
  resolveSpacingValue,
  applyNegative,
} from '../../src/internal/builders/spacing';

beforeEach(() => {
  clearRegistry();
  registerSpacingUtilities();
});

describe('Spacing Utilities Builder (Task 3.2)', () => {

  describe('SPACING_SCALE', () => {
    it('should have 0 as 0px', () => {
      expect(SPACING_SCALE['0']).toBe('0px');
    });

    it('should have px as 1px', () => {
      expect(SPACING_SCALE['px']).toBe('1px');
    });

    it('should have auto as auto', () => {
      expect(SPACING_SCALE['auto']).toBe('auto');
    });

    it('should have fractional values', () => {
      expect(SPACING_SCALE['0.5']).toBe('0.125rem');
      expect(SPACING_SCALE['1.5']).toBe('0.375rem');
      expect(SPACING_SCALE['2.5']).toBe('0.625rem');
      expect(SPACING_SCALE['3.5']).toBe('0.875rem');
    });

    it('should have integer values (multiply by 0.25rem)', () => {
      expect(SPACING_SCALE['1']).toBe('0.25rem');
      expect(SPACING_SCALE['2']).toBe('0.5rem');
      expect(SPACING_SCALE['4']).toBe('1rem');
      expect(SPACING_SCALE['8']).toBe('2rem');
      expect(SPACING_SCALE['16']).toBe('4rem');
      expect(SPACING_SCALE['96']).toBe('24rem');
    });

    it('should have all expected scale values', () => {
      const expectedKeys = [
        '0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4',
        '5', '6', '7', '8', '9', '10', '11', '12', '14', '16',
        '20', '24', '28', '32', '36', '40', '44', '48', '52', '56',
        '60', '64', '72', '80', '96', 'auto',
      ];
      for (const key of expectedKeys) {
        expect(key in SPACING_SCALE).toBe(true);
      }
    });
  });

  describe('resolveSpacingValue', () => {
    it('should resolve a scale value', () => {
      const parsed: ParsedClass = { utility: 'p', value: '4', variants: [], modifiers: [] };
      expect(resolveSpacingValue(parsed)).toBe('1rem');
    });

    it('should resolve arbitrary values', () => {
      const parsed: ParsedClass = { utility: 'p', value: '[2.5rem]', variants: [], modifiers: [], arbitrary: true };
      expect(resolveSpacingValue(parsed)).toBe('2.5rem');
    });

    it('should resolve arbitrary calc values', () => {
      const parsed: ParsedClass = { utility: 'm', value: '[calc(100%-2rem)]', variants: [], modifiers: [], arbitrary: true };
      expect(resolveSpacingValue(parsed)).toBe('calc(100%-2rem)');
    });

    it('should return null for missing value', () => {
      const parsed: ParsedClass = { utility: 'p', variants: [], modifiers: [] };
      expect(resolveSpacingValue(parsed)).toBeNull();
    });

    it('should return null for unknown scale value', () => {
      const parsed: ParsedClass = { utility: 'p', value: '99', variants: [], modifiers: [] };
      expect(resolveSpacingValue(parsed)).toBeNull();
    });
  });

  describe('applyNegative', () => {
    it('should negate a positive value when negative modifier is present', () => {
      const parsed: ParsedClass = { utility: 'm', value: '4', variants: [], modifiers: ['negative'] };
      expect(applyNegative('1rem', parsed)).toBe('-1rem');
    });

    it('should not negate when no negative modifier', () => {
      const parsed: ParsedClass = { utility: 'm', value: '4', variants: [], modifiers: [] };
      expect(applyNegative('1rem', parsed)).toBe('1rem');
    });

    it('should not negate 0px', () => {
      const parsed: ParsedClass = { utility: 'm', value: '0', variants: [], modifiers: ['negative'] };
      expect(applyNegative('0px', parsed)).toBe('0px');
    });

    it('should not negate auto', () => {
      const parsed: ParsedClass = { utility: 'm', value: 'auto', variants: [], modifiers: ['negative'] };
      expect(applyNegative('auto', parsed)).toBe('auto');
    });
  });

  describe('Margin Utilities', () => {
    it('should generate m-4 → margin: 1rem', () => {
      const parsed: ParsedClass = { utility: 'm', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'm-4');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ margin: '1rem' });
    });

    it('should generate m-0 → margin: 0px', () => {
      const parsed: ParsedClass = { utility: 'm', value: '0', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'm-0');
      expect(rule!.properties).toEqual({ margin: '0px' });
    });

    it('should generate m-px → margin: 1px', () => {
      const parsed: ParsedClass = { utility: 'm', value: 'px', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'm-px');
      expect(rule!.properties).toEqual({ margin: '1px' });
    });

    it('should generate m-auto → margin: auto', () => {
      const parsed: ParsedClass = { utility: 'm', value: 'auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'm-auto');
      expect(rule!.properties).toEqual({ margin: 'auto' });
    });

    it('should generate negative -m-4 → margin: -1rem', () => {
      const parsed: ParsedClass = { utility: 'm', value: '4', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-m-4');
      expect(rule!.properties).toEqual({ margin: '-1rem' });
    });

    it('should generate mx-4 → margin-left + margin-right', () => {
      const parsed: ParsedClass = { utility: 'mx', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'mx-4');
      expect(rule!.properties).toEqual({ 'margin-left': '1rem', 'margin-right': '1rem' });
    });

    it('should generate my-2 → margin-top + margin-bottom', () => {
      const parsed: ParsedClass = { utility: 'my', value: '2', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'my-2');
      expect(rule!.properties).toEqual({ 'margin-top': '0.5rem', 'margin-bottom': '0.5rem' });
    });

    it('should generate mt-8 → margin-top', () => {
      const parsed: ParsedClass = { utility: 'mt', value: '8', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'mt-8');
      expect(rule!.properties).toEqual({ 'margin-top': '2rem' });
    });

    it('should generate mr-6 → margin-right', () => {
      const parsed: ParsedClass = { utility: 'mr', value: '6', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'mr-6');
      expect(rule!.properties).toEqual({ 'margin-right': '1.5rem' });
    });

    it('should generate mb-4 → margin-bottom', () => {
      const parsed: ParsedClass = { utility: 'mb', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'mb-4');
      expect(rule!.properties).toEqual({ 'margin-bottom': '1rem' });
    });

    it('should generate ml-2 → margin-left', () => {
      const parsed: ParsedClass = { utility: 'ml', value: '2', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'ml-2');
      expect(rule!.properties).toEqual({ 'margin-left': '0.5rem' });
    });

    it('should generate ms-4 → margin-inline-start', () => {
      const parsed: ParsedClass = { utility: 'ms', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'ms-4');
      expect(rule!.properties).toEqual({ 'margin-inline-start': '1rem' });
    });

    it('should generate me-4 → margin-inline-end', () => {
      const parsed: ParsedClass = { utility: 'me', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'me-4');
      expect(rule!.properties).toEqual({ 'margin-inline-end': '1rem' });
    });

    it('should support negative mx → negative margin-left + margin-right', () => {
      const parsed: ParsedClass = { utility: 'mx', value: '2', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-mx-2');
      expect(rule!.properties).toEqual({ 'margin-left': '-0.5rem', 'margin-right': '-0.5rem' });
    });

    it('should support fractional values m-0.5', () => {
      const parsed: ParsedClass = { utility: 'm', value: '0.5', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'm-0.5');
      expect(rule!.properties).toEqual({ margin: '0.125rem' });
    });

    it('should support arbitrary margin m-[2.5rem]', () => {
      const parsed: ParsedClass = { utility: 'm', value: '[2.5rem]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'm-[2.5rem]');
      expect(rule!.properties).toEqual({ margin: '2.5rem' });
    });

    it('should return null for unsupported value', () => {
      const parsed: ParsedClass = { utility: 'm', value: '999', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'm-999');
      expect(rule).toBeNull();
    });
  });

  describe('Padding Utilities', () => {
    it('should generate p-4 → padding: 1rem', () => {
      const parsed: ParsedClass = { utility: 'p', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'p-4');
      expect(rule!.properties).toEqual({ padding: '1rem' });
    });

    it('should generate p-0 → padding: 0px', () => {
      const parsed: ParsedClass = { utility: 'p', value: '0', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'p-0');
      expect(rule!.properties).toEqual({ padding: '0px' });
    });

    it('should generate px-4 → padding-left + padding-right', () => {
      const parsed: ParsedClass = { utility: 'px', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'px-4');
      expect(rule!.properties).toEqual({ 'padding-left': '1rem', 'padding-right': '1rem' });
    });

    it('should generate py-2 → padding-top + padding-bottom', () => {
      const parsed: ParsedClass = { utility: 'py', value: '2', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'py-2');
      expect(rule!.properties).toEqual({ 'padding-top': '0.5rem', 'padding-bottom': '0.5rem' });
    });

    it('should generate pt-8 → padding-top', () => {
      const parsed: ParsedClass = { utility: 'pt', value: '8', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'pt-8');
      expect(rule!.properties).toEqual({ 'padding-top': '2rem' });
    });

    it('should generate pr-6 → padding-right', () => {
      const parsed: ParsedClass = { utility: 'pr', value: '6', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'pr-6');
      expect(rule!.properties).toEqual({ 'padding-right': '1.5rem' });
    });

    it('should generate pb-4 → padding-bottom', () => {
      const parsed: ParsedClass = { utility: 'pb', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'pb-4');
      expect(rule!.properties).toEqual({ 'padding-bottom': '1rem' });
    });

    it('should generate pl-2 → padding-left', () => {
      const parsed: ParsedClass = { utility: 'pl', value: '2', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'pl-2');
      expect(rule!.properties).toEqual({ 'padding-left': '0.5rem' });
    });

    it('should generate ps-4 → padding-inline-start', () => {
      const parsed: ParsedClass = { utility: 'ps', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'ps-4');
      expect(rule!.properties).toEqual({ 'padding-inline-start': '1rem' });
    });

    it('should generate pe-4 → padding-inline-end', () => {
      const parsed: ParsedClass = { utility: 'pe', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'pe-4');
      expect(rule!.properties).toEqual({ 'padding-inline-end': '1rem' });
    });

    it('should support arbitrary padding p-[20px]', () => {
      const parsed: ParsedClass = { utility: 'p', value: '[20px]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'p-[20px]');
      expect(rule!.properties).toEqual({ padding: '20px' });
    });

    it('should return null for unsupported value', () => {
      const parsed: ParsedClass = { utility: 'p', value: '999', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'p-999');
      expect(rule).toBeNull();
    });
  });

  describe('Gap Utilities', () => {
    it('should generate gap-4 → gap: 1rem', () => {
      const parsed: ParsedClass = { utility: 'gap', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'gap-4');
      expect(rule!.properties).toEqual({ gap: '1rem' });
    });

    it('should generate gap-0 → gap: 0px', () => {
      const parsed: ParsedClass = { utility: 'gap', value: '0', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'gap-0');
      expect(rule!.properties).toEqual({ gap: '0px' });
    });

    it('should generate gap-x-4 → column-gap: 1rem', () => {
      const parsed: ParsedClass = { utility: 'gap-x', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'gap-x-4');
      expect(rule!.properties).toEqual({ 'column-gap': '1rem' });
    });

    it('should generate gap-y-2 → row-gap: 0.5rem', () => {
      const parsed: ParsedClass = { utility: 'gap-y', value: '2', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'gap-y-2');
      expect(rule!.properties).toEqual({ 'row-gap': '0.5rem' });
    });

    it('should support arbitrary gap gap-[10px]', () => {
      const parsed: ParsedClass = { utility: 'gap', value: '[10px]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'gap-[10px]');
      expect(rule!.properties).toEqual({ gap: '10px' });
    });
  });

  describe('Space Between Utilities', () => {
    it('should generate space-x-4 → margin-inline-start: 1rem', () => {
      const parsed: ParsedClass = { utility: 'space-x', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'space-x-4');
      expect(rule!.properties).toEqual({ 'margin-inline-start': 'calc(1rem * calc(1 - 2 * var(--tw-space-x-reverse, 0)))' });
    });

    it('should generate space-y-2 → margin-top: 0.5rem', () => {
      const parsed: ParsedClass = { utility: 'space-y', value: '2', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'space-y-2');
      expect(rule!.properties).toEqual({ 'margin-top': 'calc(0.5rem * calc(1 - 2 * var(--tw-space-y-reverse, 0)))' });
    });

    it('should generate negative -space-x-4 → margin-inline-start: -1rem', () => {
      const parsed: ParsedClass = { utility: 'space-x', value: '4', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-space-x-4');
      expect(rule!.properties).toEqual({ 'margin-inline-start': 'calc(-1rem * calc(1 - 2 * var(--tw-space-x-reverse, 0)))' });
    });

    it('should generate negative -space-y-2 → margin-top: -0.5rem', () => {
      const parsed: ParsedClass = { utility: 'space-y', value: '2', variants: [], modifiers: ['negative'] };
      const rule = generateCSS(parsed, '-space-y-2');
      expect(rule!.properties).toEqual({ 'margin-top': 'calc(-0.5rem * calc(1 - 2 * var(--tw-space-y-reverse, 0)))' });
    });

    it('should generate space-x-0 → margin-inline-start: 0px', () => {
      const parsed: ParsedClass = { utility: 'space-x', value: '0', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'space-x-0');
      expect(rule!.properties).toEqual({ 'margin-inline-start': 'calc(0px * calc(1 - 2 * var(--tw-space-x-reverse, 0)))' });
    });
  });

  describe('Integration with Variants', () => {
    it('should work with responsive variant', () => {
      const parsed: ParsedClass = { utility: 'p', value: '4', variants: ['md'], modifiers: [] };
      const rule = generateCSS(parsed, 'md:p-4');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ padding: '1rem' });
      expect(rule!.mediaQuery).toBe('@media (min-width: 768px)');
    });

    it('should work with hover variant', () => {
      const parsed: ParsedClass = { utility: 'm', value: '2', variants: ['hover'], modifiers: [] };
      const rule = generateCSS(parsed, 'hover:m-2');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ margin: '0.5rem' });
      expect(rule!.selector).toBe('.hover\\:m-2:hover');
    });
  });
});
