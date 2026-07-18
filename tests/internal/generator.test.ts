/**
 * @jest-environment node
 */

/**
 * Tests for internal CSS generator module
 * Task 3.1: Base generator infrastructure
 */

import {
  CSSRule,
  UtilityGenerator,
  RESPONSIVE_BREAKPOINTS,
  CONTAINER_BREAKPOINTS,
  VARIANT_SELECTORS,
  registerUtility,
  registerUtilities,
  hasUtility,
  getUtility,
  getRegisteredUtilities,
  clearRegistry,
  escapeClassName,
  buildMediaQuery,
  buildContainerQuery,
  buildSupportsQuery,
  buildPseudoSelector,
  buildGroupSelector,
  buildPeerSelector,
  buildNotSelector,
  buildDarkSelector,
  resolveVariants,
  generateCSS,
  stringifyRule,
} from '../../src/internal/generator';
import type { ParsedClass } from '../../src/internal/parser';

// Clean registry before each test
beforeEach(() => {
  clearRegistry();
});

describe('Generator Infrastructure (Task 3.1)', () => {

  describe('Utility Registry', () => {
    it('should register and retrieve a utility generator', () => {
      const gen: UtilityGenerator = () => ({ display: 'flex' });
      registerUtility('flex', gen);
      expect(hasUtility('flex')).toBe(true);
      expect(getUtility('flex')).toBe(gen);
    });

    it('should return false for unregistered utility', () => {
      expect(hasUtility('nonexistent')).toBe(false);
      expect(getUtility('nonexistent')).toBeUndefined();
    });

    it('should register multiple utilities at once', () => {
      const flexGen: UtilityGenerator = () => ({ display: 'flex' });
      const blockGen: UtilityGenerator = () => ({ display: 'block' });
      registerUtilities([
        ['flex', flexGen],
        ['block', blockGen],
      ]);
      expect(hasUtility('flex')).toBe(true);
      expect(hasUtility('block')).toBe(true);
    });

    it('should list all registered utility names', () => {
      registerUtility('flex', () => ({ display: 'flex' }));
      registerUtility('block', () => ({ display: 'block' }));
      const names = getRegisteredUtilities();
      expect(names).toContain('flex');
      expect(names).toContain('block');
      expect(names).toHaveLength(2);
    });

    it('should clear all registered utilities', () => {
      registerUtility('flex', () => ({ display: 'flex' }));
      registerUtility('block', () => ({ display: 'block' }));
      clearRegistry();
      expect(getRegisteredUtilities()).toHaveLength(0);
      expect(hasUtility('flex')).toBe(false);
    });

    it('should allow overwriting a registered utility', () => {
      const gen1: UtilityGenerator = () => ({ display: 'flex' });
      const gen2: UtilityGenerator = () => ({ display: 'inline-flex' });
      registerUtility('flex', gen1);
      registerUtility('flex', gen2);
      expect(getUtility('flex')).toBe(gen2);
    });
  });

  describe('CSS Selector Escaping', () => {
    it('should escape colons in class names', () => {
      expect(escapeClassName('hover:bg-blue-500')).toBe('hover\\:bg-blue-500');
    });

    it('should escape dots in class names', () => {
      expect(escapeClassName('p-1.5')).toBe('p-1\\.5');
    });

    it('should escape brackets in class names', () => {
      expect(escapeClassName('w-[200px]')).toBe('w-\\[200px\\]');
    });

    it('should escape slashes for opacity modifiers', () => {
      expect(escapeClassName('bg-blue-500/50')).toBe('bg-blue-500\\/50');
    });

    it('should escape @ for container queries', () => {
      expect(escapeClassName('@md:flex')).toBe('\\@md\\:flex');
    });

    it('should escape multiple special characters', () => {
      expect(escapeClassName('md:hover:w-[50%]')).toBe('md\\:hover\\:w-\\[50\\%\\]');
    });

    it('should not modify simple class names', () => {
      expect(escapeClassName('flex')).toBe('flex');
      expect(escapeClassName('px-4')).toBe('px-4');
    });

    it('should escape parentheses', () => {
      expect(escapeClassName('bg-[rgb(255,0,0)]')).toBe('bg-\\[rgb\\(255\\,0\\,0\\)\\]');
    });
  });

  describe('Media Query Builder', () => {
    it('should build min-width media query', () => {
      expect(buildMediaQuery('768px')).toBe('@media (min-width: 768px)');
    });

    it('should build media query for all breakpoints', () => {
      expect(buildMediaQuery('640px')).toBe('@media (min-width: 640px)');
      expect(buildMediaQuery('1024px')).toBe('@media (min-width: 1024px)');
      expect(buildMediaQuery('1280px')).toBe('@media (min-width: 1280px)');
      expect(buildMediaQuery('1536px')).toBe('@media (min-width: 1536px)');
    });
  });

  describe('Container Query Builder', () => {
    it('should build min-width container query', () => {
      expect(buildContainerQuery('768px')).toBe('@container (min-width: 768px)');
    });

    it('should build container query for all breakpoints', () => {
      expect(buildContainerQuery('640px')).toBe('@container (min-width: 640px)');
      expect(buildContainerQuery('1024px')).toBe('@container (min-width: 1024px)');
      expect(buildContainerQuery('1280px')).toBe('@container (min-width: 1280px)');
      expect(buildContainerQuery('1536px')).toBe('@container (min-width: 1536px)');
    });
  });

  describe('Supports Query Builder', () => {
    it('should build supports query with plain condition', () => {
      expect(buildSupportsQuery('display: grid')).toBe('@supports (display: grid)');
    });

    it('should preserve parenthesized condition', () => {
      expect(buildSupportsQuery('(display: grid)')).toBe('@supports (display: grid)');
    });
  });

  describe('Pseudo-Class Selector Builder', () => {
    it('should append :hover pseudo-class', () => {
      expect(buildPseudoSelector('.btn', ':hover')).toBe('.btn:hover');
    });

    it('should append ::before pseudo-element', () => {
      expect(buildPseudoSelector('.el', '::before')).toBe('.el::before');
    });

    it('should append :nth-child(odd)', () => {
      expect(buildPseudoSelector('.item', ':nth-child(odd)')).toBe('.item:nth-child(odd)');
    });

    it('should append [open] attribute selector', () => {
      expect(buildPseudoSelector('.details', '[open]')).toBe('.details[open]');
    });
  });

  describe('Group Selector Builder', () => {
    it('should build group-hover selector', () => {
      const result = buildGroupSelector('.group-hover\\:text-white', 'hover');
      expect(result).toBe('.group:hover .group-hover\\:text-white');
    });

    it('should build group-focus selector', () => {
      const result = buildGroupSelector('.group-focus\\:ring-2', 'focus');
      expect(result).toBe('.group:focus .group-focus\\:ring-2');
    });
  });

  describe('Peer Selector Builder', () => {
    it('should build peer-checked selector', () => {
      const result = buildPeerSelector('.peer-checked\\:bg-blue-500', 'checked');
      expect(result).toBe('.peer:checked ~ .peer-checked\\:bg-blue-500');
    });

    it('should build peer-focus selector', () => {
      const result = buildPeerSelector('.peer-focus\\:ring-2', 'focus');
      expect(result).toBe('.peer:focus ~ .peer-focus\\:ring-2');
    });
  });

  describe('Not Selector Builder', () => {
    it('should build not-hover selector', () => {
      const result = buildNotSelector('.not-hover\\:opacity-100', 'hover');
      expect(result).toBe('.not-hover\\:opacity-100:not(:hover)');
    });

    it('should build not-disabled selector', () => {
      const result = buildNotSelector('.not-disabled\\:cursor-pointer', 'disabled');
      expect(result).toBe('.not-disabled\\:cursor-pointer:not(:disabled)');
    });
  });

  describe('Dark Mode Selector Builder', () => {
    it('should build dark mode selector', () => {
      const result = buildDarkSelector('.dark\\:bg-gray-800');
      expect(result).toBe('.dark .dark\\:bg-gray-800');
    });
  });

  describe('Responsive Breakpoints', () => {
    it('should have all standard breakpoints', () => {
      expect(RESPONSIVE_BREAKPOINTS.sm).toBe('640px');
      expect(RESPONSIVE_BREAKPOINTS.md).toBe('768px');
      expect(RESPONSIVE_BREAKPOINTS.lg).toBe('1024px');
      expect(RESPONSIVE_BREAKPOINTS.xl).toBe('1280px');
      expect(RESPONSIVE_BREAKPOINTS['2xl']).toBe('1536px');
    });
  });

  describe('Container Breakpoints', () => {
    it('should have all container breakpoints', () => {
      expect(CONTAINER_BREAKPOINTS['@sm']).toBe('640px');
      expect(CONTAINER_BREAKPOINTS['@md']).toBe('768px');
      expect(CONTAINER_BREAKPOINTS['@lg']).toBe('1024px');
      expect(CONTAINER_BREAKPOINTS['@xl']).toBe('1280px');
      expect(CONTAINER_BREAKPOINTS['@2xl']).toBe('1536px');
      expect(CONTAINER_BREAKPOINTS['@3xl']).toBe('1792px');
      expect(CONTAINER_BREAKPOINTS['@4xl']).toBe('2048px');
      expect(CONTAINER_BREAKPOINTS['@5xl']).toBe('2304px');
    });
  });

  describe('Variant Selectors Map', () => {
    it('should have interactive pseudo-classes', () => {
      expect(VARIANT_SELECTORS.hover).toBe(':hover');
      expect(VARIANT_SELECTORS.focus).toBe(':focus');
      expect(VARIANT_SELECTORS['focus-visible']).toBe(':focus-visible');
      expect(VARIANT_SELECTORS['focus-within']).toBe(':focus-within');
      expect(VARIANT_SELECTORS.active).toBe(':active');
      expect(VARIANT_SELECTORS.disabled).toBe(':disabled');
    });

    it('should have pseudo-elements', () => {
      expect(VARIANT_SELECTORS.before).toBe('::before');
      expect(VARIANT_SELECTORS.after).toBe('::after');
      expect(VARIANT_SELECTORS.placeholder).toBe('::placeholder');
      expect(VARIANT_SELECTORS.selection).toBe('::selection');
      expect(VARIANT_SELECTORS.marker).toBe('::marker');
    });

    it('should have structural pseudo-classes', () => {
      expect(VARIANT_SELECTORS.first).toBe(':first-child');
      expect(VARIANT_SELECTORS.last).toBe(':last-child');
      expect(VARIANT_SELECTORS.odd).toBe(':nth-child(odd)');
      expect(VARIANT_SELECTORS.even).toBe(':nth-child(even)');
      expect(VARIANT_SELECTORS.empty).toBe(':empty');
    });

    it('should have open attribute selector', () => {
      expect(VARIANT_SELECTORS.open).toBe('[open]');
    });
  });

  describe('resolveVariants', () => {
    it('should produce a simple selector with no variants', () => {
      const result = resolveVariants('px-4', []);
      expect(result.selector).toBe('.px-4');
      expect(result.mediaQuery).toBeUndefined();
      expect(result.containerQuery).toBeUndefined();
    });

    it('should resolve responsive variant to media query', () => {
      const result = resolveVariants('md:px-4', ['md']);
      expect(result.selector).toBe('.md\\:px-4');
      expect(result.mediaQuery).toBe('@media (min-width: 768px)');
    });

    it('should resolve container query variant', () => {
      const result = resolveVariants('@lg:flex', ['@lg']);
      expect(result.selector).toBe('.\\@lg\\:flex');
      expect(result.containerQuery).toBe('@container (min-width: 1024px)');
    });

    it('should resolve pseudo-class variant to selector suffix', () => {
      const result = resolveVariants('hover:bg-blue-500', ['hover']);
      expect(result.selector).toBe('.hover\\:bg-blue-500:hover');
      expect(result.mediaQuery).toBeUndefined();
    });

    it('should resolve pseudo-element variant', () => {
      const result = resolveVariants('before:content-[\'\']', ['before']);
      expect(result.selector).toContain('::before');
    });

    it('should resolve dark mode variant', () => {
      const result = resolveVariants('dark:bg-gray-800', ['dark']);
      expect(result.selector).toBe('.dark .dark\\:bg-gray-800');
    });

    it('should resolve group-hover variant', () => {
      const result = resolveVariants('group-hover:text-white', ['group-hover']);
      expect(result.selector).toBe('.group:hover .group-hover\\:text-white');
    });

    it('should resolve peer-checked variant', () => {
      const result = resolveVariants('peer-checked:bg-blue-500', ['peer-checked']);
      expect(result.selector).toBe('.peer:checked ~ .peer-checked\\:bg-blue-500');
    });

    it('should resolve in-hover variant (alias for group-hover)', () => {
      const result = resolveVariants('in-hover:text-white', ['in-hover']);
      expect(result.selector).toBe('.group:hover .in-hover\\:text-white');
    });

    it('should resolve not-hover variant', () => {
      const result = resolveVariants('not-hover:opacity-100', ['not-hover']);
      expect(result.selector).toBe('.not-hover\\:opacity-100:not(:hover)');
    });

    it('should handle variant stacking: responsive + pseudo-class', () => {
      const result = resolveVariants('md:hover:bg-blue-500', ['md', 'hover']);
      expect(result.selector).toBe('.md\\:hover\\:bg-blue-500:hover');
      expect(result.mediaQuery).toBe('@media (min-width: 768px)');
    });

    it('should handle variant stacking: responsive + dark + pseudo-class', () => {
      const result = resolveVariants('lg:dark:hover:text-white', ['lg', 'dark', 'hover']);
      expect(result.mediaQuery).toBe('@media (min-width: 1024px)');
      // dark wraps selector, then hover appends
      expect(result.selector).toBe('.dark .lg\\:dark\\:hover\\:text-white:hover');
    });

    it('should handle variant stacking: container query + group variant', () => {
      const result = resolveVariants('@lg:group-hover:text-white', ['@lg', 'group-hover']);
      expect(result.containerQuery).toBe('@container (min-width: 1024px)');
      expect(result.selector).toBe('.group:hover .\\@lg\\:group-hover\\:text-white');
    });

    it('should handle 2xl responsive breakpoint', () => {
      const result = resolveVariants('2xl:text-4xl', ['2xl']);
      expect(result.mediaQuery).toBe('@media (min-width: 1536px)');
      expect(result.selector).toBe('.2xl\\:text-4xl');
    });

    it('should handle 3xl container breakpoint', () => {
      const result = resolveVariants('@3xl:flex', ['@3xl']);
      expect(result.containerQuery).toBe('@container (min-width: 1792px)');
      expect(result.selector).toBe('.\\@3xl\\:flex');
    });

    it('should resolve print variant', () => {
      const result = resolveVariants('print:hidden', ['print']);
      expect(result.mediaQuery).toBe('@media print');
      expect(result.selector).toBe('.print\\:hidden');
    });

    it('should resolve motion-reduce variant', () => {
      const result = resolveVariants('motion-reduce:animate-none', ['motion-reduce']);
      expect(result.mediaQuery).toBe('@media (prefers-reduced-motion: reduce)');
    });

    it('should resolve portrait variant', () => {
      const result = resolveVariants('portrait:hidden', ['portrait']);
      expect(result.mediaQuery).toBe('@media (orientation: portrait)');
    });

    it('should resolve rtl variant', () => {
      const result = resolveVariants('rtl:text-right', ['rtl']);
      expect(result.selector).toBe('[dir="rtl"] .rtl\\:text-right');
    });

    it('should resolve aria variant', () => {
      const result = resolveVariants('aria-checked:bg-blue-500', ['aria-checked']);
      expect(result.selector).toBe('.aria-checked\\:bg-blue-500[aria-checked="true"]');
    });

    it('should resolve data variant', () => {
      const result = resolveVariants('data-open:opacity-100', ['data-open']);
      expect(result.selector).toBe('.data-open\\:opacity-100[data-open]');
    });

    it('should resolve supports arbitrary variant', () => {
      const result = resolveVariants('supports-[display:grid]:grid', ['supports-[display:grid]']);
      expect(result.supportsQuery).toBe('@supports (display:grid)');
    });

    it('should resolve has arbitrary variant', () => {
      const result = resolveVariants('has-[img]:p-4', ['has-[img]']);
      expect(result.selector).toBe('.has-\\[img\\]\\:p-4:has(img)');
    });
  });

  describe('generateCSS', () => {
    beforeEach(() => {
      // Register a simple test utility
      registerUtility('flex', () => ({ display: 'flex' }));
      registerUtility('px', (parsed) => {
        if (!parsed.value) return null;
        const val = parsed.value;
        return {
          'padding-left': `${Number(val) * 0.25}rem`,
          'padding-right': `${Number(val) * 0.25}rem`,
        };
      });
      registerUtility('hidden', () => ({ display: 'none' }));
    });

    it('should return null for empty utility', () => {
      const parsed: ParsedClass = { utility: '', variants: [], modifiers: [] };
      expect(generateCSS(parsed)).toBeNull();
    });

    it('should return null for unregistered utility', () => {
      const parsed: ParsedClass = { utility: 'unknown-util', variants: [], modifiers: [] };
      expect(generateCSS(parsed)).toBeNull();
    });

    it('should generate CSS for a simple utility', () => {
      const parsed: ParsedClass = { utility: 'flex', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'flex');
      expect(rule).not.toBeNull();
      expect(rule!.selector).toBe('.flex');
      expect(rule!.properties).toEqual({ display: 'flex' });
      expect(rule!.mediaQuery).toBeUndefined();
    });

    it('should generate CSS for a value-based utility', () => {
      const parsed: ParsedClass = { utility: 'px', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'px-4');
      expect(rule).not.toBeNull();
      expect(rule!.selector).toBe('.px-4');
      expect(rule!.properties).toEqual({
        'padding-left': '1rem',
        'padding-right': '1rem',
      });
    });

    it('should generate CSS with responsive variant', () => {
      const parsed: ParsedClass = { utility: 'flex', variants: ['md'], modifiers: [] };
      const rule = generateCSS(parsed, 'md:flex');
      expect(rule).not.toBeNull();
      expect(rule!.selector).toBe('.md\\:flex');
      expect(rule!.mediaQuery).toBe('@media (min-width: 768px)');
      expect(rule!.properties).toEqual({ display: 'flex' });
    });

    it('should generate CSS with pseudo-class variant', () => {
      const parsed: ParsedClass = { utility: 'hidden', variants: ['hover'], modifiers: [] };
      const rule = generateCSS(parsed, 'hover:hidden');
      expect(rule).not.toBeNull();
      expect(rule!.selector).toBe('.hover\\:hidden:hover');
      expect(rule!.properties).toEqual({ display: 'none' });
    });

    it('should generate CSS with stacked variants', () => {
      const parsed: ParsedClass = { utility: 'hidden', variants: ['md', 'hover'], modifiers: [] };
      const rule = generateCSS(parsed, 'md:hover:hidden');
      expect(rule).not.toBeNull();
      expect(rule!.selector).toBe('.md\\:hover\\:hidden:hover');
      expect(rule!.mediaQuery).toBe('@media (min-width: 768px)');
    });

    it('should generate CSS with container query variant', () => {
      const parsed: ParsedClass = { utility: 'flex', variants: ['@lg'], modifiers: [] };
      const rule = generateCSS(parsed, '@lg:flex');
      expect(rule).not.toBeNull();
      expect(rule!.selector).toBe('.\\@lg\\:flex');
      expect(rule!.containerQuery).toBe('@container (min-width: 1024px)');
    });

    it('should return null when generator returns null', () => {
      const parsed: ParsedClass = { utility: 'px', variants: [], modifiers: [] }; // no value
      const rule = generateCSS(parsed, 'px');
      expect(rule).toBeNull();
    });

    it('should prefer compound key over simple utility when value is present', () => {
      // This tests the fix for the utility lookup priority bug.
      // When "flex" (display:flex) and "flex-col" (flex-direction:column) are both registered,
      // parsing "flex-col" yields utility:"flex", value:"col". The compound key "flex-col"
      // must be tried FIRST, otherwise the "flex" generator returns display:flex.
      registerUtility('flex-col', () => ({ 'flex-direction': 'column' }));
      // "flex" is already registered from the beforeEach

      const parsed: ParsedClass = { utility: 'flex', value: 'col', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'flex-col');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-direction': 'column' });
      expect(rule!.selector).toBe('.flex-col');
    });

    it('should fall back to simple utility when compound key is not registered', () => {
      // "flex" is registered but "flex-99" is not, so "flex" with value "99" should
      // still attempt the simple utility generator (which returns display:flex and ignores the value)
      const parsed: ParsedClass = { utility: 'px', value: '4', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'px-4');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({
        'padding-left': '1rem',
        'padding-right': '1rem',
      });
    });
  });

  describe('stringifyRule', () => {
    it('should stringify a simple rule', () => {
      const rule: CSSRule = {
        selector: '.flex',
        properties: { display: 'flex' },
      };
      const css = stringifyRule(rule);
      expect(css).toBe('.flex {\n  display: flex;\n}');
    });

    it('should stringify a rule with multiple properties', () => {
      const rule: CSSRule = {
        selector: '.px-4',
        properties: {
          'padding-left': '1rem',
          'padding-right': '1rem',
        },
      };
      const css = stringifyRule(rule);
      expect(css).toContain('.px-4 {');
      expect(css).toContain('padding-left: 1rem;');
      expect(css).toContain('padding-right: 1rem;');
    });

    it('should wrap in media query', () => {
      const rule: CSSRule = {
        selector: '.md\\:flex',
        properties: { display: 'flex' },
        mediaQuery: '@media (min-width: 768px)',
      };
      const css = stringifyRule(rule);
      expect(css).toContain('@media (min-width: 768px)');
      expect(css).toContain('.md\\:flex {');
      expect(css).toContain('display: flex;');
    });

    it('should wrap in container query', () => {
      const rule: CSSRule = {
        selector: '.\\@lg\\:flex',
        properties: { display: 'flex' },
        containerQuery: '@container (min-width: 1024px)',
      };
      const css = stringifyRule(rule);
      expect(css).toContain('@container (min-width: 1024px)');
      expect(css).toContain('.\\@lg\\:flex {');
      expect(css).toContain('display: flex;');
    });

    it('should wrap in both media query and container query', () => {
      const rule: CSSRule = {
        selector: '.selector',
        properties: { display: 'flex' },
        mediaQuery: '@media (min-width: 768px)',
        containerQuery: '@container (min-width: 1024px)',
      };
      const css = stringifyRule(rule);
      expect(css).toContain('@media (min-width: 768px)');
      expect(css).toContain('@container (min-width: 1024px)');
      expect(css).toContain('display: flex;');
    });

    it('should wrap in supports query', () => {
      const rule: CSSRule = {
        selector: '.supports-\\[display\\:grid\\]\\:grid',
        properties: { display: 'grid' },
        supportsQuery: '@supports (display: grid)',
      };
      const css = stringifyRule(rule);
      expect(css).toContain('@supports (display: grid)');
      expect(css).toContain('display: grid;');
    });

    it('should produce well-formatted CSS with pseudo-class selector', () => {
      const rule: CSSRule = {
        selector: '.hover\\:bg-blue-500:hover',
        properties: { 'background-color': 'oklch(0.55 0.18 250)' },
      };
      const css = stringifyRule(rule);
      expect(css).toBe('.hover\\:bg-blue-500:hover {\n  background-color: oklch(0.55 0.18 250);\n}');
    });
  });

  describe('Compound utility lookup priority (bug fix)', () => {
    // Integration test: when layout (registers "flex" → display:flex) and flexbox
    // (registers "flex-col" → flex-direction:column) builders are both loaded,
    // the parser produces utility:"flex", value:"col" for class "flex-col".
    // The generator must resolve this to flex-direction:column, NOT display:flex.

    beforeEach(() => {
      // Simulate both layout and flexbox builders registering their utilities
      registerUtility('flex', () => ({ display: 'flex' }));
      registerUtility('inline-flex', () => ({ display: 'inline-flex' }));
      registerUtility('inline-block', () => ({ display: 'inline-block' }));
      registerUtility('flex-col', () => ({ 'flex-direction': 'column' }));
      registerUtility('flex-row', () => ({ 'flex-direction': 'row' }));
      registerUtility('flex-wrap', () => ({ 'flex-wrap': 'wrap' }));
      registerUtility('flex-nowrap', () => ({ 'flex-wrap': 'nowrap' }));
      registerUtility('flex-1', () => ({ flex: '1 1 0%' }));
      registerUtility('flex-auto', () => ({ flex: '1 1 auto' }));
    });

    it('flex-col (parsed as utility:"flex", value:"col") → flex-direction: column', () => {
      const parsed: ParsedClass = { utility: 'flex', value: 'col', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'flex-col');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-direction': 'column' });
    });

    it('flex-row (parsed as utility:"flex", value:"row") → flex-direction: row', () => {
      const parsed: ParsedClass = { utility: 'flex', value: 'row', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'flex-row');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-direction': 'row' });
    });

    it('flex-wrap (parsed as utility:"flex", value:"wrap") → flex-wrap: wrap', () => {
      const parsed: ParsedClass = { utility: 'flex', value: 'wrap', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'flex-wrap');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-wrap': 'wrap' });
    });

    it('flex-nowrap (parsed as utility:"flex", value:"nowrap") → flex-wrap: nowrap', () => {
      const parsed: ParsedClass = { utility: 'flex', value: 'nowrap', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'flex-nowrap');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ 'flex-wrap': 'nowrap' });
    });

    it('flex-1 (parsed as utility:"flex", value:"1") → flex: 1 1 0%', () => {
      const parsed: ParsedClass = { utility: 'flex', value: '1', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'flex-1');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ flex: '1 1 0%' });
    });

    it('flex-auto (parsed as utility:"flex", value:"auto") → flex: 1 1 auto', () => {
      const parsed: ParsedClass = { utility: 'flex', value: 'auto', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'flex-auto');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ flex: '1 1 auto' });
    });

    it('flex (no value) → display: flex (unchanged behavior)', () => {
      const parsed: ParsedClass = { utility: 'flex', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'flex');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'flex' });
    });

    it('inline-flex (parsed as utility:"inline", value:"flex") → display: inline-flex', () => {
      const parsed: ParsedClass = { utility: 'inline', value: 'flex', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'inline-flex');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'inline-flex' });
    });

    it('inline-block (parsed as utility:"inline", value:"block") → display: inline-block', () => {
      const parsed: ParsedClass = { utility: 'inline', value: 'block', variants: [], modifiers: [] };
      const rule = generateCSS(parsed, 'inline-block');
      expect(rule).not.toBeNull();
      expect(rule!.properties).toEqual({ display: 'inline-block' });
    });
  });
});
