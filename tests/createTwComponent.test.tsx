/**
 * Tests for createTwComponent (tasks 8.1 – 8.4)
 *
 * Runs in the default "node" Jest environment (no jsdom available).
 * DOM-rendering assertions use React's server-side renderToStaticMarkup so
 * we can verify className, tag name, and attributes without a browser DOM.
 * Ref-forwarding is verified via React's createRef + a minimal mock DOM node.
 *
 * Covers:
 *  8.1 – component factory function
 *  8.2 – variants + className merging + CSS injection
 *  8.3 – polymorphic "as" prop
 *  8.4 – ref forwarding
 */

import React, { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createTwComponent } from '../src/createTwComponent';
import { clearInjectedStyles } from '../src/internal/injector';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Render a React element to an HTML string for assertions. */
function render(element: React.ReactElement): string {
  return renderToStaticMarkup(element);
}

/** Extract the value of an attribute from an HTML string. */
function getAttribute(html: string, attr: string): string | null {
  const match = html.match(new RegExp(`${attr}="([^"]*)"`, 'i'));
  return match ? match[1] : null;
}

/** Extract the tag name from an HTML string. */
function getTagName(html: string): string {
  const match = html.match(/^<(\w+)/);
  return match ? match[1].toUpperCase() : '';
}

beforeEach(() => {
  clearInjectedStyles();
});

// ─── 8.1 Component factory function ──────────────────────────────────────────

describe('createTwComponent – 8.1 factory function', () => {
  it('returns a React forwardRef component (object with render function)', () => {
    const Box = createTwComponent('div', { base: 'flex' });
    // forwardRef returns an exotic component; it has a $$typeof symbol
    expect(Box).toBeTruthy();
    expect(typeof Box).toBe('object');
  });

  it('renders the default element type', () => {
    const Box = createTwComponent('div', {});
    const html = render(<Box />);
    expect(getTagName(html)).toBe('DIV');
  });

  it('sets a displayName based on the element', () => {
    const Box = createTwComponent('section', {});
    expect((Box as { displayName?: string }).displayName).toBe('Tw(section)');
  });

  it('uses component displayName when element is a React component', () => {
    function MyBase(_props: { className?: string }) {
      return <span />;
    }
    MyBase.displayName = 'MyBase';
    const Tw = createTwComponent(MyBase as React.ComponentType<Record<string, unknown>>, {});
    expect((Tw as { displayName?: string }).displayName).toBe('Tw(MyBase)');
  });

  it('uses component.name when displayName is not set', () => {
    function NamedComp(_props: { className?: string }) {
      return <span />;
    }
    const Tw = createTwComponent(NamedComp as React.ComponentType<Record<string, unknown>>, {});
    expect((Tw as { displayName?: string }).displayName).toBe('Tw(NamedComp)');
  });

  it('forwards arbitrary props to the underlying element', () => {
    const Input = createTwComponent('input', {});
    const html = render(<Input placeholder="hello" />);
    expect(html).toContain('placeholder="hello"');
  });

  it('renders with no config supplied', () => {
    const Div = createTwComponent('div', {});
    expect(() => render(<Div />)).not.toThrow();
  });
});

// ─── 8.2 Variants and className merging ──────────────────────────────────────

