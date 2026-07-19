/**
 * createTwComponent — Single-Component Factory
 *
 * Creates a styled React component with full variant support, CSS injection,
 * polymorphic "as" prop, and ref forwarding.
 *
 * @example
 * ```tsx
 * const Button = createTwComponent('button', {
 *   base: 'px-4 py-2 rounded-lg font-medium transition-all',
 *   variants: {
 *     variant: {
 *       solid:   'text-white',
 *       outline: 'border-2 bg-transparent',
 *     },
 *     color: {
 *       primary: 'bg-blue-600 hover:bg-blue-700',
 *       danger:  'bg-red-600  hover:bg-red-700',
 *     },
 *     size: {
 *       sm: 'text-sm  px-3 py-1.5',
 *       md: 'text-base px-4 py-2',
 *       lg: 'text-lg  px-6 py-3',
 *     },
 *   },
 *   compoundVariants: [
 *     { variant: 'solid', color: 'primary', className: 'shadow-lg' },
 *   ],
 *   defaultVariants: { variant: 'solid', color: 'primary', size: 'md' },
 * });
 *
 * // Usage
 * <Button color="danger" size="lg">Delete</Button>
 * <Button as="a" href="/">Link-styled button</Button>
 * ```
 */

import React from 'react';
import { resolveVariants } from './internal/variantsResolver';
import type { VariantsConfig } from './internal/variantsResolver';
import { parseClassName } from './internal/parser';
import { generateCSSString } from './internal/generator';
import { injectLayeredCSS } from './internal/injector';
import { mergeClassNames } from './internal/merger';
import { expandClassName } from './internal/expander';

// Side-effect: ensure all utility builders are registered before CSS generation
import './internal/init';

// ─── Re-export VariantsConfig so callers can import it from here ──────────────

export type { VariantsConfig };

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Configuration accepted by `createTwComponent`.
 * Identical to `VariantsConfig` from the variants resolver but also allows
 * the `compoundVariants` entries to use either `className` or `class` keys
 * for the extra classes string (both are supported for ergonomics).
 */
export interface TwComponentConfig extends Omit<VariantsConfig, 'compoundVariants'> {
  /**
   * Override to support both `className` and `class` keys in compound-variant
   * entries (the resolver only understands `className`).
   */
  compoundVariants?: Array<{
    [key: string]: string | string[] | undefined;
    className?: string;
    class?: string;
  }>;
}

/**
 * Props that `createTwComponent` injects on top of the element's own props.
 */
export interface TwIntrinsicProps {
  /** User-provided className — appended after the resolved variant classes. */
  className?: string;
}

/**
 * Variant keys extracted from a `TwComponentConfig`.
 * Each key in `config.variants` becomes an optional prop accepting the union
 * of that variant's possible values.
 */
type VariantPropsOf<C extends TwComponentConfig> = C['variants'] extends Record<
  string,
  Record<string, string>
>
  ? {
      [K in keyof C['variants']]?: keyof C['variants'][K] | (string & {});
    }
  : object;

/**
 * Element type helper – accepts HTML tag names or React component types.
 */
type ElementTag = keyof JSX.IntrinsicElements | React.ComponentType<Record<string, unknown>>;

/**
 * Infer the correct HTML-attribute props for a given element type.
 * When `T` is an HTML tag string the result is that tag's intrinsic props.
 * When `T` is a React component, the result is that component's props.
 */
type PropsForElement<T extends ElementTag> = T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : T extends React.ComponentType<infer P>
  ? P
  : Record<string, unknown>;

/**
 * Full props accepted by the component created by `createTwComponent`.
 *
 * - `as` – override the rendered element at runtime
 * - variant keys from the config (e.g. `size`, `color`)
 * - all HTML / component attributes of the *default* element
 * - `className` for user overrides
 *
 * When `as` is supplied, the HTML attributes change accordingly; however
 * TypeScript cannot narrow this at the call-site without complex conditional
 * inference, so we expose the default element's attrs plus an `as` escape hatch.
 */
export type TwComponentProps<
  T extends ElementTag,
  C extends TwComponentConfig
> = VariantPropsOf<C> &
  TwIntrinsicProps & {
    /**
     * Polymorphic prop: swap the rendered HTML element or component at runtime.
     * e.g. `<Button as="a" href="/">Link</Button>`
     */
    as?: ElementTag;
  } & Omit<PropsForElement<T>, keyof VariantPropsOf<C> | 'className' | 'as'>;

/**
 * The type of the component returned by `createTwComponent`.
 *
 * It is a `React.ForwardRefExoticComponent` so it supports ref forwarding and
 * is assignable to `React.ComponentType`.
 */
export type TwComponent<T extends ElementTag, C extends TwComponentConfig> =
  React.ForwardRefExoticComponent<TwComponentProps<T, C> & React.RefAttributes<unknown>>;

// ─── Helper: parse + generate + inject a single class token ──────────────────

/**
 * Attempt to generate and inject CSS for a single Tailwind class token.
 * Silently skips tokens whose utilities are not in the registry.
 */
