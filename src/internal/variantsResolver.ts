/**
 * Internal Variants Resolver Module
 * Resolves component variant classes based on props
 * 
 * This handles COMPONENT VARIANTS (size, color, etc.) - not CSS pseudo-class variants.
 * It determines which CSS classes to apply based on component props like { size: "lg", color: "primary" }.
 * 
 * @internal
 */

/**
 * A compound variant applies additional classes when multiple variant conditions are met simultaneously.
 * All non-className keys are variant conditions that must match.
 */
export interface CompoundVariant {
  [key: string]: string | string[] | undefined;
  className: string;
}

/**
 * Configuration for component variants.
 * 
 * @example
 * ```ts
 * const config: VariantsConfig = {
 *   base: "px-4 py-2 rounded",
 *   variants: {
 *     size: {
 *       sm: "text-sm px-2 py-1",
 *       md: "text-base px-4 py-2",
 *       lg: "text-lg px-6 py-3",
 *     },
 *     color: {
 *       primary: "bg-blue-500 text-white",
 *       secondary: "bg-gray-200 text-gray-800",
 *     },
 *   },
 *   defaultVariants: {
 *     size: "md",
 *     color: "primary",
 *   },
 * };
 * ```
 */
export interface VariantsConfig {
  /** Base classes always applied */
  base?: string;
  /** Map of variant names to their possible values and corresponding classes */
  variants?: Record<string, Record<string, string>>;
  /** Compound variants that apply when multiple conditions are met (implemented in task 7.2) */
  compoundVariants?: CompoundVariant[];
  /** Default variant values used when a variant prop is not provided */
  defaultVariants?: Record<string, string>;
}

/**
 * Resolve variant classes based on component props.
 * 
 * Algorithm:
 * 1. Start with base classes
 * 2. For each variant defined in config.variants:
 *    - Check if the variant prop is provided in props
 *    - If not provided, use the defaultVariant value
 *    - Look up the variant class string for that value
 *    - Append to the result
 * 3. Return the merged className string (space-separated)
 * 
 * @param config - Variant configuration object
 * @param props - Component props containing variant selections
 * @returns Resolved className string with all applicable classes
 * 
 * @example
 * ```ts
 * const config = {
 *   base: "px-4 py-2 rounded",
 *   variants: {
 *     size: { sm: "text-sm", md: "text-base", lg: "text-lg" },
 *     color: { primary: "bg-blue-500", secondary: "bg-gray-200" },
 *   },
 *   defaultVariants: { size: "md", color: "primary" },
 * };
 * 
 * resolveVariants(config, { size: "lg" })
 * // → "px-4 py-2 rounded text-lg bg-blue-500"
 * 
 * resolveVariants(config, { size: "sm", color: "secondary" })
 * // → "px-4 py-2 rounded text-sm bg-gray-200"
 * 
 * resolveVariants(config, {})
 * // → "px-4 py-2 rounded text-base bg-blue-500"
 * ```
 */
export function resolveVariants(
  config: VariantsConfig,
  props: Record<string, string | undefined> = {}
): string {
  const classes: string[] = [];

  // 1. Start with base classes
  if (config.base) {
    classes.push(config.base);
  }

  // 2. Resolve each variant
  if (config.variants) {
    for (const [variantName, variantValues] of Object.entries(config.variants)) {
      // Check if prop is provided, otherwise fall back to default
      const propValue = props[variantName] ?? config.defaultVariants?.[variantName];

      if (propValue !== undefined && propValue !== null) {
        const variantClass = variantValues[propValue];
        if (variantClass) {
          classes.push(variantClass);
        }
      }
    }
  }

  // 3. Resolve compound variants
  // Build the effective props map (props with defaults filled in) for matching
  if (config.compoundVariants && config.compoundVariants.length > 0) {
    // Build the effective variant values used in step 2
    const effectiveProps: Record<string, string | undefined> = {};
    if (config.variants) {
      for (const variantName of Object.keys(config.variants)) {
        effectiveProps[variantName] = props[variantName] ?? config.defaultVariants?.[variantName];
      }
    }
    // Also include any props that aren't in variants (for flexibility)
    for (const [key, value] of Object.entries(props)) {
      if (!(key in effectiveProps)) {
        effectiveProps[key] = value;
      }
    }

    for (const compound of config.compoundVariants) {
      const { className: compoundClass, ...conditions } = compound;

      // Check if ALL conditions match
      const allMatch = Object.entries(conditions).every(([condKey, condValue]) => {
        const effectiveValue = effectiveProps[condKey];
        if (Array.isArray(condValue)) {
          return condValue.includes(effectiveValue as string);
        }
        return effectiveValue === condValue;
      });

      if (allMatch && compoundClass) {
        classes.push(compoundClass);
      }
    }
  }

  // 4. Return merged className string
  return classes.filter(Boolean).join(' ');
}
