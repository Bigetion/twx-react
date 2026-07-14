/**
 * Tests for createTwTheme API
 */

import { createTwTheme, defaultTheme, defaultTailwindTheme } from '../../src/theme/createTwTheme';

describe('createTwTheme', () => {
  describe('Task 14.1 - Theme factory function', () => {
    it('should create theme from tokens', () => {
      const theme = createTwTheme({
        colors: {
          primary: 'oklch(0.6 0.15 240)',
          secondary: 'oklch(0.5 0.12 180)',
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
        },
        borderRadius: {
          sm: '0.25rem',
          md: '0.5rem',
        },
      });

      expect(theme).toHaveProperty('tokens');
      expect(theme).toHaveProperty('cssVariables');
      expect(theme.tokens.colors).toEqual({
        primary: 'oklch(0.6 0.15 240)',
        secondary: 'oklch(0.5 0.12 180)',
      });
    });

    it('should generate CSS variables from tokens', () => {
      const theme = createTwTheme({
        colors: {
          primary: 'oklch(0.6 0.15 240)',
        },
        spacing: {
          xs: '0.25rem',
        },
      });

      expect(theme.cssVariables).toHaveProperty('--twx-colors-primary', 'oklch(0.6 0.15 240)');
      expect(theme.cssVariables).toHaveProperty('--twx-spacing-xs', '0.25rem');
    });

    it('should handle nested token structures', () => {
      const theme = createTwTheme({
        colors: {
          blue: {
            500: 'oklch(0.6 0.15 240)',
            600: 'oklch(0.5 0.15 240)',
          },
        },
      });

      expect(theme.cssVariables).toHaveProperty('--twx-colors-blue-500', 'oklch(0.6 0.15 240)');
      expect(theme.cssVariables).toHaveProperty('--twx-colors-blue-600', 'oklch(0.5 0.15 240)');
    });

    it('should handle font size tuples with line height', () => {
      const theme = createTwTheme({
        fontSize: {
          base: ['1rem', { lineHeight: '1.5rem' }],
          lg: ['1.125rem', { lineHeight: '1.75rem' }],
        },
      });

      expect(theme.cssVariables).toHaveProperty('--twx-fontSize-base', '1rem');
      expect(theme.cssVariables).toHaveProperty('--twx-fontSize-base-line-height', '1.5rem');
      expect(theme.cssVariables).toHaveProperty('--twx-fontSize-lg', '1.125rem');
      expect(theme.cssVariables).toHaveProperty('--twx-fontSize-lg-line-height', '1.75rem');
    });
  });

  describe('Task 14.2 - Default Tailwind v4 theme values', () => {
    it('should include OKLCH P3 color palette', () => {
      expect(defaultTailwindTheme.colors).toBeDefined();
      
      // Check gray families
      expect(defaultTailwindTheme.colors).toHaveProperty('slate');
      expect(defaultTailwindTheme.colors).toHaveProperty('gray');
      expect(defaultTailwindTheme.colors).toHaveProperty('zinc');
      expect(defaultTailwindTheme.colors).toHaveProperty('neutral');
      expect(defaultTailwindTheme.colors).toHaveProperty('stone');
      
      // Check color families
      expect(defaultTailwindTheme.colors).toHaveProperty('red');
      expect(defaultTailwindTheme.colors).toHaveProperty('orange');
      expect(defaultTailwindTheme.colors).toHaveProperty('blue');
      expect(defaultTailwindTheme.colors).toHaveProperty('green');
      
      // Check all shades exist for a color
      const blue = defaultTailwindTheme.colors!.blue as Record<string, string>;
      expect(blue).toHaveProperty('50');
      expect(blue).toHaveProperty('100');
      expect(blue).toHaveProperty('500');
      expect(blue).toHaveProperty('950');
      
      // Verify OKLCH format
      expect(blue['500']).toMatch(/oklch\(/);
    });

    it('should include spacing scale (0-96)', () => {
      expect(defaultTailwindTheme.spacing).toBeDefined();
      expect(defaultTailwindTheme.spacing).toHaveProperty('0', '0px');
      expect(defaultTailwindTheme.spacing).toHaveProperty('1', '0.25rem');
      expect(defaultTailwindTheme.spacing).toHaveProperty('4', '1rem');
      expect(defaultTailwindTheme.spacing).toHaveProperty('8', '2rem');
      expect(defaultTailwindTheme.spacing).toHaveProperty('96', '24rem');
      expect(defaultTailwindTheme.spacing).toHaveProperty('px', '1px');
    });

    it('should include font sizes (xs through 9xl)', () => {
      expect(defaultTailwindTheme.fontSize).toBeDefined();
      expect(defaultTailwindTheme.fontSize).toHaveProperty('xs');
      expect(defaultTailwindTheme.fontSize).toHaveProperty('sm');
      expect(defaultTailwindTheme.fontSize).toHaveProperty('base');
      expect(defaultTailwindTheme.fontSize).toHaveProperty('lg');
      expect(defaultTailwindTheme.fontSize).toHaveProperty('xl');
      expect(defaultTailwindTheme.fontSize).toHaveProperty('2xl');
      expect(defaultTailwindTheme.fontSize).toHaveProperty('3xl');
      expect(defaultTailwindTheme.fontSize).toHaveProperty('9xl');
      
      // Check font size includes line height
      const base = defaultTailwindTheme.fontSize!.base as [string, { lineHeight: string }];
      expect(base[0]).toBe('1rem');
      expect(base[1].lineHeight).toBe('1.5rem');
    });

    it('should include border radius values', () => {
      expect(defaultTailwindTheme.borderRadius).toBeDefined();
      expect(defaultTailwindTheme.borderRadius).toHaveProperty('none', '0px');
      expect(defaultTailwindTheme.borderRadius).toHaveProperty('sm', '0.125rem');
      expect(defaultTailwindTheme.borderRadius).toHaveProperty('DEFAULT', '0.25rem');
      expect(defaultTailwindTheme.borderRadius).toHaveProperty('md', '0.375rem');
      expect(defaultTailwindTheme.borderRadius).toHaveProperty('lg', '0.5rem');
      expect(defaultTailwindTheme.borderRadius).toHaveProperty('xl', '0.75rem');
      expect(defaultTailwindTheme.borderRadius).toHaveProperty('2xl', '1rem');
      expect(defaultTailwindTheme.borderRadius).toHaveProperty('3xl', '1.5rem');
      expect(defaultTailwindTheme.borderRadius).toHaveProperty('full', '9999px');
    });

    it('should include box shadow values', () => {
      expect(defaultTailwindTheme.boxShadow).toBeDefined();
      expect(defaultTailwindTheme.boxShadow).toHaveProperty('sm');
      expect(defaultTailwindTheme.boxShadow).toHaveProperty('DEFAULT');
      expect(defaultTailwindTheme.boxShadow).toHaveProperty('md');
      expect(defaultTailwindTheme.boxShadow).toHaveProperty('lg');
      expect(defaultTailwindTheme.boxShadow).toHaveProperty('xl');
      expect(defaultTailwindTheme.boxShadow).toHaveProperty('2xl');
      expect(defaultTailwindTheme.boxShadow).toHaveProperty('inner');
      expect(defaultTailwindTheme.boxShadow).toHaveProperty('none', 'none');
    });

    it('should include responsive breakpoints', () => {
      expect(defaultTailwindTheme.screens).toBeDefined();
      expect(defaultTailwindTheme.screens).toHaveProperty('sm', '640px');
      expect(defaultTailwindTheme.screens).toHaveProperty('md', '768px');
      expect(defaultTailwindTheme.screens).toHaveProperty('lg', '1024px');
      expect(defaultTailwindTheme.screens).toHaveProperty('xl', '1280px');
      expect(defaultTailwindTheme.screens).toHaveProperty('2xl', '1536px');
    });

    it('should include container breakpoints', () => {
      expect(defaultTailwindTheme.containers).toBeDefined();
      expect(defaultTailwindTheme.containers).toHaveProperty('sm', '640px');
      expect(defaultTailwindTheme.containers).toHaveProperty('md', '768px');
      expect(defaultTailwindTheme.containers).toHaveProperty('lg', '1024px');
      expect(defaultTailwindTheme.containers).toHaveProperty('xl', '1280px');
      expect(defaultTailwindTheme.containers).toHaveProperty('2xl', '1536px');
    });

    it('should have default theme instance available', () => {
      expect(defaultTheme).toBeDefined();
      expect(defaultTheme.tokens).toBeDefined();
      expect(defaultTheme.cssVariables).toBeDefined();
      expect(Object.keys(defaultTheme.cssVariables).length).toBeGreaterThan(0);
    });
  });

  describe('Task 14.3 - Theme extension support', () => {
    it('should extend default theme with custom tokens', () => {
      const customTheme = createTwTheme.extend({
        colors: {
          brand: 'oklch(0.6 0.2 300)',
        },
        spacing: {
          18: '4.5rem',
        },
      });

      // Should have custom colors
      expect(customTheme.tokens.colors).toHaveProperty('brand', 'oklch(0.6 0.2 300)');
      
      // Should still have default colors
      expect(customTheme.tokens.colors).toHaveProperty('blue');
      expect(customTheme.tokens.colors).toHaveProperty('red');
      
      // Should have custom spacing
      expect(customTheme.tokens.spacing).toHaveProperty('18', '4.5rem');
      
      // Should still have default spacing
      expect(customTheme.tokens.spacing).toHaveProperty('4', '1rem');
      expect(customTheme.tokens.spacing).toHaveProperty('8', '2rem');
    });

    it('should support nested token structures in extension', () => {
      const customTheme = createTwTheme.extend({
        colors: {
          brand: {
            50: 'oklch(0.97 0.01 200)',
            500: 'oklch(0.55 0.18 200)',
            900: 'oklch(0.25 0.10 200)',
          },
        },
      });

      expect(customTheme.tokens.colors).toHaveProperty('brand');
      const brand = customTheme.tokens.colors!.brand as Record<string, string>;
      expect(brand).toHaveProperty('50', 'oklch(0.97 0.01 200)');
      expect(brand).toHaveProperty('500', 'oklch(0.55 0.18 200)');
      expect(brand).toHaveProperty('900', 'oklch(0.25 0.10 200)');
      
      // Should still have default colors
      expect(customTheme.tokens.colors).toHaveProperty('blue');
    });

    it('should deep merge nested structures', () => {
      const customTheme = createTwTheme.extend({
        colors: {
          blue: {
            500: 'oklch(0.7 0.2 240)', // Override blue-500
          },
        },
      });

      const blue = customTheme.tokens.colors!.blue as Record<string, string>;
      
      // Should have custom blue-500
      expect(blue['500']).toBe('oklch(0.7 0.2 240)');
      
      // Should still have other blue shades from default
      expect(blue).toHaveProperty('50');
      expect(blue).toHaveProperty('100');
      expect(blue).toHaveProperty('600');
      expect(blue).toHaveProperty('950');
    });

    it('should generate CSS variables for extended theme', () => {
      const customTheme = createTwTheme.extend({
        colors: {
          brand: 'oklch(0.6 0.2 300)',
        },
      });

      expect(customTheme.cssVariables).toHaveProperty('--twx-colors-brand', 'oklch(0.6 0.2 300)');
      
      // Should still have default CSS variables
      expect(customTheme.cssVariables).toHaveProperty('--twx-spacing-4', '1rem');
    });

    it('should allow extending multiple categories', () => {
      const customTheme = createTwTheme.extend({
        colors: {
          brand: 'oklch(0.6 0.2 300)',
        },
        spacing: {
          18: '4.5rem',
          128: '32rem',
        },
        fontSize: {
          xxs: ['0.625rem', { lineHeight: '0.75rem' }],
        },
        borderRadius: {
          '4xl': '2rem',
        },
      });

      expect(customTheme.tokens.colors).toHaveProperty('brand');
      expect(customTheme.tokens.spacing).toHaveProperty('18');
      expect(customTheme.tokens.spacing).toHaveProperty('128');
      expect(customTheme.tokens.fontSize).toHaveProperty('xxs');
      expect(customTheme.tokens.borderRadius).toHaveProperty('4xl');
      
      // Verify default values still exist
      expect(customTheme.tokens.colors).toHaveProperty('blue');
      expect(customTheme.tokens.spacing).toHaveProperty('4');
      expect(customTheme.tokens.fontSize).toHaveProperty('base');
      expect(customTheme.tokens.borderRadius).toHaveProperty('lg');
    });
  });

  describe('Integration - Theme usage example', () => {
    it('should work with the example from SPEC.md', () => {
      const theme = createTwTheme({
        colors: {
          primary: 'oklch(0.6 0.15 240)',
          secondary: 'oklch(0.5 0.12 180)',
        },
        spacing: { xs: '0.25rem', sm: '0.5rem' },
        borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '1rem' },
      });

      expect(theme.cssVariables).toEqual({
        '--twx-colors-primary': 'oklch(0.6 0.15 240)',
        '--twx-colors-secondary': 'oklch(0.5 0.12 180)',
        '--twx-spacing-xs': '0.25rem',
        '--twx-spacing-sm': '0.5rem',
        '--twx-borderRadius-sm': '0.25rem',
        '--twx-borderRadius-md': '0.5rem',
        '--twx-borderRadius-lg': '1rem',
      });
    });
  });
});
