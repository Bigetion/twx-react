/**
 * Typography Utilities Builder Tests
 */

import { registerTypographyUtilities } from '../../../src/internal/builders/typography';
import { clearRegistry, generateCSS } from '../../../src/internal/generator';
import { parseClassName } from '../../../src/internal/parser';

describe('Typography Utilities Builder', () => {
  beforeEach(() => {
    clearRegistry();
    registerTypographyUtilities();
  });

  // ─── Font Size Utilities ──────────────────────────────────────────────────

  describe('font size (text-*)', () => {
    it('generates text-xs with font-size and line-height', () => {
      const parsed = parseClassName('text-xs');
      const rule = generateCSS(parsed, 'text-xs');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'font-size': '0.75rem',
        'line-height': '1rem',
      });
    });

    it('generates text-sm', () => {
      const parsed = parseClassName('text-sm');
      const rule = generateCSS(parsed, 'text-sm');
      expect(rule!.properties).toEqual({
        'font-size': '0.875rem',
        'line-height': '1.25rem',
      });
    });

    it('generates text-base', () => {
      const parsed = parseClassName('text-base');
      const rule = generateCSS(parsed, 'text-base');
      expect(rule!.properties).toEqual({
        'font-size': '1rem',
        'line-height': '1.5rem',
      });
    });

    it('generates text-lg', () => {
      const parsed = parseClassName('text-lg');
      const rule = generateCSS(parsed, 'text-lg');
      expect(rule!.properties).toEqual({
        'font-size': '1.125rem',
        'line-height': '1.75rem',
      });
    });

    it('generates text-xl', () => {
      const parsed = parseClassName('text-xl');
      const rule = generateCSS(parsed, 'text-xl');
      expect(rule!.properties).toEqual({
        'font-size': '1.25rem',
        'line-height': '1.75rem',
      });
    });

    it('generates text-2xl', () => {
      const parsed = parseClassName('text-2xl');
      const rule = generateCSS(parsed, 'text-2xl');
      expect(rule!.properties).toEqual({
        'font-size': '1.5rem',
        'line-height': '2rem',
      });
    });

    it('generates text-5xl with line-height: 1', () => {
      const parsed = parseClassName('text-5xl');
      const rule = generateCSS(parsed, 'text-5xl');
      expect(rule!.properties).toEqual({
        'font-size': '3rem',
        'line-height': '1',
      });
    });

    it('generates text-9xl with line-height: 1', () => {
      const parsed = parseClassName('text-9xl');
      const rule = generateCSS(parsed, 'text-9xl');
      expect(rule!.properties).toEqual({
        'font-size': '8rem',
        'line-height': '1',
      });
    });
  });

  // ─── Text Alignment Utilities ─────────────────────────────────────────────

  describe('text alignment (text-*)', () => {
    it('generates text-left', () => {
      const parsed = parseClassName('text-left');
      const rule = generateCSS(parsed, 'text-left');
      expect(rule!.properties).toEqual({ 'text-align': 'left' });
    });

    it('generates text-center', () => {
      const parsed = parseClassName('text-center');
      const rule = generateCSS(parsed, 'text-center');
      expect(rule!.properties).toEqual({ 'text-align': 'center' });
    });

    it('generates text-right', () => {
      const parsed = parseClassName('text-right');
      const rule = generateCSS(parsed, 'text-right');
      expect(rule!.properties).toEqual({ 'text-align': 'right' });
    });

    it('generates text-justify', () => {
      const parsed = parseClassName('text-justify');
      const rule = generateCSS(parsed, 'text-justify');
      expect(rule!.properties).toEqual({ 'text-align': 'justify' });
    });

    it('generates text-start', () => {
      const parsed = parseClassName('text-start');
      const rule = generateCSS(parsed, 'text-start');
      expect(rule!.properties).toEqual({ 'text-align': 'start' });
    });

    it('generates text-end', () => {
      const parsed = parseClassName('text-end');
      const rule = generateCSS(parsed, 'text-end');
      expect(rule!.properties).toEqual({ 'text-align': 'end' });
    });
  });

  // ─── Font Weight Utilities ────────────────────────────────────────────────

  describe('font weight (font-*)', () => {
    it('generates font-thin', () => {
      const parsed = parseClassName('font-thin');
      const rule = generateCSS(parsed, 'font-thin');
      expect(rule!.properties).toEqual({ 'font-weight': '100' });
    });

    it('generates font-extralight', () => {
      const parsed = parseClassName('font-extralight');
      const rule = generateCSS(parsed, 'font-extralight');
      expect(rule!.properties).toEqual({ 'font-weight': '200' });
    });

    it('generates font-normal', () => {
      const parsed = parseClassName('font-normal');
      const rule = generateCSS(parsed, 'font-normal');
      expect(rule!.properties).toEqual({ 'font-weight': '400' });
    });

    it('generates font-semibold', () => {
      const parsed = parseClassName('font-semibold');
      const rule = generateCSS(parsed, 'font-semibold');
      expect(rule!.properties).toEqual({ 'font-weight': '600' });
    });

    it('generates font-bold', () => {
      const parsed = parseClassName('font-bold');
      const rule = generateCSS(parsed, 'font-bold');
      expect(rule!.properties).toEqual({ 'font-weight': '700' });
    });

    it('generates font-black', () => {
      const parsed = parseClassName('font-black');
      const rule = generateCSS(parsed, 'font-black');
      expect(rule!.properties).toEqual({ 'font-weight': '900' });
    });
  });

  // ─── Font Family Utilities ────────────────────────────────────────────────

  describe('font family (font-*)', () => {
    it('generates font-sans', () => {
      const parsed = parseClassName('font-sans');
      const rule = generateCSS(parsed, 'font-sans');
      expect(rule!.properties).toEqual({
        'font-family': 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      });
    });

    it('generates font-serif', () => {
      const parsed = parseClassName('font-serif');
      const rule = generateCSS(parsed, 'font-serif');
      expect(rule!.properties).toEqual({
        'font-family': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      });
    });

    it('generates font-mono', () => {
      const parsed = parseClassName('font-mono');
      const rule = generateCSS(parsed, 'font-mono');
      expect(rule!.properties).toEqual({
        'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      });
    });
  });

  // ─── Line Height Utilities ────────────────────────────────────────────────

  describe('line height (leading-*)', () => {
    it('generates leading-none', () => {
      const parsed = parseClassName('leading-none');
      const rule = generateCSS(parsed, 'leading-none');
      expect(rule!.properties).toEqual({ 'line-height': '1' });
    });

    it('generates leading-tight', () => {
      const parsed = parseClassName('leading-tight');
      const rule = generateCSS(parsed, 'leading-tight');
      expect(rule!.properties).toEqual({ 'line-height': '1.25' });
    });

    it('generates leading-snug', () => {
      const parsed = parseClassName('leading-snug');
      const rule = generateCSS(parsed, 'leading-snug');
      expect(rule!.properties).toEqual({ 'line-height': '1.375' });
    });

    it('generates leading-normal', () => {
      const parsed = parseClassName('leading-normal');
      const rule = generateCSS(parsed, 'leading-normal');
      expect(rule!.properties).toEqual({ 'line-height': '1.5' });
    });

    it('generates leading-relaxed', () => {
      const parsed = parseClassName('leading-relaxed');
      const rule = generateCSS(parsed, 'leading-relaxed');
      expect(rule!.properties).toEqual({ 'line-height': '1.625' });
    });

    it('generates leading-loose', () => {
      const parsed = parseClassName('leading-loose');
      const rule = generateCSS(parsed, 'leading-loose');
      expect(rule!.properties).toEqual({ 'line-height': '2' });
    });

    it('generates leading-3', () => {
      const parsed = parseClassName('leading-3');
      const rule = generateCSS(parsed, 'leading-3');
      expect(rule!.properties).toEqual({ 'line-height': '0.75rem' });
    });

    it('generates leading-4', () => {
      const parsed = parseClassName('leading-4');
      const rule = generateCSS(parsed, 'leading-4');
      expect(rule!.properties).toEqual({ 'line-height': '1rem' });
    });

    it('generates leading-10', () => {
      const parsed = parseClassName('leading-10');
      const rule = generateCSS(parsed, 'leading-10');
      expect(rule!.properties).toEqual({ 'line-height': '2.5rem' });
    });
  });

  // ─── Letter Spacing Utilities ─────────────────────────────────────────────

  describe('letter spacing (tracking-*)', () => {
    it('generates tracking-tighter', () => {
      const parsed = parseClassName('tracking-tighter');
      const rule = generateCSS(parsed, 'tracking-tighter');
      expect(rule!.properties).toEqual({ 'letter-spacing': '-0.05em' });
    });

    it('generates tracking-tight', () => {
      const parsed = parseClassName('tracking-tight');
      const rule = generateCSS(parsed, 'tracking-tight');
      expect(rule!.properties).toEqual({ 'letter-spacing': '-0.025em' });
    });

    it('generates tracking-normal', () => {
      const parsed = parseClassName('tracking-normal');
      const rule = generateCSS(parsed, 'tracking-normal');
      expect(rule!.properties).toEqual({ 'letter-spacing': '0em' });
    });

    it('generates tracking-wide', () => {
      const parsed = parseClassName('tracking-wide');
      const rule = generateCSS(parsed, 'tracking-wide');
      expect(rule!.properties).toEqual({ 'letter-spacing': '0.025em' });
    });

    it('generates tracking-wider', () => {
      const parsed = parseClassName('tracking-wider');
      const rule = generateCSS(parsed, 'tracking-wider');
      expect(rule!.properties).toEqual({ 'letter-spacing': '0.05em' });
    });

    it('generates tracking-widest', () => {
      const parsed = parseClassName('tracking-widest');
      const rule = generateCSS(parsed, 'tracking-widest');
      expect(rule!.properties).toEqual({ 'letter-spacing': '0.1em' });
    });
  });

  // ─── Text Decoration Utilities ────────────────────────────────────────────

  describe('text decoration', () => {
    it('generates underline', () => {
      const parsed = parseClassName('underline');
      const rule = generateCSS(parsed, 'underline');
      expect(rule!.properties).toEqual({ 'text-decoration-line': 'underline' });
    });

    it('generates overline', () => {
      const parsed = parseClassName('overline');
      const rule = generateCSS(parsed, 'overline');
      expect(rule!.properties).toEqual({ 'text-decoration-line': 'overline' });
    });

    it('generates line-through', () => {
      const parsed = parseClassName('line-through');
      const rule = generateCSS(parsed, 'line-through');
      expect(rule!.properties).toEqual({ 'text-decoration-line': 'line-through' });
    });

    it('generates no-underline', () => {
      const parsed = parseClassName('no-underline');
      const rule = generateCSS(parsed, 'no-underline');
      expect(rule!.properties).toEqual({ 'text-decoration-line': 'none' });
    });
  });

  // ─── Text Transform Utilities ─────────────────────────────────────────────

  describe('text transform', () => {
    it('generates uppercase', () => {
      const parsed = parseClassName('uppercase');
      const rule = generateCSS(parsed, 'uppercase');
      expect(rule!.properties).toEqual({ 'text-transform': 'uppercase' });
    });

    it('generates lowercase', () => {
      const parsed = parseClassName('lowercase');
      const rule = generateCSS(parsed, 'lowercase');
      expect(rule!.properties).toEqual({ 'text-transform': 'lowercase' });
    });

    it('generates capitalize', () => {
      const parsed = parseClassName('capitalize');
      const rule = generateCSS(parsed, 'capitalize');
      expect(rule!.properties).toEqual({ 'text-transform': 'capitalize' });
    });

    it('generates normal-case', () => {
      const parsed = parseClassName('normal-case');
      const rule = generateCSS(parsed, 'normal-case');
      expect(rule!.properties).toEqual({ 'text-transform': 'none' });
    });
  });

  // ─── Text Overflow Utilities ──────────────────────────────────────────────

  describe('text overflow', () => {
    it('generates truncate with multiple properties', () => {
      const parsed = parseClassName('truncate');
      const rule = generateCSS(parsed, 'truncate');
      expect(rule!.properties).toEqual({
        'overflow': 'hidden',
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap',
      });
    });

    it('generates text-ellipsis', () => {
      const parsed = parseClassName('text-ellipsis');
      const rule = generateCSS(parsed, 'text-ellipsis');
      expect(rule!.properties).toEqual({ 'text-overflow': 'ellipsis' });
    });

    it('generates text-clip', () => {
      const parsed = parseClassName('text-clip');
      const rule = generateCSS(parsed, 'text-clip');
      expect(rule!.properties).toEqual({ 'text-overflow': 'clip' });
    });
  });

  // ─── Whitespace Utilities ─────────────────────────────────────────────────

  describe('whitespace', () => {
    it('generates whitespace-normal', () => {
      const parsed = parseClassName('whitespace-normal');
      const rule = generateCSS(parsed, 'whitespace-normal');
      expect(rule!.properties).toEqual({ 'white-space': 'normal' });
    });

    it('generates whitespace-nowrap', () => {
      const parsed = parseClassName('whitespace-nowrap');
      const rule = generateCSS(parsed, 'whitespace-nowrap');
      expect(rule!.properties).toEqual({ 'white-space': 'nowrap' });
    });

    it('generates whitespace-pre', () => {
      const parsed = parseClassName('whitespace-pre');
      const rule = generateCSS(parsed, 'whitespace-pre');
      expect(rule!.properties).toEqual({ 'white-space': 'pre' });
    });

    it('generates whitespace-pre-line', () => {
      const parsed = parseClassName('whitespace-pre-line');
      const rule = generateCSS(parsed, 'whitespace-pre-line');
      expect(rule!.properties).toEqual({ 'white-space': 'pre-line' });
    });

    it('generates whitespace-pre-wrap', () => {
      const parsed = parseClassName('whitespace-pre-wrap');
      const rule = generateCSS(parsed, 'whitespace-pre-wrap');
      expect(rule!.properties).toEqual({ 'white-space': 'pre-wrap' });
    });

    it('generates whitespace-break-spaces', () => {
      const parsed = parseClassName('whitespace-break-spaces');
      const rule = generateCSS(parsed, 'whitespace-break-spaces');
      expect(rule!.properties).toEqual({ 'white-space': 'break-spaces' });
    });
  });

  // ─── Word Break Utilities ─────────────────────────────────────────────────

  describe('word break', () => {
    it('generates break-normal', () => {
      const parsed = parseClassName('break-normal');
      const rule = generateCSS(parsed, 'break-normal');
      expect(rule!.properties).toEqual({
        'overflow-wrap': 'normal',
        'word-break': 'normal',
      });
    });

    it('generates break-words', () => {
      const parsed = parseClassName('break-words');
      const rule = generateCSS(parsed, 'break-words');
      expect(rule!.properties).toEqual({ 'overflow-wrap': 'break-word' });
    });

    it('generates break-all', () => {
      const parsed = parseClassName('break-all');
      const rule = generateCSS(parsed, 'break-all');
      expect(rule!.properties).toEqual({ 'word-break': 'break-all' });
    });

    it('generates break-keep', () => {
      const parsed = parseClassName('break-keep');
      const rule = generateCSS(parsed, 'break-keep');
      expect(rule!.properties).toEqual({ 'word-break': 'keep-all' });
    });
  });

  // ─── Unrecognized values return null ──────────────────────────────────────

  describe('unrecognized values', () => {
    it('returns null for unknown text-* value (may be color)', () => {
      const parsed = parseClassName('text-blue');
      const rule = generateCSS(parsed, 'text-blue');
      // "blue" is not a font-size or alignment value, so should return null
      // (color handling would be done by a separate color builder)
      expect(rule).toBeNull();
    });

    it('returns null for unknown font-* value', () => {
      const parsed = parseClassName('font-unknown');
      const rule = generateCSS(parsed, 'font-unknown');
      expect(rule).toBeNull();
    });

    it('returns null for unknown leading-* value', () => {
      const parsed = parseClassName('leading-unknown');
      const rule = generateCSS(parsed, 'leading-unknown');
      expect(rule).toBeNull();
    });

    it('returns null for unknown tracking-* value', () => {
      const parsed = parseClassName('tracking-unknown');
      const rule = generateCSS(parsed, 'tracking-unknown');
      expect(rule).toBeNull();
    });
  });
});
