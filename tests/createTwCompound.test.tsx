/**
 * Tests for createTwCompound (tasks 10.1 – 10.3)
 *
 * Uses React's server-side renderToStaticMarkup so tests run without jsdom.
 * The same helpers used in createTwComponent.test.tsx are replicated here.
 *
 * Covers:
 *  10.1 – compound component factory (multiple parts, each with variants)
 *  10.2 – shared context notes (no shared React Context is required;
 *           components are independent and context is left to consumers)
 *  10.3 – prop filtering and forwarding, "as" polymorphism, ref forwarding
 */

import React, { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createTwCompound } from '../src/createTwCompound';
import { clearInjectedStyles } from '../src/internal/injector';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function render(element: React.ReactElement): string {
  return renderToStaticMarkup(element);
}

function getAttribute(html: string, attr: string): string | null {
  const match = html.match(new RegExp(`${attr}="([^"]*)"`, 'i'));
  return match ? match[1] : null;
}

function getTagName(html: string): string {
  const match = html.match(/^<(\w+)/);
  return match ? match[1].toUpperCase() : '';
}

beforeEach(() => {
  clearInjectedStyles();
});

// ─── 10.1 Compound component factory ─────────────────────────────────────────

describe('createTwCompound – 10.1 factory', () => {
  it('returns an object with a key for each part', () => {
    const Tabs = createTwCompound({
      Root: { base: 'flex flex-col' },
      List: { base: 'flex border-b' },
      Tab:  { base: 'px-4 py-2' },
      Panel: { base: 'p-4' },
    });

    expect(Tabs.Root).toBeDefined();
    expect(Tabs.List).toBeDefined();
    expect(Tabs.Tab).toBeDefined();
    expect(Tabs.Panel).toBeDefined();
  });

  it('each part is a React component (callable / forwardRef exotic object)', () => {
    const { Root, List } = createTwCompound({
      Root: { base: 'root-base' },
      List: { base: 'list-base' },
    });

    // forwardRef components are objects (not plain functions)
    expect(typeof Root).toBe('object');
    expect(typeof List).toBe('object');
  });

  it('each part renders its base classes', () => {
    const { Root, List } = createTwCompound({
      Root: { base: 'root-base-class' },
      List: { base: 'list-base-class' },
    });

    expect(getAttribute(render(<Root />), 'class')).toContain('root-base-class');
    expect(getAttribute(render(<List />), 'class')).toContain('list-base-class');
  });

  it('parts default to rendering a <div>', () => {
    const { Root } = createTwCompound({ Root: { base: 'flex' } });
    expect(getTagName(render(<Root />))).toBe('DIV');
  });

  it('respects the element field per part', () => {
    const UI = createTwCompound({
      Trigger: { element: 'button', base: 'btn' },
      Label:   { element: 'span',   base: 'lbl' },
    });

    expect(getTagName(render(<UI.Trigger />))).toBe('BUTTON');
    expect(getTagName(render(<UI.Label />))).toBe('SPAN');
  });

  it('sets a descriptive displayName on each part', () => {
    const { Root, Tab } = createTwCompound({
      Root: { base: '' },
      Tab:  { base: '' },
    });

    expect((Root as { displayName?: string }).displayName).toBe('Tw.Root');
    expect((Tab  as { displayName?: string }).displayName).toBe('Tw.Tab');
  });

  it('supports per-part variant definitions', () => {
    const { Tab } = createTwCompound({
      Tab: {
        base: 'px-4 py-2',
        variants: {
          active: { true: 'border-b-2 text-blue-500', false: 'text-gray-500' },
        },
        defaultVariants: { active: 'false' },
      },
    });

    const activeHtml = render(<Tab active="true" />);
    expect(getAttribute(activeHtml, 'class')).toContain('text-blue-500');

    const inactiveHtml = render(<Tab />);
    expect(getAttribute(inactiveHtml, 'class')).toContain('text-gray-500');
  });

  it('applies compound variants within a single part', () => {
    const { Item } = createTwCompound({
      Item: {
        base: 'item-base',
        variants: {
          size:  { sm: 'text-sm', lg: 'text-lg' },
          color: { primary: 'bg-blue-500', danger: 'bg-red-500' },
        },
        compoundVariants: [
          { size: 'lg', color: 'danger', className: 'font-bold uppercase' },
        ],
        defaultVariants: { size: 'sm', color: 'primary' },
      },
    });

    const html = render(<Item size="lg" color="danger" />);
    const cls = getAttribute(html, 'class') ?? '';
    expect(cls).toContain('font-bold');
    expect(cls).toContain('uppercase');
  });

  it('applies default variants when no variant props are supplied', () => {
    const { Root } = createTwCompound({
      Root: {
        base: 'root',
        variants: {
          orientation: { horizontal: 'flex-row', vertical: 'flex-col' },
        },
        defaultVariants: { orientation: 'horizontal' },
      },
    });

    const cls = getAttribute(render(<Root />), 'class') ?? '';
    expect(cls).toContain('flex-row');
  });

  it('handles the Tabs pattern from the spec', () => {
    const Tabs = createTwCompound({
      Root: {
        base: 'flex flex-col',
        variants: {
          orientation: { horizontal: 'flex-row', vertical: 'flex-col' },
        },
        defaultVariants: { orientation: 'horizontal' },
      },
      List: { base: 'flex border-b' },
      Tab: {
        base: 'px-4 py-2 cursor-pointer',
        variants: {
          active: {
            true:  'border-b-2 border-blue-500 text-blue-500',
            false: '',
          },
        },
        defaultVariants: { active: 'false' },
      },
      Panel: { base: 'p-4' },
    });

    // All parts can render together
    const html = render(
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Tab active="true">Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>Content</Tabs.Panel>
      </Tabs.Root>
    );

    expect(html).toContain('border-blue-500'); // active tab
    expect(html).toContain('p-4');             // panel base
    expect(html).toContain('flex border-b');   // list base
  });
});

