/**
 * @jest-environment node
 */

/**
 * Tests for background utilities builder
 * Task 3.9: Background utilities
 */

import {
  clearRegistry,
  hasUtility,
  generateCSS,
} from '../../../src/internal/generator';
import type { ParsedClass } from '../../../src/internal/parser';
import { registerBackgroundUtilities } from '../../../src/internal/builders/background';

beforeEach(() => {
  clearRegistry();
  registerBackgroundUtilities();
});

describe('Background Utilities Builder (Task 3.9)', () => {

  describe('Background Position (bg-*)', () => {
    it('should register bg utility', () => {
      expect(hasUtility('bg')).toBe(true);
    });

    it('should generate bg-bottom', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'bottom', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-bottom');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-position': 'bottom' });
    });

    it('should generate bg-center', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'center', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-center');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-position': 'center' });
    });

    it('should generate bg-left', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'left', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-left');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-position': 'left' });
    });

    it('should generate bg-left-bottom', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'left-bottom', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-left-bottom');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-position': 'left bottom' });
    });

    it('should generate bg-left-top', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'left-top', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-left-top');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-position': 'left top' });
    });

    it('should generate bg-right', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'right', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-right');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-position': 'right' });
    });

    it('should generate bg-right-bottom', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'right-bottom', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-right-bottom');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-position': 'right bottom' });
    });

    it('should generate bg-right-top', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'right-top', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-right-top');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-position': 'right top' });
    });

    it('should generate bg-top', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'top', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-top');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-position': 'top' });
    });
  });

  describe('Background Size (bg-*)', () => {
    it('should generate bg-auto', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-size': 'auto' });
    });

    it('should generate bg-cover', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'cover', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-cover');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-size': 'cover' });
    });

    it('should generate bg-contain', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'contain', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-contain');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-size': 'contain' });
    });
  });

  describe('Background Attachment (bg-*)', () => {
    it('should generate bg-fixed', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'fixed', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-fixed');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-attachment': 'fixed' });
    });

    it('should generate bg-local', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'local', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-local');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-attachment': 'local' });
    });

    it('should generate bg-scroll', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'scroll', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-scroll');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-attachment': 'scroll' });
    });
  });

  describe('Background Repeat', () => {
    it('should register bg-repeat utility', () => {
      expect(hasUtility('bg-repeat')).toBe(true);
    });

    it('should register bg-no-repeat utility', () => {
      expect(hasUtility('bg-no-repeat')).toBe(true);
    });

    it('should generate bg-no-repeat', () => {
      const parsed: ParsedClass = { utility: 'bg-no-repeat', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-no-repeat');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-repeat': 'no-repeat' });
    });

    it('should generate bg-repeat-x', () => {
      const parsed: ParsedClass = { utility: 'bg-repeat-x', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-repeat-x');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-repeat': 'repeat-x' });
    });

    it('should generate bg-repeat-y', () => {
      const parsed: ParsedClass = { utility: 'bg-repeat-y', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-repeat-y');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-repeat': 'repeat-y' });
    });

    it('should generate bg-repeat-round', () => {
      const parsed: ParsedClass = { utility: 'bg-repeat-round', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-repeat-round');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-repeat': 'round' });
    });

    it('should generate bg-repeat-space', () => {
      const parsed: ParsedClass = { utility: 'bg-repeat-space', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-repeat-space');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-repeat': 'space' });
    });
  });

  describe('Background Clip (bg-clip-*)', () => {
    it('should register bg-clip utility', () => {
      expect(hasUtility('bg-clip')).toBe(true);
    });

    it('should generate bg-clip-border', () => {
      const parsed: ParsedClass = { utility: 'bg-clip', value: 'border', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-clip-border');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-clip': 'border-box' });
    });

    it('should generate bg-clip-padding', () => {
      const parsed: ParsedClass = { utility: 'bg-clip', value: 'padding', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-clip-padding');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-clip': 'padding-box' });
    });

    it('should generate bg-clip-content', () => {
      const parsed: ParsedClass = { utility: 'bg-clip', value: 'content', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-clip-content');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-clip': 'content-box' });
    });

    it('should generate bg-clip-text with webkit prefix', () => {
      const parsed: ParsedClass = { utility: 'bg-clip', value: 'text', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-clip-text');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '-webkit-background-clip': 'text',
        'background-clip': 'text',
      });
    });

    it('should return null for invalid bg-clip value', () => {
      const parsed: ParsedClass = { utility: 'bg-clip', value: 'invalid', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-clip-invalid');
      expect(rule).toBeNull();
    });
  });

  describe('Background Origin (bg-origin-*)', () => {
    it('should register bg-origin utility', () => {
      expect(hasUtility('bg-origin')).toBe(true);
    });

    it('should generate bg-origin-border', () => {
      const parsed: ParsedClass = { utility: 'bg-origin', value: 'border', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-origin-border');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-origin': 'border-box' });
    });

    it('should generate bg-origin-padding', () => {
      const parsed: ParsedClass = { utility: 'bg-origin', value: 'padding', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-origin-padding');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-origin': 'padding-box' });
    });

    it('should generate bg-origin-content', () => {
      const parsed: ParsedClass = { utility: 'bg-origin', value: 'content', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-origin-content');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-origin': 'content-box' });
    });

    it('should return null for invalid bg-origin value', () => {
      const parsed: ParsedClass = { utility: 'bg-origin', value: 'invalid', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-origin-invalid');
      expect(rule).toBeNull();
    });
  });

  describe('Gradient Direction (bg-gradient-to-*)', () => {
    it('should register bg-gradient-to utility', () => {
      expect(hasUtility('bg-gradient-to')).toBe(true);
    });

    it('should generate bg-gradient-to-t', () => {
      const parsed: ParsedClass = { utility: 'bg-gradient-to', value: 't', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-gradient-to-t');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-image': 'linear-gradient(to top, var(--tw-gradient-stops))',
      });
    });

    it('should generate bg-gradient-to-tr', () => {
      const parsed: ParsedClass = { utility: 'bg-gradient-to', value: 'tr', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-gradient-to-tr');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-image': 'linear-gradient(to top right, var(--tw-gradient-stops))',
      });
    });

    it('should generate bg-gradient-to-r', () => {
      const parsed: ParsedClass = { utility: 'bg-gradient-to', value: 'r', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-gradient-to-r');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-image': 'linear-gradient(to right, var(--tw-gradient-stops))',
      });
    });

    it('should generate bg-gradient-to-br', () => {
      const parsed: ParsedClass = { utility: 'bg-gradient-to', value: 'br', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-gradient-to-br');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-image': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      });
    });

    it('should generate bg-gradient-to-b', () => {
      const parsed: ParsedClass = { utility: 'bg-gradient-to', value: 'b', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-gradient-to-b');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-image': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      });
    });

    it('should generate bg-gradient-to-bl', () => {
      const parsed: ParsedClass = { utility: 'bg-gradient-to', value: 'bl', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-gradient-to-bl');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-image': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
      });
    });

    it('should generate bg-gradient-to-l', () => {
      const parsed: ParsedClass = { utility: 'bg-gradient-to', value: 'l', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-gradient-to-l');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-image': 'linear-gradient(to left, var(--tw-gradient-stops))',
      });
    });

    it('should generate bg-gradient-to-tl', () => {
      const parsed: ParsedClass = { utility: 'bg-gradient-to', value: 'tl', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-gradient-to-tl');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-image': 'linear-gradient(to top left, var(--tw-gradient-stops))',
      });
    });

    it('should return null for invalid direction', () => {
      const parsed: ParsedClass = { utility: 'bg-gradient-to', value: 'x', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-gradient-to-x');
      expect(rule).toBeNull();
    });
  });

  describe('Background None (bg-none)', () => {
    it('should register bg-none utility', () => {
      expect(hasUtility('bg-none')).toBe(true);
    });

    it('should generate bg-none', () => {
      const parsed: ParsedClass = { utility: 'bg-none', value: 'none', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-none');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-image': 'none' });
    });
  });

  describe('Gradient Color Stops - from-*', () => {
    it('should register from utility', () => {
      expect(hasUtility('from')).toBe(true);
    });

    it('should generate from-transparent', () => {
      const parsed: ParsedClass = { utility: 'from', value: 'transparent', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'from-transparent');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-gradient-from': 'transparent',
        '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
      });
    });

    it('should generate from-current', () => {
      const parsed: ParsedClass = { utility: 'from', value: 'current', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'from-current');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-gradient-from': 'currentColor',
        '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
      });
    });

    it('should generate from-black', () => {
      const parsed: ParsedClass = { utility: 'from', value: 'black', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'from-black');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-gradient-from': '#000000',
        '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
      });
    });

    it('should generate from-white', () => {
      const parsed: ParsedClass = { utility: 'from', value: 'white', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'from-white');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-gradient-from': '#ffffff',
        '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
      });
    });

    it('should generate from-inherit', () => {
      const parsed: ParsedClass = { utility: 'from', value: 'inherit', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'from-inherit');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-gradient-from': 'inherit',
        '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
      });
    });

    it('should handle arbitrary color value in from', () => {
      const parsed: ParsedClass = { utility: 'from', value: '[#ff0000]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'from-[#ff0000]');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-gradient-from': '#ff0000',
        '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
      });
    });

    it('should return null for unknown from color', () => {
      const parsed: ParsedClass = { utility: 'from', value: 'unknown', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'from-unknown');
      expect(rule).toBeNull();
    });
  });

  describe('Gradient Color Stops - via-*', () => {
    it('should register via utility', () => {
      expect(hasUtility('via')).toBe(true);
    });

    it('should generate via-transparent', () => {
      const parsed: ParsedClass = { utility: 'via', value: 'transparent', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'via-transparent');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-gradient-via': 'transparent',
        '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to)',
      });
    });

    it('should generate via-black', () => {
      const parsed: ParsedClass = { utility: 'via', value: 'black', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'via-black');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-gradient-via': '#000000',
        '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to)',
      });
    });

    it('should handle arbitrary color value in via', () => {
      const parsed: ParsedClass = { utility: 'via', value: '[rgb(50,100,200)]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'via-[rgb(50,100,200)]');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-gradient-via': 'rgb(50,100,200)',
        '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to)',
      });
    });

    it('should return null for unknown via color', () => {
      const parsed: ParsedClass = { utility: 'via', value: 'unknown', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'via-unknown');
      expect(rule).toBeNull();
    });
  });

  describe('Gradient Color Stops - to-*', () => {
    it('should register to utility', () => {
      expect(hasUtility('to')).toBe(true);
    });

    it('should generate to-transparent', () => {
      const parsed: ParsedClass = { utility: 'to', value: 'transparent', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'to-transparent');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-gradient-to': 'transparent',
      });
    });

    it('should generate to-white', () => {
      const parsed: ParsedClass = { utility: 'to', value: 'white', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'to-white');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-gradient-to': '#ffffff',
      });
    });

    it('should handle arbitrary color value in to', () => {
      const parsed: ParsedClass = { utility: 'to', value: '[#00ff00]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'to-[#00ff00]');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        '--tw-gradient-to': '#00ff00',
      });
    });

    it('should return null for unknown to color', () => {
      const parsed: ParsedClass = { utility: 'to', value: 'unknown', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'to-unknown');
      expect(rule).toBeNull();
    });
  });

  describe('Arbitrary background values', () => {
    it('should handle arbitrary bg url value', () => {
      const parsed: ParsedClass = { utility: 'bg', value: '[url(/img/hero.png)]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'bg-[url(/img/hero.png)]');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-image': 'url(/img/hero.png)' });
    });

    it('should handle arbitrary bg generic value', () => {
      const parsed: ParsedClass = { utility: 'bg', value: '[#f0f0f0]', variants: [], modifiers: [], arbitrary: true };
      const rule = generateCSS(parsed, 'bg-[#f0f0f0]');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ background: '#f0f0f0' });
    });
  });

  describe('Fallthrough for unknown values', () => {
    it('should return null for unknown bg value (potential color handled by task 3.8)', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'blue', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'bg-blue');
      expect(rule).toBeNull();
    });
  });

  describe('Variant support', () => {
    it('should work with responsive variants', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'cover', variants: ['md'], modifiers: [] };
      const rule = generateCSS(parsed, 'md:bg-cover');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-size': 'cover' });
      expect(rule!.mediaQuery).toBe('@media (min-width: 768px)');
    });

    it('should work with pseudo-class variants', () => {
      const parsed: ParsedClass = { utility: 'bg', value: 'fixed', variants: ['hover'], modifiers: [] };
      const rule = generateCSS(parsed, 'hover:bg-fixed');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'background-attachment': 'fixed' });
      expect(rule!.selector).toContain(':hover');
    });

    it('should work with gradient and responsive variant', () => {
      const parsed: ParsedClass = { utility: 'bg-gradient-to', value: 'r', variants: ['lg'], modifiers: [] };
      const rule = generateCSS(parsed, 'lg:bg-gradient-to-r');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'background-image': 'linear-gradient(to right, var(--tw-gradient-stops))',
      });
      expect(rule!.mediaQuery).toBe('@media (min-width: 1024px)');
    });
  });
});
