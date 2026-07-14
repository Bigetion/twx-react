/**
 * useTwTheme - React hook for accessing the TWX-React theme context.
 *
 * Returns the current theme object and a function to update it at runtime.
 * This hook must be used within a `<TwThemeProvider>` component tree,
 * otherwise it throws an error.
 *
 * @example
 * ```tsx
 * import { useTwTheme } from 'twx-react';
 *
 * function ThemeToggle() {
 *   const { theme, setTheme } = useTwTheme();
 *
 *   return (
 *     <button onClick={() => setTheme(darkTheme)}>
 *       Toggle Theme
 *     </button>
 *   );
 * }
 * ```
 *
 * @throws {Error} When used outside of a TwThemeProvider
 * @returns The theme context with current theme and setter function
 */

import { useContext } from 'react';
import { ThemeContext } from './TwThemeProvider';
import type { TwThemeContext } from '../types/theme';

export function useTwTheme(): TwThemeContext {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error(
      'useTwTheme must be used within a TwThemeProvider. ' +
      'Wrap your component tree with <TwThemeProvider theme={...}>...</TwThemeProvider>'
    );
  }

  return context;
}
