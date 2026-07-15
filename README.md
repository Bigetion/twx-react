# twx-react

> Pure React styling library — Component-first Tailwind CSS runtime engine

[![npm version](https://img.shields.io/npm/v/twx-react.svg)](https://www.npmjs.com/package/twx-react)
[![bundle size](https://img.shields.io/bundlephobia/minzip/twx-react)](https://bundlephobia.com/package/twx-react)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/twx-react.svg)](https://github.com/yourusername/twx-react/blob/main/LICENSE)

Create styled React components with type-safe variants, multi-slot patterns, and compound components. Zero build step — just React.

---

## Installation

```bash
npm install twx-react
```

Requires React 17+ as a peer dependency.

---

## Quick Start

### Option 1: tw.element syntax (Recommended) ✨

The cleanest way to use twx-react is with `tw.element` components that automatically process Tailwind classes:

```tsx
import { tw } from 'twx-react';

function App() {
  return (
    <tw.div className="flex flex-col gap-4 p-8">
      <tw.h1 className="text-3xl font-bold text-gray-900">
        Hello World
      </tw.h1>
      <tw.button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Click me
      </tw.button>
    </tw.div>
  );
}
```

**Benefits:**
- ✅ Cleaner syntax - no `tw()` wrapper needed
- ✅ Full TypeScript support for all HTML props
- ✅ Automatic ref forwarding
- ✅ Performance optimized with React.memo
- ✅ Works with all HTML elements (`tw.div`, `tw.button`, `tw.input`, etc.)

### Option 2: tw() function (Advanced)

For third-party components or dynamic styles, use the `tw()` function:

```tsx
import { tw } from 'twx-react';
import { Select } from 'third-party-ui';

function Form() {
  const isActive = true;
  const dynamicClass = tw(`border rounded ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`);
  
  return <Select className={tw('border rounded px-3')} />;
}
```

### Option 3: createTwComponent (Advanced Patterns)

For components with variants, use `createTwComponent`:

```tsx
import { createTwComponent } from 'twx-react';

const Button = createTwComponent('button', {
  base: 'px-4 py-2 rounded-lg font-medium transition-colors',
  variants: {
    variant: {
      solid: 'text-white',
      outline: 'border-2 bg-transparent',
    },
    color: {
      primary: 'bg-blue-600 hover:bg-blue-700',
      danger: 'bg-red-600 hover:bg-red-700',
    },
    size: {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
  },
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: 'md',
  },
});

// Fully typed — variant props get autocomplete
<Button color="danger" size="lg">Delete</Button>

// Polymorphic — render as any element
<Button as="a" href="/home">Go Home</Button>
```

---

## Features

- **Zero build step** — Runtime CSS generation and injection, no PostCSS or config files
- **Full TypeScript inference** — Variant props are type-safe with autocomplete
- **Polymorphic `as` prop** — Render any component as a different element
- **Ref forwarding** — All components forward refs correctly
- **Multi-slot components** — Style complex components with per-slot variants
- **Compound components** — Group related components under one config
- **Theme system** — Design tokens via React Context with runtime switching
- **LRU cache** — Automatic caching prevents redundant CSS generation
- **Tailwind v4** — OKLCH P3 colors, all utility categories
- **SSR compatible** — Works with Next.js, Remix, Gatsby
- **Tree-shakeable** — Import only what you use (~8-12KB typical, ~16KB full)

---

## API Reference

### `tw.element` Components

Pre-built HTML element wrappers that automatically process Tailwind classes.

```tsx
import { tw } from 'twx-react';

// All standard HTML elements are available
<tw.div className="flex items-center gap-4">
  <tw.img src="..." alt="..." className="w-12 h-12 rounded-full" />
  <tw.span className="text-lg font-medium">John Doe</tw.span>
</tw.div>

// Form elements
<tw.form className="space-y-4">
  <tw.label htmlFor="email" className="block font-medium">Email</tw.label>
  <tw.input 
    type="email" 
    id="email"
    className="w-full border rounded px-3 py-2"
  />
  <tw.button type="submit" className="px-4 py-2 bg-blue-500 text-white">
    Submit
  </tw.button>
</tw.form>

// All HTML props work with full TypeScript support
<tw.a href="/about" className="text-blue-500 hover:underline">About</tw.a>
<tw.button onClick={handleClick} disabled={loading} className="...">
  {loading ? 'Loading...' : 'Click me'}
</tw.button>

// Refs work automatically
const divRef = useRef<HTMLDivElement>(null);
<tw.div ref={divRef} className="w-full h-full" />
```

**Available elements:**
- Layout: `div`, `span`, `section`, `article`, `header`, `footer`, `nav`, `main`, `aside`
- Text: `p`, `h1-h6`, `strong`, `em`, `small`, `code`, `pre`
- Lists: `ul`, `ol`, `li`, `dl`, `dt`, `dd`
- Interactive: `button`, `a`, `label`, `input`, `textarea`, `select`, `option`
- Media: `img`, `svg`, `video`, `audio`, `canvas`
- Tables: `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`
- Forms: `form`, `fieldset`, `legend`
- And all other standard HTML elements!

---

### `tw()` Function

Process Tailwind classes for any element or component.

```tsx
import { tw } from 'twx-react';

// For third-party components
import { Select } from 'third-party-ui';
<Select className={tw('border rounded px-3')} />

// For dynamic/computed styles
const buttonClass = tw(`
  px-4 py-2 rounded-lg
  ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}
  ${size === 'lg' ? 'text-lg' : 'text-sm'}
`);
<button className={buttonClass}>Click</button>

// For reusable style strings
const cardStyles = tw('bg-white rounded-lg shadow-lg p-6');
const buttonStyles = tw('px-4 py-2 rounded');

// Export and reuse
export { cardStyles, buttonStyles };
```

---

### `createTwComponent(element, config)`

Creates a styled React component with variant support, `as` prop, and ref forwarding.

```tsx
import { createTwComponent } from 'twx-react';

const Badge = createTwComponent('span', {
  base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  variants: {
    color: {
      gray: 'bg-gray-100 text-gray-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
    },
  },
  compoundVariants: [
    { color: 'red', className: 'ring-1 ring-red-600/10' },
  ],
  defaultVariants: { color: 'gray' },
});

<Badge color="green">Active</Badge>
<Badge as="a" href="/status" color="blue">Link Badge</Badge>
```

**Config options:**

| Key | Description |
|-----|-------------|
| `base` | Classes always applied |
| `variants` | Object mapping variant names to value → className |
| `compoundVariants` | Array of conditional class groups (all conditions must match) |
| `defaultVariants` | Fallback values when variant props are omitted |

---

### `createTwSlots(config)`

Creates a function that resolves per-slot class names from shared variant props. Useful for multi-part components like cards, modals, and dialogs.

```tsx
import { createTwSlots } from 'twx-react';

const card = createTwSlots({
  slots: {
    root: 'rounded-xl border bg-white',
    header: 'px-6 py-4 border-b font-semibold',
    body: 'px-6 py-4',
    footer: 'px-6 py-3 border-t bg-gray-50',
  },
  variants: {
    size: {
      sm: { root: 'text-sm', header: 'px-4 py-3', body: 'px-4 py-3' },
      md: { root: 'text-base', header: 'px-6 py-4', body: 'px-6 py-4' },
      lg: { root: 'text-lg', header: 'px-8 py-5', body: 'px-8 py-5' },
    },
    shadow: {
      none: {},
      sm: { root: 'shadow-sm' },
      lg: { root: 'shadow-lg' },
    },
  },
  defaultVariants: { size: 'md', shadow: 'none' },
});

function Card({ size, shadow, children }) {
  const styles = card({ size, shadow });

  return (
    <div className={styles.root}>
      <div className={styles.header}>Title</div>
      <div className={styles.body}>{children}</div>
      <div className={styles.footer}>Footer</div>
    </div>
  );
}
```

---

### `createTwCompound(config)`

Creates a group of related React components configured together. Each key becomes a component with full variant support.

```tsx
import { createTwCompound } from 'twx-react';

const Tabs = createTwCompound({
  Root: {
    element: 'div',
    base: 'flex flex-col',
  },
  List: {
    element: 'div',
    base: 'flex border-b',
  },
  Tab: {
    element: 'button',
    base: 'px-4 py-2 text-sm font-medium cursor-pointer transition-colors',
    variants: {
      active: {
        true: 'border-b-2 border-blue-500 text-blue-600',
        false: 'text-gray-500 hover:text-gray-700',
      },
    },
    defaultVariants: { active: 'false' },
  },
  Panel: {
    element: 'div',
    base: 'p-4',
  },
});

// Usage — each part is a full React component
<Tabs.Root>
  <Tabs.List>
    <Tabs.Tab active="true">Account</Tabs.Tab>
    <Tabs.Tab>Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel>Account content here</Tabs.Panel>
</Tabs.Root>
```

---

### `useTwVariants(config, props, deps?)`

React hook for resolving variant class names dynamically. Automatically memoized.

```tsx
import { useTwVariants } from 'twx-react';

function AlertBanner({ type, dismissible, children }) {
  const className = useTwVariants({
    base: 'p-4 rounded-lg border',
    variants: {
      type: {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800',
      },
      dismissible: {
        true: 'pr-10',
        false: '',
      },
    },
  }, { type, dismissible }, [type, dismissible]);

  return <div className={className}>{children}</div>;
}
```

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

### Theme APIs

#### `createTwTheme(tokens)`

Creates a theme object with CSS variable generation from design tokens.

```ts
import { createTwTheme } from 'twx-react';

const lightTheme = createTwTheme({
  colors: {
    primary: 'oklch(0.6 0.15 240)',
    surface: 'oklch(0.98 0 0)',
  },
  spacing: { page: '2rem' },
});

// Extend the default Tailwind v4 theme instead of starting from scratch
const customTheme = createTwTheme.extend({
  colors: {
    brand: 'oklch(0.65 0.2 300)',
  },
});
```

#### `TwThemeProvider`

React context provider that injects theme CSS variables into the DOM.

```tsx
import { TwThemeProvider } from 'twx-react';

function App() {
  return (
    <TwThemeProvider theme={lightTheme}>
      <MyApp />
    </TwThemeProvider>
  );
}
```

#### `useTwTheme()`

Hook to access and update the active theme at runtime.

```tsx
import { useTwTheme, createTwTheme } from 'twx-react';

const darkTheme = createTwTheme({
  colors: {
    primary: 'oklch(0.7 0.15 240)',
    surface: 'oklch(0.15 0 0)',
  },
});

function ThemeToggle() {
  const { theme, setTheme } = useTwTheme();

  return (
    <button onClick={() => setTheme(darkTheme)}>
      Switch to Dark
    </button>
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
  ThemeTokens,
  TwTheme,
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
| Theme system | Yes | No | No | Yes |
| Polymorphic `as` | Yes | No | No | Yes |
| React hooks | Yes | No | No | No |
| Bundle (min+gz) | ~16KB | ~3KB* | ~1KB* | ~8KB |

\* Tailwind Variants and CVA require the Tailwind CSS build toolchain separately.

---

## License

MIT
