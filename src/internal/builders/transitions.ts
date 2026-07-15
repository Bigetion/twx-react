/**
 * Transitions & Animations Utilities Builder
 * Generates transition property, duration, timing function, delay, and animation utilities
 *
 * @internal
 */

import { registerUtilities, type UtilityGenerator } from '../generator';
import { injectCSS } from '../injector';

// ─── Duration Scale ───────────────────────────────────────────────────────────

/** Maps duration value → CSS transition-duration */
const DURATION_SCALE: Record<string, string> = {
  '0': '0s',
  '75': '75ms',
  '100': '100ms',
  '150': '150ms',
  '200': '200ms',
  '300': '300ms',
  '500': '500ms',
  '700': '700ms',
  '1000': '1000ms',
};

// ─── Delay Scale ──────────────────────────────────────────────────────────────

/** Maps delay value → CSS transition-delay */
const DELAY_SCALE: Record<string, string> = {
  '0': '0s',
  '75': '75ms',
  '100': '100ms',
  '150': '150ms',
  '200': '200ms',
  '300': '300ms',
  '500': '500ms',
  '700': '700ms',
  '1000': '1000ms',
};

// ─── Timing Functions ─────────────────────────────────────────────────────────

/** Maps timing function name → CSS timing function value */
const TIMING_FUNCTIONS: Record<string, string> = {
  'linear': 'linear',
  'in': 'cubic-bezier(0.4, 0, 1, 1)',
  'out': 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
};

// ─── Transition Property Values ───────────────────────────────────────────────

/** Default transition timing function and duration applied to transition-* utilities */
const DEFAULT_TIMING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DEFAULT_DURATION = '150ms';

/** Transition property mappings */
const TRANSITION_PROPERTIES: Record<string, Record<string, string>> = {
  'none': {
    'transition-property': 'none',
  },
  'all': {
    'transition-property': 'all',
    'transition-timing-function': DEFAULT_TIMING,
    'transition-duration': DEFAULT_DURATION,
  },
  'DEFAULT': {
    'transition-property': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
    'transition-timing-function': DEFAULT_TIMING,
    'transition-duration': DEFAULT_DURATION,
  },
  'colors': {
    'transition-property': 'color, background-color, border-color, text-decoration-color, fill, stroke',
    'transition-timing-function': DEFAULT_TIMING,
    'transition-duration': DEFAULT_DURATION,
  },
  'opacity': {
    'transition-property': 'opacity',
    'transition-timing-function': DEFAULT_TIMING,
    'transition-duration': DEFAULT_DURATION,
  },
  'shadow': {
    'transition-property': 'box-shadow',
    'transition-timing-function': DEFAULT_TIMING,
    'transition-duration': DEFAULT_DURATION,
  },
  'transform': {
    'transition-property': 'transform',
    'transition-timing-function': DEFAULT_TIMING,
    'transition-duration': DEFAULT_DURATION,
  },
};

// ─── Animation Values ─────────────────────────────────────────────────────────

/** Maps animation name → CSS animation value */
const ANIMATIONS: Record<string, string> = {
  'none': 'none',
  'spin': 'spin 1s linear infinite',
  'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'bounce': 'bounce 1s infinite',
};

