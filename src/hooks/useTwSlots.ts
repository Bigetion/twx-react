/**
 * useTwSlots — React Hook for Dynamic Slots Resolution
 *
 * Resolves per-slot class names from a slots config and variant props, with
 * automatic memoization via React.useMemo.
 *
 * @example
 * ```tsx
 * function DynamicCard({ variant }) {
 *   const slots = useTwSlots({
 *     slots: {
 *       root:   'bg-white rounded-xl',
 *       header: 'px-6 py-4 border-b',
 *       body:   'px-6 py-4',
 *     },
 *     variants: {
 *       variant: {
 *         default:  { root: 'border shadow-sm' },
 *         elevated: { root: 'shadow-lg' },
 *       },
 *     },
 *   }, { variant }, [variant]);
 *
 *   return (
 *     <div className={slots.root}>
 *       <div className={slots.header}>Header</div>
 *       <div className={slots.body}>Body</div>
 *     </div>
 *   );
 * }
 * ```
 */

import { useMemo } from 'react';
import { createTwSlots } from '../createTwSlots';
import type { TwSlotsConfig } from '../createTwSlots';

/**
 * React hook that resolves per-slot class names from a slots config and variant props.
 *
 * Memoization strategy:
 * - When `deps` is provided, the slots object is recomputed only when those deps change.
 * - When `deps` is omitted, the slots object is recomputed when any value in `props` changes
 *   (shallow comparison over the prop values).
 *
 * @param config - Slots configuration (same shape as `createTwSlots` config)
 * @param props  - Variant prop values (e.g. `{ size: 'sm', variant: 'elevated' }`)
 * @param deps   - Optional custom dependency array for memoization
 * @returns Object mapping each slot name to its resolved className string
 */
export function useTwSlots<S extends Record<string, string>>(
  config: TwSlotsConfig<S>,
  props: Record<string, string | undefined> = {},
  deps?: React.DependencyList
): Record<keyof S, string> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(
    () => {
      const resolver = createTwSlots(config);
      return resolver(props);
    },
    // If deps is explicitly provided, use it; otherwise fall back to prop values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps !== undefined ? deps : Object.values(props)
  );

  return slots;
}
