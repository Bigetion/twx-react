# TWX-React API Reference

> Complete API documentation for twx-react v1.0.0 — a pure React styling library providing component-first APIs for Tailwind CSS runtime generation.

---

## Table of Contents

- [createTwComponent](#createtwcomponent)
- [createTwSlots](#createtwslots)
- [createTwCompound](#createtwcompound)
- [useTwVariants](#usetwvariants)
- [useTwSlots](#usetwslots)
- [createTwTheme](#createtwtheme)
- [TwThemeProvider](#twthemeprovider)
- [useTwTheme](#usetwtheme)
- [Exported Types](#exported-types)
- [Package Metadata](#package-metadata)
- [Internal Modules (Not Exported)](#internal-modules-not-exported)

---

## createTwComponent

Creates a styled React component with full variant support, CSS injection, polymorphic `as` prop, and ref forwarding.

### Signature

```ts
function createTwComponent<T extends ElementTag, C extends TwComponentConfig>(
  element: T,
  config: C
): TwComponent<T, C>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `element` | `ElementTag` | The default HTML tag (e.g. `'button'`, `'div'`) or a React component |
| `config` | `TwComponentConfig` | Variant configuration object |

### Config Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `base` | `string` | No | Base Tailwind classes always applied to the component |
| `variants` | `Record<string, Record<string, string>>` | No | Variant definitions mapping variant names to value→class pairs |
| `compoundVariants` | `Array<{ [key]: string; className?: string; class?: string }>` | No | Entries that apply classes when multiple variant conditions match |
| `defaultVariants` | `Record<string, string>` | No | Default variant values used when a prop is not provided |

### Returns

`TwComponent<T, C>` — A `React.ForwardRefExoticComponent` with:
- Variant props (one optional prop per variant key)
- `className` prop for user overrides (appended after variant classes)
- `as` prop for polymorphic element swapping
- Ref forwarding to the underlying DOM element
- All native HTML attributes of the default element

### Features

- **Polymorphic `as` prop** — Swap the rendered element at runtime
- **Ref forwarding** — Pass refs directly to the underlying DOM node
- **className merging** — User `className` is appended after resolved variant classes
- **CSS injection** — Tailwind utilities are parsed and injected into the DOM automatically
- **Compound variants** — Apply extra classes when multiple variant conditions are met simultaneously

### Examples

#### Basic Button Component

```tsx
import { createTwComponent } from 'twx-react';

const Button = createTwComponent('button', {
  base: 'px-4 py-2 rounded-lg font-medium transition-all cursor-pointer',
  variants: {
    variant: {
      solid: 'text-white',
      outline: 'border-2 bg-transparent',
      ghost: 'bg-transparent hover:bg-gray-100',
    },
    color: {
      primary: 'bg-blue-600 hover:bg-blue-700',
      danger: 'bg-red-600 hover:bg-red-700',
      neutral: 'bg-gray-600 hover:bg-gray-700',
    },
    size: {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
  },
  compoundVariants: [
    { variant: 'solid', color: 'primary', className: 'shadow-lg shadow-blue-500/25' },
    { variant: 'outline', color: 'primary', className: 'border-blue-600 text-blue-600' },
    { variant: 'outline', color: 'danger', className: 'border-red-600 text-red-600' },
  ],
  defaultVariants: { variant: 'solid', color: 'primary', size: 'md' },
});

// Usage
<Button>Default Button</Button>
<Button color="danger" size="lg">Delete</Button>
<Button variant="outline" color="primary">Outline</Button>
```

#### Polymorphic Link Button

```tsx
// Render as an anchor tag while keeping button styles
<Button as="a" href="/dashboard">
  Go to Dashboard
</Button>

// Render as a React Router Link
import { Link } from 'react-router-dom';
<Button as={Link} to="/settings">
  Settings
</Button>
```

#### Input Component with Ref

```tsx
import { createTwComponent } from 'twx-react';
import { useRef } from 'react';

const Input = createTwComponent('input', {
  base: 'border rounded-md px-3 py-2 outline-none transition-all',
  variants: {
    variant: {
      default: 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
      error: 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200',
    },
    size: {
      sm: 'text-sm px-2 py-1',
      md: 'text-base px-3 py-2',
      lg: 'text-lg px-4 py-3',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

function SearchForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  return <Input ref={inputRef} placeholder="Search..." variant="default" />;
}
```

---

## createTwSlots

Creates a function that resolves per-slot class names from a shared variant configuration. Ideal for multi-part components like cards, modals, and dialogs.

### Signature

```ts
function createTwSlots<S extends Record<string, string>>(
  config: TwSlotsConfig<S>
): TwSlotsFunction<S>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `TwSlotsConfig<S>` | Slots configuration with base classes, variants, and compound variants |

### Config Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `slots` | `Record<string, string>` | Yes | Base class strings keyed by slot name |
| `variants` | `Record<string, Record<string, Partial<Record<slotName, string>>>>` | No | Per-slot variant overrides |
| `compoundVariants` | `Array<{ [conditions]; class?: Partial<Record<slotName, string>> }>` | No | Per-slot classes applied when multiple conditions match |
| `defaultVariants` | `Record<string, string>` | No | Fallback variant values |

### Returns

`TwSlotsFunction<S>` — A function with signature:

```ts
(props?: Record<string, string | undefined>) => Record<keyof S, string>
```

Call it with optional variant props to get an object mapping each slot name to its resolved className string.

### Examples

#### Card Component with Slots

```tsx
import { createTwSlots } from 'twx-react';

const card = createTwSlots({
  slots: {
    root: 'rounded-lg border bg-white',
    header: 'px-6 py-4 border-b font-semibold',
    body: 'px-6 py-4',
    footer: 'px-6 py-4 border-t',
  },
  variants: {
    size: {
      sm: { root: 'text-sm', header: 'px-4 py-3', body: 'px-4 py-3', footer: 'px-4 py-3' },
      md: { root: 'text-base', header: 'px-6 py-4', body: 'px-6 py-4', footer: 'px-6 py-4' },
      lg: { root: 'text-lg', header: 'px-8 py-5', body: 'px-8 py-5', footer: 'px-8 py-5' },
    },
    shadow: {
      none: {},
      sm: { root: 'shadow-sm' },
      md: { root: 'shadow-md' },
      lg: { root: 'shadow-lg' },
    },
  },
  compoundVariants: [
    { size: 'lg', shadow: 'lg', class: { root: 'ring-1 ring-gray-200' } },
  ],
  defaultVariants: { size: 'md', shadow: 'sm' },
});

// Usage
function Card({ title, children, footer, size, shadow }) {
  const slots = card({ size, shadow });

  return (
    <div className={slots.root}>
      <div className={slots.header}>{title}</div>
      <div className={slots.body}>{children}</div>
      {footer && <div className={slots.footer}>{footer}</div>}
    </div>
  );
}

// Render
<Card title="Welcome" size="lg" shadow="lg">
  Card content goes here.
</Card>
```

#### Accessing Individual Slots

```ts
const classes = card({ size: 'sm' });

classes.root;   // "rounded-lg border bg-white text-sm shadow-sm"
classes.header; // "px-6 py-4 border-b font-semibold px-4 py-3"
classes.body;   // "px-6 py-4 px-4 py-3"
classes.footer; // "px-6 py-4 border-t px-4 py-3"
```

---

## createTwCompound

Creates a set of related React components from a single configuration object. Each key in the config becomes a React component on the returned object, with full variant support, polymorphic `as` prop, and ref forwarding.

Internally each part is built with `createTwComponent`, so every feature available there is available per-component.

### Signature

```ts
function createTwCompound<C extends CompoundConfig>(
  config: C
): TwCompoundComponents<C>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `CompoundConfig` | Record mapping part names to individual component configs |

### CompoundPartConfig (per-part)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `element` | `ElementTag` | No | Default HTML tag or React component (defaults to `'div'`) |
| `base` | `string` | No | Base Tailwind classes always applied |
| `variants` | `Record<string, Record<string, string>>` | No | Variant definitions |
| `compoundVariants` | `Array<{ [conditions]; class?: string; className?: string }>` | No | Compound variant entries |
| `defaultVariants` | `Record<string, string>` | No | Default variant values |

### Returns

`TwCompoundComponents<C>` — An object where each key is a part name and each value is a `ForwardRefExoticComponent` with:
- Variant props from that part's config
- `as` prop for polymorphic rendering
- `className` for user overrides
- Ref forwarding
- Native HTML attributes for the part's element

### Examples

#### Tabs Compound Component

```tsx
import { createTwCompound } from 'twx-react';

const Tabs = createTwCompound({
  Root: {
    base: 'flex flex-col w-full',
    variants: {
      orientation: {
        horizontal: '',
        vertical: 'flex-row',
      },
    },
    defaultVariants: { orientation: 'horizontal' },
  },
  List: {
    element: 'nav',
    base: 'flex border-b border-gray-200',
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col border-b-0 border-r',
      },
    },
    defaultVariants: { orientation: 'horizontal' },
  },
  Tab: {
    element: 'button',
    base: 'px-4 py-2 text-sm font-medium cursor-pointer transition-colors',
    variants: {
      active: {
        true: 'border-b-2 border-blue-500 text-blue-600',
        false: 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
      },
    },
    defaultVariants: { active: 'false' },
  },
  Panel: {
    base: 'p-4',
    variants: {
      hidden: {
        true: 'hidden',
        false: 'block',
      },
    },
    defaultVariants: { hidden: 'false' },
  },
});

// Usage
function TabsExample() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Tabs.Root>
      <Tabs.List>
        <Tabs.Tab active={activeTab === 0 ? 'true' : 'false'} onClick={() => setActiveTab(0)}>
          Tab 1
        </Tabs.Tab>
        <Tabs.Tab active={activeTab === 1 ? 'true' : 'false'} onClick={() => setActiveTab(1)}>
          Tab 2
        </Tabs.Tab>
        <Tabs.Tab active={activeTab === 2 ? 'true' : 'false'} onClick={() => setActiveTab(2)}>
          Tab 3
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel hidden={activeTab !== 0 ? 'true' : 'false'}>Panel 1 content</Tabs.Panel>
      <Tabs.Panel hidden={activeTab !== 1 ? 'true' : 'false'}>Panel 2 content</Tabs.Panel>
      <Tabs.Panel hidden={activeTab !== 2 ? 'true' : 'false'}>Panel 3 content</Tabs.Panel>
    </Tabs.Root>
  );
}
```

#### Alert Compound Component

```tsx
const Alert = createTwCompound({
  Root: {
    base: 'flex items-start gap-3 p-4 rounded-lg border',
    variants: {
      severity: {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        success: 'bg-green-50 border-green-200 text-green-800',
      },
    },
    defaultVariants: { severity: 'info' },
  },
  Icon: {
    element: 'span',
    base: 'flex-shrink-0 mt-0.5',
  },
  Content: {
    base: 'flex-1',
  },
  Title: {
    element: 'h4',
    base: 'font-semibold mb-1',
  },
  Description: {
    element: 'p',
    base: 'text-sm opacity-90',
  },
});

// Usage
<Alert.Root severity="error">
  <Alert.Icon>⚠️</Alert.Icon>
  <Alert.Content>
    <Alert.Title>Error occurred</Alert.Title>
    <Alert.Description>Something went wrong. Please try again.</Alert.Description>
  </Alert.Content>
</Alert.Root>
```

---

## useTwVariants

React hook for dynamic variant resolution with automatic memoization. Useful when you need variant class resolution inside a custom component without using `createTwComponent`.

### Signature

```ts
function useTwVariants(
  config: TwComponentConfig,
  props?: Record<string, string | undefined>,
  deps?: React.DependencyList
): string
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | `TwComponentConfig` | Yes | Variant configuration (base, variants, compoundVariants, defaultVariants) |
| `props` | `Record<string, string \| undefined>` | No | Current variant prop values |
| `deps` | `React.DependencyList` | No | Custom dependency array for memoization |

### Returns

`string` — The resolved className string (base + active variant classes + compound variant classes).

### Memoization Behavior

- When `deps` is provided, the result is recomputed only when those deps change.
- When `deps` is omitted, the result is recomputed when any value in `props` changes (shallow comparison over prop values).
- Uses `React.useMemo` internally.

### Examples

#### Custom Button with useTwVariants

```tsx
import { useTwVariants } from 'twx-react';

interface ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ variant = 'solid', size = 'md', className, children, ...props }: ButtonProps) {
  const buttonClass = useTwVariants(
    {
      base: 'px-4 py-2 rounded-lg font-medium transition-all',
      variants: {
        variant: {
          solid: 'bg-blue-600 text-white hover:bg-blue-700',
          outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
          ghost: 'text-blue-600 hover:bg-blue-50',
        },
        size: {
          sm: 'text-sm px-3 py-1.5',
          md: 'text-base px-4 py-2',
          lg: 'text-lg px-6 py-3',
        },
      },
      defaultVariants: { variant: 'solid', size: 'md' },
    },
    { variant, size },
    [variant, size] // Custom deps for optimal memoization
  );

  return (
    <button className={`${buttonClass} ${className ?? ''}`} {...props}>
      {children}
    </button>
  );
}
```

#### Dynamic Badge Component

```tsx
import { useTwVariants } from 'twx-react';

function Badge({ status, label }) {
  const badgeClass = useTwVariants(
    {
      base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variants: {
        status: {
          active: 'bg-green-100 text-green-800',
          pending: 'bg-yellow-100 text-yellow-800',
          inactive: 'bg-gray-100 text-gray-800',
          error: 'bg-red-100 text-red-800',
        },
      },
    },
    { status }
  );

  return <span className={badgeClass}>{label}</span>;
}
```

---

## useTwSlots

React hook for dynamic per-slot class resolution with automatic memoization. The hook equivalent of `createTwSlots` for use inside custom components.

### Signature

```ts
function useTwSlots<S extends Record<string, string>>(
  config: TwSlotsConfig<S>,
  props?: Record<string, string | undefined>,
  deps?: React.DependencyList
): Record<keyof S, string>
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | `TwSlotsConfig<S>` | Yes | Slots configuration (slots, variants, compoundVariants, defaultVariants) |
| `props` | `Record<string, string \| undefined>` | No | Current variant prop values |
| `deps` | `React.DependencyList` | No | Custom dependency array for memoization |

### Returns

`Record<keyof S, string>` — An object mapping each slot name to its resolved className string.

### Memoization Behavior

- When `deps` is provided, the slots object is recomputed only when those deps change.
- When `deps` is omitted, the slots object is recomputed when any value in `props` changes.
- Uses `React.useMemo` internally.

### Examples

#### Custom Multi-Part Card

```tsx
import { useTwSlots } from 'twx-react';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  title: string;
  children: React.ReactNode;
}

function Card({ variant = 'default', size = 'md', title, children }: CardProps) {
  const slots = useTwSlots(
    {
      slots: {
        root: 'rounded-xl overflow-hidden',
        header: 'px-6 py-4 border-b',
        body: 'px-6 py-4',
      },
      variants: {
        variant: {
          default: { root: 'bg-white border shadow-sm' },
          elevated: { root: 'bg-white shadow-lg' },
          outlined: { root: 'bg-transparent border-2' },
        },
        size: {
          sm: { root: 'text-sm', header: 'px-4 py-3', body: 'px-4 py-3' },
          md: { root: 'text-base', header: 'px-6 py-4', body: 'px-6 py-4' },
          lg: { root: 'text-lg', header: 'px-8 py-5', body: 'px-8 py-5' },
        },
      },
      defaultVariants: { variant: 'default', size: 'md' },
    },
    { variant, size },
    [variant, size]
  );

  return (
    <div className={slots.root}>
      <div className={slots.header}>{title}</div>
      <div className={slots.body}>{children}</div>
    </div>
  );
}
```

#### Dialog with useTwSlots

```tsx
import { useTwSlots } from 'twx-react';

function Dialog({ open, size = 'md', children }) {
  const slots = useTwSlots(
    {
      slots: {
        overlay: 'fixed inset-0 bg-black/50 z-40',
        container: 'fixed inset-0 flex items-center justify-center z-50',
        panel: 'bg-white rounded-xl shadow-2xl',
      },
      variants: {
        size: {
          sm: { panel: 'max-w-sm w-full' },
          md: { panel: 'max-w-md w-full' },
          lg: { panel: 'max-w-lg w-full' },
          xl: { panel: 'max-w-xl w-full' },
        },
      },
      defaultVariants: { size: 'md' },
    },
    { size },
    [size]
  );

  if (!open) return null;

  return (
    <>
      <div className={slots.overlay} />
      <div className={slots.container}>
        <div className={slots.panel}>{children}</div>
      </div>
    </>
  );
}
```

---

## createTwTheme

Creates a theme object from design tokens, generating CSS variable declarations for each token.

### Signature

```ts
function createTwTheme(tokens: ThemeTokens): TwTheme
```

### Static Methods

```ts
createTwTheme.extend(tokens: ThemeTokens): TwTheme
```

Extends the default Tailwind v4 theme with custom tokens (deep-merged on top of defaults).

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `tokens` | `ThemeTokens` | Design token definitions (colors, spacing, fontSize, etc.) |

### ThemeTokens Properties

| Property | Type | Description |
|----------|------|-------------|
| `colors` | `ColorPalette` | Color palette with flat values or shade scales (OKLCH P3 recommended) |
| `spacing` | `Record<string, string>` | Spacing scale (e.g. `{ '4': '1rem' }`) |
| `fontSize` | `Record<string, string \| [string, { lineHeight?: string }]>` | Font size definitions with optional line-height |
| `borderRadius` | `Record<string, string>` | Border radius values |
| `boxShadow` | `Record<string, string>` | Box shadow definitions |
| `screens` | `Record<string, string>` | Responsive breakpoint min-widths |
| `containers` | `Record<string, string>` | Container query breakpoint widths |

### Returns

`TwTheme` — An object with:
- `tokens` — The original ThemeTokens input
- `cssVariables` — Generated CSS variable map (`Record<string, string>`)

### CSS Variable Naming

Variables follow the pattern `--twx-{category}-{key}`:
- `colors.primary` → `--twx-colors-primary`
- `colors.blue.500` → `--twx-colors-blue-500`
- `spacing.4` → `--twx-spacing-4`
- `fontSize.base` → `--twx-fontSize-base` (size value)
- `fontSize.base-line-height` → `--twx-fontSize-base-line-height` (for tuples)

### Exports

| Export | Type | Description |
|--------|------|-------------|
| `createTwTheme` | `function` | Theme factory function |
| `createTwTheme.extend` | `function` | Extend the default theme with custom tokens |
| `defaultTheme` | `TwTheme` | Pre-built default Tailwind v4 theme instance |
| `defaultTailwindTheme` | `ThemeTokens` | Raw default theme tokens (for inspection or custom merging) |

### Examples

#### Custom Theme from Scratch

```ts
import { createTwTheme } from 'twx-react';

const theme = createTwTheme({
  colors: {
    primary: 'oklch(0.6 0.15 240)',
    secondary: 'oklch(0.7 0.1 300)',
    neutral: {
      '50': 'oklch(0.98 0 0)',
      '100': 'oklch(0.96 0 0)',
      '200': 'oklch(0.92 0 0)',
      '300': 'oklch(0.87 0 0)',
      '400': 'oklch(0.7 0 0)',
      '500': 'oklch(0.55 0 0)',
      '600': 'oklch(0.45 0 0)',
      '700': 'oklch(0.37 0 0)',
      '800': 'oklch(0.27 0 0)',
      '900': 'oklch(0.2 0 0)',
      '950': 'oklch(0.12 0 0)',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
});

// theme.cssVariables:
// {
//   '--twx-colors-primary': 'oklch(0.6 0.15 240)',
//   '--twx-colors-secondary': 'oklch(0.7 0.1 300)',
//   '--twx-colors-neutral-50': 'oklch(0.98 0 0)',
//   ...
//   '--twx-spacing-xs': '0.25rem',
//   ...
// }
```

#### Extending the Default Theme

```ts
import { createTwTheme } from 'twx-react';

const customTheme = createTwTheme.extend({
  colors: {
    brand: 'oklch(0.6 0.2 300)',
    accent: 'oklch(0.7 0.18 150)',
  },
  spacing: {
    '18': '4.5rem',
    '22': '5.5rem',
  },
});
// Includes ALL default Tailwind v4 tokens + your custom additions
```

#### Using the Default Theme Directly

```ts
import { defaultTheme } from 'twx-react';

// defaultTheme includes:
// - Full OKLCH P3 color palette (slate, gray, zinc, red, orange, yellow, green, blue, etc.)
// - Complete spacing scale (0–96)
// - Font sizes (xs through 9xl with line-heights)
// - Border radius values
// - Box shadow values
// - Responsive breakpoints (sm, md, lg, xl, 2xl)
// - Container query breakpoints
```

---

## TwThemeProvider

React Context provider component that injects theme CSS variables into the DOM and makes the theme available to descendant components via context.

### Signature

```tsx
function TwThemeProvider(props: TwThemeProviderProps): React.ReactElement
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `theme` | `TwTheme` | Yes | The theme object to inject and expose (produced by `createTwTheme`) |
| `children` | `React.ReactNode` | Yes | Child elements that can consume the theme context |

### Behavior

- Injects the theme's CSS variables into the DOM as a `<style>` block targeting `:root`
- Re-injects CSS variables automatically when the `theme` prop changes (dynamic theme switching)
- Exposes both the current theme and a `setTheme` function via React context
- SSR-safe: no-op when `document` is not available
- Uses a dedicated `<style id="twx-react-theme">` tag, separate from utility CSS injection

### Examples

#### Basic App Wrapping

```tsx
import { TwThemeProvider, createTwTheme } from 'twx-react';

const lightTheme = createTwTheme({
  colors: {
    primary: 'oklch(0.6 0.15 240)',
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.15 0 0)',
  },
});

function App() {
  return (
    <TwThemeProvider theme={lightTheme}>
      <MainLayout />
    </TwThemeProvider>
  );
}
```

#### Controlled Theme Switching

```tsx
import { TwThemeProvider, createTwTheme } from 'twx-react';
import { useState } from 'react';

const lightTheme = createTwTheme({
  colors: { primary: 'oklch(0.6 0.15 240)', background: '#ffffff' },
});

const darkTheme = createTwTheme({
  colors: { primary: 'oklch(0.7 0.15 240)', background: '#1a1a2e' },
});

function App() {
  const [theme, setTheme] = useState(lightTheme);

  return (
    <TwThemeProvider theme={theme}>
      <button onClick={() => setTheme(theme === lightTheme ? darkTheme : lightTheme)}>
        Toggle Theme
      </button>
      <MainLayout />
    </TwThemeProvider>
  );
}
```

---

## useTwTheme

React hook for accessing the theme context. Returns the current theme and a setter function for runtime theme updates.

### Signature

```ts
function useTwTheme(): TwThemeContext
```

### Parameters

None.

### Returns

`TwThemeContext` — An object with:

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `TwTheme` | The currently active theme object |
| `setTheme` | `(theme: TwTheme) => void` | Function to update the active theme at runtime |

### Throws

`Error` — When used outside of a `<TwThemeProvider>` component tree.

### Examples

#### Theme Switching Toggle

```tsx
import { useTwTheme, createTwTheme } from 'twx-react';

const darkTheme = createTwTheme({
  colors: { primary: 'oklch(0.7 0.15 240)', background: '#1a1a2e' },
});

const lightTheme = createTwTheme({
  colors: { primary: 'oklch(0.6 0.15 240)', background: '#ffffff' },
});

function ThemeToggle() {
  const { theme, setTheme } = useTwTheme();

  const isDark = theme === darkTheme;

  return (
    <button onClick={() => setTheme(isDark ? lightTheme : darkTheme)}>
      Switch to {isDark ? 'Light' : 'Dark'} Mode
    </button>
  );
}
```

#### Reading Theme Tokens

```tsx
import { useTwTheme } from 'twx-react';

function ThemeInfo() {
  const { theme } = useTwTheme();

  return (
    <div>
      <p>Primary color: {theme.tokens.colors?.primary}</p>
      <p>CSS variables generated: {Object.keys(theme.cssVariables).length}</p>
    </div>
  );
}
```

#### Programmatic Theme from User Preferences

```tsx
import { useTwTheme, createTwTheme } from 'twx-react';

function ColorPicker() {
  const { setTheme } = useTwTheme();

  const handleColorChange = (color: string) => {
    const newTheme = createTwTheme.extend({
      colors: { primary: color },
    });
    setTheme(newTheme);
  };

  return (
    <input
      type="color"
      onChange={(e) => handleColorChange(e.target.value)}
    />
  );
}
```

---

## Exported Types

All TypeScript types are exported from the main `twx-react` entry point.

### Component Types

| Type | Source | Description |
|------|--------|-------------|
| `TwComponentConfig` | `component.ts` | Configuration object for `createTwComponent` (base, variants, compoundVariants, defaultVariants) |
| `TwComponentProps<T, C>` | `component.ts` | Full props type for a created component (variant props + element attrs + as + className) |
| `TwComponent<T, C>` | `component.ts` | Return type of `createTwComponent` (ForwardRefExoticComponent) |
| `PropsOf<T>` | `component.ts` | Extract props from an ElementType (excluding ref) |
| `AsProp<T>` | `component.ts` | The polymorphic `as` prop type |
| `PolymorphicComponentProps<T, Props>` | `component.ts` | Combined polymorphic props type for custom wrappers |

### Variant Types

| Type | Source | Description |
|------|--------|-------------|
| `VariantsConfig` | `variants.ts` | Variant schema mapping variant names to value→class pairs |
| `VariantProps<V>` | `variants.ts` | Extracts optional variant props from a variants schema |
| `CompoundVariant` | `variants.ts` | A compound variant entry with conditions and `class` key |

### Slots Types

| Type | Source | Description |
|------|--------|-------------|
| `TwSlotsConfig` | `createTwSlots.ts` | Full slots configuration (slots, variants, compoundVariants, defaultVariants) |
| `TwSlotsFunction` | `createTwSlots.ts` | Return type of `createTwSlots` — function accepting props, returning slot classNames |
| `SlotsCompoundVariant` | `createTwSlots.ts` | Compound variant entry with per-slot class overrides |
| `SlotsCoreConfig` | `slots.ts` | Core slots config type (re-exported with alias) |
| `SlotsCoreFunction` | `slots.ts` | Core slots function type (re-exported with alias) |

### Compound Types

| Type | Source | Description |
|------|--------|-------------|
| `CompoundConfig` | `createTwCompound.ts` | Full compound component config (record of part configs) |
| `CompoundPartConfig` | `createTwCompound.ts` | Config for a single part (element, base, variants, etc.) |
| `TwCompoundComponents` | `createTwCompound.ts` | Return type of `createTwCompound` (object of ForwardRefExoticComponents) |
| `CompoundCoreConfig` | `compound.ts` | Core compound config type (re-exported with alias) |
| `CompoundCoreComponents` | `compound.ts` | Core compound components type (re-exported with alias) |

### Theme Types

| Type | Source | Description |
|------|--------|-------------|
| `ThemeTokens` | `theme.ts` | Design token definitions (colors, spacing, fontSize, etc.) |
| `TwTheme` | `theme.ts` | Theme object with `tokens` and `cssVariables` properties |
| `TwThemeProviderProps` | `theme.ts` | Props for the TwThemeProvider component |
| `TwThemeContext` | `theme.ts` | Context value type with `theme` and `setTheme` |

---

## Package Metadata

| Export | Type | Value | Description |
|--------|------|-------|-------------|
| `version` | `string` | `'1.0.0'` | Current package version |

```ts
import { version } from 'twx-react';
console.log(version); // "1.0.0"
```

---

## Internal Modules (Not Exported)

The following modules are internal implementation details and are **not** part of the public API. They should not be imported directly:

| Module | Path | Purpose |
|--------|------|---------|
| Parser | `src/internal/parser.ts` | Parses Tailwind class strings into structured tokens |
| Generator | `src/internal/generator.ts` | Generates CSS from parsed tokens |
| Injector | `src/internal/injector.ts` | Injects generated CSS into the DOM via `<style>` tags |
| Cache | `src/internal/cache.ts` | LRU cache for generated CSS (avoids redundant generation) |
| Variants Resolver | `src/internal/variantsResolver.ts` | Resolves active variants based on props and defaults |
| Builders | `src/internal/builders/*` | Individual CSS utility builders (spacing, sizing, colors, etc.) |

These modules may change between versions without notice. Always use the documented public APIs above.

---

## Quick Import Reference

```ts
// Component APIs
import { createTwComponent, createTwSlots, createTwCompound } from 'twx-react';

// Hooks
import { useTwVariants, useTwSlots } from 'twx-react';

// Theme
import { createTwTheme, TwThemeProvider, useTwTheme, defaultTheme } from 'twx-react';

// Types
import type {
  TwComponentConfig,
  TwComponent,
  TwSlotsConfig,
  TwSlotsFunction,
  CompoundConfig,
  TwCompoundComponents,
  ThemeTokens,
  TwTheme,
  VariantProps,
} from 'twx-react';

// Metadata
import { version } from 'twx-react';
```
