import React, { useState } from 'react';
import { ButtonExamples } from '../../examples/button';
import { CardExamples } from '../../examples/card';
import { TabsExamples } from '../../examples/tabs';
import { ThemeSwitchingApp } from '../../examples/theme-switching';
import { TypeScriptExamples } from '../../examples/typescript-usage';

const tabs = [
  { id: 'button', label: 'Button', component: ButtonExamples },
  { id: 'card', label: 'Card', component: CardExamples },
  { id: 'tabs', label: 'Tabs', component: TabsExamples },
  { id: 'theme', label: 'Theme Switching', component: ThemeSwitchingApp },
  { id: 'typescript', label: 'TypeScript', component: TypeScriptExamples },
] as const;

export function App() {
  const [activeTab, setActiveTab] = useState<string>('button');

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component ?? ButtonExamples;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={navStyle}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginRight: '2rem' }}>
          twx-react
        </h1>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={activeTab === tab.id ? activeTabStyle : tabStyle}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <ActiveComponent />
      </main>
    </div>
  );
}

// ─── Inline Styles ────────────────────────────────────────────────────────────

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.75rem 2rem',
  borderBottom: '1px solid #e5e7eb',
  background: '#ffffff',
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

const tabStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  border: 'none',
  background: 'transparent',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#6b7280',
  transition: 'all 150ms',
};

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  background: '#eff6ff',
  color: '#2563eb',
};