// ─── 10.3 Prop filtering and forwarding ──────────────────────────────────────

describe('createTwCompound – 10.3 prop filtering', () => {
  it('does not forward variant prop keys as HTML attributes', () => {
    const { Tab } = createTwCompound({
      Tab: {
        base: 'tab',
        variants: {
          active: { true: 'active-class', false: 'inactive-class' },
        },
        defaultVariants: { active: 'false' },
      },
    });

    const html = render(<Tab active="true" />);
    // "active" is a variant — must not become an HTML attribute
    expect(html).not.toMatch(/\bactive="/);
  });

  it('forwards non-variant props to the DOM element', () => {
    const { Btn } = createTwCompound({
      Btn: { element: 'button', base: 'btn' },
    });

    const html = render(<Btn type="submit" aria-label="Submit" />);
    expect(html).toContain('type="submit"');
    expect(html).toContain('aria-label="Submit"');
  });

  it('merges user className after resolved variant classes', () => {
    const { Box } = createTwCompound({
      Box: { base: 'box-base' },
    });

    const cls = getAttribute(render(<Box className="extra" />), 'class') ?? '';
    expect(cls).toContain('box-base');
    expect(cls).toContain('extra');
  });

  it('"as" prop overrides the rendered element per part', () => {
    const { Trigger } = createTwCompound({
      Trigger: { element: 'button', base: 'trigger' },
    });

    // Switch from button → a
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html = render(<Trigger as="a" {...({ href: '/path' } as any)} />);
    expect(getTagName(html)).toBe('A');
    expect(html).toContain('href="/path"');
  });

  it('"as" prop is not rendered as an HTML attribute', () => {
    const { Box } = createTwCompound({ Box: { base: 'box' } });
    const html = render(<Box as="span" />);
    expect(html).not.toMatch(/\bas="/);
  });

  it('still applies base + variant classes when "as" is used', () => {
    const { Btn } = createTwCompound({
      Btn: {
        element: 'button',
        base: 'btn-base',
        variants: { size: { sm: 'text-sm', lg: 'text-lg' } },
        defaultVariants: { size: 'sm' },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html = render(<Btn as="a" {...({ href: '#' } as any)} />);
    const cls = getAttribute(html, 'class') ?? '';
    expect(cls).toContain('btn-base');
    expect(cls).toContain('text-sm');
  });
});

// ─── 10.3 Ref forwarding ─────────────────────────────────────────────────────

describe('createTwCompound – 10.3 ref forwarding', () => {
  it('each part is created with React.forwardRef', () => {
    const { Root, Tab } = createTwCompound({
      Root: { base: 'root' },
      Tab:  { base: 'tab' },
    });

    const fwdRefSymbol = Symbol.for('react.forward_ref');
    expect((Root as unknown as { $$typeof: symbol }).$$typeof).toBe(fwdRefSymbol);
    expect((Tab  as unknown as { $$typeof: symbol }).$$typeof).toBe(fwdRefSymbol);
  });

  it('accepts a ref without throwing during render', () => {
    const { Root } = createTwCompound({ Root: { base: 'root' } });
    const ref = createRef<HTMLDivElement>();
    expect(() => render(<Root ref={ref} />)).not.toThrow();
  });

  it('ref works alongside the "as" prop per part', () => {
    const { Trigger } = createTwCompound({
      Trigger: { element: 'button', base: 'trigger' },
    });

    const ref = createRef<HTMLButtonElement>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => render(<Trigger as="a" ref={ref as any} />)).not.toThrow();
  });
});
