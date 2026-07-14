/**
 * Tests for Filter Utilities Builder
 */

import { registerFilterUtilities } from '../../../src/internal/builders/filters';
import { clearRegistry, generateCSS } from '../../../src/internal/generator';
import { parseClassName } from '../../../src/internal/parser';

// Register filter utilities before tests
beforeAll(() => {
  clearRegistry();
  registerFilterUtilities();
});

describe('Filter Utilities Builder', () => {
  // ─── Blur ─────────────────────────────────────────────────────────────────

  describe('blur utilities', () => {
    it('generates blur (default)', () => {
      const parsed = parseClassName('blur');
      const rule = generateCSS(parsed, 'blur');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'blur(8px)' });
    });

    it('generates blur-none', () => {
      const parsed = parseClassName('blur-none');
      const rule = generateCSS(parsed, 'blur-none');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'blur(0)' });
    });

    it('generates blur-sm', () => {
      const parsed = parseClassName('blur-sm');
      const rule = generateCSS(parsed, 'blur-sm');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'blur(4px)' });
    });

    it('generates blur-md', () => {
      const parsed = parseClassName('blur-md');
      const rule = generateCSS(parsed, 'blur-md');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'blur(12px)' });
    });

    it('generates blur-lg', () => {
      const parsed = parseClassName('blur-lg');
      const rule = generateCSS(parsed, 'blur-lg');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'blur(16px)' });
    });

    it('generates blur-xl', () => {
      const parsed = parseClassName('blur-xl');
      const rule = generateCSS(parsed, 'blur-xl');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'blur(24px)' });
    });

    it('generates blur-2xl', () => {
      const parsed = parseClassName('blur-2xl');
      const rule = generateCSS(parsed, 'blur-2xl');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'blur(40px)' });
    });

    it('generates blur-3xl', () => {
      const parsed = parseClassName('blur-3xl');
      const rule = generateCSS(parsed, 'blur-3xl');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'blur(64px)' });
    });

    it('returns null for invalid blur value', () => {
      const parsed = parseClassName('blur-invalid');
      const rule = generateCSS(parsed, 'blur-invalid');
      expect(rule).toBeNull();
    });
  });

  // ─── Brightness ───────────────────────────────────────────────────────────

  describe('brightness utilities', () => {
    it('generates brightness-0', () => {
      const parsed = parseClassName('brightness-0');
      const rule = generateCSS(parsed, 'brightness-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'brightness(0)' });
    });

    it('generates brightness-50', () => {
      const parsed = parseClassName('brightness-50');
      const rule = generateCSS(parsed, 'brightness-50');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'brightness(0.5)' });
    });

    it('generates brightness-75', () => {
      const parsed = parseClassName('brightness-75');
      const rule = generateCSS(parsed, 'brightness-75');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'brightness(0.75)' });
    });

    it('generates brightness-100', () => {
      const parsed = parseClassName('brightness-100');
      const rule = generateCSS(parsed, 'brightness-100');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'brightness(1)' });
    });

    it('generates brightness-150', () => {
      const parsed = parseClassName('brightness-150');
      const rule = generateCSS(parsed, 'brightness-150');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'brightness(1.5)' });
    });

    it('generates brightness-200', () => {
      const parsed = parseClassName('brightness-200');
      const rule = generateCSS(parsed, 'brightness-200');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'brightness(2)' });
    });

    it('returns null for invalid brightness value', () => {
      const parsed = parseClassName('brightness-999');
      const rule = generateCSS(parsed, 'brightness-999');
      expect(rule).toBeNull();
    });
  });

  // ─── Contrast ─────────────────────────────────────────────────────────────

  describe('contrast utilities', () => {
    it('generates contrast-0', () => {
      const parsed = parseClassName('contrast-0');
      const rule = generateCSS(parsed, 'contrast-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'contrast(0)' });
    });

    it('generates contrast-50', () => {
      const parsed = parseClassName('contrast-50');
      const rule = generateCSS(parsed, 'contrast-50');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'contrast(0.5)' });
    });

    it('generates contrast-100', () => {
      const parsed = parseClassName('contrast-100');
      const rule = generateCSS(parsed, 'contrast-100');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'contrast(1)' });
    });

    it('generates contrast-200', () => {
      const parsed = parseClassName('contrast-200');
      const rule = generateCSS(parsed, 'contrast-200');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'contrast(2)' });
    });

    it('returns null for invalid contrast value', () => {
      const parsed = parseClassName('contrast-999');
      const rule = generateCSS(parsed, 'contrast-999');
      expect(rule).toBeNull();
    });
  });

  // ─── Grayscale ────────────────────────────────────────────────────────────

  describe('grayscale utilities', () => {
    it('generates grayscale (default = 1)', () => {
      const parsed = parseClassName('grayscale');
      const rule = generateCSS(parsed, 'grayscale');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'grayscale(1)' });
    });

    it('generates grayscale-0', () => {
      const parsed = parseClassName('grayscale-0');
      const rule = generateCSS(parsed, 'grayscale-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'grayscale(0)' });
    });
  });

  // ─── Invert ───────────────────────────────────────────────────────────────

  describe('invert utilities', () => {
    it('generates invert (default = 1)', () => {
      const parsed = parseClassName('invert');
      const rule = generateCSS(parsed, 'invert');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'invert(1)' });
    });

    it('generates invert-0', () => {
      const parsed = parseClassName('invert-0');
      const rule = generateCSS(parsed, 'invert-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'invert(0)' });
    });
  });

  // ─── Sepia ────────────────────────────────────────────────────────────────

  describe('sepia utilities', () => {
    it('generates sepia (default = 1)', () => {
      const parsed = parseClassName('sepia');
      const rule = generateCSS(parsed, 'sepia');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'sepia(1)' });
    });

    it('generates sepia-0', () => {
      const parsed = parseClassName('sepia-0');
      const rule = generateCSS(parsed, 'sepia-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'sepia(0)' });
    });
  });

  // ─── Hue-Rotate ──────────────────────────────────────────────────────────

  describe('hue-rotate utilities', () => {
    it('generates hue-rotate-0', () => {
      const parsed = parseClassName('hue-rotate-0');
      const rule = generateCSS(parsed, 'hue-rotate-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'hue-rotate(0deg)' });
    });

    it('generates hue-rotate-15', () => {
      const parsed = parseClassName('hue-rotate-15');
      const rule = generateCSS(parsed, 'hue-rotate-15');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'hue-rotate(15deg)' });
    });

    it('generates hue-rotate-30', () => {
      const parsed = parseClassName('hue-rotate-30');
      const rule = generateCSS(parsed, 'hue-rotate-30');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'hue-rotate(30deg)' });
    });

    it('generates hue-rotate-60', () => {
      const parsed = parseClassName('hue-rotate-60');
      const rule = generateCSS(parsed, 'hue-rotate-60');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'hue-rotate(60deg)' });
    });

    it('generates hue-rotate-90', () => {
      const parsed = parseClassName('hue-rotate-90');
      const rule = generateCSS(parsed, 'hue-rotate-90');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'hue-rotate(90deg)' });
    });

    it('generates hue-rotate-180', () => {
      const parsed = parseClassName('hue-rotate-180');
      const rule = generateCSS(parsed, 'hue-rotate-180');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'hue-rotate(180deg)' });
    });

    it('generates negative -hue-rotate-60', () => {
      const parsed = parseClassName('-hue-rotate-60');
      const rule = generateCSS(parsed, '-hue-rotate-60');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'hue-rotate(-60deg)' });
    });

    it('returns null for invalid hue-rotate value', () => {
      const parsed = parseClassName('hue-rotate-999');
      const rule = generateCSS(parsed, 'hue-rotate-999');
      expect(rule).toBeNull();
    });
  });

  // ─── Saturate ─────────────────────────────────────────────────────────────

  describe('saturate utilities', () => {
    it('generates saturate-0', () => {
      const parsed = parseClassName('saturate-0');
      const rule = generateCSS(parsed, 'saturate-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'saturate(0)' });
    });

    it('generates saturate-50', () => {
      const parsed = parseClassName('saturate-50');
      const rule = generateCSS(parsed, 'saturate-50');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'saturate(0.5)' });
    });

    it('generates saturate-100', () => {
      const parsed = parseClassName('saturate-100');
      const rule = generateCSS(parsed, 'saturate-100');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'saturate(1)' });
    });

    it('generates saturate-150', () => {
      const parsed = parseClassName('saturate-150');
      const rule = generateCSS(parsed, 'saturate-150');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'saturate(1.5)' });
    });

    it('generates saturate-200', () => {
      const parsed = parseClassName('saturate-200');
      const rule = generateCSS(parsed, 'saturate-200');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ filter: 'saturate(2)' });
    });

    it('returns null for invalid saturate value', () => {
      const parsed = parseClassName('saturate-999');
      const rule = generateCSS(parsed, 'saturate-999');
      expect(rule).toBeNull();
    });
  });

  // ─── Drop Shadow ──────────────────────────────────────────────────────────

  describe('drop-shadow utilities', () => {
    it('generates drop-shadow (default)', () => {
      const parsed = parseClassName('drop-shadow');
      // Parser: "drop-shadow" → utility: "drop", value: "shadow"
      // But we register "drop-shadow" so compound lookup should find it
      const rule = generateCSS(parsed, 'drop-shadow');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))',
      });
    });

    it('generates drop-shadow-sm', () => {
      const parsed = parseClassName('drop-shadow-sm');
      const rule = generateCSS(parsed, 'drop-shadow-sm');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))',
      });
    });

    it('generates drop-shadow-md', () => {
      const parsed = parseClassName('drop-shadow-md');
      const rule = generateCSS(parsed, 'drop-shadow-md');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
      });
    });

    it('generates drop-shadow-lg', () => {
      const parsed = parseClassName('drop-shadow-lg');
      const rule = generateCSS(parsed, 'drop-shadow-lg');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
      });
    });

    it('generates drop-shadow-xl', () => {
      const parsed = parseClassName('drop-shadow-xl');
      const rule = generateCSS(parsed, 'drop-shadow-xl');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        filter: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))',
      });
    });

    it('generates drop-shadow-2xl', () => {
      const parsed = parseClassName('drop-shadow-2xl');
      const rule = generateCSS(parsed, 'drop-shadow-2xl');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))',
      });
    });

    it('generates drop-shadow-none', () => {
      const parsed = parseClassName('drop-shadow-none');
      const rule = generateCSS(parsed, 'drop-shadow-none');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        filter: 'drop-shadow(0 0 #0000)',
      });
    });
  });

  // ─── Backdrop Blur ────────────────────────────────────────────────────────

  describe('backdrop-blur utilities', () => {
    it('generates backdrop-blur (default)', () => {
      const parsed = parseClassName('backdrop-blur');
      // Parser: "backdrop-blur" → utility: "backdrop", value: "blur"
      // Compound lookup: "backdrop-blur" registered
      const rule = generateCSS(parsed, 'backdrop-blur');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'blur(8px)' });
    });

    it('generates backdrop-blur-lg', () => {
      const parsed = parseClassName('backdrop-blur-lg');
      const rule = generateCSS(parsed, 'backdrop-blur-lg');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'blur(16px)' });
    });

    it('generates backdrop-blur-none', () => {
      const parsed = parseClassName('backdrop-blur-none');
      const rule = generateCSS(parsed, 'backdrop-blur-none');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'blur(0)' });
    });
  });

  // ─── Backdrop Brightness ──────────────────────────────────────────────────

  describe('backdrop-brightness utilities', () => {
    it('generates backdrop-brightness-75', () => {
      const parsed = parseClassName('backdrop-brightness-75');
      const rule = generateCSS(parsed, 'backdrop-brightness-75');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'brightness(0.75)' });
    });

    it('generates backdrop-brightness-150', () => {
      const parsed = parseClassName('backdrop-brightness-150');
      const rule = generateCSS(parsed, 'backdrop-brightness-150');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'brightness(1.5)' });
    });
  });

  // ─── Backdrop Contrast ────────────────────────────────────────────────────

  describe('backdrop-contrast utilities', () => {
    it('generates backdrop-contrast-50', () => {
      const parsed = parseClassName('backdrop-contrast-50');
      const rule = generateCSS(parsed, 'backdrop-contrast-50');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'contrast(0.5)' });
    });

    it('generates backdrop-contrast-200', () => {
      const parsed = parseClassName('backdrop-contrast-200');
      const rule = generateCSS(parsed, 'backdrop-contrast-200');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'contrast(2)' });
    });
  });

  // ─── Backdrop Grayscale ───────────────────────────────────────────────────

  describe('backdrop-grayscale utilities', () => {
    it('generates backdrop-grayscale (default = 1)', () => {
      const parsed = parseClassName('backdrop-grayscale');
      const rule = generateCSS(parsed, 'backdrop-grayscale');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'grayscale(1)' });
    });

    it('generates backdrop-grayscale-0', () => {
      const parsed = parseClassName('backdrop-grayscale-0');
      const rule = generateCSS(parsed, 'backdrop-grayscale-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'grayscale(0)' });
    });
  });

  // ─── Backdrop Hue-Rotate ──────────────────────────────────────────────────

  describe('backdrop-hue-rotate utilities', () => {
    it('generates backdrop-hue-rotate-60', () => {
      const parsed = parseClassName('backdrop-hue-rotate-60');
      const rule = generateCSS(parsed, 'backdrop-hue-rotate-60');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'hue-rotate(60deg)' });
    });

    it('generates backdrop-hue-rotate-180', () => {
      const parsed = parseClassName('backdrop-hue-rotate-180');
      const rule = generateCSS(parsed, 'backdrop-hue-rotate-180');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'hue-rotate(180deg)' });
    });
  });

  // ─── Backdrop Invert ──────────────────────────────────────────────────────

  describe('backdrop-invert utilities', () => {
    it('generates backdrop-invert (default = 1)', () => {
      const parsed = parseClassName('backdrop-invert');
      const rule = generateCSS(parsed, 'backdrop-invert');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'invert(1)' });
    });

    it('generates backdrop-invert-0', () => {
      const parsed = parseClassName('backdrop-invert-0');
      const rule = generateCSS(parsed, 'backdrop-invert-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'invert(0)' });
    });
  });

  // ─── Backdrop Opacity ─────────────────────────────────────────────────────

  describe('backdrop-opacity utilities', () => {
    it('generates backdrop-opacity-50', () => {
      const parsed = parseClassName('backdrop-opacity-50');
      const rule = generateCSS(parsed, 'backdrop-opacity-50');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'opacity(0.5)' });
    });

    it('generates backdrop-opacity-100', () => {
      const parsed = parseClassName('backdrop-opacity-100');
      const rule = generateCSS(parsed, 'backdrop-opacity-100');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'opacity(1)' });
    });
  });

  // ─── Backdrop Saturate ────────────────────────────────────────────────────

  describe('backdrop-saturate utilities', () => {
    it('generates backdrop-saturate-50', () => {
      const parsed = parseClassName('backdrop-saturate-50');
      const rule = generateCSS(parsed, 'backdrop-saturate-50');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'saturate(0.5)' });
    });

    it('generates backdrop-saturate-200', () => {
      const parsed = parseClassName('backdrop-saturate-200');
      const rule = generateCSS(parsed, 'backdrop-saturate-200');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'saturate(2)' });
    });
  });

  // ─── Backdrop Sepia ───────────────────────────────────────────────────────

  describe('backdrop-sepia utilities', () => {
    it('generates backdrop-sepia (default = 1)', () => {
      const parsed = parseClassName('backdrop-sepia');
      const rule = generateCSS(parsed, 'backdrop-sepia');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'sepia(1)' });
    });

    it('generates backdrop-sepia-0', () => {
      const parsed = parseClassName('backdrop-sepia-0');
      const rule = generateCSS(parsed, 'backdrop-sepia-0');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'backdrop-filter': 'sepia(0)' });
    });
  });
});
