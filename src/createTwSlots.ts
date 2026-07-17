/**
 * createTwSlots — Multi-Part Component Slots Factory
 *
 * Creates a function that resolves per-slot class names from a shared variant
 * configuration. Each call to the returned function accepts variant props and
 * returns a plain object mapping every slot name to its resolved className.
 *
 * @example
 * ```ts
 * const card = createTwSlots({
 *   slots: {
 *     root:   "rounded-lg border bg-white",
 *     header: "px-6 py-4 border-b",
 *     body:   "px-6 py-4",
 *     footer: "px-6 py-4 border-t",
 *   },
 *   variants: {
 *     size: {
 *       sm: { root: "text-sm", body: "px-4 py-3" },
 *       md: { root: "text-base", body: "px-6 py-4" },
 *     },
 *     shadow: {
 *       none: {},
 *       sm:   { root: "shadow-sm" },
 *       lg:   { root: "shadow-lg" },
 *     },
 *   },
 *   defaultVariants: { size: "md", shadow: "none" },
 * });
 *
 * card({ size: "sm" }).root   // "rounded-lg border bg-white text-sm"
 * card({ size: "sm" }).body   // "px-6 py-4 px-4 py-3"
 * card({ size: "sm" }).header // "px-6 py-4 border-b"  (no variant class)
 * ```
 */

import { parseClassName } from './internal/parser';
import { generateCSSString } from './internal/generator';
import { injectLayeredCSS } from './internal/injector';
import { mergeClassNames } from './internal/merger';

// Side-effect: ensure all utility builders are registered
import './internal/init';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Maps variant values to per-slot class overrides.
 * A slot key that is absent or empty means no extra class for that slot.
 */
type SlotVariantValue<S extends Record<string, string>> = Partial<Record<keyof S, string>>;

/**
 * Variant definitions where each value maps to per-slot overrides.
 */
type SlotsVariants<S extends Record<string, string>> = Record<
  string,
  Record<string, SlotVariantValue<S>>
>;

/**
 * Compound variant entry: all non-`class` keys are conditions, `class` maps
 * slot names to additional classes that are applied when all conditions match.
 */
export interface SlotsCompoundVariant<S extends Record<string, string>> {
  [key: string]: unknown;
  class?: SlotVariantValue<S>;
}

/**
 * Full configuration accepted by `createTwSlots`.
 */
export interface TwSlotsConfig<
  S extends Record<string, string>,
  V extends SlotsVariants<S> = SlotsVariants<S>
> {
  /** Base class strings keyed by slot name. Always applied. */
  slots: S;
  /**
   * Variant definitions. Each variant key maps to an object whose keys are
   * variant values, and each value is a `Partial<Record<slotName, string>>`.
   */
  variants?: V;
  /**
   * Compound variants: applied when all specified conditions simultaneously
   * match the resolved variant props (including defaults).
   */
  compoundVariants?: SlotsCompoundVariant<S>[];
  /** Fallback variant values used when a variant prop is absent. */
  defaultVariants?: Record<string, string>;
}

/**
 * The function returned by `createTwSlots`.
 * Call it with optional variant props to get a slot → className map.
 */
export type TwSlotsFunction<S extends Record<string, string>> = (
  props?: Record<string, string | undefined>
) => Record<keyof S, string>;

// ─── Implementation ───────────────────────────────────────────────────────────

/**
 * Create a slots resolver from the given configuration.
 *
 * @param config - Slots configuration (slots, variants, defaultVariants)
 * @returns A function that accepts variant props and returns per-slot classNames
 */
export function createTwSlots<
  S extends Record<string, string>,
  V extends SlotsVariants<S> = SlotsVariants<S>
>(config: TwSlotsConfig<S, V>): TwSlotsFunction<S> {
  const { slots, variants, compoundVariants, defaultVariants } = config;

  return function resolveSlots(
    props: Record<string, string | undefined> = {}
  ): Record<keyof S, string> {
    // Build effective props: caller-provided values win, defaults fill the rest
    const effectiveProps: Record<string, string | undefined> = {};

    if (variants) {
      for (const variantName of Object.keys(variants)) {
        effectiveProps[variantName] =
          props[variantName] ?? defaultVariants?.[variantName];
      }
    }

    // Also include any caller-provided props not in the variants definition
    for (const [key, value] of Object.entries(props)) {
      if (!(key in effectiveProps)) {
        effectiveProps[key] = value;
      }
    }

    // Initialise per-slot class lists with the base slot class
    const slotClasses: Record<string, string[]> = {};
    for (const slotName of Object.keys(slots)) {
      slotClasses[slotName] = slots[slotName] ? [slots[slotName]] : [];
    }

    // Apply per-slot variant classes
    if (variants) {
      for (const [variantName, variantValues] of Object.entries(variants)) {
        const resolvedValue = effectiveProps[variantName];
        if (resolvedValue === undefined || resolvedValue === null) {
          continue;
        }

        const slotOverrides = variantValues[resolvedValue];
        if (!slotOverrides) {
          continue;
        }

        for (const [slotName, extraClass] of Object.entries(slotOverrides)) {
          if (extraClass && slotName in slotClasses) {
            slotClasses[slotName].push(extraClass as string);
          }
        }
      }
    }

    // Apply compound variant classes
    if (compoundVariants && compoundVariants.length > 0) {
      for (const compound of compoundVariants) {
        const { class: slotOverrides, ...conditions } = compound;

        // Check that every condition key matches effectiveProps
        const allMatch = Object.entries(conditions).every(([condKey, condValue]) => {
          const effectiveValue = effectiveProps[condKey];
          if (Array.isArray(condValue)) {
            return condValue.includes(effectiveValue as string);
          }
          return effectiveValue === condValue;
        });

        if (allMatch && slotOverrides) {
          for (const [slotName, extraClass] of Object.entries(slotOverrides)) {
            if (extraClass && slotName in slotClasses) {
              slotClasses[slotName].push(extraClass as string);
            }
          }
        }
      }
    }

    // Merge each slot's classes into a single trimmed string (resolving any
    // conflicting utilities so a later variant/compound-variant class reliably
    // overrides an earlier one) and inject CSS.
    const result: Record<string, string> = {};
    for (const slotName of Object.keys(slots)) {
      const classString = mergeClassNames(...slotClasses[slotName]).trim();
      result[slotName] = classString;

      // Inject CSS for each token in the resolved slot class string
      if (classString) {
        const tokens = classString.split(/\s+/).filter(Boolean);
        for (const token of tokens) {
          const parsed = parseClassName(token);
          if (!parsed.utility) continue;
          const css = generateCSSString(parsed, token);
          if (css) {
            injectLayeredCSS(css, parsed.variants.length > 0 ? 'variants' : 'utilities');
          }
        }
      }
    }

    return result as Record<keyof S, string>;
  };
}
