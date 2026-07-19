import React, { useState } from 'react';
import { ButtonExamples } from '../../examples/button';
import { CardExamples } from '../../examples/card';
import { TabsExamples } from '../../examples/tabs';
import { ThemeSwitchingApp } from '../../examples/theme-switching';
import { TypeScriptExamples } from '../../examples/typescript-usage';
import { TwElementsExamples } from '../../examples/tw-elements';
import { ClassGroupingExamples } from '../../examples/class-grouping';

const tabs = [
  { id: 'tw-elements', label: 'tw.elements', component: TwElementsExamples },
  { id: 'grouping', label: 'Grouping ✨', component: ClassGroupingExamples },
  { id: 'button', label: 'Button', component: ButtonExamples },
  { id: 'card', label: 'Card', component: CardExamples },
  { id: 'tabs', label: 'Tabs', component: TabsExamples },
  { id: 'theme', label: 'Theme Switching', component: ThemeSwitchingApp },
  { id: 'typescript', label: 'TypeScript', component: TypeScriptExamples },
] as const;

export function App() {
  const [activeTab, setActiveTab] = useState<string>('tw-elements');

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component ?? TwElementsExamples;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2rem', height: '2rem', borderRadius: '0.65rem', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            tx
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>twx-react</h1>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Runtime-first UI styling for React</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
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

      <main style={{ flex: 1, padding: '2rem' }}>
        <section style={heroStyle}>
          <div>
            <span style={pillStyle}>New in 0.1.2</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.5rem 0', color: '#0f172a' }}>
              Build expressive React UI with Tailwind-style utilities and component composition.
            </h2>
            <p style={{ color: '#475569', margin: 0, maxWidth: '48rem', lineHeight: 1.6 }}>
              twx-react brings runtime CSS generation, variants, slots, compound components, and theme support together in one lightweight package.
            </p>
          </div>
        </section>

        <div style={{ marginTop: '1.25rem' }}>
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}

// ─── Inline Styles ────────────────────────────────────────────────────────────

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.85rem 2rem',
  borderBottom: '1px solid #e2e8f0',
  background: 'rgba(255,255,255,0.95)',
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backdropFilter: 'blur(10px)',
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

const heroStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
  border: '1px solid #dbeafe',
  borderRadius: '1rem',
  padding: '1.5rem',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
};

const pillStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.3rem 0.7rem',
  borderRadius: '999px',
  background: '#dbeafe',
  color: '#1d4ed8',
  fontSize: '0.8rem',
  fontWeight: 600,
};
