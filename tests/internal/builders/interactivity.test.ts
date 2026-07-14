/**
 * Tests for Interactivity Utilities Builder
 */

import { registerInteractivityUtilities } from '../../../src/internal/builders/interactivity';
import { clearRegistry, generateCSS } from '../../../src/internal/generator';
import { parseClassName } from '../../../src/internal/parser';

describe('Interactivity Utilities Builder', () => {
  beforeEach(() => {
    clearRegistry();
    registerInteractivityUtilities();
  });

  // ─── Cursor Utilities ─────────────────────────────────────────────────────

  describe('cursor utilities', () => {
    it('should generate simple cursor values', () => {
      const cases: [string, string][] = [
        ['cursor-auto', 'auto'],
        ['cursor-default', 'default'],
        ['cursor-pointer', 'pointer'],
        ['cursor-wait', 'wait'],
        ['cursor-text', 'text'],
        ['cursor-move', 'move'],
        ['cursor-help', 'help'],
        ['cursor-none', 'none'],
        ['cursor-progress', 'progress'],
        ['cursor-cell', 'cell'],
        ['cursor-crosshair', 'crosshair'],
        ['cursor-alias', 'alias'],
        ['cursor-copy', 'copy'],
        ['cursor-grab', 'grab'],
        ['cursor-grabbing', 'grabbing'],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ cursor: expected });
      }
    });

    it('should generate compound cursor values', () => {
      const cases: [string, string][] = [
        ['cursor-not-allowed', 'not-allowed'],
        ['cursor-context-menu', 'context-menu'],
        ['cursor-vertical-text', 'vertical-text'],
        ['cursor-no-drop', 'no-drop'],
        ['cursor-all-scroll', 'all-scroll'],
        ['cursor-col-resize', 'col-resize'],
        ['cursor-row-resize', 'row-resize'],
        ['cursor-n-resize', 'n-resize'],
        ['cursor-e-resize', 'e-resize'],
        ['cursor-s-resize', 's-resize'],
        ['cursor-w-resize', 'w-resize'],
        ['cursor-ne-resize', 'ne-resize'],
        ['cursor-nw-resize', 'nw-resize'],
        ['cursor-se-resize', 'se-resize'],
        ['cursor-sw-resize', 'sw-resize'],
        ['cursor-ew-resize', 'ew-resize'],
        ['cursor-ns-resize', 'ns-resize'],
        ['cursor-nesw-resize', 'nesw-resize'],
        ['cursor-nwse-resize', 'nwse-resize'],
        ['cursor-zoom-in', 'zoom-in'],
        ['cursor-zoom-out', 'zoom-out'],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ cursor: expected });
      }
    });
  });

  // ─── Pointer Events Utilities ─────────────────────────────────────────────

  describe('pointer-events utilities', () => {
    it('should generate pointer-events-none', () => {
      const parsed = parseClassName('pointer-events-none');
      const rule = generateCSS(parsed, 'pointer-events-none');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'pointer-events': 'none' });
    });

    it('should generate pointer-events-auto', () => {
      const parsed = parseClassName('pointer-events-auto');
      const rule = generateCSS(parsed, 'pointer-events-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'pointer-events': 'auto' });
    });
  });

  // ─── User Select Utilities ────────────────────────────────────────────────

  describe('user-select utilities', () => {
    it('should generate user-select values', () => {
      const cases: [string, string][] = [
        ['select-none', 'none'],
        ['select-text', 'text'],
        ['select-all', 'all'],
        ['select-auto', 'auto'],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ 'user-select': expected });
      }
    });
  });

  // ─── Resize Utilities ─────────────────────────────────────────────────────

  describe('resize utilities', () => {
    it('should generate resize: both for "resize"', () => {
      const parsed = parseClassName('resize');
      const rule = generateCSS(parsed, 'resize');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ resize: 'both' });
    });

    it('should generate resize values', () => {
      const cases: [string, string][] = [
        ['resize-none', 'none'],
        ['resize-y', 'vertical'],
        ['resize-x', 'horizontal'],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ resize: expected });
      }
    });
  });

  // ─── Scroll Behavior Utilities ────────────────────────────────────────────

  describe('scroll behavior utilities', () => {
    it('should generate scroll-behavior values', () => {
      const cases: [string, string][] = [
        ['scroll-auto', 'auto'],
        ['scroll-smooth', 'smooth'],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ 'scroll-behavior': expected });
      }
    });
  });

  // ─── Scroll Margin Utilities ──────────────────────────────────────────────

  describe('scroll margin utilities', () => {
    it('should generate scroll-m-* (all sides)', () => {
      const parsed = parseClassName('scroll-m-4');
      const rule = generateCSS(parsed, 'scroll-m-4');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'scroll-margin': '1rem' });
    });

    it('should generate scroll-mx-* (left + right)', () => {
      const parsed = parseClassName('scroll-mx-2');
      const rule = generateCSS(parsed, 'scroll-mx-2');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'scroll-margin-left': '0.5rem',
        'scroll-margin-right': '0.5rem',
      });
    });

    it('should generate scroll-my-* (top + bottom)', () => {
      const parsed = parseClassName('scroll-my-2');
      const rule = generateCSS(parsed, 'scroll-my-2');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'scroll-margin-top': '0.5rem',
        'scroll-margin-bottom': '0.5rem',
      });
    });

    it('should generate directional scroll margins', () => {
      const cases: [string, Record<string, string>][] = [
        ['scroll-mt-4', { 'scroll-margin-top': '1rem' }],
        ['scroll-mr-4', { 'scroll-margin-right': '1rem' }],
        ['scroll-mb-4', { 'scroll-margin-bottom': '1rem' }],
        ['scroll-ml-4', { 'scroll-margin-left': '1rem' }],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual(expected);
      }
    });
  });

  // ─── Scroll Padding Utilities ─────────────────────────────────────────────

  describe('scroll padding utilities', () => {
    it('should generate scroll-p-* (all sides)', () => {
      const parsed = parseClassName('scroll-p-4');
      const rule = generateCSS(parsed, 'scroll-p-4');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'scroll-padding': '1rem' });
    });

    it('should generate scroll-px-* (left + right)', () => {
      const parsed = parseClassName('scroll-px-2');
      const rule = generateCSS(parsed, 'scroll-px-2');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'scroll-padding-left': '0.5rem',
        'scroll-padding-right': '0.5rem',
      });
    });

    it('should generate scroll-py-* (top + bottom)', () => {
      const parsed = parseClassName('scroll-py-2');
      const rule = generateCSS(parsed, 'scroll-py-2');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'scroll-padding-top': '0.5rem',
        'scroll-padding-bottom': '0.5rem',
      });
    });

    it('should generate directional scroll paddings', () => {
      const cases: [string, Record<string, string>][] = [
        ['scroll-pt-4', { 'scroll-padding-top': '1rem' }],
        ['scroll-pr-4', { 'scroll-padding-right': '1rem' }],
        ['scroll-pb-4', { 'scroll-padding-bottom': '1rem' }],
        ['scroll-pl-4', { 'scroll-padding-left': '1rem' }],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual(expected);
      }
    });
  });

  // ─── Scroll Snap Utilities ────────────────────────────────────────────────

  describe('scroll snap utilities', () => {
    it('should generate snap type values', () => {
      const cases: [string, Record<string, string>][] = [
        ['snap-none', { 'scroll-snap-type': 'none' }],
        ['snap-x', { 'scroll-snap-type': 'x var(--tw-scroll-snap-strictness)' }],
        ['snap-y', { 'scroll-snap-type': 'y var(--tw-scroll-snap-strictness)' }],
        ['snap-both', { 'scroll-snap-type': 'both var(--tw-scroll-snap-strictness)' }],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual(expected);
      }
    });

    it('should generate snap strictness values', () => {
      const cases: [string, Record<string, string>][] = [
        ['snap-mandatory', { '--tw-scroll-snap-strictness': 'mandatory' }],
        ['snap-proximity', { '--tw-scroll-snap-strictness': 'proximity' }],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual(expected);
      }
    });

    it('should generate snap alignment values', () => {
      const cases: [string, Record<string, string>][] = [
        ['snap-start', { 'scroll-snap-align': 'start' }],
        ['snap-end', { 'scroll-snap-align': 'end' }],
        ['snap-center', { 'scroll-snap-align': 'center' }],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual(expected);
      }
    });

    it('should generate snap-align-none', () => {
      const parsed = parseClassName('snap-align-none');
      const rule = generateCSS(parsed, 'snap-align-none');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'scroll-snap-align': 'none' });
    });

    it('should generate snap stop values', () => {
      const cases: [string, Record<string, string>][] = [
        ['snap-normal', { 'scroll-snap-stop': 'normal' }],
        ['snap-always', { 'scroll-snap-stop': 'always' }],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual(expected);
      }
    });
  });

  // ─── Touch Action Utilities ───────────────────────────────────────────────

  describe('touch action utilities', () => {
    it('should generate simple touch-action values', () => {
      const cases: [string, string][] = [
        ['touch-auto', 'auto'],
        ['touch-none', 'none'],
        ['touch-manipulation', 'manipulation'],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ 'touch-action': expected });
      }
    });

    it('should generate compound touch-action values', () => {
      const cases: [string, string][] = [
        ['touch-pan-x', 'pan-x'],
        ['touch-pan-left', 'pan-left'],
        ['touch-pan-right', 'pan-right'],
        ['touch-pan-y', 'pan-y'],
        ['touch-pan-up', 'pan-up'],
        ['touch-pan-down', 'pan-down'],
        ['touch-pinch-zoom', 'pinch-zoom'],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ 'touch-action': expected });
      }
    });
  });

  // ─── Will Change Utilities ────────────────────────────────────────────────

  describe('will-change utilities', () => {
    it('should generate will-change values', () => {
      const cases: [string, string][] = [
        ['will-change-auto', 'auto'],
        ['will-change-scroll', 'scroll-position'],
        ['will-change-contents', 'contents'],
        ['will-change-transform', 'transform'],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ 'will-change': expected });
      }
    });
  });

  // ─── Appearance Utilities ─────────────────────────────────────────────────

  describe('appearance utilities', () => {
    it('should generate appearance values', () => {
      const cases: [string, string][] = [
        ['appearance-none', 'none'],
        ['appearance-auto', 'auto'],
      ];

      for (const [className, expected] of cases) {
        const parsed = parseClassName(className);
        const rule = generateCSS(parsed, className);
        expect(rule).not.toBeNull();
        expect(rule!.properties).toEqual({ appearance: expected });
      }
    });
  });
});
