# Getting Started with twx-react

twx-react is a runtime-first styling library for React. It gives you Tailwind-style utilities with component composition, typed variants, and a compact runtime API.

## Installation

```bash
npm install twx-react react
```

## First example

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

## Reusable component pattern

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

## When to use which API

- Use `tw` for direct utility processing and class merging.
- Use `createTwComponent` for reusable primitives such as buttons and badges.
- Use `createTwSlots` for coordinated multi-part UI.
- Use `createTwCompound` for families of related components.

## Next steps

- Read the API overview in the README.
- Use `twMerge` when you need deterministic conflict resolution.
- Use `injectPreflight` or `disablePreflight` when you need explicit control over CSS reset behavior.
