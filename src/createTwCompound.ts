/**
 * createTwCompound — Compound Component Factory
 *
 * Creates a set of related React components from a single configuration object.
 * Each key in the config becomes a React component on the returned object,
 * with full variant support, polymorphic "as" prop, and ref forwarding.
 *
 * Internally each part is built with `createTwComponent`, so every feature
 * available there (base, variants, compoundVariants, defaultVariants, "as"
 * prop, ref forwarding, CSS injection) is available per-component.
 *
 * @example
 * ```tsx
 * const Tabs = createTwCompound({
 *   Root: {
 *     base: 'flex flex-col',
 *     variants: {
 *       orientation: {
 *         horizontal: 'flex-row',
 *         vertical: 'flex-col',
 *       },
 *     },
 *     defaultVariants: { orientation: 'horizontal' },
 *   },
 *   List: { base: 'flex border-b' },
 *   Tab: {
 *     base: 'px-4 py-2 cursor-pointer',
 *     variants: {
 *       active: {
 *         true:  'border-b-2 border-blue-500 text-blue-500',
 *         false: '',
 *       },
 *     },
 *     defaultVariants: { active: 'false' },
 *   },
 *   Panel: { base: 'p-4' },
 * });
 *
 * // Usage
 * <Tabs.Root>
 *   <Tabs.List>
 *     <Tabs.Tab active="true">Tab 1</Tabs.Tab>
 *     <Tabs.Tab>Tab 2</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel>Content</Tabs.Panel>
 * </Tabs.Root>
 * ```
 */

import { createTwComponent } from './createTwComponent';
import type { TwComponentConfig, TwComponent } from './createTwComponent';

// ─── Types ─────────────────────────────────────────────────────────────────────

/**
 * A single component definition within a compound config.
 *
 * Extends `TwComponentConfig` with an optional `element` key that sets the
 * default HTML element to render (defaults to `"div"` when omitted).
 */
export interface CompoundPartConfig extends TwComponentConfig {
  /**
   * The default HTML tag or React component this part renders.
   * Defaults to `"div"` when not specified.
   *
   * @example `element: 'button'`
   */
  element?: keyof JSX.IntrinsicElements | React.ComponentType<Record<string, unknown>>;
}

/**
 * The full compound config: an object where each key is a part name and each
 * value is a `CompoundPartConfig`.
 */
export type CompoundConfig = Record<string, CompoundPartConfig>;

/**
 * The return type of `createTwCompound`.
 *
 * Maps each key in the config to a `TwComponent` built from that config entry.
 * The element type is inferred from the `element` field; when absent it
 * defaults to `"div"`.
 */
export type TwCompoundComponents<C extends CompoundConfig> = {
  [K in keyof C]: TwComponent<
    C[K]['element'] extends keyof JSX.IntrinsicElements | React.ComponentType<Record<string, unknown>>
      ? C[K]['element']
      : 'div',
    C[K]
  >;
};

// ─── Implementation ───────────────────────────────────────────────────────────

/**
 * Create a compound component — an object of related React components that
 * share a naming convention and are configured together.
 *
 * @param config - A record mapping part names to individual component configs
 * @returns An object whose keys are the part names and values are React components
 */
export function createTwCompound<C extends CompoundConfig>(
  config: C
): TwCompoundComponents<C> {
  const compound = {} as TwCompoundComponents<C>;

  for (const partName of Object.keys(config) as Array<keyof C>) {
    const partConfig = config[partName];
    const { element = 'div', ...restConfig } = partConfig;

    // Create the component using the existing single-component factory.
    // Every feature (variants, compoundVariants, "as" prop, ref forwarding,
    // CSS injection) comes for free via createTwComponent.
    const component = /*#__PURE__*/ createTwComponent(
      element as keyof JSX.IntrinsicElements,
      restConfig as TwComponentConfig
    );

    // Set a meaningful display name for React DevTools, e.g. "Tw.Tabs.Tab"
    (component as { displayName?: string }).displayName = `Tw.${String(partName)}`;

    compound[partName] = component as TwCompoundComponents<C>[typeof partName];
  }

  return compound;
}

// Re-export for convenience
export type { TwComponentConfig, TwComponent };
