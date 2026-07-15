/**
 * Tests for the className expander module
 *
 * Covers:
 * 1. Variant grouping: hover:(bg-blue-500 text-white)
 * 2. Nested grouping: dark:(hover:(bg-gray-800 text-white))
 * 3. Important grouping: !(bg-red-500 text-white)
 * 4. Negative grouping: -(mt-4 ml-2)
 * 5. Mixed usage and edge cases
 */

import { expandClassName } from '../../src/internal/expander';

describe('expandClassName', () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // Basic - No Expansion Needed
  // ═══════════════════════════════════════════════════════════════════════════

  describe('passthrough (no grouping)', () => {
    it('should return empty string for empty input', () => {
      expect(expandClassName('')).toBe('');
    });

    it('should return single class unchanged', () => {
      expect(expandClassName('flex')).toBe('flex');
    });

    it('should return multiple classes unchanged', () => {
      expect(expandClassName('flex items-center gap-4')).toBe('flex items-center gap-4');
    });

    it('should return variant classes unchanged', () => {
      expect(expandClassName('hover:bg-blue-500 focus:ring-2')).toBe('hover:bg-blue-500 focus:ring-2');
    });

    it('should handle arbitrary values without expansion', () => {
      expect(expandClassName('bg-[#ff0000] text-[14px]')).toBe('bg-[#ff0000] text-[14px]');
    });

    it('should handle arbitrary values with parentheses inside brackets', () => {
      expect(expandClassName('bg-[rgb(255,0,0)] text-[calc(100%-2rem)]')).toBe('bg-[rgb(255,0,0)] text-[calc(100%-2rem)]');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Variant Grouping
  // ═══════════════════════════════════════════════════════════════════════════

  describe('variant grouping', () => {
    it('should expand hover:(class1 class2)', () => {
      expect(expandClassName('hover:(bg-blue-500 text-white)')).toBe('hover:bg-blue-500 hover:text-white');
    });

    it('should expand focus:(class1 class2 class3)', () => {
      expect(expandClassName('focus:(ring-2 ring-blue-300 ring-offset-2)')).toBe('focus:ring-2 focus:ring-blue-300 focus:ring-offset-2');
    });

    it('should expand responsive variants', () => {
      expect(expandClassName('sm:(flex gap-4 p-2)')).toBe('sm:flex sm:gap-4 sm:p-2');
    });

    it('should expand md variant', () => {
      expect(expandClassName('md:(grid grid-cols-2 gap-8)')).toBe('md:grid md:grid-cols-2 md:gap-8');
    });

    it('should expand lg variant', () => {
      expect(expandClassName('lg:(grid-cols-3 max-w-6xl)')).toBe('lg:grid-cols-3 lg:max-w-6xl');
    });

    it('should expand dark mode variant', () => {
      expect(expandClassName('dark:(bg-gray-900 text-white)')).toBe('dark:bg-gray-900 dark:text-white');
    });

    it('should expand active variant', () => {
      expect(expandClassName('active:(scale-95 bg-blue-700)')).toBe('active:scale-95 active:bg-blue-700');
    });

    it('should expand disabled variant', () => {
      expect(expandClassName('disabled:(opacity-50 cursor-not-allowed pointer-events-none)')).toBe('disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none');
    });

    it('should expand first-child variant', () => {
      expect(expandClassName('first:(mt-0 pt-0)')).toBe('first:mt-0 first:pt-0');
    });

    it('should handle single class in group', () => {
      expect(expandClassName('hover:(bg-blue-500)')).toBe('hover:bg-blue-500');
    });

    it('should handle group with extra whitespace', () => {
      expect(expandClassName('hover:(  bg-blue-500   text-white  )')).toBe('hover:bg-blue-500 hover:text-white');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Multiple Groups
  // ═══════════════════════════════════════════════════════════════════════════

  describe('multiple groups', () => {
    it('should expand multiple variant groups', () => {
      expect(expandClassName('hover:(bg-blue-600 scale-105) focus:(ring-2 ring-blue-300)')).toBe(
        'hover:bg-blue-600 hover:scale-105 focus:ring-2 focus:ring-blue-300'
      );
    });

    it('should handle mix of grouped and ungrouped classes', () => {
      expect(expandClassName('flex items-center hover:(bg-blue-500 text-white) p-4')).toBe(
        'flex items-center hover:bg-blue-500 hover:text-white p-4'
      );
    });

    it('should handle multiple responsive groups', () => {
      expect(expandClassName('sm:(flex gap-4) md:(grid grid-cols-2) lg:(grid-cols-3 gap-8)')).toBe(
        'sm:flex sm:gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-8'
      );
    });

    it('should handle complex real-world button example', () => {
      const input = 'px-4 py-2 rounded-lg bg-blue-500 text-white hover:(bg-blue-600 shadow-lg) focus:(ring-2 ring-blue-300) active:(scale-95) disabled:(opacity-50 cursor-not-allowed)';
      const expected = 'px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg focus:ring-2 focus:ring-blue-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
      expect(expandClassName(input)).toBe(expected);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Nested Grouping
  // ═══════════════════════════════════════════════════════════════════════════

  describe('nested grouping', () => {
    it('should expand dark:(hover:(class1 class2))', () => {
      expect(expandClassName('dark:(hover:(bg-gray-800 text-white))')).toBe(
        'dark:hover:bg-gray-800 dark:hover:text-white'
      );
    });

    it('should expand nested with sibling classes', () => {
      expect(expandClassName('dark:(hover:(bg-gray-700 text-white) bg-gray-900)')).toBe(
        'dark:hover:bg-gray-700 dark:hover:text-white dark:bg-gray-900'
      );
    });

    it('should expand multiple nested groups', () => {
      expect(expandClassName('dark:(hover:(bg-gray-700) focus:(ring-2 ring-gray-500))')).toBe(
        'dark:hover:bg-gray-700 dark:focus:ring-2 dark:focus:ring-gray-500'
      );
    });

    it('should expand responsive nested with state', () => {
      expect(expandClassName('md:(hover:(bg-blue-600 text-white))')).toBe(
        'md:hover:bg-blue-600 md:hover:text-white'
      );
    });

    it('should expand three levels deep', () => {
      expect(expandClassName('dark:(md:(hover:(bg-gray-700 text-white)))')).toBe(
        'dark:md:hover:bg-gray-700 dark:md:hover:text-white'
      );
    });

    it('should handle nested with mixed siblings', () => {
      expect(expandClassName('dark:(bg-gray-900 text-gray-100 hover:(bg-gray-800 text-white))')).toBe(
        'dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Important Grouping
  // ═══════════════════════════════════════════════════════════════════════════

  describe('important grouping', () => {
    it('should expand !(class1 class2)', () => {
      expect(expandClassName('!(bg-red-500 text-white)')).toBe('!bg-red-500 !text-white');
    });

    it('should expand single important class', () => {
      expect(expandClassName('!(bg-red-500)')).toBe('!bg-red-500');
    });

    it('should expand important with many classes', () => {
      expect(expandClassName('!(p-4 m-2 border rounded)')).toBe('!p-4 !m-2 !border !rounded');
    });

    it('should handle important group with other classes', () => {
      expect(expandClassName('flex items-center !(bg-red-500 text-white) gap-4')).toBe(
        'flex items-center !bg-red-500 !text-white gap-4'
      );
    });

    it('should handle important group with variant groups', () => {
      expect(expandClassName('!(bg-red-500) hover:(text-white scale-105)')).toBe(
        '!bg-red-500 hover:text-white hover:scale-105'
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Negative Grouping
  // ═══════════════════════════════════════════════════════════════════════════

  describe('negative grouping', () => {
    it('should expand -(class1 class2)', () => {
      expect(expandClassName('-(mt-4 ml-2)')).toBe('-mt-4 -ml-2');
    });

    it('should expand single negative class', () => {
      expect(expandClassName('-(translate-x-1)')).toBe('-translate-x-1');
    });

    it('should expand negative with many classes', () => {
      expect(expandClassName('-(mt-4 ml-2 translate-x-1 rotate-45)')).toBe('-mt-4 -ml-2 -translate-x-1 -rotate-45');
    });

    it('should handle negative group with other classes', () => {
      expect(expandClassName('absolute top-0 -(mt-4 ml-2) left-0')).toBe(
        'absolute top-0 -mt-4 -ml-2 left-0'
      );
    });

    it('should handle negative and important groups together', () => {
      expect(expandClassName('-(mt-4 ml-2) !(text-white bg-red-500)')).toBe(
        '-mt-4 -ml-2 !text-white !bg-red-500'
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Complex/Real-World Scenarios
  // ═══════════════════════════════════════════════════════════════════════════

  describe('complex real-world scenarios', () => {
    it('should handle full button component', () => {
      const input = `
        px-4 py-2 rounded-lg font-medium transition-all
        bg-blue-500 text-white
        hover:(bg-blue-600 shadow-lg scale-105)
        focus:(ring-2 ring-blue-300 ring-offset-2)
        active:(scale-95 bg-blue-700)
        disabled:(opacity-50 cursor-not-allowed pointer-events-none)
        dark:(bg-blue-600 hover:(bg-blue-500))
        sm:(text-sm px-3 py-1.5)
        md:(text-base px-4 py-2)
        lg:(text-lg px-6 py-3)
      `;
      const result = expandClassName(input);

      expect(result).toContain('hover:bg-blue-600');
      expect(result).toContain('hover:shadow-lg');
      expect(result).toContain('hover:scale-105');
      expect(result).toContain('focus:ring-2');
      expect(result).toContain('focus:ring-blue-300');
      expect(result).toContain('focus:ring-offset-2');
      expect(result).toContain('active:scale-95');
      expect(result).toContain('active:bg-blue-700');
      expect(result).toContain('disabled:opacity-50');
      expect(result).toContain('disabled:cursor-not-allowed');
      expect(result).toContain('disabled:pointer-events-none');
      expect(result).toContain('dark:bg-blue-600');
      expect(result).toContain('dark:hover:bg-blue-500');
      expect(result).toContain('sm:text-sm');
      expect(result).toContain('sm:px-3');
      expect(result).toContain('sm:py-1.5');
      expect(result).toContain('md:text-base');
      expect(result).toContain('lg:text-lg');
      expect(result).toContain('lg:px-6');
      expect(result).toContain('lg:py-3');
    });

    it('should handle card component', () => {
      const input = 'bg-white rounded-xl shadow-lg overflow-hidden hover:(shadow-xl scale-[1.02]) dark:(bg-gray-800 border-gray-700)';
      const result = expandClassName(input);

      expect(result).toContain('bg-white');
      expect(result).toContain('rounded-xl');
      expect(result).toContain('shadow-lg');
      expect(result).toContain('overflow-hidden');
      expect(result).toContain('hover:shadow-xl');
      expect(result).toContain('hover:scale-[1.02]');
      expect(result).toContain('dark:bg-gray-800');
      expect(result).toContain('dark:border-gray-700');
    });

    it('should handle input component with all states', () => {
      const input = 'w-full px-4 py-2 border rounded-lg focus:(ring-2 ring-blue-500 border-transparent) disabled:(bg-gray-100 opacity-50 cursor-not-allowed) !(outline-none)';
      const result = expandClassName(input);

      expect(result).toContain('w-full');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('border');
      expect(result).toContain('rounded-lg');
      expect(result).toContain('focus:ring-2');
      expect(result).toContain('focus:ring-blue-500');
      expect(result).toContain('focus:border-transparent');
      expect(result).toContain('disabled:bg-gray-100');
      expect(result).toContain('disabled:opacity-50');
      expect(result).toContain('disabled:cursor-not-allowed');
      expect(result).toContain('!outline-none');
    });

    it('should handle responsive layout', () => {
      const input = 'flex flex-col sm:(flex-row items-center gap-4) md:(gap-8 px-6) lg:(max-w-6xl mx-auto gap-12)';
      const result = expandClassName(input);

      expect(result).toBe('flex flex-col sm:flex-row sm:items-center sm:gap-4 md:gap-8 md:px-6 lg:max-w-6xl lg:mx-auto lg:gap-12');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Edge Cases
  // ═══════════════════════════════════════════════════════════════════════════

  describe('edge cases', () => {
    it('should handle arbitrary values alongside groups', () => {
      expect(expandClassName('w-[200px] hover:(bg-blue-500 text-white)')).toBe(
        'w-[200px] hover:bg-blue-500 hover:text-white'
      );
    });

    it('should handle arbitrary values with parentheses alongside groups', () => {
      const result = expandClassName('bg-[rgb(255,0,0)] hover:(text-white scale-105)');
      expect(result).toContain('bg-[rgb(255,0,0)]');
      expect(result).toContain('hover:text-white');
      expect(result).toContain('hover:scale-105');
    });

    it('should handle multiline className with indentation', () => {
      const input = `
        flex
        items-center
        hover:(bg-blue-500 text-white)
      `;
      const result = expandClassName(input);
      expect(result).toContain('flex');
      expect(result).toContain('items-center');
      expect(result).toContain('hover:bg-blue-500');
      expect(result).toContain('hover:text-white');
    });

    it('should handle empty group gracefully', () => {
      expect(expandClassName('hover:()')).toBe('');
    });

    it('should handle classes with colons that are not groups', () => {
      expect(expandClassName('hover:bg-blue-500')).toBe('hover:bg-blue-500');
    });

    it('should be idempotent (expanding twice gives same result)', () => {
      const input = 'hover:(bg-blue-500 text-white) dark:(bg-gray-900)';
      const firstExpand = expandClassName(input);
      const secondExpand = expandClassName(firstExpand);
      expect(firstExpand).toBe(secondExpand);
    });

    it('should use cache for repeated inputs', () => {
      const input = 'hover:(bg-blue-500 text-white)';
      const result1 = expandClassName(input);
      const result2 = expandClassName(input);
      expect(result1).toBe(result2);
    });

    it('should handle group-* variant', () => {
      expect(expandClassName('group-hover:(bg-blue-500 text-white)')).toBe(
        'group-hover:bg-blue-500 group-hover:text-white'
      );
    });

    it('should handle peer-* variant', () => {
      expect(expandClassName('peer-focus:(ring-2 ring-blue-500)')).toBe(
        'peer-focus:ring-2 peer-focus:ring-blue-500'
      );
    });

    it('should handle arbitrary variant grouping', () => {
      expect(expandClassName('[&>*]:(mb-4 last:mb-0)')).toBe(
        '[&>*]:mb-4 [&>*]:last:mb-0'
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Performance
  // ═══════════════════════════════════════════════════════════════════════════

  describe('performance', () => {
    it('should handle large inputs efficiently', () => {
      const classes = Array.from({ length: 50 }, (_, i) => `hover:(bg-blue-${i * 100} text-white)`).join(' ');

      const start = performance.now();
      expandClassName(classes);
      const end = performance.now();

      expect(end - start).toBeLessThan(50); // Should be fast
    });

    it('should benefit from caching on repeated calls', () => {
      const input = 'hover:(bg-blue-500 text-white) focus:(ring-2 ring-blue-300) dark:(bg-gray-900 text-white)';

      // Warm up cache
      expandClassName(input);

      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        expandClassName(input);
      }
      const end = performance.now();

      // 1000 cached lookups should be very fast
      expect(end - start).toBeLessThan(50);
    });
  });
});
