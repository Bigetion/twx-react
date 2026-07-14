/**
 * @jest-environment node
 */

/**
 * Tests for sizing utilities builder
 * Task 3.3: Implement sizing utilities builder
 */

import {
  registerSizingUtilities,
  widthGenerator,
  minWidthGenerator,
  maxWidthGenerator,
  heightGenerator,
  minHeightGenerator,
  maxHeightGenerator,
  sizeGenerator,
} from '../../src/internal/builders/sizing';
import { clearRegistry, hasUtility } from '../../src/internal/generator';
import type { ParsedClass } from '../../src/internal/parser';

beforeEach(() => {
  clearRegistry();
});

// Helper to create a ParsedClass object
function makeParsed(utility: string, value?: string, arbitrary?: boolean): ParsedClass {
  return { utility, value, variants: [], modifiers: [], arbitrary };
}

describe('Sizing Utilities Builder (Task 3.3)', () => {

  describe('registerSizingUtilities', () => {
    it('should register all sizing utilities', () => {
      registerSizingUtilities();
      expect(hasUtility('w')).toBe(true);
      expect(hasUtility('min-w')).toBe(true);
      expect(hasUtility('max-w')).toBe(true);
      expect(hasUtility('h')).toBe(true);
      expect(hasUtility('min-h')).toBe(true);
      expect(hasUtility('max-h')).toBe(true);
      expect(hasUtility('size')).toBe(true);
    });
  });

  describe('Width (w-*)', () => {
    it('should return null for no value', () => {
      expect(widthGenerator(makeParsed('w'))).toBeNull();
    });

    it('should resolve numeric scale values', () => {
      expect(widthGenerator(makeParsed('w', '0'))).toEqual({ width: '0px' });
      expect(widthGenerator(makeParsed('w', 'px'))).toEqual({ width: '1px' });
      expect(widthGenerator(makeParsed('w', '4'))).toEqual({ width: '1rem' });
      expect(widthGenerator(makeParsed('w', '8'))).toEqual({ width: '2rem' });
      expect(widthGenerator(makeParsed('w', '96'))).toEqual({ width: '24rem' });
    });

    it('should resolve fraction values', () => {
      expect(widthGenerator(makeParsed('w', '1/2'))).toEqual({ width: '50%' });
      expect(widthGenerator(makeParsed('w', '1/3'))).toEqual({ width: '33.333333%' });
      expect(widthGenerator(makeParsed('w', '2/3'))).toEqual({ width: '66.666667%' });
      expect(widthGenerator(makeParsed('w', '3/4'))).toEqual({ width: '75%' });
    });

    it('should resolve special keyword values', () => {
      expect(widthGenerator(makeParsed('w', 'auto'))).toEqual({ width: 'auto' });
      expect(widthGenerator(makeParsed('w', 'full'))).toEqual({ width: '100%' });
      expect(widthGenerator(makeParsed('w', 'screen'))).toEqual({ width: '100vw' });
      expect(widthGenerator(makeParsed('w', 'min'))).toEqual({ width: 'min-content' });
      expect(widthGenerator(makeParsed('w', 'max'))).toEqual({ width: 'max-content' });
      expect(widthGenerator(makeParsed('w', 'fit'))).toEqual({ width: 'fit-content' });
    });

    it('should resolve arbitrary values', () => {
      expect(widthGenerator(makeParsed('w', '[200px]', true))).toEqual({ width: '200px' });
      expect(widthGenerator(makeParsed('w', '[50%]', true))).toEqual({ width: '50%' });
      expect(widthGenerator(makeParsed('w', '[calc(100%-2rem)]', true))).toEqual({ width: 'calc(100%-2rem)' });
    });

    it('should return null for unknown values', () => {
      expect(widthGenerator(makeParsed('w', 'unknown'))).toBeNull();
    });
  });

  describe('Min-Width (min-w-*)', () => {
    it('should return null for no value', () => {
      expect(minWidthGenerator(makeParsed('min-w'))).toBeNull();
    });

    it('should resolve named values', () => {
      expect(minWidthGenerator(makeParsed('min-w', '0'))).toEqual({ 'min-width': '0px' });
      expect(minWidthGenerator(makeParsed('min-w', 'full'))).toEqual({ 'min-width': '100%' });
      expect(minWidthGenerator(makeParsed('min-w', 'min'))).toEqual({ 'min-width': 'min-content' });
      expect(minWidthGenerator(makeParsed('min-w', 'max'))).toEqual({ 'min-width': 'max-content' });
      expect(minWidthGenerator(makeParsed('min-w', 'fit'))).toEqual({ 'min-width': 'fit-content' });
    });

    it('should resolve numeric scale values', () => {
      expect(minWidthGenerator(makeParsed('min-w', '4'))).toEqual({ 'min-width': '1rem' });
      expect(minWidthGenerator(makeParsed('min-w', '64'))).toEqual({ 'min-width': '16rem' });
    });

    it('should resolve arbitrary values', () => {
      expect(minWidthGenerator(makeParsed('min-w', '[300px]', true))).toEqual({ 'min-width': '300px' });
    });
  });

  describe('Max-Width (max-w-*)', () => {
    it('should return null for no value', () => {
      expect(maxWidthGenerator(makeParsed('max-w'))).toBeNull();
    });

    it('should resolve named size values', () => {
      expect(maxWidthGenerator(makeParsed('max-w', 'none'))).toEqual({ 'max-width': 'none' });
      expect(maxWidthGenerator(makeParsed('max-w', 'xs'))).toEqual({ 'max-width': '20rem' });
      expect(maxWidthGenerator(makeParsed('max-w', 'sm'))).toEqual({ 'max-width': '24rem' });
      expect(maxWidthGenerator(makeParsed('max-w', 'md'))).toEqual({ 'max-width': '28rem' });
      expect(maxWidthGenerator(makeParsed('max-w', 'lg'))).toEqual({ 'max-width': '32rem' });
      expect(maxWidthGenerator(makeParsed('max-w', 'xl'))).toEqual({ 'max-width': '36rem' });
      expect(maxWidthGenerator(makeParsed('max-w', '2xl'))).toEqual({ 'max-width': '42rem' });
      expect(maxWidthGenerator(makeParsed('max-w', '7xl'))).toEqual({ 'max-width': '80rem' });
    });

    it('should resolve special keyword values', () => {
      expect(maxWidthGenerator(makeParsed('max-w', 'full'))).toEqual({ 'max-width': '100%' });
      expect(maxWidthGenerator(makeParsed('max-w', 'min'))).toEqual({ 'max-width': 'min-content' });
      expect(maxWidthGenerator(makeParsed('max-w', 'max'))).toEqual({ 'max-width': 'max-content' });
      expect(maxWidthGenerator(makeParsed('max-w', 'fit'))).toEqual({ 'max-width': 'fit-content' });
      expect(maxWidthGenerator(makeParsed('max-w', 'prose'))).toEqual({ 'max-width': '65ch' });
    });

    it('should resolve screen-* values', () => {
      expect(maxWidthGenerator(makeParsed('max-w', 'screen-sm'))).toEqual({ 'max-width': '640px' });
      expect(maxWidthGenerator(makeParsed('max-w', 'screen-md'))).toEqual({ 'max-width': '768px' });
      expect(maxWidthGenerator(makeParsed('max-w', 'screen-lg'))).toEqual({ 'max-width': '1024px' });
      expect(maxWidthGenerator(makeParsed('max-w', 'screen-xl'))).toEqual({ 'max-width': '1280px' });
      expect(maxWidthGenerator(makeParsed('max-w', 'screen-2xl'))).toEqual({ 'max-width': '1536px' });
    });

    it('should resolve numeric scale', () => {
      expect(maxWidthGenerator(makeParsed('max-w', '0'))).toEqual({ 'max-width': '0px' });
      expect(maxWidthGenerator(makeParsed('max-w', '96'))).toEqual({ 'max-width': '24rem' });
    });

    it('should resolve arbitrary values', () => {
      expect(maxWidthGenerator(makeParsed('max-w', '[500px]', true))).toEqual({ 'max-width': '500px' });
    });
  });

  describe('Height (h-*)', () => {
    it('should return null for no value', () => {
      expect(heightGenerator(makeParsed('h'))).toBeNull();
    });

    it('should resolve numeric scale values', () => {
      expect(heightGenerator(makeParsed('h', '0'))).toEqual({ height: '0px' });
      expect(heightGenerator(makeParsed('h', '4'))).toEqual({ height: '1rem' });
      expect(heightGenerator(makeParsed('h', '64'))).toEqual({ height: '16rem' });
    });

    it('should resolve fraction values', () => {
      expect(heightGenerator(makeParsed('h', '1/2'))).toEqual({ height: '50%' });
      expect(heightGenerator(makeParsed('h', '1/3'))).toEqual({ height: '33.333333%' });
      expect(heightGenerator(makeParsed('h', '2/3'))).toEqual({ height: '66.666667%' });
    });

    it('should resolve special keyword values', () => {
      expect(heightGenerator(makeParsed('h', 'auto'))).toEqual({ height: 'auto' });
      expect(heightGenerator(makeParsed('h', 'full'))).toEqual({ height: '100%' });
      expect(heightGenerator(makeParsed('h', 'screen'))).toEqual({ height: '100vh' });
      expect(heightGenerator(makeParsed('h', 'min'))).toEqual({ height: 'min-content' });
      expect(heightGenerator(makeParsed('h', 'max'))).toEqual({ height: 'max-content' });
      expect(heightGenerator(makeParsed('h', 'fit'))).toEqual({ height: 'fit-content' });
      expect(heightGenerator(makeParsed('h', 'svh'))).toEqual({ height: '100svh' });
      expect(heightGenerator(makeParsed('h', 'lvh'))).toEqual({ height: '100lvh' });
      expect(heightGenerator(makeParsed('h', 'dvh'))).toEqual({ height: '100dvh' });
    });

    it('should resolve arbitrary values', () => {
      expect(heightGenerator(makeParsed('h', '[100px]', true))).toEqual({ height: '100px' });
    });
  });

  describe('Min-Height (min-h-*)', () => {
    it('should return null for no value', () => {
      expect(minHeightGenerator(makeParsed('min-h'))).toBeNull();
    });

    it('should resolve named values', () => {
      expect(minHeightGenerator(makeParsed('min-h', '0'))).toEqual({ 'min-height': '0px' });
      expect(minHeightGenerator(makeParsed('min-h', 'full'))).toEqual({ 'min-height': '100%' });
      expect(minHeightGenerator(makeParsed('min-h', 'screen'))).toEqual({ 'min-height': '100vh' });
      expect(minHeightGenerator(makeParsed('min-h', 'min'))).toEqual({ 'min-height': 'min-content' });
      expect(minHeightGenerator(makeParsed('min-h', 'max'))).toEqual({ 'min-height': 'max-content' });
      expect(minHeightGenerator(makeParsed('min-h', 'fit'))).toEqual({ 'min-height': 'fit-content' });
      expect(minHeightGenerator(makeParsed('min-h', 'svh'))).toEqual({ 'min-height': '100svh' });
      expect(minHeightGenerator(makeParsed('min-h', 'lvh'))).toEqual({ 'min-height': '100lvh' });
      expect(minHeightGenerator(makeParsed('min-h', 'dvh'))).toEqual({ 'min-height': '100dvh' });
    });

    it('should resolve numeric scale', () => {
      expect(minHeightGenerator(makeParsed('min-h', '16'))).toEqual({ 'min-height': '4rem' });
    });

    it('should resolve arbitrary values', () => {
      expect(minHeightGenerator(makeParsed('min-h', '[50vh]', true))).toEqual({ 'min-height': '50vh' });
    });
  });

  describe('Max-Height (max-h-*)', () => {
    it('should return null for no value', () => {
      expect(maxHeightGenerator(makeParsed('max-h'))).toBeNull();
    });

    it('should resolve named values', () => {
      expect(maxHeightGenerator(makeParsed('max-h', 'none'))).toEqual({ 'max-height': 'none' });
      expect(maxHeightGenerator(makeParsed('max-h', 'full'))).toEqual({ 'max-height': '100%' });
      expect(maxHeightGenerator(makeParsed('max-h', 'screen'))).toEqual({ 'max-height': '100vh' });
      expect(maxHeightGenerator(makeParsed('max-h', 'min'))).toEqual({ 'max-height': 'min-content' });
      expect(maxHeightGenerator(makeParsed('max-h', 'max'))).toEqual({ 'max-height': 'max-content' });
      expect(maxHeightGenerator(makeParsed('max-h', 'fit'))).toEqual({ 'max-height': 'fit-content' });
      expect(maxHeightGenerator(makeParsed('max-h', 'svh'))).toEqual({ 'max-height': '100svh' });
      expect(maxHeightGenerator(makeParsed('max-h', 'lvh'))).toEqual({ 'max-height': '100lvh' });
      expect(maxHeightGenerator(makeParsed('max-h', 'dvh'))).toEqual({ 'max-height': '100dvh' });
    });

    it('should resolve numeric scale', () => {
      expect(maxHeightGenerator(makeParsed('max-h', '48'))).toEqual({ 'max-height': '12rem' });
      expect(maxHeightGenerator(makeParsed('max-h', '96'))).toEqual({ 'max-height': '24rem' });
    });

    it('should resolve arbitrary values', () => {
      expect(maxHeightGenerator(makeParsed('max-h', '[80vh]', true))).toEqual({ 'max-height': '80vh' });
    });
  });

  describe('Size (size-*)', () => {
    it('should return null for no value', () => {
      expect(sizeGenerator(makeParsed('size'))).toBeNull();
    });

    it('should set both width and height from numeric scale', () => {
      expect(sizeGenerator(makeParsed('size', '4'))).toEqual({ width: '1rem', height: '1rem' });
      expect(sizeGenerator(makeParsed('size', '8'))).toEqual({ width: '2rem', height: '2rem' });
      expect(sizeGenerator(makeParsed('size', '0'))).toEqual({ width: '0px', height: '0px' });
    });

    it('should set both width and height from special values', () => {
      expect(sizeGenerator(makeParsed('size', 'full'))).toEqual({ width: '100%', height: '100%' });
      expect(sizeGenerator(makeParsed('size', 'auto'))).toEqual({ width: 'auto', height: 'auto' });
      expect(sizeGenerator(makeParsed('size', 'min'))).toEqual({ width: 'min-content', height: 'min-content' });
      expect(sizeGenerator(makeParsed('size', 'max'))).toEqual({ width: 'max-content', height: 'max-content' });
      expect(sizeGenerator(makeParsed('size', 'fit'))).toEqual({ width: 'fit-content', height: 'fit-content' });
    });

    it('should set both width and height from fractions', () => {
      expect(sizeGenerator(makeParsed('size', '1/2'))).toEqual({ width: '50%', height: '50%' });
    });

    it('should resolve arbitrary values', () => {
      expect(sizeGenerator(makeParsed('size', '[100px]', true))).toEqual({ width: '100px', height: '100px' });
    });

    it('should return null for unknown values', () => {
      expect(sizeGenerator(makeParsed('size', 'unknown'))).toBeNull();
    });
  });
});
