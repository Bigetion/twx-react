/**
 * useTwVariants — React Hook for Dynamic Variant Resolution
 *
 * Resolves variant class names from a component config and props, with
 * automatic memoization via React.useMemo.
 *
 * @example
 * ```tsx
 * function DynamicButton({ variant, size, className, ...props }) {
 *   const buttonClass = useTwVariants({
 *     base: 'px-4 py-2 rounded-lg font-medium',
 *     variants: {
 *       variant: {
 *         primary:   'bg-blue-600 text-white',
 *         secondary: 'bg-gray-200 text-gray-800',
 *       },
 *       size: {
 *         sm: 'text-sm px-3 py-1.5',
 *         md: 'text-base px-4 py-2',
 *       },
 *     },
 *   }, { variant, size }, [variant, size]);
 *
 *   return <button className={`${buttonClass} ${className}`} {...props} />;
 * }
 * ```
 */

import { useMemo } from 'react';
import { resolveVariants, type VariantsConfig } from '../internal/variantsResolver';
import { parseClassName } from '../internal/parser';
import { generateCSSString } from '../internal/generator';
import { injectCSS } from '../internal/injector';
import type { TwComponentConfig } from '../createTwComponent';

// Side-effect: ensure all utility builders are registered
import '../internal/init';

/**
 * Normalize TwComponentConfig to VariantsConfig by converting any `class` key
 * in compound variants to `className` (the internal resolver only understands `className`).
 */
function normalizeConfig(config: TwComponentConfig): VariantsConfig {
  if (!config.compoundVariants) {
    return config as VariantsConfig;
  }

  const normalizedCompounds = config.compoundVariants.map((cv) => {
    const { class: cls, className, ...rest } = cv;
    return {
      ...rest,
      className: className ?? cls ?? '',
    };
  });

  return { ...config, compoundVariants: normalizedCompounds } as VariantsConfig;
}

/**
 * React hook that resolves variant class names from a config and variant props.
 *
 * Memoization strategy:
 * - When `deps` is provided, the result is recomputed only when those deps change.
 * - When `deps` is omitted, the result is recomputed when any value in `props` changes
 *   (shallow comparison over the prop values).
 *
 * @param config - Variant configuration (same shape as `createTwComponent` config)
 * @param props  - Variant prop values (e.g. `{ size: 'lg', color: 'primary' }`)
 * @param deps   - Optional custom dependency array for memoization
 * @returns Resolved className string
 */
export function useTwVariants(
  config: TwComponentConfig,
  props: Record<string, string | undefined> = {},
  deps?: React.DependencyList
): string {
  // When the caller supplies a custom deps array, use it directly.
  // Otherwise, derive dependencies from the values of props so any prop change
  // triggers a recomputation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedClass = useMemo(
    () => {
      const normalizedConfig = normalizeConfig(config);
      const resolved = resolveVariants(normalizedConfig, props);

      // Inject CSS for each token in the resolved class string
      if (resolved) {
        const tokens = resolved.split(/\s+/).filter(Boolean);
        for (const token of tokens) {
          const parsed = parseClassName(token);
          if (!parsed.utility) continue;
          const css = generateCSSString(parsed, token);
          if (css) {
            injectCSS(css);
          }
        }
      }

      return resolved;
    },
    // If deps is explicitly provided, use it; otherwise fall back to prop values.
    // We spread into a new array so React gets a stable tuple on every call.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps !== undefined ? deps : Object.values(props)
  );

  return memoizedClass;
}
