/**
 * tw — Utility function for processing and injecting Tailwind CSS classes.
 *
 * The `tw` export serves dual purposes:
 *
 * 1. **As a function**: Process and inject Tailwind classes for any element
 * 2. **As an object**: Pre-built HTML element wrappers (tw.div, tw.span, etc.)
 *
 * @example
 * ```tsx
 * import { tw } from 'twx-react';
 *
 * // Recommended: Use tw.element for native HTML (cleaner)
 * function Layout() {
 *   return (
 *     <tw.div className="flex flex-col gap-6 p-8">
 *       <tw.h1 className="text-2xl font-bold">Hello</tw.h1>
 *       <tw.button className="px-4 py-2 bg-blue-500">Click</tw.button>
 *     </tw.div>
 *   );
 * }
 *
 * // Advanced: Use tw() function for third-party components or dynamic styles
 * import { Select } from 'third-party-ui';
 *
 * function Form() {
 *   const dynamicClass = tw(`border rounded ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`);
 *   return <Select className={tw('border rounded px-3')} />;
 * }
 * ```
 *
 * @param classString - Space-separated Tailwind class names
 * @returns The same class string (unchanged), after injecting the CSS
 */

import { parseClassName } from './internal/parser';
import { generateCSSString } from './internal/generator';
import { injectCSS } from './internal/injector';
import { createTwElementsProxy, type TwElements } from './createTwElements';

// Side-effect: ensure all utility builders are registered
import './internal/init';

/**
 * Core tw function - processes Tailwind classes and injects CSS
 * @internal
 */
function twFunction(classString: string): string {
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

/**
 * Combined tw export: function + HTML element components
 *
 * Usage:
 * - tw('class names') → returns processed string
 * - tw.div, tw.span, etc. → React components with auto tw() processing
 */
export type TwExport = typeof twFunction & TwElements;

// Create the combined export
const twElements = createTwElementsProxy();
const tw = Object.assign(twFunction, twElements) as TwExport;

export { tw };
