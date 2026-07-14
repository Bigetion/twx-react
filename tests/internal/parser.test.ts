/**
 * Tests for internal parser module
 * Task 2.1: Base parser for Tailwind class strings
 */

import { parseClassName, parseClassNames } from '../../src/internal/parser';

describe('parseClassName - Base Parser (Task 2.1)', () => {
  describe('Basic utility parsing', () => {
    it('should parse simple utility with value', () => {
      const result = parseClassName('px-4');
      expect(result).toEqual({
        utility: 'px',
        value: '4',
        variants: [],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse utility with compound name and value', () => {
      const result = parseClassName('bg-blue-500');
      expect(result).toEqual({
        utility: 'bg-blue',
        value: '500',
        variants: [],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse utility without explicit value', () => {
      const result = parseClassName('flex');
      expect(result).toEqual({
        utility: 'flex',
        value: undefined,
        variants: [],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse utility with multiple hyphens in name', () => {
      const result = parseClassName('text-blue-500');
      expect(result).toEqual({
        utility: 'text-blue',
        value: '500',
        variants: [],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse utility with alphanumeric values', () => {
      const result = parseClassName('text-2xl');
      expect(result).toEqual({
        utility: 'text',
        value: '2xl',
        variants: [],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Negative values', () => {
    it('should parse negative margin', () => {
      const result = parseClassName('-m-4');
      expect(result).toEqual({
        utility: 'm',
        value: '4',
        variants: [],
        modifiers: ['negative'],
        arbitrary: undefined,
      });
    });

    it('should parse negative translate', () => {
      const result = parseClassName('-translate-x-2');
      expect(result).toEqual({
        utility: 'translate-x',
        value: '2',
        variants: [],
        modifiers: ['negative'],
        arbitrary: undefined,
      });
    });

    it('should parse negative margin with compound utility', () => {
      const result = parseClassName('-ml-8');
      expect(result).toEqual({
        utility: 'ml',
        value: '8',
        variants: [],
        modifiers: ['negative'],
        arbitrary: undefined,
      });
    });
  });

  describe('Arbitrary values', () => {
    it('should parse arbitrary width value', () => {
      const result = parseClassName('w-[200px]');
      expect(result).toEqual({
        utility: 'w',
        value: '[200px]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary color value', () => {
      const result = parseClassName('bg-[#ff0000]');
      expect(result).toEqual({
        utility: 'bg',
        value: '[#ff0000]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary value with calc', () => {
      const result = parseClassName('w-[calc(100%-2rem)]');
      expect(result).toEqual({
        utility: 'w',
        value: '[calc(100%-2rem)]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary percentage value', () => {
      const result = parseClassName('opacity-[0.85]');
      expect(result).toEqual({
        utility: 'opacity',
        value: '[0.85]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary value with spaces', () => {
      const result = parseClassName('m-[2.5rem]');
      expect(result).toEqual({
        utility: 'm',
        value: '[2.5rem]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary rgb color', () => {
      const result = parseClassName('text-[rgb(255,0,0)]');
      expect(result).toEqual({
        utility: 'text',
        value: '[rgb(255,0,0)]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      const result = parseClassName('');
      expect(result).toEqual({
        utility: '',
        variants: [],
        modifiers: [],
      });
    });

    it('should handle whitespace-only string', () => {
      const result = parseClassName('   ');
      expect(result).toEqual({
        utility: '',
        variants: [],
        modifiers: [],
      });
    });

    it('should trim whitespace from input', () => {
      const result = parseClassName('  px-4  ');
      expect(result).toEqual({
        utility: 'px',
        value: '4',
        variants: [],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should handle single character utility', () => {
      const result = parseClassName('p-4');
      expect(result).toEqual({
        utility: 'p',
        value: '4',
        variants: [],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should handle utility with no hyphen', () => {
      const result = parseClassName('container');
      expect(result).toEqual({
        utility: 'container',
        value: undefined,
        variants: [],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Complex examples', () => {
    it('should parse spacing utility', () => {
      const result = parseClassName('mt-8');
      expect(result).toEqual({
        utility: 'mt',
        value: '8',
        variants: [],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse border radius', () => {
      const result = parseClassName('rounded-lg');
      expect(result).toEqual({
        utility: 'rounded',
        value: 'lg',
        variants: [],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse shadow utility', () => {
      const result = parseClassName('shadow-xl');
      expect(result).toEqual({
        utility: 'shadow',
        value: 'xl',
        variants: [],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse grid columns', () => {
      const result = parseClassName('grid-cols-12');
      expect(result).toEqual({
        utility: 'grid-cols',
        value: '12',
        variants: [],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse z-index', () => {
      const result = parseClassName('z-50');
      expect(result).toEqual({
        utility: 'z',
        value: '50',
        variants: [],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse negative z-index', () => {
      const result = parseClassName('-z-10');
      expect(result).toEqual({
        utility: 'z',
        value: '10',
        variants: [],
        modifiers: ['negative'],
        arbitrary: undefined,
      });
    });
  });
});

describe('parseClassNames', () => {
  it('should parse multiple class strings', () => {
    const result = parseClassNames(['px-4', 'bg-blue-500', 'rounded-lg']);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      utility: 'px',
      value: '4',
      variants: [],
      modifiers: [],
      arbitrary: undefined,
    });
    expect(result[1]).toEqual({
      utility: 'bg-blue',
      value: '500',
      variants: [],
      modifiers: [],
      arbitrary: undefined,
    });
    expect(result[2]).toEqual({
      utility: 'rounded',
      value: 'lg',
      variants: [],
      modifiers: [],
      arbitrary: undefined,
    });
  });

  it('should handle empty array', () => {
    const result = parseClassNames([]);
    expect(result).toEqual([]);
  });

  it('should handle array with empty strings', () => {
    const result = parseClassNames(['', 'px-4', '']);
    expect(result).toHaveLength(3);
    expect(result[0].utility).toBe('');
    expect(result[1].utility).toBe('px');
    expect(result[2].utility).toBe('');
  });
});

describe('parseClassName - Responsive Prefix Support (Task 2.2)', () => {
  describe('Responsive breakpoint variants', () => {
    it('should parse sm: prefix', () => {
      const result = parseClassName('sm:px-4');
      expect(result).toEqual({
        utility: 'px',
        value: '4',
        variants: ['sm'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse md: prefix', () => {
      const result = parseClassName('md:bg-blue-500');
      expect(result).toEqual({
        utility: 'bg-blue',
        value: '500',
        variants: ['md'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse lg: prefix', () => {
      const result = parseClassName('lg:flex');
      expect(result).toEqual({
        utility: 'flex',
        value: undefined,
        variants: ['lg'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse xl: prefix', () => {
      const result = parseClassName('xl:grid-cols-4');
      expect(result).toEqual({
        utility: 'grid-cols',
        value: '4',
        variants: ['xl'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse 2xl: prefix', () => {
      const result = parseClassName('2xl:text-3xl');
      expect(result).toEqual({
        utility: 'text',
        value: '3xl',
        variants: ['2xl'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Container query variants', () => {
    it('should parse @sm: prefix', () => {
      const result = parseClassName('@sm:px-4');
      expect(result).toEqual({
        utility: 'px',
        value: '4',
        variants: ['@sm'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse @md: prefix', () => {
      const result = parseClassName('@md:flex');
      expect(result).toEqual({
        utility: 'flex',
        value: undefined,
        variants: ['@md'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse @lg: prefix', () => {
      const result = parseClassName('@lg:grid-cols-3');
      expect(result).toEqual({
        utility: 'grid-cols',
        value: '3',
        variants: ['@lg'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse @xl: prefix', () => {
      const result = parseClassName('@xl:text-2xl');
      expect(result).toEqual({
        utility: 'text',
        value: '2xl',
        variants: ['@xl'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse @2xl: prefix', () => {
      const result = parseClassName('@2xl:p-8');
      expect(result).toEqual({
        utility: 'p',
        value: '8',
        variants: ['@2xl'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse @3xl: prefix', () => {
      const result = parseClassName('@3xl:m-12');
      expect(result).toEqual({
        utility: 'm',
        value: '12',
        variants: ['@3xl'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse @4xl: prefix', () => {
      const result = parseClassName('@4xl:gap-6');
      expect(result).toEqual({
        utility: 'gap',
        value: '6',
        variants: ['@4xl'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse @5xl: prefix', () => {
      const result = parseClassName('@5xl:text-4xl');
      expect(result).toEqual({
        utility: 'text',
        value: '4xl',
        variants: ['@5xl'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Variant stacking', () => {
    it('should parse double stacked variants (responsive + pseudo-class)', () => {
      const result = parseClassName('md:hover:bg-blue-500');
      expect(result).toEqual({
        utility: 'bg-blue',
        value: '500',
        variants: ['md', 'hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse triple stacked variants', () => {
      const result = parseClassName('lg:dark:hover:text-white');
      expect(result).toEqual({
        utility: 'text',
        value: 'white',
        variants: ['lg', 'dark', 'hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse container query with pseudo-class', () => {
      const result = parseClassName('@md:focus:border-blue-500');
      expect(result).toEqual({
        utility: 'border-blue',
        value: '500',
        variants: ['@md', 'focus'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse responsive with group variant', () => {
      const result = parseClassName('sm:group-hover:opacity-100');
      expect(result).toEqual({
        utility: 'opacity',
        value: '100',
        variants: ['sm', 'group-hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should preserve variant order', () => {
      const result = parseClassName('xl:md:sm:px-4');
      expect(result).toEqual({
        utility: 'px',
        value: '4',
        variants: ['xl', 'md', 'sm'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Responsive with modifiers', () => {
    it('should parse responsive with negative value', () => {
      const result = parseClassName('md:-m-4');
      expect(result).toEqual({
        utility: 'm',
        value: '4',
        variants: ['md'],
        modifiers: ['negative'],
        arbitrary: undefined,
      });
    });

    it('should parse responsive with negative translate', () => {
      const result = parseClassName('lg:-translate-x-8');
      expect(result).toEqual({
        utility: 'translate-x',
        value: '8',
        variants: ['lg'],
        modifiers: ['negative'],
        arbitrary: undefined,
      });
    });

    it('should parse container query with negative value', () => {
      const result = parseClassName('@lg:-mt-12');
      expect(result).toEqual({
        utility: 'mt',
        value: '12',
        variants: ['@lg'],
        modifiers: ['negative'],
        arbitrary: undefined,
      });
    });
  });

  describe('Responsive with arbitrary values', () => {
    it('should parse responsive with arbitrary width', () => {
      const result = parseClassName('md:w-[250px]');
      expect(result).toEqual({
        utility: 'w',
        value: '[250px]',
        variants: ['md'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse responsive with arbitrary color', () => {
      const result = parseClassName('lg:bg-[#3b82f6]');
      expect(result).toEqual({
        utility: 'bg',
        value: '[#3b82f6]',
        variants: ['lg'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse container query with arbitrary value', () => {
      const result = parseClassName('@xl:max-w-[1200px]');
      expect(result).toEqual({
        utility: 'max-w',
        value: '[1200px]',
        variants: ['@xl'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse stacked variants with arbitrary value', () => {
      const result = parseClassName('sm:hover:opacity-[0.85]');
      expect(result).toEqual({
        utility: 'opacity',
        value: '[0.85]',
        variants: ['sm', 'hover'],
        modifiers: [],
        arbitrary: true,
      });
    });
  });

  describe('Complex responsive examples', () => {
    it('should parse responsive padding utility', () => {
      const result = parseClassName('sm:p-6');
      expect(result).toEqual({
        utility: 'p',
        value: '6',
        variants: ['sm'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse responsive grid template', () => {
      const result = parseClassName('md:grid-cols-12');
      expect(result).toEqual({
        utility: 'grid-cols',
        value: '12',
        variants: ['md'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse responsive text alignment', () => {
      const result = parseClassName('lg:text-center');
      expect(result).toEqual({
        utility: 'text',
        value: 'center',
        variants: ['lg'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse responsive flexbox', () => {
      const result = parseClassName('xl:flex-row');
      expect(result).toEqual({
        utility: 'flex',
        value: 'row',
        variants: ['xl'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse responsive display utility', () => {
      const result = parseClassName('2xl:hidden');
      expect(result).toEqual({
        utility: 'hidden',
        value: undefined,
        variants: ['2xl'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });
});

describe('parseClassName - Pseudo-class Variant Support (Task 2.3)', () => {
  describe('Interactive pseudo-classes', () => {
    it('should parse hover: variant', () => {
      const result = parseClassName('hover:bg-blue-500');
      expect(result).toEqual({
        utility: 'bg-blue',
        value: '500',
        variants: ['hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse focus: variant', () => {
      const result = parseClassName('focus:ring-2');
      expect(result).toEqual({
        utility: 'ring',
        value: '2',
        variants: ['focus'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse focus-visible: variant', () => {
      const result = parseClassName('focus-visible:outline-none');
      expect(result).toEqual({
        utility: 'outline',
        value: 'none',
        variants: ['focus-visible'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse focus-within: variant', () => {
      const result = parseClassName('focus-within:border-blue-500');
      expect(result).toEqual({
        utility: 'border-blue',
        value: '500',
        variants: ['focus-within'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse active: variant', () => {
      const result = parseClassName('active:scale-95');
      expect(result).toEqual({
        utility: 'scale',
        value: '95',
        variants: ['active'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse visited: variant', () => {
      const result = parseClassName('visited:text-purple-600');
      expect(result).toEqual({
        utility: 'text-purple',
        value: '600',
        variants: ['visited'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse target: variant', () => {
      const result = parseClassName('target:scroll-mt-16');
      expect(result).toEqual({
        utility: 'scroll-mt',
        value: '16',
        variants: ['target'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse disabled: variant', () => {
      const result = parseClassName('disabled:opacity-50');
      expect(result).toEqual({
        utility: 'opacity',
        value: '50',
        variants: ['disabled'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse enabled: variant', () => {
      const result = parseClassName('enabled:cursor-pointer');
      expect(result).toEqual({
        utility: 'cursor',
        value: 'pointer',
        variants: ['enabled'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse checked: variant', () => {
      const result = parseClassName('checked:bg-blue-600');
      expect(result).toEqual({
        utility: 'bg-blue',
        value: '600',
        variants: ['checked'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse indeterminate: variant', () => {
      const result = parseClassName('indeterminate:bg-gray-300');
      expect(result).toEqual({
        utility: 'bg-gray',
        value: '300',
        variants: ['indeterminate'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Form validation pseudo-classes', () => {
    it('should parse required: variant', () => {
      const result = parseClassName('required:border-red-500');
      expect(result).toEqual({
        utility: 'border-red',
        value: '500',
        variants: ['required'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse valid: variant', () => {
      const result = parseClassName('valid:border-green-500');
      expect(result).toEqual({
        utility: 'border-green',
        value: '500',
        variants: ['valid'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse invalid: variant', () => {
      const result = parseClassName('invalid:border-red-500');
      expect(result).toEqual({
        utility: 'border-red',
        value: '500',
        variants: ['invalid'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse user-valid: variant', () => {
      const result = parseClassName('user-valid:border-green-600');
      expect(result).toEqual({
        utility: 'border-green',
        value: '600',
        variants: ['user-valid'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse user-invalid: variant', () => {
      const result = parseClassName('user-invalid:border-red-600');
      expect(result).toEqual({
        utility: 'border-red',
        value: '600',
        variants: ['user-invalid'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse in-range: variant', () => {
      const result = parseClassName('in-range:border-green-500');
      expect(result).toEqual({
        utility: 'border-green',
        value: '500',
        variants: ['in-range'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse out-of-range: variant', () => {
      const result = parseClassName('out-of-range:border-red-500');
      expect(result).toEqual({
        utility: 'border-red',
        value: '500',
        variants: ['out-of-range'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse placeholder-shown: variant', () => {
      const result = parseClassName('placeholder-shown:border-gray-300');
      expect(result).toEqual({
        utility: 'border-gray',
        value: '300',
        variants: ['placeholder-shown'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse autofill: variant', () => {
      const result = parseClassName('autofill:bg-yellow-100');
      expect(result).toEqual({
        utility: 'bg-yellow',
        value: '100',
        variants: ['autofill'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse read-only: variant', () => {
      const result = parseClassName('read-only:bg-gray-100');
      expect(result).toEqual({
        utility: 'bg-gray',
        value: '100',
        variants: ['read-only'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse default: variant', () => {
      const result = parseClassName('default:ring-2');
      expect(result).toEqual({
        utility: 'ring',
        value: '2',
        variants: ['default'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse optional: variant', () => {
      const result = parseClassName('optional:text-gray-500');
      expect(result).toEqual({
        utility: 'text-gray',
        value: '500',
        variants: ['optional'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse open: variant', () => {
      const result = parseClassName('open:bg-white');
      expect(result).toEqual({
        utility: 'bg',
        value: 'white',
        variants: ['open'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Pseudo-elements', () => {
    it('should parse before: variant', () => {
      const result = parseClassName('before:content-[\'\']');
      expect(result).toEqual({
        utility: 'content',
        value: '[\'\']',
        variants: ['before'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse after: variant', () => {
      const result = parseClassName('after:absolute');
      expect(result).toEqual({
        utility: 'absolute',
        value: undefined,
        variants: ['after'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse placeholder: variant', () => {
      const result = parseClassName('placeholder:text-gray-400');
      expect(result).toEqual({
        utility: 'text-gray',
        value: '400',
        variants: ['placeholder'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse selection: variant', () => {
      const result = parseClassName('selection:bg-blue-200');
      expect(result).toEqual({
        utility: 'bg-blue',
        value: '200',
        variants: ['selection'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse first-letter: variant', () => {
      const result = parseClassName('first-letter:text-7xl');
      expect(result).toEqual({
        utility: 'text',
        value: '7xl',
        variants: ['first-letter'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse first-line: variant', () => {
      const result = parseClassName('first-line:font-bold');
      expect(result).toEqual({
        utility: 'font',
        value: 'bold',
        variants: ['first-line'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse marker: variant', () => {
      const result = parseClassName('marker:text-blue-600');
      expect(result).toEqual({
        utility: 'text-blue',
        value: '600',
        variants: ['marker'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse file: variant', () => {
      const result = parseClassName('file:mr-4');
      expect(result).toEqual({
        utility: 'mr',
        value: '4',
        variants: ['file'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse backdrop: variant', () => {
      const result = parseClassName('backdrop:bg-black');
      expect(result).toEqual({
        utility: 'bg',
        value: 'black',
        variants: ['backdrop'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Structural pseudo-classes', () => {
    it('should parse first: variant', () => {
      const result = parseClassName('first:mt-0');
      expect(result).toEqual({
        utility: 'mt',
        value: '0',
        variants: ['first'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse last: variant', () => {
      const result = parseClassName('last:mb-0');
      expect(result).toEqual({
        utility: 'mb',
        value: '0',
        variants: ['last'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse odd: variant', () => {
      const result = parseClassName('odd:bg-gray-100');
      expect(result).toEqual({
        utility: 'bg-gray',
        value: '100',
        variants: ['odd'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse even: variant', () => {
      const result = parseClassName('even:bg-white');
      expect(result).toEqual({
        utility: 'bg',
        value: 'white',
        variants: ['even'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse first-of-type: variant', () => {
      const result = parseClassName('first-of-type:pt-0');
      expect(result).toEqual({
        utility: 'pt',
        value: '0',
        variants: ['first-of-type'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse last-of-type: variant', () => {
      const result = parseClassName('last-of-type:pb-0');
      expect(result).toEqual({
        utility: 'pb',
        value: '0',
        variants: ['last-of-type'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse only: variant', () => {
      const result = parseClassName('only:mx-auto');
      expect(result).toEqual({
        utility: 'mx',
        value: 'auto',
        variants: ['only'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse only-of-type: variant', () => {
      const result = parseClassName('only-of-type:border-0');
      expect(result).toEqual({
        utility: 'border',
        value: '0',
        variants: ['only-of-type'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse empty: variant', () => {
      const result = parseClassName('empty:hidden');
      expect(result).toEqual({
        utility: 'hidden',
        value: undefined,
        variants: ['empty'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Group and peer variants (Task 2.4)', () => {
    describe('Group variants', () => {
      it('should parse group-hover: variant', () => {
        const result = parseClassName('group-hover:opacity-100');
        expect(result).toEqual({
          utility: 'opacity',
          value: '100',
          variants: ['group-hover'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse group-focus: variant', () => {
        const result = parseClassName('group-focus:ring-2');
        expect(result).toEqual({
          utility: 'ring',
          value: '2',
          variants: ['group-focus'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse group-active: variant', () => {
        const result = parseClassName('group-active:scale-95');
        expect(result).toEqual({
          utility: 'scale',
          value: '95',
          variants: ['group-active'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse group-visited: variant', () => {
        const result = parseClassName('group-visited:text-purple-600');
        expect(result).toEqual({
          utility: 'text-purple',
          value: '600',
          variants: ['group-visited'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse group-disabled: variant', () => {
        const result = parseClassName('group-disabled:opacity-50');
        expect(result).toEqual({
          utility: 'opacity',
          value: '50',
          variants: ['group-disabled'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse group-checked: variant', () => {
        const result = parseClassName('group-checked:bg-blue-500');
        expect(result).toEqual({
          utility: 'bg-blue',
          value: '500',
          variants: ['group-checked'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse group-valid: variant', () => {
        const result = parseClassName('group-valid:border-green-500');
        expect(result).toEqual({
          utility: 'border-green',
          value: '500',
          variants: ['group-valid'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse group-invalid: variant', () => {
        const result = parseClassName('group-invalid:border-red-500');
        expect(result).toEqual({
          utility: 'border-red',
          value: '500',
          variants: ['group-invalid'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse group-first: variant', () => {
        const result = parseClassName('group-first:mt-0');
        expect(result).toEqual({
          utility: 'mt',
          value: '0',
          variants: ['group-first'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse group-last: variant', () => {
        const result = parseClassName('group-last:mb-0');
        expect(result).toEqual({
          utility: 'mb',
          value: '0',
          variants: ['group-last'],
          modifiers: [],
          arbitrary: undefined,
        });
      });
    });

    describe('Peer variants', () => {
      it('should parse peer-hover: variant', () => {
        const result = parseClassName('peer-hover:text-blue-600');
        expect(result).toEqual({
          utility: 'text-blue',
          value: '600',
          variants: ['peer-hover'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse peer-focus: variant', () => {
        const result = parseClassName('peer-focus:border-blue-500');
        expect(result).toEqual({
          utility: 'border-blue',
          value: '500',
          variants: ['peer-focus'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse peer-active: variant', () => {
        const result = parseClassName('peer-active:bg-gray-100');
        expect(result).toEqual({
          utility: 'bg-gray',
          value: '100',
          variants: ['peer-active'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse peer-checked: variant', () => {
        const result = parseClassName('peer-checked:bg-blue-500');
        expect(result).toEqual({
          utility: 'bg-blue',
          value: '500',
          variants: ['peer-checked'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse peer-disabled: variant', () => {
        const result = parseClassName('peer-disabled:opacity-50');
        expect(result).toEqual({
          utility: 'opacity',
          value: '50',
          variants: ['peer-disabled'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse peer-valid: variant', () => {
        const result = parseClassName('peer-valid:block');
        expect(result).toEqual({
          utility: 'block',
          value: undefined,
          variants: ['peer-valid'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse peer-invalid: variant', () => {
        const result = parseClassName('peer-invalid:text-red-600');
        expect(result).toEqual({
          utility: 'text-red',
          value: '600',
          variants: ['peer-invalid'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse peer-required: variant', () => {
        const result = parseClassName('peer-required:block');
        expect(result).toEqual({
          utility: 'block',
          value: undefined,
          variants: ['peer-required'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse peer-optional: variant', () => {
        const result = parseClassName('peer-optional:hidden');
        expect(result).toEqual({
          utility: 'hidden',
          value: undefined,
          variants: ['peer-optional'],
          modifiers: [],
          arbitrary: undefined,
        });
      });

      it('should parse peer-placeholder-shown: variant', () => {
        const result = parseClassName('peer-placeholder-shown:text-gray-400');
        expect(result).toEqual({
          utility: 'text-gray',
          value: '400',
          variants: ['peer-placeholder-shown'],
          modifiers: [],
          arbitrary: undefined,
        });
      });
    });
  });

  describe('In-* variants (group-based) (Task 2.4)', () => {
    it('should parse in-hover: variant (equivalent to group-hover)', () => {
      const result = parseClassName('in-hover:text-blue-600');
      expect(result).toEqual({
        utility: 'text-blue',
        value: '600',
        variants: ['in-hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse in-focus: variant (equivalent to group-focus)', () => {
      const result = parseClassName('in-focus:ring-2');
      expect(result).toEqual({
        utility: 'ring',
        value: '2',
        variants: ['in-focus'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse in-active: variant', () => {
      const result = parseClassName('in-active:bg-gray-100');
      expect(result).toEqual({
        utility: 'bg-gray',
        value: '100',
        variants: ['in-active'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse in-disabled: variant', () => {
      const result = parseClassName('in-disabled:opacity-50');
      expect(result).toEqual({
        utility: 'opacity',
        value: '50',
        variants: ['in-disabled'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse in-checked: variant', () => {
      const result = parseClassName('in-checked:text-green-600');
      expect(result).toEqual({
        utility: 'text-green',
        value: '600',
        variants: ['in-checked'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse in-valid: variant', () => {
      const result = parseClassName('in-valid:border-green-500');
      expect(result).toEqual({
        utility: 'border-green',
        value: '500',
        variants: ['in-valid'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse in-invalid: variant', () => {
      const result = parseClassName('in-invalid:border-red-500');
      expect(result).toEqual({
        utility: 'border-red',
        value: '500',
        variants: ['in-invalid'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Not-* variants (negation) (Task 2.4)', () => {
    it('should parse not-hover: variant', () => {
      const result = parseClassName('not-hover:opacity-50');
      expect(result).toEqual({
        utility: 'opacity',
        value: '50',
        variants: ['not-hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse not-focus: variant', () => {
      const result = parseClassName('not-focus:border-gray-300');
      expect(result).toEqual({
        utility: 'border-gray',
        value: '300',
        variants: ['not-focus'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse not-active: variant', () => {
      const result = parseClassName('not-active:bg-white');
      expect(result).toEqual({
        utility: 'bg',
        value: 'white',
        variants: ['not-active'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse not-disabled: variant', () => {
      const result = parseClassName('not-disabled:cursor-pointer');
      expect(result).toEqual({
        utility: 'cursor',
        value: 'pointer',
        variants: ['not-disabled'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse not-checked: variant', () => {
      const result = parseClassName('not-checked:bg-white');
      expect(result).toEqual({
        utility: 'bg',
        value: 'white',
        variants: ['not-checked'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse not-first: variant', () => {
      const result = parseClassName('not-first:mt-4');
      expect(result).toEqual({
        utility: 'mt',
        value: '4',
        variants: ['not-first'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse not-last: variant', () => {
      const result = parseClassName('not-last:mb-4');
      expect(result).toEqual({
        utility: 'mb',
        value: '4',
        variants: ['not-last'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse not-visited: variant', () => {
      const result = parseClassName('not-visited:text-blue-600');
      expect(result).toEqual({
        utility: 'text-blue',
        value: '600',
        variants: ['not-visited'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse not-empty: variant', () => {
      const result = parseClassName('not-empty:p-4');
      expect(result).toEqual({
        utility: 'p',
        value: '4',
        variants: ['not-empty'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Other variants', () => {
    it('should parse dark: variant', () => {
      const result = parseClassName('dark:bg-gray-900');
      expect(result).toEqual({
        utility: 'bg-gray',
        value: '900',
        variants: ['dark'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse starting: variant (Tailwind v4)', () => {
      const result = parseClassName('starting:opacity-0');
      expect(result).toEqual({
        utility: 'opacity',
        value: '0',
        variants: ['starting'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Group/peer/in/not variant stacking (Task 2.4)', () => {
    it('should parse responsive + group variant', () => {
      const result = parseClassName('md:group-hover:bg-blue-500');
      expect(result).toEqual({
        utility: 'bg-blue',
        value: '500',
        variants: ['md', 'group-hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse responsive + peer variant', () => {
      const result = parseClassName('lg:peer-checked:text-green-600');
      expect(result).toEqual({
        utility: 'text-green',
        value: '600',
        variants: ['lg', 'peer-checked'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse responsive + in variant', () => {
      const result = parseClassName('sm:in-hover:opacity-100');
      expect(result).toEqual({
        utility: 'opacity',
        value: '100',
        variants: ['sm', 'in-hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse responsive + not variant', () => {
      const result = parseClassName('xl:not-disabled:cursor-pointer');
      expect(result).toEqual({
        utility: 'cursor',
        value: 'pointer',
        variants: ['xl', 'not-disabled'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse dark mode + group variant', () => {
      const result = parseClassName('dark:group-hover:bg-slate-700');
      expect(result).toEqual({
        utility: 'bg-slate',
        value: '700',
        variants: ['dark', 'group-hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse dark mode + peer variant', () => {
      const result = parseClassName('dark:peer-focus:border-blue-400');
      expect(result).toEqual({
        utility: 'border-blue',
        value: '400',
        variants: ['dark', 'peer-focus'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse container query + group variant', () => {
      const result = parseClassName('@lg:group-focus:ring-4');
      expect(result).toEqual({
        utility: 'ring',
        value: '4',
        variants: ['@lg', 'group-focus'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse container query + peer variant', () => {
      const result = parseClassName('@md:peer-hover:scale-105');
      expect(result).toEqual({
        utility: 'scale',
        value: '105',
        variants: ['@md', 'peer-hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse triple stack: responsive + dark + group', () => {
      const result = parseClassName('lg:dark:group-hover:text-white');
      expect(result).toEqual({
        utility: 'text',
        value: 'white',
        variants: ['lg', 'dark', 'group-hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse triple stack: responsive + dark + peer', () => {
      const result = parseClassName('md:dark:peer-checked:bg-blue-500');
      expect(result).toEqual({
        utility: 'bg-blue',
        value: '500',
        variants: ['md', 'dark', 'peer-checked'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse group variant with negative value', () => {
      const result = parseClassName('group-hover:-translate-y-2');
      expect(result).toEqual({
        utility: 'translate-y',
        value: '2',
        variants: ['group-hover'],
        modifiers: ['negative'],
        arbitrary: undefined,
      });
    });

    it('should parse peer variant with negative value', () => {
      const result = parseClassName('peer-focus:-mt-1');
      expect(result).toEqual({
        utility: 'mt',
        value: '1',
        variants: ['peer-focus'],
        modifiers: ['negative'],
        arbitrary: undefined,
      });
    });

    it('should parse group variant with arbitrary value', () => {
      const result = parseClassName('group-hover:bg-[#3b82f6]');
      expect(result).toEqual({
        utility: 'bg',
        value: '[#3b82f6]',
        variants: ['group-hover'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse peer variant with arbitrary value', () => {
      const result = parseClassName('peer-checked:w-[250px]');
      expect(result).toEqual({
        utility: 'w',
        value: '[250px]',
        variants: ['peer-checked'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse in variant with arbitrary value', () => {
      const result = parseClassName('in-hover:opacity-[0.85]');
      expect(result).toEqual({
        utility: 'opacity',
        value: '[0.85]',
        variants: ['in-hover'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse not variant with arbitrary value', () => {
      const result = parseClassName('not-disabled:ring-[3px]');
      expect(result).toEqual({
        utility: 'ring',
        value: '[3px]',
        variants: ['not-disabled'],
        modifiers: [],
        arbitrary: true,
      });
    });
    it('should parse responsive + pseudo-class', () => {
      const result = parseClassName('md:hover:bg-blue-700');
      expect(result).toEqual({
        utility: 'bg-blue',
        value: '700',
        variants: ['md', 'hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse container query + pseudo-class', () => {
      const result = parseClassName('@lg:focus:ring-4');
      expect(result).toEqual({
        utility: 'ring',
        value: '4',
        variants: ['@lg', 'focus'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse dark mode + pseudo-class', () => {
      const result = parseClassName('dark:hover:text-white');
      expect(result).toEqual({
        utility: 'text',
        value: 'white',
        variants: ['dark', 'hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse triple variant stack', () => {
      const result = parseClassName('lg:dark:hover:bg-slate-800');
      expect(result).toEqual({
        utility: 'bg-slate',
        value: '800',
        variants: ['lg', 'dark', 'hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse quadruple variant stack', () => {
      const result = parseClassName('xl:dark:group-hover:focus:text-blue-500');
      expect(result).toEqual({
        utility: 'text-blue',
        value: '500',
        variants: ['xl', 'dark', 'group-hover', 'focus'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse pseudo-element + responsive', () => {
      const result = parseClassName('md:before:content-[\'\']');
      expect(result).toEqual({
        utility: 'content',
        value: '[\'\']',
        variants: ['md', 'before'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse structural + responsive', () => {
      const result = parseClassName('lg:first:mt-0');
      expect(result).toEqual({
        utility: 'mt',
        value: '0',
        variants: ['lg', 'first'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse peer variant + responsive', () => {
      const result = parseClassName('md:peer-checked:bg-blue-100');
      expect(result).toEqual({
        utility: 'bg-blue',
        value: '100',
        variants: ['md', 'peer-checked'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Pseudo-classes with modifiers', () => {
    it('should parse hover with negative value', () => {
      const result = parseClassName('hover:-translate-y-1');
      expect(result).toEqual({
        utility: 'translate-y',
        value: '1',
        variants: ['hover'],
        modifiers: ['negative'],
        arbitrary: undefined,
      });
    });

    it('should parse focus with negative margin', () => {
      const result = parseClassName('focus:-m-2');
      expect(result).toEqual({
        utility: 'm',
        value: '2',
        variants: ['focus'],
        modifiers: ['negative'],
        arbitrary: undefined,
      });
    });

    it('should parse active with negative scale', () => {
      const result = parseClassName('active:-rotate-1');
      expect(result).toEqual({
        utility: 'rotate',
        value: '1',
        variants: ['active'],
        modifiers: ['negative'],
        arbitrary: undefined,
      });
    });
  });

  describe('Pseudo-classes with arbitrary values', () => {
    it('should parse hover with arbitrary color', () => {
      const result = parseClassName('hover:bg-[#3b82f6]');
      expect(result).toEqual({
        utility: 'bg',
        value: '[#3b82f6]',
        variants: ['hover'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse focus with arbitrary width', () => {
      const result = parseClassName('focus:ring-[3px]');
      expect(result).toEqual({
        utility: 'ring',
        value: '[3px]',
        variants: ['focus'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse before with arbitrary content', () => {
      const result = parseClassName('before:content-[\'→\']');
      expect(result).toEqual({
        utility: 'content',
        value: '[\'→\']',
        variants: ['before'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse placeholder with arbitrary opacity', () => {
      const result = parseClassName('placeholder:opacity-[0.65]');
      expect(result).toEqual({
        utility: 'opacity',
        value: '[0.65]',
        variants: ['placeholder'],
        modifiers: [],
        arbitrary: true,
      });
    });
  });

  describe('Complex real-world examples', () => {
    it('should parse interactive button hover state', () => {
      const result = parseClassName('hover:shadow-lg');
      expect(result).toEqual({
        utility: 'shadow',
        value: 'lg',
        variants: ['hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse form input focus state', () => {
      const result = parseClassName('focus:border-blue-500');
      expect(result).toEqual({
        utility: 'border-blue',
        value: '500',
        variants: ['focus'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse disabled button state', () => {
      const result = parseClassName('disabled:cursor-not-allowed');
      expect(result).toEqual({
        utility: 'cursor',
        value: 'not-allowed',
        variants: ['disabled'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse checkbox checked state', () => {
      const result = parseClassName('checked:border-transparent');
      expect(result).toEqual({
        utility: 'border',
        value: 'transparent',
        variants: ['checked'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse list item marker', () => {
      const result = parseClassName('marker:text-sky-400');
      expect(result).toEqual({
        utility: 'text-sky',
        value: '400',
        variants: ['marker'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse text selection', () => {
      const result = parseClassName('selection:bg-fuchsia-300');
      expect(result).toEqual({
        utility: 'bg-fuchsia',
        value: '300',
        variants: ['selection'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse table row alternating colors', () => {
      const result = parseClassName('odd:bg-gray-50');
      expect(result).toEqual({
        utility: 'bg-gray',
        value: '50',
        variants: ['odd'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse group card hover effect', () => {
      const result = parseClassName('group-hover:translate-y-0');
      expect(result).toEqual({
        utility: 'translate-y',
        value: '0',
        variants: ['group-hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse dark mode with hover', () => {
      const result = parseClassName('dark:hover:bg-slate-700');
      expect(result).toEqual({
        utility: 'bg-slate',
        value: '700',
        variants: ['dark', 'hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });
});

describe('parseClassName - Dark Mode and Arbitrary Value Support (Task 2.5)', () => {
  describe('Dark mode variant', () => {
    it('should parse dark: prefix', () => {
      const result = parseClassName('dark:bg-slate-800');
      expect(result).toEqual({
        utility: 'bg-slate',
        value: '800',
        variants: ['dark'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse dark: with text color', () => {
      const result = parseClassName('dark:text-white');
      expect(result).toEqual({
        utility: 'text',
        value: 'white',
        variants: ['dark'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse dark: with border color', () => {
      const result = parseClassName('dark:border-gray-700');
      expect(result).toEqual({
        utility: 'border-gray',
        value: '700',
        variants: ['dark'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse dark: with utility without value', () => {
      const result = parseClassName('dark:hidden');
      expect(result).toEqual({
        utility: 'hidden',
        value: undefined,
        variants: ['dark'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse dark: with responsive', () => {
      const result = parseClassName('md:dark:bg-gray-900');
      expect(result).toEqual({
        utility: 'bg-gray',
        value: '900',
        variants: ['md', 'dark'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse dark: with hover', () => {
      const result = parseClassName('dark:hover:bg-slate-700');
      expect(result).toEqual({
        utility: 'bg-slate',
        value: '700',
        variants: ['dark', 'hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse dark: with group variant', () => {
      const result = parseClassName('dark:group-hover:text-gray-100');
      expect(result).toEqual({
        utility: 'text-gray',
        value: '100',
        variants: ['dark', 'group-hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse triple stack with dark mode', () => {
      const result = parseClassName('lg:dark:hover:text-white');
      expect(result).toEqual({
        utility: 'text',
        value: 'white',
        variants: ['lg', 'dark', 'hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });
  });

  describe('Arbitrary values (verified from Task 2.1)', () => {
    it('should parse arbitrary width', () => {
      const result = parseClassName('w-[200px]');
      expect(result).toEqual({
        utility: 'w',
        value: '[200px]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary background color with hex', () => {
      const result = parseClassName('bg-[#ff0000]');
      expect(result).toEqual({
        utility: 'bg',
        value: '[#ff0000]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary padding with rem', () => {
      const result = parseClassName('p-[2.5rem]');
      expect(result).toEqual({
        utility: 'p',
        value: '[2.5rem]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary value with calc', () => {
      const result = parseClassName('w-[calc(100%-2rem)]');
      expect(result).toEqual({
        utility: 'w',
        value: '[calc(100%-2rem)]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary opacity', () => {
      const result = parseClassName('opacity-[0.85]');
      expect(result).toEqual({
        utility: 'opacity',
        value: '[0.85]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary rgb color', () => {
      const result = parseClassName('text-[rgb(255,0,0)]');
      expect(result).toEqual({
        utility: 'text',
        value: '[rgb(255,0,0)]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary oklch color', () => {
      const result = parseClassName('bg-[oklch(0.5_0.2_200)]');
      expect(result).toEqual({
        utility: 'bg',
        value: '[oklch(0.5_0.2_200)]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary percentage width', () => {
      const result = parseClassName('w-[33.333%]');
      expect(result).toEqual({
        utility: 'w',
        value: '[33.333%]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary viewport height', () => {
      const result = parseClassName('h-[50vh]');
      expect(result).toEqual({
        utility: 'h',
        value: '[50vh]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary max-width', () => {
      const result = parseClassName('max-w-[1200px]');
      expect(result).toEqual({
        utility: 'max-w',
        value: '[1200px]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });
  });

  describe('Arbitrary CSS properties (NEW)', () => {
    it('should parse arbitrary text-decoration property', () => {
      const result = parseClassName('[text-decoration:underline]');
      expect(result).toEqual({
        utility: 'text-decoration',
        value: 'underline',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary display property', () => {
      const result = parseClassName('[display:flex]');
      expect(result).toEqual({
        utility: 'display',
        value: 'flex',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary color property', () => {
      const result = parseClassName('[color:red]');
      expect(result).toEqual({
        utility: 'color',
        value: 'red',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary padding property with value', () => {
      const result = parseClassName('[padding:2rem]');
      expect(result).toEqual({
        utility: 'padding',
        value: '2rem',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary margin property with value', () => {
      const result = parseClassName('[margin:auto]');
      expect(result).toEqual({
        utility: 'margin',
        value: 'auto',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary background-color with hex', () => {
      const result = parseClassName('[background-color:#3b82f6]');
      expect(result).toEqual({
        utility: 'background-color',
        value: '#3b82f6',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary font-size with line-height', () => {
      const result = parseClassName('[font-size:1.5rem]');
      expect(result).toEqual({
        utility: 'font-size',
        value: '1.5rem',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary border-radius', () => {
      const result = parseClassName('[border-radius:0.5rem]');
      expect(result).toEqual({
        utility: 'border-radius',
        value: '0.5rem',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary box-shadow', () => {
      const result = parseClassName('[box-shadow:0_4px_6px_rgba(0,0,0,0.1)]');
      expect(result).toEqual({
        utility: 'box-shadow',
        value: '0_4px_6px_rgba(0,0,0,0.1)',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary transform', () => {
      const result = parseClassName('[transform:rotate(45deg)]');
      expect(result).toEqual({
        utility: 'transform',
        value: 'rotate(45deg)',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary grid-template-columns', () => {
      const result = parseClassName('[grid-template-columns:repeat(3,1fr)]');
      expect(result).toEqual({
        utility: 'grid-template-columns',
        value: 'repeat(3,1fr)',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary z-index', () => {
      const result = parseClassName('[z-index:9999]');
      expect(result).toEqual({
        utility: 'z-index',
        value: '9999',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary line-height', () => {
      const result = parseClassName('[line-height:1.75]');
      expect(result).toEqual({
        utility: 'line-height',
        value: '1.75',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary letter-spacing', () => {
      const result = parseClassName('[letter-spacing:0.05em]');
      expect(result).toEqual({
        utility: 'letter-spacing',
        value: '0.05em',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary text-shadow', () => {
      const result = parseClassName('[text-shadow:1px_1px_2px_black]');
      expect(result).toEqual({
        utility: 'text-shadow',
        value: '1px_1px_2px_black',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });
  });

  describe('Arbitrary CSS properties with variants', () => {
    it('should parse hover with arbitrary CSS property', () => {
      const result = parseClassName('hover:[text-decoration:underline]');
      expect(result).toEqual({
        utility: 'text-decoration',
        value: 'underline',
        variants: ['hover'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse focus with arbitrary CSS property', () => {
      const result = parseClassName('focus:[outline:2px_solid_blue]');
      expect(result).toEqual({
        utility: 'outline',
        value: '2px_solid_blue',
        variants: ['focus'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse dark mode with arbitrary CSS property', () => {
      const result = parseClassName('dark:[color:#e5e7eb]');
      expect(result).toEqual({
        utility: 'color',
        value: '#e5e7eb',
        variants: ['dark'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse responsive with arbitrary CSS property', () => {
      const result = parseClassName('md:[padding:2rem]');
      expect(result).toEqual({
        utility: 'padding',
        value: '2rem',
        variants: ['md'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse double stacked variants with arbitrary CSS property', () => {
      const result = parseClassName('md:hover:[display:block]');
      expect(result).toEqual({
        utility: 'display',
        value: 'block',
        variants: ['md', 'hover'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse dark mode + hover with arbitrary CSS property', () => {
      const result = parseClassName('dark:hover:[background-color:#1e293b]');
      expect(result).toEqual({
        utility: 'background-color',
        value: '#1e293b',
        variants: ['dark', 'hover'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse triple stack with arbitrary CSS property', () => {
      const result = parseClassName('lg:dark:hover:[transform:scale(1.1)]');
      expect(result).toEqual({
        utility: 'transform',
        value: 'scale(1.1)',
        variants: ['lg', 'dark', 'hover'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse group-hover with arbitrary CSS property', () => {
      const result = parseClassName('group-hover:[opacity:1]');
      expect(result).toEqual({
        utility: 'opacity',
        value: '1',
        variants: ['group-hover'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse peer-checked with arbitrary CSS property', () => {
      const result = parseClassName('peer-checked:[display:block]');
      expect(result).toEqual({
        utility: 'display',
        value: 'block',
        variants: ['peer-checked'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse before pseudo-element with arbitrary CSS property', () => {
      const result = parseClassName('before:[content:"→"]');
      expect(result).toEqual({
        utility: 'content',
        value: '"→"',
        variants: ['before'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse after pseudo-element with arbitrary CSS property', () => {
      const result = parseClassName('after:[position:absolute]');
      expect(result).toEqual({
        utility: 'position',
        value: 'absolute',
        variants: ['after'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse container query with arbitrary CSS property', () => {
      const result = parseClassName('@lg:[gap:2rem]');
      expect(result).toEqual({
        utility: 'gap',
        value: '2rem',
        variants: ['@lg'],
        modifiers: [],
        arbitrary: true,
      });
    });
  });

  describe('Dark mode with arbitrary values', () => {
    it('should parse dark: with arbitrary color', () => {
      const result = parseClassName('dark:bg-[#1e293b]');
      expect(result).toEqual({
        utility: 'bg',
        value: '[#1e293b]',
        variants: ['dark'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse dark: with arbitrary text color', () => {
      const result = parseClassName('dark:text-[#e5e7eb]');
      expect(result).toEqual({
        utility: 'text',
        value: '[#e5e7eb]',
        variants: ['dark'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse dark: with arbitrary border color', () => {
      const result = parseClassName('dark:border-[#374151]');
      expect(result).toEqual({
        utility: 'border',
        value: '[#374151]',
        variants: ['dark'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse dark: with arbitrary opacity', () => {
      const result = parseClassName('dark:opacity-[0.9]');
      expect(result).toEqual({
        utility: 'opacity',
        value: '[0.9]',
        variants: ['dark'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse responsive + dark with arbitrary value', () => {
      const result = parseClassName('md:dark:bg-[#0f172a]');
      expect(result).toEqual({
        utility: 'bg',
        value: '[#0f172a]',
        variants: ['md', 'dark'],
        modifiers: [],
        arbitrary: true,
      });
    });
  });

  describe('Complex Task 2.5 real-world examples', () => {
    it('should parse dark mode background', () => {
      const result = parseClassName('dark:bg-gray-900');
      expect(result).toEqual({
        utility: 'bg-gray',
        value: '900',
        variants: ['dark'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse dark mode with hover effect', () => {
      const result = parseClassName('dark:hover:bg-gray-800');
      expect(result).toEqual({
        utility: 'bg-gray',
        value: '800',
        variants: ['dark', 'hover'],
        modifiers: [],
        arbitrary: undefined,
      });
    });

    it('should parse arbitrary width for custom size', () => {
      const result = parseClassName('w-[350px]');
      expect(result).toEqual({
        utility: 'w',
        value: '[350px]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary brand color', () => {
      const result = parseClassName('bg-[#ff6b6b]');
      expect(result).toEqual({
        utility: 'bg',
        value: '[#ff6b6b]',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary CSS for custom property', () => {
      const result = parseClassName('[mask-image:linear-gradient(to_bottom,transparent,black)]');
      expect(result).toEqual({
        utility: 'mask-image',
        value: 'linear-gradient(to_bottom,transparent,black)',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse hover with arbitrary underline', () => {
      const result = parseClassName('hover:[text-decoration:underline]');
      expect(result).toEqual({
        utility: 'text-decoration',
        value: 'underline',
        variants: ['hover'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse responsive dark mode arbitrary color', () => {
      const result = parseClassName('lg:dark:bg-[#0a0a0a]');
      expect(result).toEqual({
        utility: 'bg',
        value: '[#0a0a0a]',
        variants: ['lg', 'dark'],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse custom property for animation', () => {
      const result = parseClassName('[animation-duration:2s]');
      expect(result).toEqual({
        utility: 'animation-duration',
        value: '2s',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary CSS for scrollbar', () => {
      const result = parseClassName('[scrollbar-width:thin]');
      expect(result).toEqual({
        utility: 'scrollbar-width',
        value: 'thin',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });

    it('should parse arbitrary aspect ratio', () => {
      const result = parseClassName('[aspect-ratio:16/9]');
      expect(result).toEqual({
        utility: 'aspect-ratio',
        value: '16/9',
        variants: [],
        modifiers: [],
        arbitrary: true,
      });
    });
  });
});
