/**
 * tw — Utility function for processing and injecting Tailwind CSS classes.
 *
 * Use this when applying Tailwind classes to raw HTML elements (not created
 * via `createTwComponent`). It parses each class token, generates the CSS,
 * and injects it into the DOM — then returns the original class string.
 *
 * For `createTwComponent`-created elements, CSS injection is automatic.
 * This function is for cases where you apply classes to plain `<div>`,
 * `<span>`, or other elements directly.
 *
 * @example
 * ```tsx
 * import { tw } from 'twx-react';
 *
 * function Layout() {
 *   return (
 *     <div className={tw('flex flex-col gap-6 p-8')}>
 *       <h1 className={tw('text-2xl font-bold')}>Hello</h1>
 *     </div>
 *   );
 * }
 * ```
 *
 * @param classString - Space-separated Tailwind class names
 * @returns The same class string (unchanged), after injecting the CSS
 */

import { parseClassName } from './internal/parser';
import { generateCSSString } from './internal/generator';
import { injectCSS } from './internal/injector';

// Side-effect: ensure all utility builders are registered
import './internal/init';

export function tw(classString: string): string {
  if (!classString) return '';

  const tokens = classString.split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    const parsed = parseClassName(token);
    if (!parsed.utility) continue;
    const css = generateCSSString(parsed, token);
    if (css) {
      injectCSS(css);
    }
  }

  return classString;
}
