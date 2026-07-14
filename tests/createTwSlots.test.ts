/**
 * Tests for createTwSlots (tasks 9.1 – 9.2)
 *
 * Covers:
 *  9.1 – slots function factory (accept config, return function, return className object)
 *  9.2 – per-slot variant resolution (variants apply to individual slots, base merging)
 */

import { createTwSlots } from '../src/createTwSlots';

// ─── 9.1 Slots function factory ──────────────────────────────────────────────

describe('createTwSlots – 9.1 slots function factory', () => {
  it('returns a function', () => {
    const card = createTwSlots({
      slots: { root: 'rounded-lg', body: 'px-4 py-2' },
    });
    expect(typeof card).toBe('function');
  });

  it('returned function produces an object with a key for every slot', () => {
    const card = createTwSlots({
      slots: {
        root: 'rounded-lg',
        header: 'px-6 py-4 border-b',
        body: 'px-6 py-4',
        footer: 'px-6 py-4 border-t',
      },
    });
    const classes = card();
    expect(Object.keys(classes)).toEqual(['root', 'header', 'body', 'footer']);
  });

  it('base slot classes are always present in the result', () => {
    const card = createTwSlots({
      slots: {
        root: 'rounded-lg border bg-white',
        body: 'px-6 py-4',
      },
    });
    const classes = card();
    expect(classes.root).toContain('rounded-lg');
    expect(classes.root).toContain('border');
    expect(classes.root).toContain('bg-white');
    expect(classes.body).toContain('px-6');
    expect(classes.body).toContain('py-4');
  });

  it('can be called with no arguments', () => {
    const card = createTwSlots({
      slots: { root: 'rounded-lg' },
    });
    expect(() => card()).not.toThrow();
    expect(card().root).toBe('rounded-lg');
  });

  it('can be called with an empty props object', () => {
    const card = createTwSlots({
      slots: { root: 'rounded-lg' },
    });
    expect(() => card({})).not.toThrow();
    expect(card({}).root).toBe('rounded-lg');
  });

  it('returns empty string for a slot with no base classes and no variant', () => {
    const card = createTwSlots({
      slots: { root: '', body: 'px-4' },
    });
    expect(card().root).toBe('');
    expect(card().body).toBe('px-4');
  });

  it('accepts a config with no variants defined', () => {
    const card = createTwSlots({
      slots: { root: 'a', header: 'b' },
    });
    const result = card({ anyProp: 'ignored' });
    expect(result.root).toBe('a');
    expect(result.header).toBe('b');
  });
});

// ─── 9.2 Per-slot variant resolution ─────────────────────────────────────────

describe('createTwSlots – 9.2 per-slot variant resolution', () => {
  const card = createTwSlots({
    slots: {
      root: 'rounded-lg border bg-white',
      header: 'px-6 py-4 border-b',
      body: 'px-6 py-4',
      footer: 'px-6 py-4 border-t',
    },
    variants: {
      size: {
        sm: { root: 'text-sm', body: 'px-4 py-3' },
        md: { root: 'text-base', body: 'px-6 py-4' },
      },
      shadow: {
        none: {},
        sm: { root: 'shadow-sm' },
        lg: { root: 'shadow-lg' },
      },
    },
    defaultVariants: { size: 'md', shadow: 'none' },
  });

  it('applies default variant classes to the correct slots', () => {
    const classes = card();
    // size: md → root gets "text-base", body gets "px-6 py-4"
    expect(classes.root).toContain('text-base');
    expect(classes.body).toContain('px-6');
  });

  it('explicit variant prop overrides the default', () => {
    const classes = card({ size: 'sm' });
    expect(classes.root).toContain('text-sm');
    expect(classes.body).toContain('px-4');
    expect(classes.body).toContain('py-3');
  });

  it('variant classes only affect the slots they reference', () => {
    const classes = card({ size: 'sm' });
    // header and footer have no size override → only base classes
    expect(classes.header).toBe('px-6 py-4 border-b');
    expect(classes.footer).toBe('px-6 py-4 border-t');
  });

  it('base slot classes always appear before variant classes', () => {
    const classes = card({ size: 'sm' });
    // root base: "rounded-lg border bg-white", then "text-sm"
    expect(classes.root.startsWith('rounded-lg border bg-white')).toBe(true);
    expect(classes.root).toContain('text-sm');
  });

  it('shadow variant applies to root only', () => {
    const classes = card({ shadow: 'lg' });
    expect(classes.root).toContain('shadow-lg');
    expect(classes.header).not.toContain('shadow');
    expect(classes.body).not.toContain('shadow');
    expect(classes.footer).not.toContain('shadow');
  });

  it('empty variant value object adds no extra classes', () => {
    const classes = card({ shadow: 'none' });
    // shadow: none maps to {} — root should not gain any shadow class
    expect(classes.root).not.toContain('shadow');
  });

  it('multiple variants combine correctly across slots', () => {
    const classes = card({ size: 'sm', shadow: 'sm' });
    expect(classes.root).toContain('text-sm');   // from size: sm
    expect(classes.root).toContain('shadow-sm');  // from shadow: sm
    expect(classes.body).toContain('px-4');       // from size: sm
  });

  it('undefined variant key is ignored (no crash)', () => {
    // Passing an unknown variant prop should not throw
    expect(() => card({ nonExistent: 'value' } as Record<string, string>)).not.toThrow();
  });

  it('matches the exact example from the spec / task prompt', () => {
    // card({ size: "sm" }) per SPEC.md example
    const classes = card({ size: 'sm' });
    // root → "rounded-lg border bg-white text-sm"
    expect(classes.root).toBe('rounded-lg border bg-white text-sm');
    // header → "px-6 py-4 border-b" (no size override for header)
    expect(classes.header).toBe('px-6 py-4 border-b');
  });

  it('compound variants apply slot-specific classes when all conditions match', () => {
    const alert = createTwSlots({
      slots: { wrapper: 'flex', icon: 'mr-2', text: 'font-medium' },
      variants: {
        type: {
          success: { wrapper: 'bg-green-50', text: 'text-green-800' },
          error: { wrapper: 'bg-red-50', text: 'text-red-800' },
        },
        size: {
          sm: { wrapper: 'p-2', text: 'text-sm' },
          lg: { wrapper: 'p-4', text: 'text-base' },
        },
      },
      compoundVariants: [
        {
          type: 'success',
          size: 'lg',
          class: { icon: 'text-green-600', wrapper: 'border border-green-200' },
        },
      ],
      defaultVariants: { type: 'success', size: 'sm' },
    });

    // Condition not met (size is sm) → compound not applied
    const smClasses = alert({ size: 'sm' });
    expect(smClasses.icon).not.toContain('text-green-600');

    // All conditions met → compound applied
    const lgClasses = alert({ type: 'success', size: 'lg' });
    expect(lgClasses.icon).toContain('text-green-600');
    expect(lgClasses.wrapper).toContain('border-green-200');
  });

  it('defaultVariants are applied when corresponding prop is not passed', () => {
    const comp = createTwSlots({
      slots: { box: 'flex' },
      variants: {
        rounded: {
          none: { box: 'rounded-none' },
          full: { box: 'rounded-full' },
        },
      },
      defaultVariants: { rounded: 'full' },
    });

    // No prop → default 'full' should be used
    expect(comp().box).toContain('rounded-full');
    // Explicit 'none' overrides the default
    expect(comp({ rounded: 'none' }).box).toContain('rounded-none');
    expect(comp({ rounded: 'none' }).box).not.toContain('rounded-full');
  });
});
