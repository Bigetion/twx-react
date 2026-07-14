/**
 * Slots Type Definitions
 *
 * Type definitions for the multi-part component slots system. Slots allow
 * styling multiple named sub-elements from a single variant configuration.
 *
 * @packageDocumentation
 */

import type { VariantsConfig } from './variants';

// ─── Core Schema Types ────────────────────────────────────────────────────────

/**
 * The raw slots object type — a record mapping slot names to their base
 * Tailwind CSS class strings.
 *
 * @example
 * ```ts
 * const slots: SlotsSchema = {
 *   root: "rounded-lg border bg-white",
 *   header: "px-6 py-4 border-b",
 *   body: "px-6 py-4",
 *   footer: "px-6 py-4 border-t",
 * };
 * ```
 */
export type SlotsSchema = Record<string, string>;

// ─── Variant Types for Slots ──────────────────────────────────────────────────

/**
 * Variants configuration for slots, where each variant value maps to
 * per-slot class overrides. A slot key that is absent or empty means
 * no extra class for that slot at that variant value.
 *
 * @typeParam S - The slots schema (slot names and their base classes)
 * @typeParam V - The variants configuration defining variant names and values
 *
 * @example
 * ```ts
 * type MySlots = { root: string; body: string };
 * type MyVariants = { size: { sm: string; md: string } };
 *
 * const variants: SlotsVariantsConfig<MySlots, MyVariants> = {
 *   size: {
 *     sm: { root: "text-sm", body: "px-4 py-3" },
 *     md: { root: "text-base", body: "px-6 py-4" },
 *   },
 * };
 * ```
 */
export type SlotsVariantsConfig<
  S extends SlotsSchema,
  V extends VariantsConfig
> = {
  [K in keyof V]: {
    [VK in keyof V[K]]: Partial<Record<keyof S, string>>;
  };
};

// ─── Compound Variant Type ────────────────────────────────────────────────────

/**
 * A compound variant entry for slots. All non-`class` keys are conditions
 * (variant name → value), and `class` maps slot names to additional classes
 * applied when all conditions match.
 *
 * @typeParam S - The slots schema (slot names and their base classes)
 *
 * @example
 * ```ts
 * const compound: SlotsCompoundVariant<{ root: string; body: string }> = {
 *   size: "sm",
 *   color: "primary",
 *   class: {
 *     root: "border-blue-500",
 *     body: "text-blue-900",
 *   },
 * };
 * ```
 */
export interface SlotsCompoundVariant<S extends SlotsSchema> {
  [key: string]: unknown;
  /** Per-slot class overrides applied when all conditions match. */
  class?: Partial<Record<keyof S, string>>;
}

// ─── Configuration Type ───────────────────────────────────────────────────────

/**
 * Full configuration accepted by `createTwSlots`. Defines the slots, their
 * base classes, variants (per-slot overrides), compound variants, and default
 * variant values.
 *
 * @typeParam S - The slots schema (slot names and their base classes)
 * @typeParam V - The variants configuration defining variant names and values
 *
 * @example
 * ```ts
 * const config: TwSlotsConfig<
 *   { root: string; header: string; body: string },
 *   { size: { sm: string; md: string } }
 * > = {
 *   slots: {
 *     root: "rounded-lg border bg-white",
 *     header: "px-6 py-4 border-b",
 *     body: "px-6 py-4",
 *   },
 *   variants: {
 *     size: {
 *       sm: { root: "text-sm", body: "px-4 py-3" },
 *       md: { root: "text-base", body: "px-6 py-4" },
 *     },
 *   },
 *   defaultVariants: { size: "md" },
 * };
 * ```
 */
export interface TwSlotsConfig<
  S extends SlotsSchema,
  V extends VariantsConfig = VariantsConfig
> {
  /** Base class strings keyed by slot name. Always applied. */
  slots: S;
  /**
   * Variant definitions. Each variant key maps to an object whose keys are
   * variant values, and each value is a `Partial<Record<slotName, string>>`.
   */
  variants?: SlotsVariantsConfig<S, V>;
  /**
   * Compound variants: applied when all specified conditions simultaneously
   * match the resolved variant props (including defaults).
   */
  compoundVariants?: Array<SlotsCompoundVariant<S>>;
  /** Fallback variant values used when a variant prop is absent. */
  defaultVariants?: Partial<Record<keyof V, string>>;
}

// ─── Utility Types ────────────────────────────────────────────────────────────

/**
 * Extracts the slot names from a `TwSlotsConfig`.
 *
 * @typeParam C - A `TwSlotsConfig` instance
 *
 * @example
 * ```ts
 * type Config = TwSlotsConfig<{ root: string; body: string; footer: string }>;
 * type Names = SlotNames<Config>; // "root" | "body" | "footer"
 * ```
 */
export type SlotNames<C extends TwSlotsConfig<SlotsSchema, VariantsConfig>> =
  keyof C['slots'];

/**
 * The return type of a resolved slots function — a record mapping each slot
 * name to its resolved className string.
 *
 * @typeParam S - The slots schema (slot names and their base classes)
 *
 * @example
 * ```ts
 * type Result = SlotClassNames<{ root: string; header: string; body: string }>;
 * // { root: string; header: string; body: string }
 * ```
 */
export type SlotClassNames<S extends SlotsSchema> = Record<keyof S, string>;

// ─── Function Type ────────────────────────────────────────────────────────────

/**
 * The function returned by `createTwSlots`. Call it with optional variant props
 * to get a slot → className map. Each slot key in the result contains the fully
 * resolved class string (base + variant + compound variant classes merged).
 *
 * @typeParam S - The slots schema (slot names and their base classes)
 * @typeParam V - The variants configuration defining variant names and values
 *
 * @example
 * ```ts
 * const card: TwSlotsFunction<
 *   { root: string; body: string },
 *   { size: { sm: string; md: string } }
 * > = createTwSlots(config);
 *
 * const classes = card({ size: "sm" });
 * classes.root; // "rounded-lg border bg-white text-sm"
 * classes.body; // "px-6 py-4 px-4 py-3"
 * ```
 */
export type TwSlotsFunction<
  S extends SlotsSchema,
  V extends VariantsConfig = VariantsConfig
> = (props?: Partial<Record<keyof V, string>>) => SlotClassNames<S>;