const ANIMATION_KEYFRAMES: Record<string, string> = {
  spin: `@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
  ping: `@keyframes ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}`,
  pulse: `@keyframes pulse {
  50% { opacity: 0.5; }
}`,
  bounce: `@keyframes bounce {
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
}`,
};

const injectedAnimationKeyframes = new Set<string>();

function injectAnimationKeyframes(name: string): void {
  const keyframes = ANIMATION_KEYFRAMES[name];
  if (!keyframes || injectedAnimationKeyframes.has(name)) return;
  injectedAnimationKeyframes.add(name);
  injectCSS(keyframes);
}

// ─── Transition Property Generator ───────────────────────────────────────────

/**
 * transition / transition-* → transition-property (+ timing + duration for non-none)
 * 
 * Parser behavior:
 * - "transition" → utility: "transition", value: undefined → DEFAULT
 * - "transition-all" → utility: "transition", value: "all"
 * - "transition-none" → utility: "transition", value: "none"
 * - "transition-colors" → utility: "transition", value: "colors"
 * - "transition-opacity" → utility: "transition", value: "opacity"
 * - "transition-shadow" → utility: "transition", value: "shadow"
 * - "transition-transform" → utility: "transition", value: "transform"
 */
const transitionGenerator: UtilityGenerator = (parsed) => {
  // "transition" with no value → DEFAULT
  if (!parsed.value) {
    return { ...TRANSITION_PROPERTIES['DEFAULT'] };
  }

  const props = TRANSITION_PROPERTIES[parsed.value];
  if (!props) return null;

  return { ...props };
};

// ─── Duration Generator ───────────────────────────────────────────────────────

/** duration-* → transition-duration: value */
const durationGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: duration-[2s]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'transition-duration': parsed.value.slice(1, -1) };
  }

  const duration = DURATION_SCALE[parsed.value];
  if (!duration) return null;

  return { 'transition-duration': duration };
};

// ─── Timing Function Generator ────────────────────────────────────────────────

/**
 * ease-* → transition-timing-function: value
 * 
 * Parser behavior:
 * - "ease-linear" → utility: "ease", value: "linear"
 * - "ease-in" → utility: "ease", value: "in"
 * - "ease-out" → utility: "ease", value: "out"
 * - "ease-in-out" → utility: "ease-in", value: "out" (parser splits on last hyphen!)
 * 
 * So we register both "ease" and "ease-in":
 * - "ease" handles value: "linear", "in", "out"
 * - "ease-in" handles value: "out" → produces ease-in-out
 */
const easeGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  const timing = TIMING_FUNCTIONS[parsed.value];
  if (!timing) return null;

  return { 'transition-timing-function': timing };
};

/**
 * ease-in with value "out" → ease-in-out
 * Parser splits "ease-in-out" as utility: "ease-in", value: "out"
 */
const easeInGenerator: UtilityGenerator = (parsed) => {
  // "ease-in" with no value → transition-timing-function: cubic-bezier(0.4, 0, 1, 1)
  if (!parsed.value) {
    return { 'transition-timing-function': TIMING_FUNCTIONS['in'] };
  }

  // "ease-in-out" → utility: "ease-in", value: "out"
  if (parsed.value === 'out') {
    return { 'transition-timing-function': TIMING_FUNCTIONS['in-out'] };
  }

  return null;
};

// ─── Delay Generator ──────────────────────────────────────────────────────────

/** delay-* → transition-delay: value */
const delayGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: delay-[2s]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { 'transition-delay': parsed.value.slice(1, -1) };
  }

  const delay = DELAY_SCALE[parsed.value];
  if (!delay) return null;

  return { 'transition-delay': delay };
};

// ─── Animation Generator ─────────────────────────────────────────────────────

/** animate-* → animation: value */
const animateGenerator: UtilityGenerator = (parsed) => {
  if (!parsed.value) return null;

  // Arbitrary value: animate-[wiggle_1s_ease-in-out_infinite]
  if (parsed.arbitrary && parsed.value.startsWith('[') && parsed.value.endsWith(']')) {
    return { animation: parsed.value.slice(1, -1) };
  }

  const animation = ANIMATIONS[parsed.value];
  if (!animation) return null;

  injectAnimationKeyframes(parsed.value);
  return { animation };
};

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register all transition and animation utilities with the generator registry.
 * Call this during initialization.
 */
export function registerTransitionUtilities(): void {
  registerUtilities([
    // Transition property
    ['transition', transitionGenerator],

    // Duration
    ['duration', durationGenerator],

    // Timing function (ease-linear, ease-in, ease-out)
    ['ease', easeGenerator],
    // Handles "ease-in-out" (parser splits as utility: "ease-in", value: "out")
    ['ease-in', easeInGenerator],

    // Delay
    ['delay', delayGenerator],

    // Animation
    ['animate', animateGenerator],
  ]);
}

// Export for testing
export {
  DURATION_SCALE,
  DELAY_SCALE,
  TIMING_FUNCTIONS,
  TRANSITION_PROPERTIES,
  ANIMATIONS,
};
