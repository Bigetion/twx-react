/**
 * Button Component Example
 *
 * Demonstrates createTwComponent with:
 * - Multiple variants (size, color, variant)
 * - Compound variants (conditional styling based on variant combinations)
 * - Default variants
 * - Polymorphic `as` prop (rendering as a link)
 * - Ref forwarding
 * - className override
 */

import React, { useRef } from 'react';
import { createTwComponent, tw } from 'twx-react';

// ─── Button Definition ────────────────────────────────────────────────────────

const Button = createTwComponent('button', {
  // Base classes always applied
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1',

  // Variant definitions — each key becomes an optional prop on the component
  variants: {
    size: {
      sm: 'text-sm px-3 py-1.5 gap-1.5',
      md: 'text-base px-4 py-2 gap-2',
      lg: 'text-lg px-6 py-3 gap-2.5',
    },
    color: {
      primary: 'focus:ring-blue-500/50',
      secondary: 'focus:ring-gray-500/50',
      danger: 'focus:ring-red-500/50',
    },
    variant: {
      solid: 'text-white border-transparent',
      outline: 'border-2 bg-transparent',
      ghost: 'border-transparent bg-transparent',
    },
  },

  // Compound variants — apply extra classes when multiple variant conditions match
  compoundVariants: [
    // Solid + Primary → blue background with shadow
    { variant: 'solid', color: 'primary', className: 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25' },
    // Solid + Secondary → gray background
    { variant: 'solid', color: 'secondary', className: 'bg-gray-600 hover:bg-gray-700' },
    // Solid + Danger → red background with shadow
    { variant: 'solid', color: 'danger', className: 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/25' },
    // Outline + Primary → blue border and text
    { variant: 'outline', color: 'primary', className: 'border-blue-600 text-blue-600 hover:bg-blue-50' },
    // Outline + Secondary → gray border and text
    { variant: 'outline', color: 'secondary', className: 'border-gray-300 text-gray-700 hover:bg-gray-50' },
    // Outline + Danger → red border and text
    { variant: 'outline', color: 'danger', className: 'border-red-600 text-red-600 hover:bg-red-50' },
    // Ghost + Primary → blue text
    { variant: 'ghost', color: 'primary', className: 'text-blue-600 hover:bg-blue-50' },
    // Ghost + Secondary → gray text
    { variant: 'ghost', color: 'secondary', className: 'text-gray-700 hover:bg-gray-100' },
    // Ghost + Danger → red text
    { variant: 'ghost', color: 'danger', className: 'text-red-600 hover:bg-red-50' },
  ],

  // Default variant values — used when the variant prop is not provided
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'solid',
  },
});

// ─── Usage Examples ───────────────────────────────────────────────────────────

export function ButtonExamples() {
  // Ref forwarding — access the underlying DOM element
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={tw('flex flex-col gap-6 p-8 items-start')}>
      {/* Basic usage with defaults (solid, primary, md) */}
      <Button>Default Button</Button>

      {/* Explicit variant props */}
      <Button size="lg" color="danger" variant="solid">
        Delete Account
      </Button>

      {/* Outline variant */}
      <Button variant="outline" color="secondary" size="sm">
        Cancel
      </Button>

      {/* Ghost variant */}
      <Button variant="ghost" color="primary">
        Learn More
      </Button>

      {/* Polymorphic `as` prop — renders as an anchor tag.
          TypeScript narrows props to the default element type; use type assertion
          or spread for the anchor-specific props. */}
      <Button as="a" {...{ href: '/dashboard' }} color="primary" variant="outline">
        Go to Dashboard
      </Button>

      {/* Ref forwarding — get a reference to the underlying button element */}
      <Button ref={buttonRef} onClick={() => buttonRef.current?.focus()}>
        Focusable Button
      </Button>

      {/* className override — append custom classes after variant classes */}
      <Button className="w-full uppercase tracking-wider">
        Full Width Custom Button
      </Button>

      {/* All sizes side by side */}
      <div className={tw('flex items-center gap-4')}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>
  );
}
