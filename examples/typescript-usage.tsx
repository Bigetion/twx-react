/**
 * TypeScript Usage Examples
 *
 * Demonstrates type inference and type safety features:
 * - InferVariantProps — extracting variant types from an existing component
 * - Typed variant props — type-safe variant selection
 * - Type-safe compound variants — ensuring valid compound conditions
 * - VariantPropsOf utility types
 */

import React from 'react';
import { createTwComponent, createTwCompound, tw } from 'twx-react';
import type { InferVariantProps, InferComponentProps, VariantPropsOf, TwComponentConfig } from 'twx-react';

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Explicit Config Types — Type-safe variant definitions
// ═══════════════════════════════════════════════════════════════════════════════

// Define a config object with explicit typing to get full IntelliSense
const badgeConfig = {
  base: 'inline-flex items-center rounded-full font-medium',
  variants: {
    size: {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    },
    color: {
      gray: 'bg-gray-100 text-gray-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
    },
    rounded: {
      full: 'rounded-full',
      md: 'rounded-md',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'gray',
    rounded: 'full',
  },
} satisfies TwComponentConfig;

const Badge = createTwComponent('span', badgeConfig);

// ─── VariantPropsOf — Extract variant types from a config ─────────────────────

// VariantPropsOf extracts variant props from the config type:
// Result: { size?: "sm" | "md" | "lg"; color?: "gray" | "blue" | ... ; rounded?: "full" | "md" }
type BadgeVariants = VariantPropsOf<typeof badgeConfig>;

// Use the extracted type in helper functions
function renderBadge(variants: BadgeVariants, label: string) {
  return <Badge size={variants.size} color={variants.color} rounded={variants.rounded}>{label}</Badge>;
}

// ─── InferVariantProps — Extract from a component instance ────────────────────

// InferVariantProps works with the TwComponent type itself.
// This is useful when you receive a component as a prop and need its variant types.
type _BadgeVariantsFromComponent = InferVariantProps<typeof Badge>;

// ─── InferComponentProps — Full props extraction ──────────────────────────────

// InferComponentProps gives you everything: variants + HTML attrs + className + as
type _BadgeAllProps = InferComponentProps<typeof Badge>;

// Wrapper components can accept the full props type
function BadgeWrapper({ children, ...props }: { children?: React.ReactNode } & BadgeVariants) {
  return <Badge size={props.size} color={props.color} rounded={props.rounded}>{children}</Badge>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Typed Variant Props — Compile-time enforcement
// ═══════════════════════════════════════════════════════════════════════════════

const Alert = createTwComponent('div', {
  base: 'p-4 rounded-lg border',
  variants: {
    severity: {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      success: 'bg-green-50 border-green-200 text-green-800',
    },
    dismissible: {
      true: 'pr-12',
      false: '',
    },
  },
  defaultVariants: {
    severity: 'info',
    dismissible: 'false',
  },
});

// TypeScript ensures only valid variant values are passed:
function TypeSafeAlerts() {
  return (
    <div className={tw('space-y-4')}>
      {/* Valid — severity is one of: info, warning, error, success */}
      <Alert severity="info">Information message</Alert>
      <Alert severity="error" dismissible="true">Error with dismiss</Alert>

      {/* The following would produce a TypeScript error (if uncommented):
          <Alert severity="critical">Invalid</Alert>
          "critical" is not assignable to "info" | "warning" | "error" | "success"
      */}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Type-Safe Compound Variants
// ═══════════════════════════════════════════════════════════════════════════════

const Input = createTwComponent('input', {
  base: 'block w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2',
  variants: {
    size: {
      sm: 'text-sm px-2 py-1',
      md: 'text-base px-3 py-2',
      lg: 'text-lg px-4 py-3',
    },
    state: {
      default: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
      error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
      success: 'border-green-300 focus:ring-green-500 focus:border-green-500',
      disabled: 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60',
    },
  },
  // Compound variants combine multiple conditions safely
  compoundVariants: [
    { size: 'lg', state: 'error', className: 'ring-2 ring-red-100' },
    { size: 'lg', state: 'success', className: 'ring-2 ring-green-100' },
  ],
  defaultVariants: {
    size: 'md',
    state: 'default',
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Typed Compound Components
// ═══════════════════════════════════════════════════════════════════════════════

const FormField = createTwCompound({
  Root: {
    base: 'flex flex-col gap-1.5',
  },
  Label: {
    element: 'label',
    base: 'text-sm font-medium',
    variants: {
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
        false: '',
      },
    },
    defaultVariants: { required: 'false' },
  },
  Input: {
    element: 'input',
    base: 'block w-full rounded-md border border-gray-300 px-3 py-2',
    variants: {
      error: {
        true: 'border-red-300 focus:ring-red-500',
        false: 'focus:ring-blue-500',
      },
    },
    defaultVariants: { error: 'false' },
  },
  HelpText: {
    base: 'text-xs',
    variants: {
      error: {
        true: 'text-red-600',
        false: 'text-gray-500',
      },
    },
    defaultVariants: { error: 'false' },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Generic Component Pattern — Reusing variant types across components
// ═══════════════════════════════════════════════════════════════════════════════

// Define a shared variant type and reuse it
type Size = 'sm' | 'md' | 'lg';
type Color = 'primary' | 'secondary' | 'neutral';

// Use an interface to document the expected variant contract
interface SharedVariantProps {
  size?: Size;
  color?: Color;
}

// Multiple components can share the same variant contract
const Chip = createTwComponent('span', {
  base: 'inline-flex items-center rounded-full',
  variants: {
    size: {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-3 py-1',
      lg: 'text-base px-4 py-1.5',
    },
    color: {
      primary: 'bg-blue-100 text-blue-700',
      secondary: 'bg-purple-100 text-purple-700',
      neutral: 'bg-gray-100 text-gray-700',
    },
  },
  defaultVariants: { size: 'md', color: 'neutral' },
});

// The Tag component shares the same variant shape as Chip
const Tag = createTwComponent('span', {
  base: 'inline-flex items-center border',
  variants: {
    size: {
      sm: 'text-xs px-1.5 py-0.5 rounded',
      md: 'text-sm px-2 py-0.5 rounded-md',
      lg: 'text-base px-3 py-1 rounded-lg',
    },
    color: {
      primary: 'border-blue-300 text-blue-700 bg-blue-50',
      secondary: 'border-purple-300 text-purple-700 bg-purple-50',
      neutral: 'border-gray-300 text-gray-700 bg-gray-50',
    },
  },
  defaultVariants: { size: 'md', color: 'neutral' },
});

// A helper that works with any component following the SharedVariantProps contract
function renderWithVariants(props: SharedVariantProps) {
  return (
    <div className={tw('flex gap-2')}>
      <Chip size={props.size} color={props.color}>Chip</Chip>
      <Tag size={props.size} color={props.color}>Tag</Tag>
    </div>
  );
}

// ─── Full Example Render ──────────────────────────────────────────────────────

export function TypeScriptExamples() {
  return (
    <div className={tw('space-y-8 p-8 max-w-lg')}>
      {/* VariantPropsOf usage */}
      <section>
        <h2 className={tw('text-lg font-bold mb-3')}>VariantPropsOf / InferVariantProps</h2>
        <div className={tw('flex gap-2 flex-wrap')}>
          {renderBadge({ size: 'sm', color: 'blue' }, 'Small Blue')}
          {renderBadge({ size: 'lg', color: 'green' }, 'Large Green')}
          <BadgeWrapper size="md" color="red">Wrapper</BadgeWrapper>
        </div>
      </section>

      {/* Type-safe alerts */}
      <section>
        <h2 className={tw('text-lg font-bold mb-3')}>Type-Safe Variants</h2>
        <TypeSafeAlerts />
      </section>

      {/* Input states */}
      <section>
        <h2 className={tw('text-lg font-bold mb-3')}>Compound Variant Input</h2>
        <div className={tw('space-y-3')}>
          <Input placeholder="Default input" />
          <Input state="error" placeholder="Error state" />
          <Input size="lg" state="success" placeholder="Large success" />
          <Input state="disabled" disabled placeholder="Disabled" />
        </div>
      </section>

      {/* Typed compound components */}
      <section>
        <h2 className={tw('text-lg font-bold mb-3')}>Typed Compound FormField</h2>
        <FormField.Root>
          <FormField.Label required="true">Email Address</FormField.Label>
          <FormField.Input type="email" placeholder="you@example.com" />
          <FormField.HelpText>We'll never share your email.</FormField.HelpText>
        </FormField.Root>

        <FormField.Root className={tw('mt-4')}>
          <FormField.Label required="true">Password</FormField.Label>
          <FormField.Input type="password" error="true" placeholder="••••••••" />
          <FormField.HelpText error="true">Password is too short.</FormField.HelpText>
        </FormField.Root>
      </section>

      {/* Shared variant types */}
      <section>
        <h2 className={tw('text-lg font-bold mb-3')}>Shared Variant Types</h2>
        <div className={tw('flex gap-2 flex-wrap')}>
          <Chip size="sm" color="primary">Primary SM</Chip>
          <Chip size="md" color="secondary">Secondary MD</Chip>
          <Chip size="lg" color="neutral">Neutral LG</Chip>
        </div>
        <div className={tw('mt-3')}>
          {renderWithVariants({ size: 'md', color: 'primary' })}
        </div>
      </section>
    </div>
  );
}
