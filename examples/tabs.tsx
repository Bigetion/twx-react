/**
 * Tabs Compound Component Example
 *
 * Demonstrates createTwCompound with:
 * - Multiple related sub-components (Root, List, Tab, Panel)
 * - Variants on individual parts (active state on Tab)
 * - Custom element types per part (button for Tab)
 * - Rendering the compound components together
 */

import React, { useState } from 'react';
import { createTwCompound, tw } from 'twx-react';

// ─── Tabs Compound Definition ─────────────────────────────────────────────────

// createTwCompound builds a set of related React components from a single config.
// Each key becomes a component: Tabs.Root, Tabs.List, Tabs.Tab, Tabs.Panel
const Tabs = createTwCompound({
  Root: {
    // The Root container wraps the entire tabs structure
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
    // The tab list holds all the tab triggers
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
    // Individual tab trigger — uses a button element by default
    element: 'button',
    base: 'px-4 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap',
    variants: {
      active: {
        true: 'border-b-2 border-blue-500 text-blue-600',
        false: 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300',
      },
    },
    defaultVariants: { active: 'false' },
  },

  Panel: {
    // The content panel shown for the active tab
    base: 'p-4 focus:outline-none',
    variants: {
      hidden: {
        true: 'hidden',
        false: 'block',
      },
    },
    defaultVariants: { hidden: 'false' },
  },
});

// ─── Stateful Tabs Component ──────────────────────────────────────────────────

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsContainerProps {
  tabs: TabItem[];
  defaultTab?: string;
}

export function TabsContainer({ tabs, defaultTab }: TabsContainerProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);

  return (
    <Tabs.Root>
      <Tabs.List>
        {tabs.map((tab) => (
          <Tabs.Tab
            key={tab.id}
            active={activeTab === tab.id ? 'true' : 'false'}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Panel
          key={tab.id}
          hidden={activeTab === tab.id ? 'false' : 'true'}
          role="tabpanel"
        >
          {tab.content}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}

// ─── Usage Examples ───────────────────────────────────────────────────────────

export function TabsExamples() {
  return (
    <div className={tw('p-8 max-w-2xl')}>
      {/* Basic tabs usage */}
      <TabsContainer
        tabs={[
          {
            id: 'overview',
            label: 'Overview',
            content: <p>This is the overview panel content.</p>,
          },
          {
            id: 'features',
            label: 'Features',
            content: (
              <ul className={tw('list-disc pl-4 space-y-1')}>
                <li>Variant-based styling</li>
                <li>Compound components</li>
                <li>Theme support</li>
              </ul>
            ),
          },
          {
            id: 'docs',
            label: 'Documentation',
            content: <p>Read the full documentation for detailed API reference.</p>,
          },
        ]}
      />

      {/* Direct compound component usage (no wrapper) */}
      <div className={tw('mt-8')}>
        <h2 className={tw('text-lg font-bold mb-4')}>Direct Usage</h2>
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Tab active="true">Active Tab</Tabs.Tab>
            <Tabs.Tab>Inactive Tab</Tabs.Tab>
            <Tabs.Tab>Another Tab</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel>
            <p>Compound components can be used directly without a wrapper.</p>
          </Tabs.Panel>
        </Tabs.Root>
      </div>

      {/* Vertical orientation */}
      <div className={tw('mt-8')}>
        <h2 className={tw('text-lg font-bold mb-4')}>Vertical Tabs</h2>
        <Tabs.Root orientation="vertical">
          <Tabs.List orientation="vertical">
            <Tabs.Tab active="true">Settings</Tabs.Tab>
            <Tabs.Tab>Profile</Tabs.Tab>
            <Tabs.Tab>Notifications</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel>
            <p>Content for the vertical tab layout.</p>
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </div>
  );
}
