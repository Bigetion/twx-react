/**
 * Card Component Example
 *
 * Demonstrates createTwSlots with:
 * - Multi-part slots (root, header, body, footer)
 * - Shared variants that affect multiple slots
 * - Compound variants for slot-specific conditional styling
 * - Using the slots function inside a React component
 */

import React from 'react';
import { createTwSlots, tw } from 'twx-react';

// ─── Card Slots Definition ────────────────────────────────────────────────────

// createTwSlots produces a function (not a component).
// You call it with variant props and it returns a className for each slot.
const card = createTwSlots({
  // Base classes for each slot — always applied
  slots: {
    root: 'rounded-xl border border-gray-200 bg-white overflow-hidden',
    header: 'px-6 py-4 border-b border-gray-100',
    body: 'px-6 py-4',
    footer: 'px-6 py-4 border-t border-gray-100 bg-gray-50',
  },

  // Variants that can affect any combination of slots
  variants: {
    size: {
      sm: {
        root: 'text-sm',
        header: 'px-4 py-3',
        body: 'px-4 py-3',
        footer: 'px-4 py-3',
      },
      md: {
        root: 'text-base',
        header: 'px-6 py-4',
        body: 'px-6 py-4',
        footer: 'px-6 py-4',
      },
      lg: {
        root: 'text-lg',
        header: 'px-8 py-5',
        body: 'px-8 py-6',
        footer: 'px-8 py-5',
      },
    },
    elevated: {
      true: {
        root: 'shadow-lg border-transparent',
      },
      false: {},
    },
  },

  // Compound variants — apply extra slot classes when conditions match
  compoundVariants: [
    {
      size: 'lg',
      elevated: 'true',
      class: {
        root: 'shadow-xl',
      },
    },
  ],

  // Defaults when variant props are not provided
  defaultVariants: {
    size: 'md',
    elevated: 'false',
  },
});

// ─── Card Component ───────────────────────────────────────────────────────────

// Build a React component using the slots function
interface CardProps {
  size?: 'sm' | 'md' | 'lg';
  elevated?: boolean;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({ size, elevated, title, children, footer }: CardProps) {
  // Call the slots function with variant props to get per-slot classNames
  const styles = card({
    size,
    elevated: elevated ? 'true' : 'false',
  });

  return (
    <div className={styles.root}>
      {title && (
        <div className={styles.header}>
          <h3 className={tw('font-semibold')}>{title}</h3>
        </div>
      )}
      <div className={styles.body}>
        {children}
      </div>
      {footer && (
        <div className={styles.footer}>
          {footer}
        </div>
      )}
    </div>
  );
}

// ─── Usage Examples ───────────────────────────────────────────────────────────

export function CardExamples() {
  return (
    <div className={tw('flex flex-col gap-6 p-8 max-w-lg')}>
      {/* Default card */}
      <Card title="Default Card">
        <p>This card uses the default size (md) and no elevation.</p>
      </Card>

      {/* Small card with elevation */}
      <Card size="sm" elevated title="Compact Elevated Card">
        <p>A compact card with a drop shadow.</p>
      </Card>

      {/* Large card with footer */}
      <Card
        size="lg"
        elevated
        title="Premium Feature"
        footer={
          <div className={tw('flex justify-end gap-2')}>
            <button className={tw('px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors')}>Cancel</button>
            <button className={tw('px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors')}>Confirm</button>
          </div>
        }
      >
        <p>A large elevated card with a footer section for actions.</p>
      </Card>

      {/* Direct slots usage without a wrapper component */}
      <DirectSlotsUsage />
    </div>
  );
}

// Demonstrating direct slots usage without building a component
function DirectSlotsUsage() {
  // You can call the slots function directly in any component
  const styles = card({ size: 'md', elevated: 'true' });

  return (
    <article className={styles.root}>
      <header className={styles.header}>
        <h2 className={tw('font-bold text-xl')}>Direct Slots</h2>
      </header>
      <section className={styles.body}>
        <p>You can use the slots function directly without a wrapper component.</p>
        <p>Each slot returns its resolved className string.</p>
      </section>
      <footer className={styles.footer}>
        <span className={tw('text-sm text-gray-500')}>Posted just now</span>
      </footer>
    </article>
  );
}
