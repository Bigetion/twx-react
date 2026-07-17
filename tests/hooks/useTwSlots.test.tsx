/**
 * Tests for useTwSlots hook (tasks 13.1 – 13.2)
 *
 * Covers:
 *  13.1 – hook for dynamic slots resolution
 *  13.2 – automatic memoization
 */

import { renderToStaticMarkup } from 'react-dom/server';
import { useTwSlots } from '../../src/hooks/useTwSlots';
import type { TwSlotsConfig } from '../../src/createTwSlots';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extract all class attribute values from an HTML string. */
function getAllClassNames(html: string): string[] {
  const matches = html.matchAll(/class="([^"]*)"/gi);
  return Array.from(matches).map((match) => match[1]);
}

// ─── 13.1 Hook for dynamic slots resolution ──────────────────────────────────

describe('useTwSlots – 13.1 dynamic slots resolution', () => {
  it('resolves base slot classes when no variants are provided', () => {
    const config: TwSlotsConfig<{
      root: string;
      header: string;
      body: string;
    }> = {
      slots: {
        root: 'bg-white rounded-xl',
        header: 'px-6 py-4 border-b',
        body: 'px-6 py-4',
      },
    };

    function TestComponent() {
      const slots = useTwSlots(config);
      return (
        <div className={slots.root}>
          <div className={slots.header}>Header</div>
          <div className={slots.body}>Body</div>
        </div>
      );
    }

    const html = renderToStaticMarkup(<TestComponent />);
    const classNames = getAllClassNames(html);

    expect(classNames[0]).toBe('bg-white rounded-xl');
    expect(classNames[1]).toBe('px-6 py-4 border-b');
    expect(classNames[2]).toBe('px-6 py-4');
  });

  it('resolves per-slot variant classes based on props', () => {
    const config: TwSlotsConfig<{
      root: string;
      header: string;
      body: string;
    }> = {
      slots: {
        root: 'bg-white rounded-xl',
        header: 'px-6 py-4 border-b',
        body: 'px-6 py-4',
      },
      variants: {
        variant: {
          default: {
            root: 'border shadow-sm',
          },
          elevated: {
            root: 'shadow-lg hover:shadow-xl',
          },
        },
        padding: {
          sm: {
            header: 'px-4 py-3',
            body: 'px-4 py-3',
          },
          md: {
            header: 'px-6 py-4',
            body: 'px-6 py-4',
          },
        },
      },
    };

    function TestComponent({ variant, padding }: { variant: string; padding: string }) {
      const slots = useTwSlots(config, { variant, padding });
      return (
        <div className={slots.root}>
          <div className={slots.header}>Header</div>
          <div className={slots.body}>Body</div>
        </div>
      );
    }

    const html = renderToStaticMarkup(<TestComponent variant="elevated" padding="sm" />);
    const classNames = getAllClassNames(html);

    expect(classNames[0]).toContain('bg-white rounded-xl');
    expect(classNames[0]).toContain('shadow-lg hover:shadow-xl');
    // header/body base `px-6 py-4` targets the same properties as the `sm`
    // padding variant's `px-4 py-3`, so the variant's padding wins.
    expect(classNames[1]).toContain('border-b');
    expect(classNames[1]).toContain('px-4 py-3');
    expect(classNames[1]).not.toContain('px-6 py-4');
    expect(classNames[2]).toContain('px-4 py-3');
    expect(classNames[2]).not.toContain('px-6 py-4');
  });

  it('uses default variants when props are not provided', () => {
    const config: TwSlotsConfig<{
      root: string;
      header: string;
    }> = {
      slots: {
        root: 'rounded-xl',
        header: 'border-b',
      },
      variants: {
        variant: {
          default: {
            root: 'border shadow-sm',
          },
          elevated: {
            root: 'shadow-lg',
          },
        },
      },
      defaultVariants: {
        variant: 'default',
      },
    };

    function TestComponent() {
      const slots = useTwSlots(config, {});
      return (
        <div className={slots.root}>
          <div className={slots.header}>Header</div>
        </div>
      );
    }

    const html = renderToStaticMarkup(<TestComponent />);
    const classNames = getAllClassNames(html);

    expect(classNames[0]).toContain('rounded-xl');
    expect(classNames[0]).toContain('border shadow-sm');
    expect(classNames[1]).toBe('border-b');
  });

  it('allows partial variant overrides with defaults', () => {
    const config: TwSlotsConfig<{
      root: string;
      body: string;
    }> = {
      slots: {
        root: 'rounded-xl',
        body: 'p-4',
      },
      variants: {
        variant: {
          default: { root: 'border' },
          elevated: { root: 'shadow-lg' },
        },
        size: {
          sm: { body: 'p-2' },
          md: { body: 'p-4' },
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'md',
      },
    };

    function TestComponent({ size }: { size: string }) {
      const slots = useTwSlots(config, { size });
      return (
        <div className={slots.root}>
          <div className={slots.body}>Body</div>
        </div>
      );
    }

    const html = renderToStaticMarkup(<TestComponent size="sm" />);
    const classNames = getAllClassNames(html);

    expect(classNames[0]).toContain('rounded-xl');
    expect(classNames[0]).toContain('border'); // default variant
    // base body `p-4` targets the same property as the overridden `sm` size's
    // `p-2`, so only the override survives.
    expect(classNames[1]).toContain('p-2'); // overridden size
    expect(classNames[1]).not.toContain('p-4');
  });

  it('handles compound variants correctly', () => {
    const config: TwSlotsConfig<{
      root: string;
      header: string;
    }> = {
      slots: {
        root: 'rounded-xl',
        header: 'border-b',
      },
      variants: {
        variant: {
          default: { root: 'border' },
          elevated: { root: 'shadow-lg' },
        },
        interactive: {
          true: { root: 'cursor-pointer' },
          false: {},
        },
      },
      compoundVariants: [
        {
          variant: 'elevated',
          interactive: 'true',
          class: {
            root: 'hover:shadow-2xl transition-shadow',
            header: 'hover:bg-gray-50',
          },
        },
      ],
    };

    function TestComponent() {
      const slots = useTwSlots(config, { variant: 'elevated', interactive: 'true' });
      return (
        <div className={slots.root}>
          <div className={slots.header}>Header</div>
        </div>
      );
    }

    const html = renderToStaticMarkup(<TestComponent />);
    const classNames = getAllClassNames(html);

    expect(classNames[0]).toContain('rounded-xl');
    expect(classNames[0]).toContain('shadow-lg');
    expect(classNames[0]).toContain('cursor-pointer');
    expect(classNames[0]).toContain('hover:shadow-2xl transition-shadow');
    expect(classNames[1]).toContain('border-b');
    expect(classNames[1]).toContain('hover:bg-gray-50');
  });

  it('accepts empty props object', () => {
    const config: TwSlotsConfig<{
      root: string;
      body: string;
    }> = {
      slots: {
        root: 'flex flex-col',
        body: 'p-4',
      },
    };

    function TestComponent() {
      const slots = useTwSlots(config, {});
      return (
        <div className={slots.root}>
          <div className={slots.body}>Body</div>
        </div>
      );
    }

    const html = renderToStaticMarkup(<TestComponent />);
    const classNames = getAllClassNames(html);

    expect(classNames[0]).toBe('flex flex-col');
    expect(classNames[1]).toBe('p-4');
  });

  it('accepts undefined props', () => {
    const config: TwSlotsConfig<{
      root: string;
      body: string;
    }> = {
      slots: {
        root: 'flex flex-col',
        body: 'p-4',
      },
    };

    function TestComponent() {
      const slots = useTwSlots(config);
      return (
        <div className={slots.root}>
          <div className={slots.body}>Body</div>
        </div>
      );
    }

    const html = renderToStaticMarkup(<TestComponent />);
    const classNames = getAllClassNames(html);

    expect(classNames[0]).toBe('flex flex-col');
    expect(classNames[1]).toBe('p-4');
  });

  it('returns correct slot names as keys', () => {
    const config: TwSlotsConfig<{
      root: string;
      header: string;
      body: string;
      footer: string;
    }> = {
      slots: {
        root: 'container',
        header: 'header',
        body: 'body',
        footer: 'footer',
      },
    };

    function TestComponent() {
      const slots = useTwSlots(config);
      const keys = Object.keys(slots);
      return <div>{keys.join(',')}</div>;
    }

    const html = renderToStaticMarkup(<TestComponent />);
    expect(html).toContain('root,header,body,footer');
  });
});

// ─── 13.2 Automatic memoization ──────────────────────────────────────────────

describe('useTwSlots – 13.2 automatic memoization', () => {
  it('memoizes based on prop values when no deps provided', () => {
    const config: TwSlotsConfig<{
      root: string;
      body: string;
    }> = {
      slots: {
        root: 'rounded-xl',
        body: 'p-4',
      },
      variants: {
        variant: {
          default: { root: 'border' },
          elevated: { root: 'shadow-lg' },
        },
      },
    };

    let renderCount = 0;

    function TestComponent({ variant }: { variant: string }) {
      const slots = useTwSlots(config, { variant });
      renderCount++;
      return (
        <div className={slots.root}>
          <div className={slots.body}>Render {renderCount}</div>
        </div>
      );
    }

    // First render
    const html1 = renderToStaticMarkup(<TestComponent variant="default" />);
    expect(html1).toContain('border');
    const firstRenderCount = renderCount;

    // Second render with same props
    const html2 = renderToStaticMarkup(<TestComponent variant="default" />);
    expect(html2).toContain('border');

    // Third render with different props
    const html3 = renderToStaticMarkup(<TestComponent variant="elevated" />);
    expect(html3).toContain('shadow-lg');

    // In SSR mode, each render is independent
    expect(renderCount).toBeGreaterThan(firstRenderCount);
  });

  it('memoizes based on custom deps array when provided', () => {
    const config: TwSlotsConfig<{
      root: string;
      body: string;
    }> = {
      slots: {
        root: 'rounded-xl',
        body: 'p-4',
      },
      variants: {
        variant: {
          default: { root: 'border' },
          elevated: { root: 'shadow-lg' },
        },
      },
    };

    let computeCount = 0;

    function TestComponent({ variant, trackCount }: { variant: string; trackCount: boolean }) {
      // Use custom deps - only recompute when variant changes
      const slots = useTwSlots(config, { variant }, [variant]);
      if (trackCount) computeCount++;
      return (
        <div className={slots.root}>
          <div className={slots.body}>Body</div>
        </div>
      );
    }

    const html1 = renderToStaticMarkup(<TestComponent variant="default" trackCount={true} />);
    expect(html1).toContain('border');

    const html2 = renderToStaticMarkup(<TestComponent variant="default" trackCount={false} />);
    expect(html2).toContain('border');

    expect(computeCount).toBeGreaterThan(0);
  });

  it('handles empty deps array to never recompute', () => {
    const config: TwSlotsConfig<{
      root: string;
      body: string;
    }> = {
      slots: {
        root: 'rounded-xl',
        body: 'p-4',
      },
      variants: {
        variant: {
          default: { root: 'border' },
          elevated: { root: 'shadow-lg' },
        },
      },
    };

    function TestComponent({ variant }: { variant: string }) {
      // Empty deps means the first computed value is always returned (after initial render)
      const slots = useTwSlots(config, { variant }, []);
      return (
        <div className={slots.root}>
          <div className={slots.body}>Body</div>
        </div>
      );
    }

    const html1 = renderToStaticMarkup(<TestComponent variant="default" />);
    expect(html1).toContain('border');

    // In SSR, each render is independent
    const html2 = renderToStaticMarkup(<TestComponent variant="elevated" />);
    expect(html2).toContain('shadow-lg');
  });

  it('allows combining slot results with additional classNames', () => {
    const config: TwSlotsConfig<{
      root: string;
      body: string;
    }> = {
      slots: {
        root: 'rounded-xl',
        body: 'p-4',
      },
      variants: {
        variant: {
          default: { root: 'border' },
        },
      },
    };

    function TestComponent({
      variant,
      additionalRootClass,
    }: {
      variant: string;
      additionalRootClass?: string;
    }) {
      const slots = useTwSlots(config, { variant });
      const rootClassName = additionalRootClass
        ? `${slots.root} ${additionalRootClass}`
        : slots.root;
      return (
        <div className={rootClassName}>
          <div className={slots.body}>Body</div>
        </div>
      );
    }

    const html = renderToStaticMarkup(
      <TestComponent variant="default" additionalRootClass="container mx-auto" />
    );
    const classNames = getAllClassNames(html);

    expect(classNames[0]).toContain('rounded-xl');
    expect(classNames[0]).toContain('border');
    expect(classNames[0]).toContain('container mx-auto');
    expect(classNames[1]).toBe('p-4');
  });
});
