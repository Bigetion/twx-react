/**
 * Theme Switching Example
 *
 * Demonstrates the theme system with:
 * - Creating light and dark themes using createTwTheme
 * - Wrapping the app with TwThemeProvider
 * - Using useTwTheme hook for dynamic theme switching
 * - Extending the default Tailwind theme with custom tokens
 */

import React from 'react';
import {
  createTwTheme,
  TwThemeProvider,
  useTwTheme,
  tw,
} from 'twx-react';
import type { TwTheme } from 'twx-react';

// ─── Theme Definitions ────────────────────────────────────────────────────────

// Light theme — using createTwTheme with custom color tokens
const lightTheme = createTwTheme({
  colors: {
    primary: 'oklch(0.6 0.15 240)',       // Blue
    secondary: 'oklch(0.55 0.1 300)',     // Purple
    background: 'oklch(0.98 0 0)',        // Near-white
    surface: 'oklch(1 0 0)',              // White
    text: 'oklch(0.2 0 0)',              // Near-black
    muted: 'oklch(0.55 0 0)',            // Gray
    border: 'oklch(0.85 0 0)',           // Light gray
    danger: 'oklch(0.55 0.2 25)',        // Red
    success: 'oklch(0.6 0.15 145)',      // Green
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

// Dark theme — different color palette for dark mode
const darkTheme = createTwTheme({
  colors: {
    primary: 'oklch(0.7 0.15 240)',       // Lighter blue for dark bg
    secondary: 'oklch(0.7 0.12 300)',     // Lighter purple
    background: 'oklch(0.15 0 0)',        // Very dark
    surface: 'oklch(0.2 0 0)',            // Dark surface
    text: 'oklch(0.95 0 0)',             // Near-white text
    muted: 'oklch(0.6 0 0)',             // Lighter gray
    border: 'oklch(0.3 0 0)',            // Dark gray border
    danger: 'oklch(0.65 0.2 25)',        // Lighter red
    success: 'oklch(0.7 0.15 145)',      // Lighter green
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

// Extending the default Tailwind theme with brand-specific tokens
const brandTheme = createTwTheme.extend({
  colors: {
    brand: {
      50: 'oklch(0.97 0.02 280)',
      100: 'oklch(0.93 0.04 280)',
      500: 'oklch(0.6 0.2 280)',
      900: 'oklch(0.3 0.12 280)',
    },
  },
  spacing: {
    '18': '4.5rem',
    '22': '5.5rem',
  },
});

// ─── Theme Toggle Component ───────────────────────────────────────────────────

// Uses the useTwTheme hook to read and switch the active theme
function ThemeToggle() {
  const { theme, setTheme } = useTwTheme();

  // Determine which theme is active by comparing references
  const isDark = theme === darkTheme;

  return (
    <button
      onClick={() => setTheme(isDark ? lightTheme : darkTheme)}
      className={tw('px-4 py-2 rounded-lg border')}
      style={{ color: 'var(--twx-colors-text)', borderColor: 'var(--twx-colors-border)' }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}

// ─── Theme-Aware Components ───────────────────────────────────────────────────

// Components can read theme tokens via CSS variables injected by TwThemeProvider.
// The CSS variables follow the pattern: --twx-{category}-{key}
function ThemeDemo() {
  const { theme } = useTwTheme();

  return (
    <div className={tw('p-6 rounded-xl')} style={{ background: 'var(--twx-colors-surface)' }}>
      <h2
        className={tw('text-xl font-bold mb-4')}
        style={{ color: 'var(--twx-colors-text)' }}
      >
        Theme-Aware Content
      </h2>
      <p
        className={tw('mb-4')}
        style={{ color: 'var(--twx-colors-muted)' }}
      >
        This content adapts to the current theme via CSS variables.
        The active theme has {Object.keys(theme.cssVariables).length} CSS variables.
      </p>
      <div className={tw('flex gap-3')}>
        <div
          className={tw('w-8 h-8 rounded-full')}
          style={{ background: 'var(--twx-colors-primary)' }}
          title="Primary color"
        />
        <div
          className={tw('w-8 h-8 rounded-full')}
          style={{ background: 'var(--twx-colors-secondary)' }}
          title="Secondary color"
        />
        <div
          className={tw('w-8 h-8 rounded-full')}
          style={{ background: 'var(--twx-colors-danger)' }}
          title="Danger color"
        />
        <div
          className={tw('w-8 h-8 rounded-full')}
          style={{ background: 'var(--twx-colors-success)' }}
          title="Success color"
        />
      </div>
    </div>
  );
}

// ─── Multi-Theme Selector ─────────────────────────────────────────────────────

function ThemeSelector() {
  const { setTheme } = useTwTheme();

  const themes: { name: string; theme: TwTheme }[] = [
    { name: 'Light', theme: lightTheme },
    { name: 'Dark', theme: darkTheme },
    { name: 'Brand', theme: brandTheme },
  ];

  return (
    <div className={tw('flex gap-2')}>
      {themes.map(({ name, theme }) => (
        <button
          key={name}
          onClick={() => setTheme(theme)}
          className={tw('px-3 py-1.5 text-sm rounded-md border')}
          style={{ color: 'var(--twx-colors-text)', borderColor: 'var(--twx-colors-border)' }}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

// ─── App Entry Point ──────────────────────────────────────────────────────────

// Wrap your application (or subtree) with TwThemeProvider to enable theming
export function ThemeSwitchingApp() {
  return (
    <TwThemeProvider theme={lightTheme}>
      <div
        className={tw('min-h-screen p-8 transition-colors')}
        style={{ background: 'var(--twx-colors-background)' }}
      >
        <div className={tw('max-w-xl mx-auto space-y-6')}>
          <header className={tw('flex items-center justify-between')}>
            <h1
              className={tw('text-2xl font-bold')}
              style={{ color: 'var(--twx-colors-text)' }}
            >
              Theme Switching Demo
            </h1>
            <ThemeToggle />
          </header>

          <ThemeDemo />

          <div className={tw('pt-4')}>
            <h3 className={tw('text-sm font-medium mb-2')} style={{ color: 'var(--twx-colors-muted)' }}>
              Choose a theme:
            </h3>
            <ThemeSelector />
          </div>
        </div>
      </div>
    </TwThemeProvider>
  );
}
