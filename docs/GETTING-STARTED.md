# Getting Started with twx-react

twx-react is a runtime-first styling library for React. It lets you build UI with Tailwind-style classes while keeping the ergonomics of component composition, variants, and theme tokens.

## Installation

```bash
npm install twx-react react
```

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

## Create a reusable component

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

- Use `tw` for quick styling and third-party components.
- Use `createTwComponent` for reusable buttons, cards, badges, and similar primitives.
- Use `createTwSlots` when a UI needs multiple coordinated parts.
- Use `createTwCompound` when you want a family of related components.

## Next steps

- Review the examples in the examples folder.
- Read the API reference in the README.
- Use the runtime warning helpers when debugging unsupported classes.
