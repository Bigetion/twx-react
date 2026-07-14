/**
 * Variants Type Definitions
 *
 * Provides comprehensive TypeScript types for the twx-react variants system,
 * including variant schemas, compound variants, default variants, and utility
 * types for extracting variant props from configuration objects.
 *
 * @packageDocumentation
 */

// ─── Core Types ───────────────────────────────────────────────────────────────

/**
 * A raw variants schema mapping variant names to their possible values and
 * corresponding Tailwind class strings.
 *
 * @example
 * ```ts
 * const variants: VariantsSchema = {
 *   size: {
 *     sm: 'text-sm px-2 py-1',
 *     md: 'text-base px-4 py-2',
 *     lg: 'text-lg px-6 py-3',
 *   },
 *   color: {
 *     primary: 'bg-blue-600 text-white',
 *     danger: 'bg-red-600 text-white',
 *   },
 * };
 * ```
 */
export type VariantsSchema = Record<string, Record<string, string>>;

/**
 * Configuration mapping variant names to their possible values.
 * Each key is a variant name and each value is an object mapping
 * variant option names to their Tailwind class strings.
 *
 * @remarks
 * This is the legacy interface retained for backward compatibility.
 * Prefer using {@link VariantsSchema} for new code.
 *
 * @example
 * ```ts
 * const config: VariantsConfig = {
 *   size: { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
 *   variant: { solid: 'bg-blue-500 text-white', outline: 'border-2' },
 * };
 * ```
 */
export interface VariantsConfig {
  [variantName: string]: {
    [variantValue: string]: string;
  };
}

// ─── Variant Props ────────────────────────────────────────────────────────────

/**
 * Extracts optional variant props from a {@link VariantsSchema}.
 * Each variant key becomes an optional prop whose value is a union of
 * the variant's defined option keys (with a string escape hatch for
 * dynamic values).
 *
 * @typeParam V - The variants schema to extract props from
 *
 * @example
 * ```ts
 * type Schema = {
 *   size: { sm: string; md: string; lg: string };
 *   color: { primary: string; danger: string };
 * };
 *
 * type Props = VariantProps<Schema>;
 * // { size?: 'sm' | 'md' | 'lg' | (string & {}); color?: 'primary' | 'danger' | (string & {}) }
 * ```
 */
export type VariantProps<V extends VariantsSchema> = {
  [K in keyof V]?: keyof V[K] | (string & {});
};

/**
 * Utility type that makes specific variant props required while keeping
 * others optional.
 *
 * @typeParam V - The variants schema
 * @typeParam R - Union of variant keys to mark as required
 *
 * @example
 * ```ts
 * type Schema = {
 *   size: { sm: string; md: string };
 *   color: { primary: string; danger: string };
 * };
 *
 * type Props = RequiredVariantProps<Schema, 'size'>;
 * // { size: 'sm' | 'md' | (string & {}); color?: 'primary' | 'danger' | (string & {}) }
 * ```
 */
export type RequiredVariantProps<V extends VariantsSchema, R extends keyof V> = Required<
  Pick<VariantProps<V>, R>
> &
  Omit<VariantProps<V>, R>;

// ─── Compound Variants ────────────────────────────────────────────────────────

/**
 * A compound variant entry that applies additional classes when multiple
 * variant conditions are matched simultaneously.
 *
 * @remarks
 * This is the legacy interface retained for backward compatibility.
 * Prefer using {@link CompoundVariantRule} for new code with better
 * type safety.
 *
 * @example
 * ```ts
 * const compound: CompoundVariant = {
 *   variant: 'solid',
 *   color: 'primary',
 *   class: 'shadow-lg ring-2 ring-blue-300',
 * };
 * ```
 */
export interface CompoundVariant {
  [key: string]: string | number | boolean;
  class: string;
}

/**
 * A properly typed compound variant entry that applies additional classes
 * when multiple variant conditions are met simultaneously.
 *
 * Each key (other than `className`) represents a variant condition that must
 * match for the compound variant's classes to be applied.
 *
 * @typeParam V - The variants schema this compound variant references
 *
 * @example
 * ```ts
 * type Schema = {
 *   variant: { solid: string; outline: string };
 *   color: { primary: string; danger: string };
 * };
 *
 * const entry: CompoundVariantRule<Schema> = {
 *   variant: 'solid',
 *   color: 'primary',
 *   className: 'shadow-lg ring-2 ring-blue-300',
 * };
 * ```
 */
export type CompoundVariantRule<V extends VariantsSchema> = {
  [K in keyof V]?: keyof V[K] | (string & {});
} & {
  /** The class string to apply when all variant conditions match. */
  className: string;
};

// ─── Default Variants ─────────────────────────────────────────────────────────

/**
 * A partial mapping of variant keys to their default values.
 * When a variant prop is not provided, the corresponding default value
 * is used for resolution.
 *
 * @typeParam V - The variants schema
 *
 * @example
 * ```ts
 * type Schema = {
 *   size: { sm: string; md: string; lg: string };
 *   color: { primary: string; danger: string };
 * };
 *
 * const defaults: DefaultVariants<Schema> = {
 *   size: 'md',
 *   color: 'primary',
 * };
 * ```
 */
export type DefaultVariants<V extends VariantsSchema> = {
  [K in keyof V]?: keyof V[K] | (string & {});
};

// ─── Full Variants Configuration ──────────────────────────────────────────────

/**
 * Complete variants configuration type combining base classes, variant
 * definitions, compound variants, and default variant values.
 *
 * This represents the full configuration object passed to
 * `createTwComponent` or `useTwVariants`.
 *
 * @typeParam V - The variants schema
 *
 * @example
 * ```ts
 * type Schema = {
 *   size: { sm: string; md: string; lg: string };
 *   color: { primary: string; danger: string };
 * };
 *
 * const config: FullVariantsConfig<Schema> = {
 *   base: 'px-4 py-2 rounded-lg font-medium transition-all',
 *   variants: {
 *     size: { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
 *     color: { primary: 'bg-blue-600', danger: 'bg-red-600' },
 *   },
 *   compoundVariants: [
 *     { size: 'lg', color: 'primary', className: 'shadow-lg' },
 *   ],
 *   defaultVariants: { size: 'md', color: 'primary' },
 * };
 * ```
 */
export interface FullVariantsConfig<V extends VariantsSchema = VariantsSchema> {
  /** Base classes that are always applied regardless of variant selection. */
  base?: string;

  /** Map of variant names to their possible values and corresponding classes. */
  variants?: V;

  /** Compound variants that apply when multiple variant conditions are met. */
  compoundVariants?: Array<CompoundVariantRule<V>>;

  /** Default variant values used when a variant prop is not provided. */
  defaultVariants?: DefaultVariants<V>;
}

// ─── Resolved Output ──────────────────────────────────────────────────────────

/**
 * The resolved className string result after variant resolution.
 * This is always a plain string of space-separated class names.
 */
export type ResolvedClassName = string;
