// Ensure the utility registry is populated so mergeClassNames can perform
// real CSS-property-based conflict resolution (matches production usage,
// since createTwComponent/useTwVariants always import this side-effect too).
import '../../src/internal/init';
import { resolveVariants, VariantsConfig } from '../../src/internal/variantsResolver';

describe('resolveVariants', () => {
  const buttonConfig: VariantsConfig = {
    base: 'px-4 py-2 rounded font-medium',
    variants: {
      size: {
        sm: 'text-sm px-2 py-1',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
      color: {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-gray-800',
        danger: 'bg-red-500 text-white',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'primary',
    },
  };

  describe('base classes', () => {
    it('should return base classes when no variants defined', () => {
      const config: VariantsConfig = { base: 'px-4 py-2' };
      expect(resolveVariants(config, {})).toBe('px-4 py-2');
    });

    it('should return empty string when config is empty', () => {
      expect(resolveVariants({}, {})).toBe('');
    });

    it('should return empty string when base is undefined', () => {
      const config: VariantsConfig = {
        variants: { size: { sm: 'text-sm' } },
      };
      expect(resolveVariants(config, { size: 'sm' })).toBe('text-sm');
    });
  });

  describe('variant resolution from props', () => {
    it('should resolve a single variant from props', () => {
      const result = resolveVariants(buttonConfig, { size: 'lg', color: 'primary' });
      // base's `px-4 py-2` is superseded by the `lg` variant's `px-6 py-3`
      expect(result).toBe('rounded font-medium text-lg px-6 py-3 bg-blue-500 text-white');
    });

    it('should resolve multiple variants from props', () => {
      const result = resolveVariants(buttonConfig, { size: 'sm', color: 'danger' });
      // base's `px-4 py-2` is superseded by the `sm` variant's `px-2 py-1`
      expect(result).toBe('rounded font-medium text-sm px-2 py-1 bg-red-500 text-white');
    });

    it('should ignore unknown variant values', () => {
      const result = resolveVariants(buttonConfig, { size: 'xl' as any, color: 'primary' });
      // 'xl' doesn't exist in size variants, so no size class is added
      expect(result).toBe('px-4 py-2 rounded font-medium bg-blue-500 text-white');
    });

    it('should ignore unknown variant names in props', () => {
      const result = resolveVariants(buttonConfig, { size: 'sm', color: 'primary', shape: 'round' } as any);
      // 'shape' is not a defined variant, so it's ignored; base's `px-4 py-2`
      // is superseded by the `sm` variant's `px-2 py-1`
      expect(result).toBe('rounded font-medium text-sm px-2 py-1 bg-blue-500 text-white');
    });
  });

  describe('default variants', () => {
    it('should apply default variants when no props provided', () => {
      const result = resolveVariants(buttonConfig, {});
      // The 'md' size variant's `px-4 py-2` targets the same CSS properties as
      // the base classes' identical `px-4 py-2`, so the conflict resolver keeps
      // only the later (variant) occurrence, in its original position.
      expect(result).toBe('rounded font-medium text-base px-4 py-2 bg-blue-500 text-white');
    });

    it('should apply default variants for missing props', () => {
      const result = resolveVariants(buttonConfig, { size: 'lg' });
      // size comes from props, color comes from defaults; base's `px-4 py-2`
      // is superseded by the `lg` variant's `px-6 py-3`
      expect(result).toBe('rounded font-medium text-lg px-6 py-3 bg-blue-500 text-white');
    });

    it('should override defaults when props are provided', () => {
      const result = resolveVariants(buttonConfig, { size: 'sm', color: 'secondary' });
      // base's `px-4 py-2` is superseded by the `sm` variant's `px-2 py-1`
      expect(result).toBe('rounded font-medium text-sm px-2 py-1 bg-gray-200 text-gray-800');
    });

    it('should work without defaultVariants in config', () => {
      const config: VariantsConfig = {
        base: 'btn',
        variants: {
          size: { sm: 'small', lg: 'large' },
        },
      };
      // No default, no prop → no variant class
      expect(resolveVariants(config, {})).toBe('btn');
      // With prop → variant class applied
      expect(resolveVariants(config, { size: 'lg' })).toBe('btn large');
    });
  });

  describe('edge cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = resolveVariants(buttonConfig, { size: undefined });
      // undefined prop should fall back to default; the base's `px-4 py-2` is
      // superseded by the variant's identical `px-4 py-2`
      expect(result).toBe('rounded font-medium text-base px-4 py-2 bg-blue-500 text-white');
    });

    it('should handle config with no variants', () => {
      const config: VariantsConfig = {
        base: 'static-classes',
      };
      expect(resolveVariants(config, { anything: 'here' })).toBe('static-classes');
    });

    it('should handle calling with no props argument', () => {
      const result = resolveVariants(buttonConfig);
      // the base's `px-4 py-2` is superseded by the variant's identical `px-4 py-2`
      expect(result).toBe('rounded font-medium text-base px-4 py-2 bg-blue-500 text-white');
    });

    it('should handle empty base string', () => {
      const config: VariantsConfig = {
        base: '',
        variants: { size: { sm: 'text-sm' } },
        defaultVariants: { size: 'sm' },
      };
      expect(resolveVariants(config, {})).toBe('text-sm');
    });

    it('should handle variant with empty class string', () => {
      const config: VariantsConfig = {
        base: 'btn',
        variants: { size: { none: '', sm: 'text-sm' } },
        defaultVariants: { size: 'none' },
      };
      expect(resolveVariants(config, {})).toBe('btn');
    });
  });

  describe('compound variants', () => {
    const compoundConfig: VariantsConfig = {
      base: 'btn',
      variants: {
        size: { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
        color: { primary: 'bg-blue-500', secondary: 'bg-gray-200', danger: 'bg-red-500' },
        variant: { solid: 'text-white', outline: 'border bg-transparent' },
      },
      compoundVariants: [
        { size: 'sm', color: 'primary', className: 'shadow-sm' },
        { size: 'lg', color: 'danger', className: 'font-bold ring-2' },
        { variant: 'outline', color: 'primary', className: 'border-blue-500 text-blue-500' },
      ],
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'solid',
      },
    };

    it('should apply compound variant class when all conditions match', () => {
      const result = resolveVariants(compoundConfig, { size: 'sm', color: 'primary', variant: 'solid' });
      expect(result).toContain('shadow-sm');
    });

    it('should not apply compound variant when only some conditions match', () => {
      // size=sm but color=secondary, so the sm+primary compound should NOT fire
      const result = resolveVariants(compoundConfig, { size: 'sm', color: 'secondary', variant: 'solid' });
      expect(result).not.toContain('shadow-sm');
    });

    it('should apply multiple compound variants when each set of conditions is met', () => {
      // Use a config where two separate compound entries can both match
      const config: VariantsConfig = {
        base: 'btn',
        variants: {
          size: { sm: 'text-sm', lg: 'text-lg' },
          color: { primary: 'bg-blue-500', danger: 'bg-red-500' },
        },
        compoundVariants: [
          { size: 'sm', className: 'compact' },
          { color: 'primary', className: 'themed' },
        ],
      };
      const result = resolveVariants(config, { size: 'sm', color: 'primary' });
      expect(result).toContain('compact');
      expect(result).toContain('themed');
    });

    it('should use default variant values when matching compound conditions', () => {
      // With defaults: size=md, color=primary, variant=solid — none of the compound entries match md+primary
      // but outline+primary matches when variant comes from props
      const result = resolveVariants(compoundConfig, { variant: 'outline' });
      expect(result).toContain('border-blue-500 text-blue-500');
    });

    it('should apply compound variant that matches via default values', () => {
      // defaults: size=md, color=primary, variant=solid — no compound for md+primary
      // but if we have a compound for size=md, it should fire via default
      const config: VariantsConfig = {
        base: 'btn',
        variants: {
          size: { sm: 'text-sm', md: 'text-base' },
          color: { primary: 'bg-blue-500' },
        },
        compoundVariants: [
          { size: 'md', color: 'primary', className: 'default-compound' },
        ],
        defaultVariants: { size: 'md', color: 'primary' },
      };
      const result = resolveVariants(config, {});
      expect(result).toContain('default-compound');
    });

    it('should not apply compound variant when conditions use unknown variant values', () => {
      const result = resolveVariants(compoundConfig, { size: 'xl' as any, color: 'primary', variant: 'solid' });
      // sm+primary compound should not match because size is xl not sm
      expect(result).not.toContain('shadow-sm');
    });

    it('should support array values in compound conditions', () => {
      const config: VariantsConfig = {
        base: 'btn',
        variants: {
          size: { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
          color: { primary: 'bg-blue-500', danger: 'bg-red-500' },
        },
        compoundVariants: [
          { size: ['sm', 'md'], color: 'primary', className: 'small-or-medium-primary' },
        ],
      };
      const resultSm = resolveVariants(config, { size: 'sm', color: 'primary' });
      const resultMd = resolveVariants(config, { size: 'md', color: 'primary' });
      const resultLg = resolveVariants(config, { size: 'lg', color: 'primary' });

      expect(resultSm).toContain('small-or-medium-primary');
      expect(resultMd).toContain('small-or-medium-primary');
      expect(resultLg).not.toContain('small-or-medium-primary');
    });

    it('should handle config with compoundVariants but no matching conditions', () => {
      const result = resolveVariants(compoundConfig, { size: 'md', color: 'secondary', variant: 'solid' });
      // None of the compound entries match md+secondary or solid+secondary
      expect(result).not.toContain('shadow-sm');
      expect(result).not.toContain('font-bold ring-2');
      expect(result).not.toContain('border-blue-500 text-blue-500');
    });

    it('should handle empty compoundVariants array', () => {
      const config: VariantsConfig = {
        base: 'btn',
        variants: { size: { sm: 'text-sm' } },
        compoundVariants: [],
      };
      expect(resolveVariants(config, { size: 'sm' })).toBe('btn text-sm');
    });

    it('should place compound variant classes after base variant classes', () => {
      const config: VariantsConfig = {
        base: 'base',
        variants: {
          size: { sm: 'size-sm' },
          color: { primary: 'color-primary' },
        },
        compoundVariants: [
          { size: 'sm', color: 'primary', className: 'compound-class' },
        ],
      };
      const result = resolveVariants(config, { size: 'sm', color: 'primary' });
      expect(result).toBe('base size-sm color-primary compound-class');
    });
  });

  describe('real-world examples', () => {
    it('should resolve a badge component config', () => {
      const badgeConfig: VariantsConfig = {
        base: 'inline-flex items-center rounded-full font-medium',
        variants: {
          variant: {
            solid: 'text-white',
            outline: 'border',
            subtle: 'bg-opacity-10',
          },
          size: {
            sm: 'px-2 py-0.5 text-xs',
            md: 'px-3 py-1 text-sm',
          },
        },
        defaultVariants: {
          variant: 'solid',
          size: 'sm',
        },
      };

      expect(resolveVariants(badgeConfig, { variant: 'outline', size: 'md' })).toBe(
        'inline-flex items-center rounded-full font-medium border px-3 py-1 text-sm'
      );
    });

    it('should resolve an input component config', () => {
      const inputConfig: VariantsConfig = {
        base: 'w-full border rounded-md transition-colors',
        variants: {
          size: {
            sm: 'px-2 py-1 text-sm',
            md: 'px-3 py-2 text-base',
            lg: 'px-4 py-3 text-lg',
          },
          state: {
            default: 'border-gray-300 focus:border-blue-500',
            error: 'border-red-500 focus:border-red-600',
            success: 'border-green-500 focus:border-green-600',
          },
        },
        defaultVariants: {
          size: 'md',
          state: 'default',
        },
      };

      expect(resolveVariants(inputConfig, { state: 'error' })).toBe(
        'w-full border rounded-md transition-colors px-3 py-2 text-base border-red-500 focus:border-red-600'
      );
    });
  });
});
