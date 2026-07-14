/**
 * Compound Components Type Definitions
 *
 * Provides comprehensive type support for the compound component system
 * created via `createTwCompound`. A compound component is a group of related
 * React components (parts) configured together and returned as a single object.
 *
 * @packageDocumentation
 */

import type {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';

// ─── Part Configuration ─────────────────────────────────────────────────────

/**
 * Configuration for a single part within a compound component.
 *
 * Each part can define its own element, base classes, variants,
 * compound variants, and default variant values.
 *
 * @example
 * ```ts
 * const tabConfig: CompoundPartConfig = {
 *   element: 'button',
 *   base: 'px-4 py-2 cursor-pointer',
 *   variants: {
 *     active: {
 *       true: 'border-b-2 border-blue-500 text-blue-500',
 *       false: '',
 *     },
 *   },
 *   defaultVariants: { active: 'false' },
 * };
 * ```
 */
export interface CompoundPartConfig {
  /**
   * The default HTML element or React component this part renders.
   * Defaults to `"div"` when not specified.
   *
   * @default 'div'
   * @example `element: 'button'`
   * @example `element: 'section'`
   */
  element?: ElementType;

  /**
   * Base Tailwind CSS classes that are always applied to this part.
   *
   * @example `base: 'flex items-center gap-2'`
   */
  base?: string;

  /**
   * Variant definitions mapping variant names to their possible values and
   * corresponding CSS classes.
   *
   * @example
   * ```ts
   * variants: {
   *   size: { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
   *   color: { primary: 'text-blue-500', danger: 'text-red-500' },
   * }
   * ```
   */
  variants?: Record<string, Record<string, string>>;

  /**
   * Compound variants that apply additional classes when multiple variant
   * conditions are met simultaneously.
   *
   * Each entry is an object with variant conditions plus a `class` (or
   * `className`) key holding the CSS classes to apply.
   *
   * @example
   * ```ts
   * compoundVariants: [
   *   { size: 'lg', color: 'primary', class: 'font-bold shadow-lg' },
   * ]
   * ```
   */
  compoundVariants?: Array<Record<string, unknown> & { class?: string; className?: string }>;

  /**
   * Default values for variants when not explicitly provided as props.
   *
   * @example
   * ```ts
   * defaultVariants: { size: 'md', color: 'primary' }
   * ```
   */
  defaultVariants?: Record<string, unknown>;
}

// ─── Compound Configuration ─────────────────────────────────────────────────

/**
 * The full compound component configuration: a record where each key is a
 * part name (e.g. "Root", "Header", "Body") and each value is the
 * configuration for that part.
 *
 * @example
 * ```ts
 * const config: CompoundConfig = {
 *   Root: { base: 'flex flex-col', element: 'div' },
 *   Header: { base: 'font-bold text-lg', element: 'header' },
 *   Body: { base: 'p-4' },
 * };
 * ```
 */
export interface CompoundConfig {
  [componentName: string]: CompoundPartConfig;
}

// ─── Utility Types ──────────────────────────────────────────────────────────

/**
 * Extracts the part names (keys) from a compound configuration as a union type.
 *
 * @example
 * ```ts
 * type Names = CompoundComponentNames<typeof tabsConfig>;
 * // "Root" | "List" | "Tab" | "Panel"
 * ```
 */
export type CompoundComponentNames<C extends CompoundConfig> = keyof C & string;

/**
 * Extracts the variant prop types for a specific part in a compound config.
 *
 * When a part defines variants, each variant name becomes an optional prop
 * accepting the union of its possible values.
 *
 * @typeParam C - The full compound config
 * @typeParam K - The key of the specific part
 *
 * @example
 * ```ts
 * type TabProps = CompoundPartProps<typeof tabsConfig, 'Tab'>;
 * // { active?: 'true' | 'false' }
 * ```
 */
export type CompoundPartProps<
  C extends CompoundConfig,
  K extends keyof C
> = C[K]['variants'] extends Record<string, Record<string, string>>
  ? {
      [V in keyof C[K]['variants']]?: keyof C[K]['variants'][V] | (string & {});
    }
  : object;

/**
 * Resolves the element type for a compound part.
 * Returns the `element` field from the config if present, otherwise defaults
 * to `"div"`.
 *
 * @typeParam P - The part configuration
 */
type ResolvePartElement<P extends CompoundPartConfig> =
  P['element'] extends ElementType ? P['element'] : 'div';

/**
 * Full props for a single compound part component, combining:
 * - Variant props derived from the part's `variants` config
 * - HTML element attributes from the part's `element` (or `"div"`)
 * - The polymorphic `as` prop for element override
 * - A `className` prop for user class overrides
 *
 * @typeParam C - The full compound config
 * @typeParam K - The key of the specific part
 */
export type CompoundPartComponentProps<
  C extends CompoundConfig,
  K extends keyof C
> = CompoundPartProps<C, K> & {
  /** Override the rendered HTML element at runtime */
  as?: ElementType;
  /** Additional CSS class names to append */
  className?: string;
} & Omit<
    ComponentPropsWithoutRef<ResolvePartElement<C[K]>>,
    keyof CompoundPartProps<C, K> | 'as' | 'className'
  >;

// ─── Compound Components Return Type ────────────────────────────────────────

/**
 * The return type of `createTwCompound`.
 *
 * Maps each key in the compound config to a `ForwardRefExoticComponent` that
 * accepts the part's variant props, the element's native attributes, and
 * supports polymorphic rendering via `as` and ref forwarding.
 *
 * @typeParam C - The compound config type
 *
 * @example
 * ```ts
 * const Tabs: TwCompoundComponents<typeof tabsConfig> = createTwCompound(tabsConfig);
 * // Tabs.Root, Tabs.List, Tabs.Tab, Tabs.Panel are all ForwardRefExoticComponents
 * ```
 */
export type TwCompoundComponents<C extends CompoundConfig> = {
  [K in keyof C]: ForwardRefExoticComponent<
    CompoundPartComponentProps<C, K> & RefAttributes<unknown>
  >;
};

// ─── Shared Context Types ───────────────────────────────────────────────────

/**
 * Shared context value that can be passed between compound parts.
 *
 * When a compound component needs shared state (e.g., active tab index),
 * this type defines the context shape. The root part typically provides the
 * context while child parts consume it.
 *
 * @typeParam T - The shape of the shared context value
 */
export interface CompoundContext<T extends Record<string, unknown> = Record<string, unknown>> {
  /** The shared context value accessible by all parts */
  value: T;
}
