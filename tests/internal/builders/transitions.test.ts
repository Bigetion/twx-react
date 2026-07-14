/**
 * Tests for Transitions & Animations Utilities Builder
 */

import { registerTransitionUtilities } from '../../../src/internal/builders/transitions';
import { generateCSS, clearRegistry } from '../../../src/internal/generator';
import { parseClassName } from '../../../src/internal/parser';

beforeEach(() => {
  clearRegistry();
  registerTransitionUtilities();
});

// ─── Transition Property Utilities ────────────────────────────────────────────

describe('Transition property utilities', () => {
  it('transition → default transition properties', () => {
    const parsed = parseClassName('transition');
    const rule = generateCSS(parsed, 'transition');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-property']).toBe(
      'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter'
    );
    expect(rule!.properties['transition-timing-function']).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(rule!.properties['transition-duration']).toBe('150ms');
  });

  it('transition-none → transition-property: none', () => {
    const parsed = parseClassName('transition-none');
    const rule = generateCSS(parsed, 'transition-none');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-property']).toBe('none');
    expect(rule!.properties['transition-timing-function']).toBeUndefined();
  });

  it('transition-all → transition-property: all + timing + duration', () => {
    const parsed = parseClassName('transition-all');
    const rule = generateCSS(parsed, 'transition-all');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-property']).toBe('all');
    expect(rule!.properties['transition-timing-function']).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(rule!.properties['transition-duration']).toBe('150ms');
  });

  it('transition-colors → transition-property: color properties', () => {
    const parsed = parseClassName('transition-colors');
    const rule = generateCSS(parsed, 'transition-colors');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-property']).toBe(
      'color, background-color, border-color, text-decoration-color, fill, stroke'
    );
    expect(rule!.properties['transition-timing-function']).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(rule!.properties['transition-duration']).toBe('150ms');
  });

  it('transition-opacity → transition-property: opacity', () => {
    const parsed = parseClassName('transition-opacity');
    const rule = generateCSS(parsed, 'transition-opacity');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-property']).toBe('opacity');
  });

  it('transition-shadow → transition-property: box-shadow', () => {
    const parsed = parseClassName('transition-shadow');
    const rule = generateCSS(parsed, 'transition-shadow');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-property']).toBe('box-shadow');
  });

  it('transition-transform → transition-property: transform', () => {
    const parsed = parseClassName('transition-transform');
    const rule = generateCSS(parsed, 'transition-transform');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-property']).toBe('transform');
  });
});

// ─── Duration Utilities ───────────────────────────────────────────────────────

describe('Duration utilities', () => {
  it('duration-0 → transition-duration: 0s', () => {
    const parsed = parseClassName('duration-0');
    const rule = generateCSS(parsed, 'duration-0');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-duration']).toBe('0s');
  });

  it('duration-75 → transition-duration: 75ms', () => {
    const parsed = parseClassName('duration-75');
    const rule = generateCSS(parsed, 'duration-75');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-duration']).toBe('75ms');
  });

  it('duration-150 → transition-duration: 150ms', () => {
    const parsed = parseClassName('duration-150');
    const rule = generateCSS(parsed, 'duration-150');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-duration']).toBe('150ms');
  });

  it('duration-300 → transition-duration: 300ms', () => {
    const parsed = parseClassName('duration-300');
    const rule = generateCSS(parsed, 'duration-300');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-duration']).toBe('300ms');
  });

  it('duration-1000 → transition-duration: 1000ms', () => {
    const parsed = parseClassName('duration-1000');
    const rule = generateCSS(parsed, 'duration-1000');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-duration']).toBe('1000ms');
  });
});

// ─── Timing Function Utilities ────────────────────────────────────────────────

describe('Timing function utilities', () => {
  it('ease-linear → transition-timing-function: linear', () => {
    const parsed = parseClassName('ease-linear');
    const rule = generateCSS(parsed, 'ease-linear');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-timing-function']).toBe('linear');
  });

  it('ease-in → transition-timing-function: cubic-bezier(0.4, 0, 1, 1)', () => {
    const parsed = parseClassName('ease-in');
    const rule = generateCSS(parsed, 'ease-in');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-timing-function']).toBe('cubic-bezier(0.4, 0, 1, 1)');
  });

  it('ease-out → transition-timing-function: cubic-bezier(0, 0, 0.2, 1)', () => {
    const parsed = parseClassName('ease-out');
    const rule = generateCSS(parsed, 'ease-out');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-timing-function']).toBe('cubic-bezier(0, 0, 0.2, 1)');
  });

  it('ease-in-out → transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)', () => {
    const parsed = parseClassName('ease-in-out');
    const rule = generateCSS(parsed, 'ease-in-out');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-timing-function']).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
  });
});

// ─── Delay Utilities ──────────────────────────────────────────────────────────

describe('Delay utilities', () => {
  it('delay-0 → transition-delay: 0s', () => {
    const parsed = parseClassName('delay-0');
    const rule = generateCSS(parsed, 'delay-0');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-delay']).toBe('0s');
  });

  it('delay-100 → transition-delay: 100ms', () => {
    const parsed = parseClassName('delay-100');
    const rule = generateCSS(parsed, 'delay-100');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-delay']).toBe('100ms');
  });

  it('delay-200 → transition-delay: 200ms', () => {
    const parsed = parseClassName('delay-200');
    const rule = generateCSS(parsed, 'delay-200');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-delay']).toBe('200ms');
  });

  it('delay-500 → transition-delay: 500ms', () => {
    const parsed = parseClassName('delay-500');
    const rule = generateCSS(parsed, 'delay-500');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-delay']).toBe('500ms');
  });

  it('delay-1000 → transition-delay: 1000ms', () => {
    const parsed = parseClassName('delay-1000');
    const rule = generateCSS(parsed, 'delay-1000');
    expect(rule).not.toBeNull();
    expect(rule!.properties['transition-delay']).toBe('1000ms');
  });
});

// ─── Animation Utilities ──────────────────────────────────────────────────────

describe('Animation utilities', () => {
  it('animate-none → animation: none', () => {
    const parsed = parseClassName('animate-none');
    const rule = generateCSS(parsed, 'animate-none');
    expect(rule).not.toBeNull();
    expect(rule!.properties['animation']).toBe('none');
  });

  it('animate-spin → animation: spin 1s linear infinite', () => {
    const parsed = parseClassName('animate-spin');
    const rule = generateCSS(parsed, 'animate-spin');
    expect(rule).not.toBeNull();
    expect(rule!.properties['animation']).toBe('spin 1s linear infinite');
  });

  it('animate-ping → animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', () => {
    const parsed = parseClassName('animate-ping');
    const rule = generateCSS(parsed, 'animate-ping');
    expect(rule).not.toBeNull();
    expect(rule!.properties['animation']).toBe('ping 1s cubic-bezier(0, 0, 0.2, 1) infinite');
  });

  it('animate-pulse → animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', () => {
    const parsed = parseClassName('animate-pulse');
    const rule = generateCSS(parsed, 'animate-pulse');
    expect(rule).not.toBeNull();
    expect(rule!.properties['animation']).toBe('pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite');
  });

  it('animate-bounce → animation: bounce 1s infinite', () => {
    const parsed = parseClassName('animate-bounce');
    const rule = generateCSS(parsed, 'animate-bounce');
    expect(rule).not.toBeNull();
    expect(rule!.properties['animation']).toBe('bounce 1s infinite');
  });
});
