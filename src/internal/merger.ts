/**
 * Internal Class Conflict Resolver
 *
 * Resolves conflicting Tailwind utility classes similarly to `tailwind-merge`,
 * but without a hand-maintained lookup table. Because twx-react already has a
 * real runtime CSS generator, we can ask it what CSS properties a class token
 * actually produces and use THAT as the source of truth for conflicts:
 *
 *   mergeClassNames('px-4 bg-blue-500', 'px-2 bg-red-500')
 *   // both "px-*" tokens resolve to { paddingLeft, paddingRight }
 *   // both "bg-*" tokens resolve to { backgroundColor }
 *   // → 'px-2 bg-red-500'  (later token wins for each conflicting property set)
 *
 * Two tokens only conflict when, under the exact same variant/modifier chain
 * (e.g. `hover:`, `md:`, `dark:`), they resolve to the exact same set of CSS
 * property names. This correctly avoids false positives like `text-sm`
 * (font-size) vs `text-red-500` (color) — both start with `text-` but touch
 * different properties, so they are never merged away.
 *
 * Tokens twx-react doesn't recognise (custom app classes, typos, arbitrary
 * CSS twx can't parse, etc.) are never merged away based on "meaning" — only
 * exact literal duplicates are collapsed for those.
 *
 * @internal
 */

import { parseClassName } from './parser';
import { generateCSS, resolveVariants } from './generator';
import { expandClassName } from './expander';
import { LRUCache } from './cache';

// Small dedicated cache so repeated renders of the same component don't
// re-parse + re-generate CSS just to compute a conflict identity.
const conflictKeyCache = new LRUCache<string, string | null>({ maxSize: 2000 });

/**
 * Compute a "conflict identity" for a single class token.
 * Returns `null` when the token isn't a recognised twx-react utility.
 */
function getConflictKey(token: string): string | null {
  const cached = conflictKeyCache.get(token);
  if (cached !== undefined) return cached;

  let key: string | null = null;
  const parsed = parseClassName(token);

  if (parsed.utility) {
    const rule = generateCSS(parsed, token);
    if (rule) {
      const propertyKeys = Object.keys(rule.properties).sort().join(',');
      const variantKey = [...parsed.variants].sort().join(':');
      const { selector: baseSelector } = resolveVariants(token, parsed.variants);
      const selectorSuffix = rule.selector.startsWith(baseSelector)
        ? rule.selector.slice(baseSelector.length)
        : rule.selector;
      key = `${variantKey}|${selectorSuffix}|${propertyKeys}`;
    }
  }

  conflictKeyCache.set(token, key);
  return key;
}

/**
 * Merge one or more className strings, resolving Tailwind utility conflicts.
 *
 * When two tokens target the exact same CSS properties under the exact same
 * variant context, only the LAST one is kept — the earlier one is dropped
 * entirely, so the outcome no longer depends on unpredictable CSS insertion
 * order.
 *
 * @example
 * ```ts
 * mergeClassNames('px-4 bg-blue-500', 'px-2 bg-red-500')
 * // → "px-2 bg-red-500"
 *
 * mergeClassNames('p-4 hover:bg-blue-500', 'hover:bg-red-500')
 * // → "p-4 hover:bg-red-500"
 * ```
 */
export function mergeClassNames(
  ...classNames: Array<string | undefined | null | false>
): string {
  const tokens: string[] = [];

  for (const cn of classNames) {
    if (!cn) continue;
    const expanded = expandClassName(cn);
    for (const token of expanded.split(/\s+/)) {
      if (token) tokens.push(token);
    }
  }

  if (tokens.length <= 1) return tokens.join('');

  const keys = tokens.map(getConflictKey);

  // Find the winning (last) index for every recognised conflict key.
  const lastIndexForKey = new Map<string, number>();
  keys.forEach((key, i) => {
    if (key !== null) lastIndexForKey.set(key, i);
  });

  const result: string[] = [];
  const seenLiteral = new Set<string>();

  tokens.forEach((token, i) => {
    const key = keys[i];

    if (key !== null) {
      if (lastIndexForKey.get(key) !== i) return; // superseded by a later class
    } else if (seenLiteral.has(token)) {
      return; // unrecognised class — only collapse exact literal duplicates
    }

    seenLiteral.add(token);
    result.push(token);
  });

  return result.join(' ');
}
