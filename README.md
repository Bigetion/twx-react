# twx-react

> Runtime-first styling library for React with Tailwind-style utilities, component variants, slots, and compounds.

[![npm version](https://img.shields.io/npm/v/twx-react.svg)](https://www.npmjs.com/package/twx-react)
[![bundle size](https://img.shields.io/bundlephobia/minzip/twx-react)](https://bundlephobia.com/package/twx-react)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/twx-react.svg)](https://github.com/Bigetion/twx-react/blob/main/LICENSE)

twx-react gives you a lightweight runtime styling layer for React. It is designed for teams that want Tailwind-style ergonomics without the overhead of a heavier styling framework.

## Installation

```bash
npm install twx-react react
```

## Core idea

Use the library for three things:

- `tw` for runtime utility processing and class merging
- `createTwComponent` for reusable, typed component primitives
- `createTwSlots` and `createTwCompound` for multi-part and grouped UI patterns

## Quick start

```tsx
import { tw } from 'twx-react';

export function Example() {
  return (
    <tw.button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
      Save changes
    </tw.button>
  );
}
```

```tsx
import { createTwComponent } from 'twx-react';

const Button = createTwComponent('button', {
  base: 'inline-flex items-center rounded-lg font-medium transition-colors',
  variants: {
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
    },
    color: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    },
  },
  defaultVariants: { size: 'md', color: 'primary' },
});
```

For a deeper introduction, see [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md).

## Why it exists

- Zero build-step styling for React apps
- Deterministic class merging with `twMerge`
- Type-safe component variants
- Runtime CSS generation with SSR-friendly behavior
- A compact API surface focused on styling primitives

## API highlights

- `tw` and `twMerge`
- `createTwComponent`
- `createTwSlots`
- `createTwCompound`
- `useTwVariants` and `useTwSlots`
- `injectPreflight` and `disablePreflight`

## Notes

- The package is intentionally focused on runtime styling rather than becoming a full design-system framework.
- The public API is kept lean so it stays predictable and easy to adopt.

---

### `useTwSlots(config, props, deps?)`

React hook for dynamic per-slot resolution. Same config shape as `createTwSlots`, but reactive.

```tsx
import { useTwSlots } from 'twx-react';

function Modal({ size, children }) {
  const slots = useTwSlots({
    slots: {
      overlay: 'fixed inset-0 bg-black/50',
      content: 'bg-white rounded-xl shadow-xl',
      header: 'px-6 py-4 border-b',
      body: 'px-6 py-4',
    },
    variants: {
      size: {
        sm: { content: 'max-w-sm' },
        md: { content: 'max-w-md' },
        lg: { content: 'max-w-lg' },
      },
    },
  }, { size }, [size]);

  return (
    <div className={slots.overlay}>
      <div className={slots.content}>
        <div className={slots.header}>Modal Title</div>
        <div className={slots.body}>{children}</div>
      </div>
    </div>
  );
}
```

---

## TypeScript

All APIs provide full type inference. Variant props are automatically derived from your config.

```tsx
const Button = createTwComponent('button', {
  base: 'px-4 py-2 rounded',
  variants: {
    size: { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
    color: { primary: 'bg-blue-500', danger: 'bg-red-500' },
  },
});

// TypeScript knows: size?: 'sm' | 'md' | 'lg', color?: 'primary' | 'danger'
<Button size="sm" color="primary">OK</Button>

// Error: Type '"xl"' is not assignable to type '"sm" | "md" | "lg"'
<Button size="xl">Nope</Button>
```

**Exported types:**

```ts
import type {
  TwComponentConfig,
  TwComponentProps,
  TwComponent,
  VariantProps,
  CompoundVariant,
} from 'twx-react';
```

---

## Performance

- **LRU Cache** — Generated CSS is cached (500+ entries) to avoid repeat parsing
- **Memoization** — Hooks use `React.useMemo` with configurable dependency arrays
- **Pre-injection** — `createTwComponent` injects all variant CSS at factory time, not render time
- **Deduplication** — The injector skips CSS rules that already exist in the stylesheet
- **Tree-shakeable** — Only import what you use; unused APIs are eliminated by bundlers

---

## Comparison

| Feature | twx-react | Tailwind Variants | CVA | Stitches |
|---------|-----------|-------------------|-----|----------|
| Runtime CSS | Yes | No (needs Tailwind) | No (needs Tailwind) | Yes |
| Zero config | Yes | No (PostCSS) | No (PostCSS) | Yes |
| Type-safe variants | Yes | Yes | Yes | Yes |
| Compound components | Yes | No | No | No |
| Multi-slot | Yes | Yes | No | No |
| Polymorphic `as` | Yes | No | No | Yes |
| React hooks | Yes | No | No | No |
| Bundle (min+gz) | ~16KB | ~3KB* | ~1KB* | ~8KB |

\* Tailwind Variants and CVA require the Tailwind CSS build toolchain separately.

---

## License

MIT