function injectClassToken(token: string): void {
  const parsed = parseClassName(token);
  if (!parsed.utility) return;
  const css = generateCSSString(parsed, token);
  if (css) {
    injectLayeredCSS(css, parsed.variants.length > 0 ? 'variants' : 'utilities');
  }
}

/**
 * Parse a space-separated className string into tokens and inject each one.
 */
function injectClassString(classString: string): void {
  if (!classString) return;
  // Expand grouping syntax (hover:(...), !(...), -(...)) so tokens are valid
  const expanded = expandClassName(classString);
  const tokens = expanded.split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    injectClassToken(token);
  }
}

// ─── normaliseCompoundVariants ────────────────────────────────────────────────

/**
 * The internal `resolveVariants` from `variantsResolver` expects compound
 * variant entries to use `className` as the class key.
 * This normaliser converts any `class` key to `className` so callers can use
 * either spelling.
 */
function normaliseConfig(config: TwComponentConfig): VariantsConfig {
  if (!config.compoundVariants) return config as VariantsConfig;

  const normalisedCompounds = config.compoundVariants.map((cv) => {
    const { class: cls, className, ...rest } = cv;
    return {
      ...rest,
      className: className ?? cls ?? '',
    };
  });

  return { ...config, compoundVariants: normalisedCompounds } as VariantsConfig;
}

// ─── Variant prop extraction ──────────────────────────────────────────────────

/**
 * Separate the variant-related props (defined in `config.variants` or
 * `defaultVariants`) from the rest of the element's DOM props.
 *
 * Returns `{ variantProps, elementProps }`.
 */
function splitProps<C extends TwComponentConfig>(
  config: C,
  allProps: Record<string, unknown>
): { variantProps: Record<string, string | undefined>; elementProps: Record<string, unknown> } {
  const variantKeys = new Set<string>([
    ...Object.keys(config.variants ?? {}),
    ...Object.keys(config.defaultVariants ?? {}),
  ]);

  const variantProps: Record<string, string | undefined> = {};
  const elementProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(allProps)) {
    if (variantKeys.has(key)) {
      variantProps[key] = value as string | undefined;
    } else {
      elementProps[key] = value;
    }
  }

  return { variantProps, elementProps };
}

// ─── createTwComponent ────────────────────────────────────────────────────────

/**
 * Create a styled React component.
 *
 * @param element - The default HTML tag or React component to render
 * @param config  - Variant configuration (base, variants, compoundVariants, defaultVariants)
 * @returns A React component with variant props, polymorphic `as` support, and ref forwarding
 */
export function createTwComponent<
  T extends ElementTag,
  C extends TwComponentConfig = TwComponentConfig
>(element: T, config: C = {} as C): TwComponent<T, C> {
  // Normalise once at factory time (not per-render)
  const normalisedConfig = normaliseConfig(config);

  // Pre-inject base classes (they never change)
  if (normalisedConfig.base) {
    injectClassString(normalisedConfig.base);
  }

  // Pre-inject all variant classes
  if (normalisedConfig.variants) {
    for (const variantValues of Object.values(normalisedConfig.variants)) {
      for (const classString of Object.values(variantValues)) {
        injectClassString(classString as string);
      }
    }
  }

  // Pre-inject compound variant classes
  if (normalisedConfig.compoundVariants) {
    for (const cv of normalisedConfig.compoundVariants) {
      const cls = (cv as { className?: string }).className;
      if (cls) injectClassString(cls);
    }
  }

  // ── The actual component ────────────────────────────────────────────────────
  const TwComponentImpl = /*#__PURE__*/ React.forwardRef<unknown, Record<string, unknown>>(
    function TwComponentImpl(props, ref) {
      // Destructure the polymorphic "as" prop and className override
      const { as: Tag = element as ElementTag, className: userClassName, ...rest } = props;

      // Split variant props from DOM props
      const { variantProps, elementProps } = splitProps(config, rest);

      // Resolve the variant className
      const resolvedClassName = resolveVariants(normalisedConfig, variantProps);

      // Inject user-provided className tokens on the fly (they may vary per render)
      if (userClassName) {
        injectClassString(userClassName as string);
      }

      // Merge: resolved variant classes + user className, resolving any
      // conflicting utilities so the user's override reliably wins instead of
      // depending on CSS insertion order.
      const finalClassName =
        mergeClassNames(resolvedClassName, userClassName as string | undefined) || undefined;

      // Render the element
      return React.createElement(Tag as string, {
        ...elementProps,
        className: finalClassName,
        ref,
      });
    }
  );

  // Set a display name for React DevTools
  const elementName =
    typeof element === 'string'
      ? element
      : (element as React.ComponentType<Record<string, unknown>>).displayName ??
        (element as React.ComponentType<Record<string, unknown>>).name ??
        'Component';

  TwComponentImpl.displayName = `Tw(${elementName})`;

  return TwComponentImpl as unknown as TwComponent<T, C>;
}
