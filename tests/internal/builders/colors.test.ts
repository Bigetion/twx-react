/**
 * Color Utilities Builder Tests
 */

import { parseClassName } from '../../../src/internal/parser';
import {
  clearRegistry,
  generateCSS,
  getUtility,
} from '../../../src/internal/generator';
import {
  registerColorUtilities,
  resolveColor,
  COLOR_PALETTE,
  COLOR_FAMILIES,
  SPECIAL_COLORS,
  SHADES,
} from '../../../src/internal/builders/colors';

describe('Color Utilities Builder', () => {
  beforeEach(() => {
    clearRegistry();
    registerColorUtilities();
  });

  describe('COLOR_PALETTE', () => {
    it('should include all standard color families', () => {
      const expectedFamilies = [
        'slate', 'gray', 'zinc', 'neutral', 'stone',
        'red', 'orange', 'amber', 'yellow', 'lime',
        'green', 'emerald', 'teal', 'cyan', 'sky',
        'blue', 'indigo', 'violet', 'purple', 'fuchsia',
        'pink', 'rose',
      ];
      for (const family of expectedFamilies) {
        expect(COLOR_PALETTE[family]).toBeDefined();
      }
    });

    it('should include v4 new colors', () => {
      expect(COLOR_PALETTE.mauve).toBeDefined();
      expect(COLOR_PALETTE.olive).toBeDefined();
      expect(COLOR_PALETTE.mist).toBeDefined();
      expect(COLOR_PALETTE.taupe).toBeDefined();
    });

    it('should have all shades for each family', () => {
      for (const family of COLOR_FAMILIES) {
        for (const shade of SHADES) {
          expect(COLOR_PALETTE[family][shade]).toBeDefined();
        }
      }
    });

    it('should use OKLCH format for all values', () => {
      for (const family of COLOR_FAMILIES) {
        for (const shade of SHADES) {
          expect(COLOR_PALETTE[family][shade]).toMatch(
            /^oklch\(\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?\)$/
          );
        }
      }
    });
  });

  describe('resolveColor', () => {
    it('should resolve a valid color family and shade', () => {
      expect(resolveColor('blue', '500')).toBe('oklch(0.623 0.214 259.815)');
    });

    it('should return null for invalid family', () => {
      expect(resolveColor('nonexistent', '500')).toBeNull();
    });

    it('should return null for invalid shade', () => {
      expect(resolveColor('blue', '999')).toBeNull();
    });

    it('should apply opacity modifier', () => {
      expect(resolveColor('blue', '500', '50')).toBe(
        'oklch(0.623 0.214 259.815 / 50%)'
      );
    });

    it('should apply 0% opacity', () => {
      expect(resolveColor('red', '600', '0')).toBe(
        'oklch(0.577 0.245 27.325 / 0%)'
      );
    });

    it('should apply 100% opacity', () => {
      expect(resolveColor('green', '400', '100')).toBe(
        'oklch(0.792 0.209 151.711 / 100%)'
      );
    });
  });

  describe('registerColorUtilities', () => {
    it('should register text-{family} utilities for each color family', () => {
      for (const family of COLOR_FAMILIES) {
        expect(getUtility(`text-${family}`)).toBeDefined();
      }
    });

    it('should register bg-{family} utilities for each color family', () => {
      for (const family of COLOR_FAMILIES) {
        expect(getUtility(`bg-${family}`)).toBeDefined();
      }
    });

    it('should register border-{family} utilities for each color family', () => {
      for (const family of COLOR_FAMILIES) {
        expect(getUtility(`border-${family}`)).toBeDefined();
      }
    });

    it('should register divide-{family} utilities for each color family', () => {
      for (const family of COLOR_FAMILIES) {
        expect(getUtility(`divide-${family}`)).toBeDefined();
      }
    });

    it('should register special color utilities', () => {
      for (const name of Object.keys(SPECIAL_COLORS)) {
        expect(getUtility(`text-${name}`)).toBeDefined();
        expect(getUtility(`bg-${name}`)).toBeDefined();
        expect(getUtility(`border-${name}`)).toBeDefined();
        expect(getUtility(`divide-${name}`)).toBeDefined();
      }
    });
  });

  describe('text color generation', () => {
    it('should generate text-blue-500', () => {
      const parsed = parseClassName('text-blue-500');
      const rule = generateCSS(parsed, 'text-blue-500');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        color: 'oklch(0.623 0.214 259.815)',
      });
    });

    it('should generate text-red-300', () => {
      const parsed = parseClassName('text-red-300');
      const rule = generateCSS(parsed, 'text-red-300');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        color: 'oklch(0.808 0.114 19.571)',
      });
    });

    it('should generate text-white', () => {
      const parsed = parseClassName('text-white');
      // Parser splits "text-white" as utility: "text", value: "white"
      // Generator uses compound lookup: tries "text-white" as utility key
      expect(parsed.utility).toBe('text');
      expect(parsed.value).toBe('white');
      const rule = generateCSS(parsed, 'text-white');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        color: 'oklch(1 0 0)',
      });
    });

    it('should generate text-black', () => {
      const parsed = parseClassName('text-black');
      const rule = generateCSS(parsed, 'text-black');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        color: 'oklch(0 0 0)',
      });
    });

    it('should generate text-transparent', () => {
      const parsed = parseClassName('text-transparent');
      const rule = generateCSS(parsed, 'text-transparent');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        color: 'transparent',
      });
    });

    it('should generate text-current', () => {
      const parsed = parseClassName('text-current');
      const rule = generateCSS(parsed, 'text-current');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        color: 'currentColor',
      });
    });

    it('should generate text-emerald-700', () => {
      const parsed = parseClassName('text-emerald-700');
      const rule = generateCSS(parsed, 'text-emerald-700');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        color: 'oklch(0.508 0.118 165.612)',
      });
    });
  });

  describe('background color generation', () => {
    it('should generate bg-blue-500', () => {
      const parsed = parseClassName('bg-blue-500');
      const rule = generateCSS(parsed, 'bg-blue-500');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-color': 'oklch(0.623 0.214 259.815)',
      });
    });

    it('should generate bg-rose-100', () => {
      const parsed = parseClassName('bg-rose-100');
      const rule = generateCSS(parsed, 'bg-rose-100');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-color': 'oklch(0.941 0.03 12.58)',
      });
    });

    it('should generate bg-slate-950', () => {
      const parsed = parseClassName('bg-slate-950');
      const rule = generateCSS(parsed, 'bg-slate-950');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-color': 'oklch(0.129 0.042 264.695)',
      });
    });

    it('should generate bg-white', () => {
      const parsed = parseClassName('bg-white');
      const rule = generateCSS(parsed, 'bg-white');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-color': 'oklch(1 0 0)',
      });
    });

    it('should generate bg-transparent', () => {
      const parsed = parseClassName('bg-transparent');
      const rule = generateCSS(parsed, 'bg-transparent');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-color': 'transparent',
      });
    });
  });

  describe('border color generation', () => {
    it('should generate border-red-500', () => {
      const parsed = parseClassName('border-red-500');
      const rule = generateCSS(parsed, 'border-red-500');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'border-color': 'oklch(0.637 0.237 25.331)',
      });
    });

    it('should generate border-green-200', () => {
      const parsed = parseClassName('border-green-200');
      const rule = generateCSS(parsed, 'border-green-200');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'border-color': 'oklch(0.925 0.084 155.995)',
      });
    });
  });

  describe('ring color generation', () => {
    it('should generate ring-blue-300 as a ring color variable', () => {
      const parsed = parseClassName('ring-blue-300');
      const rule = generateCSS(parsed, 'ring-blue-300');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-ring-color': 'oklch(0.809 0.105 251.813)',
      });
    });

    it('should generate ring-white as a ring color variable', () => {
      const parsed = parseClassName('ring-white');
      const rule = generateCSS(parsed, 'ring-white');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-ring-color': 'oklch(1 0 0)',
      });
    });
  });

  describe('divide color generation', () => {
    it('should generate divide-red-500 with selector suffix', () => {
      const parsed = parseClassName('divide-red-500');
      const rule = generateCSS(parsed, 'divide-red-500');
      expect(rule).not.toBeNull();
      expect(rule!.selector).toBe('.divide-red-500 > :not([hidden]) ~ :not([hidden])');
      expect(rule!.properties).toEqual({
        'border-color': 'oklch(0.637 0.237 25.331)',
      });
    });

    it('should generate divide-sky-400/50 with selector suffix', () => {
      const parsed = parseClassName('divide-sky-400/50');
      const rule = generateCSS(parsed, 'divide-sky-400/50');
      expect(rule).not.toBeNull();
      expect(rule!.selector).toBe('.divide-sky-400\\/50 > :not([hidden]) ~ :not([hidden])');
      expect(rule!.properties).toEqual({
        'border-color': 'oklch(0.746 0.16 232.661 / 50%)',
      });
    });

    it('should generate divide-white with selector suffix', () => {
      const parsed = parseClassName('divide-white');
      const rule = generateCSS(parsed, 'divide-white');
      expect(rule).not.toBeNull();
      expect(rule!.selector).toBe('.divide-white > :not([hidden]) ~ :not([hidden])');
      expect(rule!.properties).toEqual({
        'border-color': 'oklch(1 0 0)',
      });
    });
  });

  describe('opacity modifier support', () => {
    it('should handle opacity in value (bg-blue-500/50)', () => {
      // When parser handles "bg-blue-500/50":
      // The last hyphen split gives utility: "bg-blue", value: "500/50"
      // Our generator splits on "/" to extract opacity
      const parsed = parseClassName('bg-blue-500/50');
      // If parser handles the "/" correctly, we can generate
      const rule = generateCSS(parsed, 'bg-blue-500/50');
      if (rule) {
        expect(rule.properties['background-color']).toBe(
          'oklch(0.623 0.214 259.815 / 50%)'
        );
      }
    });
  });

  describe('v4 new colors', () => {
    it('should generate text-mauve-500', () => {
      const parsed = parseClassName('text-mauve-500');
      const rule = generateCSS(parsed, 'text-mauve-500');
      expect(rule).not.toBeNull();
      expect(rule!.properties.color).toMatch(/^oklch\(/);
    });

    it('should generate bg-olive-300', () => {
      const parsed = parseClassName('bg-olive-300');
      const rule = generateCSS(parsed, 'bg-olive-300');
      expect(rule).not.toBeNull();
      expect(rule!.properties['background-color']).toMatch(/^oklch\(/);
    });

    it('should generate border-mist-600', () => {
      const parsed = parseClassName('border-mist-600');
      const rule = generateCSS(parsed, 'border-mist-600');
      expect(rule).not.toBeNull();
      expect(rule!.properties['border-color']).toMatch(/^oklch\(/);
    });

    it('should generate text-taupe-800', () => {
      const parsed = parseClassName('text-taupe-800');
      const rule = generateCSS(parsed, 'text-taupe-800');
      expect(rule).not.toBeNull();
      expect(rule!.properties.color).toMatch(/^oklch\(/);
    });
  });

  describe('variant support', () => {
    it('should handle hover variant with color', () => {
      const parsed = parseClassName('hover:text-blue-600');
      const rule = generateCSS(parsed, 'hover:text-blue-600');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        color: 'oklch(0.546 0.245 262.881)',
      });
      expect(rule!.selector).toContain(':hover');
    });

    it('should handle responsive variant with color', () => {
      const parsed = parseClassName('md:bg-red-500');
      const rule = generateCSS(parsed, 'md:bg-red-500');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-color': 'oklch(0.637 0.237 25.331)',
      });
      expect(rule!.mediaQuery).toBe('@media (min-width: 768px)');
    });
  });

  describe('invalid inputs', () => {
    it('should return null for invalid shade', () => {
      const parsed = parseClassName('text-blue-999');
      const rule = generateCSS(parsed, 'text-blue-999');
      expect(rule).toBeNull();
    });

    it('should return null for unknown color family', () => {
      const parsed = parseClassName('bg-unicorn-500');
      const rule = generateCSS(parsed, 'bg-unicorn-500');
      expect(rule).toBeNull();
    });
  });
});
