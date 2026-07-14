/**
 * TwThemeProvider — React Context provider for the TWX-React theme system.
 *
 * Wraps your application (or a subtree) with a theme context and injects
 * the theme's CSS variables into the DOM as a `<style>` block targeting
 * `:root`.  When the `theme` prop changes the style block is updated
 * automatically so dynamic theme switching works out of the box.
 *
 * @example
 * ```tsx
 * import { TwThemeProvider } from 'twx-react';
 *
 * const lightTheme = createTwTheme({ colors: { primary: '#3b82f6' } });
 *
 * function App() {
 *   return (
 *     <TwThemeProvider theme={lightTheme}>
 *       <MyApp />
 *     </TwThemeProvider>
 *   );
 * }
 * ```
 */

import React, { createContext, useEffect, useRef, useState } from 'react';
import type { TwTheme, TwThemeContext, TwThemeProviderProps } from '../types/theme';

// ─── Context ──────────────────────────────────────────────────────────────────

/**
 * The React context that stores the active theme and the setter function.
 * Access it via the `useTwTheme` hook rather than reading the context directly.
 */
export const ThemeContext = /*#__PURE__*/ createContext<TwThemeContext | null>(null);

ThemeContext.displayName = 'TwThemeContext';

// ─── CSS variable injection ───────────────────────────────────────────────────

const THEME_STYLE_TAG_ID = 'twx-react-theme';

/**
 * Build the `:root { ... }` CSS block from a theme's `cssVariables` map.
 *
 * @param cssVariables - Record mapping CSS variable names to their values.
 *   Variable names may or may not include the leading `--`; both are handled.
 * @returns A complete `:root { ... }` CSS rule string, or an empty string
 *   when `cssVariables` is empty.
 */
function buildRootCSS(cssVariables: Record<string, string>): string {
  const entries = Object.entries(cssVariables);
  if (entries.length === 0) return '';

  const declarations = entries
    .map(([name, value]) => {
      const varName = name.startsWith('--') ? name : `--${name}`;
      return `  ${varName}: ${value};`;
    })
    .join('\n');

  return `:root {\n${declarations}\n}`;
}

/**
 * Get or create the dedicated `<style>` tag used for theme CSS variables.
 * A separate tag (distinct from the utility-class tag) keeps theme variables
 * easy to find and update without touching injected utility rules.
 */
function getThemeStyleTag(): HTMLStyleElement | null {
  if (typeof document === 'undefined') return null;

  let tag = document.getElementById(THEME_STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!tag) {
    tag = document.createElement('style');
    tag.id = THEME_STYLE_TAG_ID;
    tag.setAttribute('data-twx-theme', '');
    document.head.appendChild(tag);
  }
  return tag;
}

/**
 * Inject (or update) the `:root` CSS variable block for the given theme.
 * Safe to call in SSR — the function is a no-op when `document` is absent.
 */
function injectThemeCSS(theme: TwTheme): void {
  if (typeof document === 'undefined') return;

  const css = buildRootCSS(theme.cssVariables ?? {});
  const tag = getThemeStyleTag();
  if (tag) {
    tag.textContent = css;
  }
}

// ─── TwThemeProvider ─────────────────────────────────────────────────────────

/**
 * Provider component for the TWX-React theme system.
 *
 * - Accepts a `theme` prop (a `TwTheme` object produced by `createTwTheme`).
 * - Injects the theme's CSS variables into the DOM on mount and whenever
 *   the `theme` prop changes.
 * - Exposes both the current theme and a `setTheme` function via context so
 *   descendant components can read or switch the theme at runtime.
 *
 * @param props.theme    - The initial theme to inject and expose.
 * @param props.children - Child elements that can consume the theme context.
 */
export function TwThemeProvider({ theme: initialTheme, children }: TwThemeProviderProps): React.ReactElement {
  const [theme, setThemeState] = useState<TwTheme>(initialTheme);

  // Keep track of the previous external `theme` prop so we can sync it into
  // local state when the parent swaps themes (controlled-component pattern).
  const prevInitialThemeRef = useRef<TwTheme>(initialTheme);

  // Sync controlled `theme` prop → internal state when the prop reference changes.
  useEffect(() => {
    if (initialTheme !== prevInitialThemeRef.current) {
      prevInitialThemeRef.current = initialTheme;
      setThemeState(initialTheme);
    }
  }, [initialTheme]);

  // Inject / re-inject CSS variables whenever the active theme changes.
  useEffect(() => {
    injectThemeCSS(theme);
  }, [theme]);

  const setTheme = (newTheme: TwTheme) => {
    setThemeState(newTheme);
  };

  const contextValue: TwThemeContext = { theme, setTheme };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Internal helper (re-exported for tests) ─────────────────────────────────

export { buildRootCSS };
