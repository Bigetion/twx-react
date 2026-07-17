/**
 * createTwElements — Factory for creating HTML element wrappers with automatic tw() processing
 *
 * This module creates React components for HTML elements that automatically
 * wrap className props with the tw() function, providing a cleaner API:
 *
 * Instead of:  <div className={tw('flex items-center')} />
 * You can use: <tw.div className="flex items-center" />
 *
 * @example
 * ```tsx
 * import { tw } from 'twx-react';
 *
 * function App() {
 *   return (
 *     <tw.div className="flex flex-col gap-4 p-8">
 *       <tw.h1 className="text-3xl font-bold">Hello World</tw.h1>
 *       <tw.button className="px-4 py-2 bg-blue-500 hover:bg-blue-600">
 *         Click me
 *       </tw.button>
 *     </tw.div>
 *   );
 * }
 * ```
 *
 * @internal
 */

import React, { forwardRef, memo } from 'react';
import { parseClassName } from './internal/parser';
import { generateCSSString } from './internal/generator';
import { injectLayeredCSS } from './internal/injector';
import { mergeClassNames } from './internal/merger';

// ═══════════════════════════════════════════════════════════════════════════════
// Type Definitions
// ═══════════════════════════════════════════════════════════════════════════════

type IntrinsicElements = JSX.IntrinsicElements;

/**
 * Mapped type for all HTML elements with proper props and ref forwarding
 */
export type TwElements = {
  [K in keyof IntrinsicElements]: React.ForwardRefExoticComponent<
    IntrinsicElements[K] & React.RefAttributes<any>
  >;
};

// ═══════════════════════════════════════════════════════════════════════════════
// Component Factory
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Core tw function - processes Tailwind classes and injects CSS
 * Extracted here to avoid circular dependency with createTwElements
 * Includes grouping expansion step
 */
const twFunction = (classString: string): string => {
  if (!classString) return '';

  // Step 1: Resolve conflicting utilities (also expands grouping syntax)
  const merged = mergeClassNames(classString);

  // Step 2: Process each token
  const tokens = merged.split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    const parsed = parseClassName(token);
    if (!parsed.utility) continue;
    const css = generateCSSString(parsed, token);
    if (css) {
      injectLayeredCSS(css, parsed.variants.length > 0 ? 'variants' : 'utilities');
    }
  }

  return merged;
};

/**
 * Creates a memoized element wrapper that automatically processes className with tw()
 *
 * @param tag - HTML tag name (e.g., 'div', 'span', 'button')
 * @returns Memoized React component with ref forwarding
 */
const createTwElement = (tag: string): any => {
  const Component = memo(
    forwardRef((props: any, ref: any) => {
      const { className, ...rest } = props;

      // Process className with tw() - tw() has internal caching
      // Skip processing if className is falsy (optimization)
      const processedClassName = className ? twFunction(className) : undefined;

      return React.createElement(tag, {
        ...rest,
        ref,
        className: processedClassName,
      });
    })
  );

  // Set display name for better debugging
  Component.displayName = `tw.${String(tag)}`;

  return Component;
};

// ═══════════════════════════════════════════════════════════════════════════════
// Pre-generate Common Elements (Performance Optimization)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Common HTML tags that are pre-generated to avoid Proxy overhead
 * These cover ~90% of typical use cases
 */
const commonTags = [
  // Layout
  'div',
  'span',
  'section',
  'article',
  'aside',
  'nav',
  'header',
  'footer',
  'main',

  // Text
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'strong',
  'em',
  'small',
  'code',
  'pre',

  // Lists
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',

  // Interactive
  'button',
  'a',
  'label',
  'input',
  'textarea',
  'select',
  'option',

  // Media
  'img',
  'svg',
  'video',
  'audio',
  'canvas',

  // Tables
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',

  // Forms
  'form',
  'fieldset',
  'legend',

  // Other
  'figure',
  'figcaption',
  'iframe',
  'details',
  'summary',
] as const;

/**
 * Pre-generated elements object (partial, will be completed by Proxy)
 */
const twElements: Partial<TwElements> = {};

// Pre-generate common elements to avoid Proxy overhead
commonTags.forEach((tag) => {
  twElements[tag] = createTwElement(tag);
});

// ═══════════════════════════════════════════════════════════════════════════════
// Proxy for Lazy Element Creation
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Creates tw elements object with Proxy for lazy creation of uncommon elements
 * Common elements are pre-generated, uncommon ones are created on-demand and cached
 */
export const createTwElementsProxy = (): TwElements => {
  return new Proxy(twElements, {
    get(target: any, prop: string) {
      // Return pre-generated element if it exists
      if (target[prop]) {
        return target[prop];
      }

      // Lazy create and cache uncommon elements
      if (typeof prop === 'string') {
        target[prop] = createTwElement(prop);
        return target[prop];
      }

      return undefined;
    },
  }) as TwElements;
};