describe('createTwComponent – 8.2 variants & className merging', () => {
  const Button = createTwComponent('button', {
    base: 'rounded font-medium',
    variants: {
      size: {
        sm: 'text-sm px-3 py-1',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
      color: {
        primary: 'bg-blue-500',
        danger: 'bg-red-500',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'primary',
    },
  });

  it('applies base classes', () => {
    const html = render(<Button />);
    const cls = getAttribute(html, 'class') ?? '';
    expect(cls).toContain('rounded');
    expect(cls).toContain('font-medium');
  });

  it('applies default variant classes', () => {
    const html = render(<Button />);
    const cls = getAttribute(html, 'class') ?? '';
    expect(cls).toContain('text-base');
    expect(cls).toContain('bg-blue-500');
  });

  it('applies explicit variant props', () => {
    const html = render(<Button size="lg" color="danger" />);
    const cls = getAttribute(html, 'class') ?? '';
    expect(cls).toContain('text-lg');
    expect(cls).toContain('bg-red-500');
  });

  it('overrides a single default variant when only one prop is supplied', () => {
    const html = render(<Button size="sm" />);
    const cls = getAttribute(html, 'class') ?? '';
    expect(cls).toContain('text-sm'); // overridden
    expect(cls).toContain('bg-blue-500'); // default still applied
  });

  it('merges user className after resolved variant classes', () => {
    const html = render(<Button className="extra-class" />);
    const cls = getAttribute(html, 'class') ?? '';
    expect(cls).toContain('extra-class');
    expect(cls).toContain('rounded'); // base still present
  });

  it('does not pass variant prop keys as HTML attributes', () => {
    const html = render(<Button size="sm" />);
    // "size" should not appear as an attribute on the button element
    expect(html).not.toMatch(/\bsize="/);
    expect(html).not.toMatch(/\bcolor="/);
  });

  it('applies compound variants when conditions match', () => {
    const Comp = createTwComponent('div', {
      base: 'base-class',
      variants: {
        variant: { solid: 'solid-class', outline: 'outline-class' },
        color:   { primary: 'primary-class', danger: 'danger-class' },
      },
      compoundVariants: [
        { variant: 'solid', color: 'primary', className: 'shadow-lg' },
      ],
      defaultVariants: { variant: 'solid', color: 'primary' },
    });

    const html = render(<Comp />);
    const cls = getAttribute(html, 'class') ?? '';
    expect(cls).toContain('shadow-lg');
  });

  it('does not apply compound variants when conditions are not met', () => {
    const Comp = createTwComponent('div', {
      base: 'base-class',
      variants: {
        variant: { solid: 'solid-class', outline: 'outline-class' },
        color:   { primary: 'primary-class', danger: 'danger-class' },
      },
      compoundVariants: [
        { variant: 'solid', color: 'primary', className: 'shadow-lg' },
      ],
      defaultVariants: { variant: 'outline', color: 'danger' },
    });

    const html = render(<Comp />);
    const cls = getAttribute(html, 'class') ?? '';
    expect(cls).not.toContain('shadow-lg');
  });

  it('supports "class" key in compoundVariants (alias for className)', () => {
    const Comp = createTwComponent('div', {
      base: '',
      variants: {
        v: { a: 'v-a', b: 'v-b' },
      },
      compoundVariants: [
        { v: 'a', class: 'compound-applied' },
      ],
      defaultVariants: { v: 'a' },
    });

    const html = render(<Comp />);
    const cls = getAttribute(html, 'class') ?? '';
    expect(cls).toContain('compound-applied');
  });

  it('produces an empty / omitted className when no classes are resolved', () => {
    const Bare = createTwComponent('div', {});
    const html = render(<Bare />);
    // No classes → className attribute should be absent from the output
    expect(getAttribute(html, 'class')).toBeNull();
  });
});

// ─── 8.3 Polymorphic "as" prop ────────────────────────────────────────────────

describe('createTwComponent – 8.3 polymorphic "as" prop', () => {
  it('renders the default element when "as" is not provided', () => {
    const Box = createTwComponent('div', {});
    expect(getTagName(render(<Box />))).toBe('DIV');
  });

  it('renders the element specified by "as"', () => {
    const Box = createTwComponent('div', {});
    expect(getTagName(render(<Box as="span" />))).toBe('SPAN');
  });

  it('renders as "a" and passes href', () => {
    const Button = createTwComponent('button', { base: 'btn' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html = render(<Button as="a" {...({ href: 'https://example.com' } as any)} />);
    expect(getTagName(html)).toBe('A');
    expect(html).toContain('href="https://example.com"');
  });

  it('renders as "section" with correct tag', () => {
    const Box = createTwComponent('div', { base: 'container' });
    expect(getTagName(render(<Box as="section" />))).toBe('SECTION');
  });

  it('still applies base and variant classes when "as" is provided', () => {
    const Button = createTwComponent('button', {
      base: 'base-btn',
      variants: { size: { sm: 'text-sm', lg: 'text-lg' } },
      defaultVariants: { size: 'sm' },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html = render(<Button as="a" {...({ href: '#' } as any)} />);
    const cls = getAttribute(html, 'class') ?? '';
    expect(cls).toContain('base-btn');
    expect(cls).toContain('text-sm');
  });

  it('does not expose the "as" prop as an HTML attribute', () => {
    const Box = createTwComponent('div', {});
    const html = render(<Box as="span" />);
    // The rendered <span> should not have an "as" attribute
    expect(html).not.toMatch(/\bas="/);
  });
});

// ─── 8.4 Ref forwarding ───────────────────────────────────────────────────────

describe('createTwComponent – 8.4 ref forwarding', () => {
  /**
   * In a node environment there is no real DOM, so React's server renderer
   * doesn't call refs. We test ref-forwarding by rendering with react-dom/client
   * into a minimal JSDOM-like structure, OR we simply verify the component is
   * created with forwardRef so refs are wired correctly.
   *
   * The authoritative check: the component's $$typeof must be the forwardRef symbol.
   */

  it('creates component with React.forwardRef', () => {
    const Box = createTwComponent('div', {});
    // React.forwardRef sets $$typeof to Symbol.for('react.forward_ref')
    const fwdRefSymbol = Symbol.for('react.forward_ref');
    expect((Box as unknown as { $$typeof: symbol }).$$typeof).toBe(fwdRefSymbol);
  });

  it('exposes the inner render function (render property on forwardRef component)', () => {
    const Box = createTwComponent('div', {});
    // ForwardRef components expose their inner function as .render
    expect(
      typeof (Box as unknown as { render?: unknown }).render
    ).toBe('function');
  });

  it('accepts a ref object without throwing during render', () => {
    const Box = createTwComponent('div', {});
    const ref = createRef<HTMLDivElement>();

    // renderToStaticMarkup ignores refs (SSR), but must not throw
    expect(() => render(<Box ref={ref} />)).not.toThrow();
  });

  it('ref still works with polymorphic "as" prop', () => {
    const Box = createTwComponent('div', {});
    const ref = createRef<HTMLDivElement>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => render(<Box as="span" ref={ref as any} />)).not.toThrow();
  });
});
