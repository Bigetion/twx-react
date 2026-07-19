/**
 * TWX-React - Pure React Styling Library
 * Component-First Tailwind CSS Runtime Engine
 *
 * Public API surface — do NOT export anything from src/internal/
 *
 * @packageDocumentation
 */

// Side-effect import: registers all utility builders before any API usage
import './internal/init';

// Auto-inject preflight CSS reset (opt out via disablePreflight())
import { autoInjectPreflight } from './preflight';
autoInjectPreflight();

// ═══════════════════════════════════════════════════════════════════════════════
// Runtime APIs
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Utility Functions ────────────────────────────────────────────────────────

export { tw } from './tw';
export { expandClassName } from './internal/expander';
export { mergeClassNames, mergeClassNames as twMerge } from './internal/merger';
export { warnUnknownClass } from './internal/generator';

// ─── Preflight (CSS Reset) ────────────────────────────────────────────────────

export { injectPreflight, disablePreflight } from './preflight';

// ─── Component APIs ───────────────────────────────────────────────────────────

export { createTwComponent } from './createTwComponent';
export type {
  TwComponentConfig,
  TwComponentProps,
  TwComponent,
  VariantsConfig,
} from './createTwComponent';

export { createTwSlots } from './createTwSlots';
export type {
  TwSlotsConfig,
  TwSlotsFunction,
  SlotsCompoundVariant,
} from './createTwSlots';

export { createTwCompound } from './createTwCompound';
export type {
  CompoundConfig,
  CompoundPartConfig,
  TwCompoundComponents,
} from './createTwCompound';

// ─── Hooks ────────────────────────────────────────────────────────────────────

export { useTwVariants } from './hooks/useTwVariants';
export { useTwSlots } from './hooks/useTwSlots';

// ═══════════════════════════════════════════════════════════════════════════════
// Type-Only Exports (from src/types/)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Component Types (types/component.ts) ─────────────────────────────────────

export type {
  ElementTag,
  TwIntrinsicProps,
  TwCompoundVariantEntry,
  VariantNames,
  VariantValues,
  VariantPropsOf,
  PropsForElement,
  InferVariantProps,
  InferComponentProps,
  // Legacy polymorphic types
  PropsOf,
  AsProp,
  PolymorphicComponentProps,
} from './types/component';

// ─── Variants Types (types/variants.ts) ───────────────────────────────────────

export type {
  VariantsSchema,
  VariantProps,
  RequiredVariantProps,
  CompoundVariant,
  CompoundVariantRule,
  DefaultVariants,
  FullVariantsConfig,
  ResolvedClassName,
} from './types/variants';

// ─── Slots Types (types/slots.ts) ─────────────────────────────────────────────
// Aliased to avoid conflicts with runtime exports from ./createTwSlots

export type {
  SlotsSchema,
  SlotsVariantsConfig,
  SlotNames,
  SlotClassNames,
  TwSlotsConfig as SlotsCoreConfig,
  TwSlotsFunction as SlotsCoreFunction,
  SlotsCompoundVariant as SlotsCompoundVariantTyped,
} from './types/slots';

// ─── Compound Types (types/compound.ts) ────────────────────────────────────────
// Aliased to avoid conflicts with runtime exports from ./createTwCompound

export type {
  CompoundComponentNames,
  CompoundPartProps,
  CompoundPartComponentProps,
  CompoundContext,
  CompoundConfig as CompoundCoreConfig,
  CompoundPartConfig as CompoundCorePartConfig,
  TwCompoundComponents as CompoundCoreComponents,
} from './types/compound';

// ═══════════════════════════════════════════════════════════════════════════════
// Package Metadata
// ═══════════════════════════════════════════════════════════════════════════════

export const version = '1.0.0';
