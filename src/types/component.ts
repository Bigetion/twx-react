/**
 * Component Type Definitions
 *
 * Comprehensive TypeScript types for the twx-react component system.
 * These types provide full type safety for styled components created with
 * `createTwComponent`, including polymorphic "as" prop support, variant
 * inference, and ref forwarding.
 *
 * @packageDocumentation
 */

import type {
  ComponentType,
  ComponentPropsWithoutRef,
  ElementType,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';

// ─── Element Tag ──────────────────────────────────────────────────────────────

/**
 * Represents a valid element target for a twx-react component.
 *
 * Accepts either an HTML/SVG tag name (e.g. `"div"`, `"button"`) or a
 * React component type.
 *
 * @example
 * ```ts
 * const tag: ElementTag = 'button';
 * const component: ElementTag = MyCustomComponent;
 * ```
 */
export type ElementTag = keyof JSX.IntrinsicElements | ComponentType<Record<string, unknown>>;

// ─── Intrinsic Props ──────────────────────────────────────────────────────────

/**
 * Props that twx-react injects on top of the element's own props.
 * These are always available regardless of the underlying element type.
 */
export interface TwIntrinsicProps {
  /**
   * User-provided className. Appended after the resolved variant classes
   * so it can override styles via specificity or class ordering.
   */
  className?: string;
}

// ─── Legacy Polymorphic Types (kept for backward compatibility) ───────────────

/**
 * Extract props from an element type, excluding ref.
 *
 * @typeParam T - The element type (HTML tag string or React component)
 */
export type PropsOf<T extends ElementType> = ComponentPropsWithoutRef<T>;

/**
 * Polymorphic "as" prop type. Allows swapping the rendered element at runtime.
 *
 * @typeParam T - The target element type to render as
 */
export type AsProp<T extends ElementType> = {
  as?: T;
};

/**
 * Full polymorphic component props combining custom props with the element's
 * native props and the "as" prop.
 *
 * @typeParam T - The element type
 * @typeParam Props - Additional props to inject
 */
export type PolymorphicComponentProps<
  T extends ElementType,
  Props = object
> = Props & AsProp<T> & Omit<PropsOf<T>, keyof Props | 'as'>;

// ─── Component Config ─────────────────────────────────────────────────────────

/**
 * A single compound variant entry for component configs. Matches multiple
 * variant conditions and applies additional classes when all conditions are met.
 *
 * Supports both `class` and `className` keys for the applied classes string,
 * allowing ergonomic usage with either naming convention.
 *
 * @example
 * ```ts
 * const entry: TwCompoundVariantEntry = {
 *   variant: 'solid',
 *   color: 'primary',
 *   className: 'shadow-lg',
 * };
 * ```
 */
export interface TwCompoundVariantEntry {
  [key: string]: string | string[] | undefined;
  /** Classes to apply (preferred key name). */
  className?: string;
  /** Classes to apply (alternative key name, same behavior as `className`). */
  class?: string;
}

/**
 * Configuration object accepted by `createTwComponent`.
 *
 * Defines the base classes, variant styles, compound variant conditions,
 * and default variant values for a styled component.
 *
 * @example
 * ```ts
 * const config: TwComponentConfig = {
 *   base: 'px-4 py-2 rounded-lg font-medium',
 *   variants: {
 *     size: { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
 *     color: { primary: 'bg-blue-500', danger: 'bg-red-500' },
 *   },
 *   compoundVariants: [
 *     { size: 'lg', color: 'primary', className: 'shadow-xl' },
 *   ],
 *   defaultVariants: { size: 'md', color: 'primary' },
 * };
 * ```
 */
export interface TwComponentConfig {
  /** Base Tailwind classes always applied to the component. */
  base?: string;

  /**
   * Variant definitions. Each key is a variant name, mapping to an object
   * of variant-value → Tailwind class string.
   */
  variants?: Record<string, Record<string, string>>;

  /**
   * Compound variant entries. Each entry specifies conditions (variant-key →
   * value) and the classes to apply when all conditions match.
   *
   * Both `class` and `className` keys are supported for the classes string.
   */
  compoundVariants?: TwCompoundVariantEntry[];

  /**
   * Default variant values applied when the user does not provide a variant
   * prop explicitly.
   */
  defaultVariants?: Record<string, string>;
}

// ─── Variant Extraction Utilities ─────────────────────────────────────────────

/**
 * Extracts the variant names defined in a config's `variants` field.
 *
 * @typeParam C - A TwComponentConfig type
 *
 * @example
 * ```ts
 * type Names = VariantNames<typeof config>; // "size" | "color"
 * ```
 */
export type VariantNames<C extends TwComponentConfig> = C['variants'] extends Record<
  string,
  Record<string, string>
>
  ? keyof C['variants']
  : never;

/**
 * Extracts the possible values for a given variant name from a config.
 *
 * @typeParam C - A TwComponentConfig type
 * @typeParam K - The variant key name
 *
 * @example
 * ```ts
 * type Sizes = VariantValues<typeof config, 'size'>; // "sm" | "md" | "lg"
 * ```
 */
export type VariantValues<
  C extends TwComponentConfig,
  K extends VariantNames<C>
> = C['variants'] extends Record<string, Record<string, string>>
  ? keyof C['variants'][K]
  : never;

/**
 * Extracts variant props from a `TwComponentConfig`.
 *
 * Each key defined in `config.variants` becomes an optional prop whose value
 * type is the union of that variant's defined keys (plus an open `string & {}`
 * escape hatch for arbitrary values).
 *
 * @typeParam C - A TwComponentConfig type
 *
 * @example
 * ```ts
 * // Given config with variants: { size: { sm, md, lg }, color: { primary, danger } }
 * type Props = VariantPropsOf<typeof config>;
 * // { size?: "sm" | "md" | "lg" | (string & {}); color?: "primary" | "danger" | (string & {}) }
 * ```
 */
export type VariantPropsOf<C extends TwComponentConfig> = C['variants'] extends Record<
  string,
  Record<string, string>
>
  ? {
      [K in keyof C['variants']]?: keyof C['variants'][K] | (string & {});
    }
  : object;

// ─── Props for Element ────────────────────────────────────────────────────────

/**
 * Resolves the correct HTML-attribute props for a given element type.
 *
 * - When `T` is an HTML tag string, resolves to that tag's intrinsic props.
 * - When `T` is a React component, resolves to that component's props.
 *
 * @typeParam T - An ElementTag (HTML tag name or React component)
 */
export type PropsForElement<T extends ElementTag> = T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : T extends ComponentType<infer P>
    ? P
    : Record<string, unknown>;

// ─── TwComponentProps ─────────────────────────────────────────────────────────

/**
 * Full props type accepted by a component created via `createTwComponent`.
 *
 * Combines:
 * - Variant props from the config (e.g. `size`, `color`)
 * - `TwIntrinsicProps` (className)
 * - Polymorphic `as` prop for element override
 * - All native HTML/component attributes of the default element (excluding conflicts)
 *
 * @typeParam T - The default element tag
 * @typeParam C - The component's TwComponentConfig
 *
 * @example
 * ```tsx
 * // For a button component with size and color variants:
 * type Props = TwComponentProps<'button', typeof config>;
 * // Includes: size?, color?, className?, as?, onClick?, disabled?, etc.
 * ```
 */
export type TwComponentProps<
  T extends ElementTag,
  C extends TwComponentConfig
> = VariantPropsOf<C> &
  TwIntrinsicProps & {
    /**
     * Polymorphic prop: swap the rendered HTML element or component at runtime.
     *
     * @example
     * ```tsx
     * <Button as="a" href="/">Link styled as button</Button>
     * ```
     */
    as?: ElementTag;
  } & Omit<PropsForElement<T>, keyof VariantPropsOf<C> | 'className' | 'as'>;

// ─── TwComponent ──────────────────────────────────────────────────────────────

/**
 * The type of a styled component returned by `createTwComponent`.
 *
 * It is a `ForwardRefExoticComponent` enabling ref forwarding and full
 * compatibility with React's component model. It includes `RefAttributes`
 * so consumers can pass refs directly.
 *
 * @typeParam T - The default element tag
 * @typeParam C - The component's TwComponentConfig
 *
 * @example
 * ```ts
 * const Button: TwComponent<'button', typeof buttonConfig> = createTwComponent('button', buttonConfig);
 * ```
 */
export type TwComponent<
  T extends ElementTag,
  C extends TwComponentConfig
> = ForwardRefExoticComponent<TwComponentProps<T, C> & RefAttributes<unknown>>;

// ─── Inference Utilities ──────────────────────────────────────────────────────

/**
 * Infers the variant props from a `TwComponent` instance.
 *
 * Useful for extracting the variant props type from an existing component
 * to reuse in wrapper components or HOCs.
 *
 * @typeParam T - A TwComponent type
 *
 * @example
 * ```ts
 * const Button = createTwComponent('button', buttonConfig);
 * type ButtonVariants = InferVariantProps<typeof Button>;
 * // { size?: "sm" | "md" | "lg"; color?: "primary" | "danger" }
 * ```
 */
export type InferVariantProps<T> = T extends TwComponent<infer _E, infer C>
  ? VariantPropsOf<C>
  : never;

/**
 * Infers the full props type from a `TwComponent` instance.
 *
 * @typeParam T - A TwComponent type
 *
 * @example
 * ```ts
 * const Button = createTwComponent('button', buttonConfig);
 * type ButtonProps = InferComponentProps<typeof Button>;
 * ```
 */
export type InferComponentProps<T> = T extends TwComponent<infer E, infer C>
  ? TwComponentProps<E, C>
  : never;
