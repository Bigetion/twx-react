import { initializeBuilders } from '../src/internal/init';
import { parseClassName } from '../src/internal/parser';
import { generateCSSString, getRegisteredUtilities } from '../src/internal/generator';
import { clearInjectedStyles, extractCriticalCSS, injectCSS } from '../src/internal/injector';

// Ensure builders are registered
initializeBuilders();

const testClasses = [
  'rounded-lg',
  'px-4',
  'py-2',
  'gap-6',
  'inline-flex',
  'flex-col',
  'items-center',
  'justify-center',
  'w-full',
  'text-white',
  'bg-blue-600',
  'font-medium',
  'transition-all',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-offset-2',
  'hover:bg-blue-700',
];

describe('Utility CSS generation', () => {
  it('should have key utilities registered', () => {
    const registered = getRegisteredUtilities();
    expect(registered.length).toBeGreaterThan(300);

    for (const name of ['px', 'py', 'rounded', 'gap', 'inline-flex', 'flex-col', 'items', 'justify', 'w', 'text', 'font', 'transition']) {
      expect(registered).toContain(name);
    }
  });

  for (const className of testClasses) {
    it(`should generate CSS for "${className}"`, () => {
      const parsed = parseClassName(className);
      const css = generateCSSString(parsed, className);

      expect(css).not.toBeNull();
      expect(css).toContain('{');
    });
  }

  describe('CSS injection flow', () => {
    beforeEach(() => {
      clearInjectedStyles();
    });

    it('should inject base classes (inline-flex, rounded-lg, font-medium, etc.)', () => {
      const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all';
      const tokens = baseClasses.split(/\s+/).filter(Boolean);

      for (const token of tokens) {
        const parsed = parseClassName(token);
        if (!parsed.utility) continue;
        const css = generateCSSString(parsed, token);
        if (css) {
          injectCSS(css);
        }
      }

      const allCSS = extractCriticalCSS();
      expect(allCSS).toContain('inline-flex');
      expect(allCSS).toContain('border-radius');
      expect(allCSS).toContain('font-weight');
      expect(allCSS).toContain('transition');
    });

    it('should inject variant classes (px-4, py-2, gap-6)', () => {
      const variantClasses = 'text-base px-4 py-2 gap-2';
      const tokens = variantClasses.split(/\s+/).filter(Boolean);

      for (const token of tokens) {
        const parsed = parseClassName(token);
        if (!parsed.utility) continue;
        const css = generateCSSString(parsed, token);
        if (css) {
          injectCSS(css);
        }
      }

      const allCSS = extractCriticalCSS();
      expect(allCSS).toContain('padding-left: 1rem');
      expect(allCSS).toContain('padding-right: 1rem');
      expect(allCSS).toContain('padding-top: 0.5rem');
      expect(allCSS).toContain('padding-bottom: 0.5rem');
      expect(allCSS).toContain('gap: 0.5rem');
    });
  });

  describe('Focus variant utilities', () => {
    it('should parse focus:outline-none correctly', () => {
      const parsed = parseClassName('focus:outline-none');
      expect(parsed.variants).toEqual(['focus']);
      expect(parsed.utility).toBe('outline');
      expect(parsed.value).toBe('none');
    });

    it('should parse focus:ring-2 correctly', () => {
      const parsed = parseClassName('focus:ring-2');
      expect(parsed.variants).toEqual(['focus']);
      expect(parsed.utility).toBe('ring');
      expect(parsed.value).toBe('2');
    });

    it('should parse focus:ring-offset-2 correctly', () => {
      const parsed = parseClassName('focus:ring-offset-2');
      expect(parsed.variants).toEqual(['focus']);
      expect(parsed.utility).toBe('ring-offset');
      expect(parsed.value).toBe('2');
    });

    it('should parse hover:bg-blue-700 correctly', () => {
      const parsed = parseClassName('hover:bg-blue-700');
      expect(parsed.variants).toEqual(['hover']);
      expect(parsed.utility).toBe('bg-blue');
      expect(parsed.value).toBe('700');
    });

    it('should generate CSS for focus:outline-none with :focus pseudo-class', () => {
      const parsed = parseClassName('focus:outline-none');
      const css = generateCSSString(parsed, 'focus:outline-none');
      expect(css).not.toBeNull();
      expect(css).toContain(':focus');
      expect(css).toContain('outline');
    });

    it('should generate CSS for focus:ring-2 with :focus pseudo-class', () => {
      const parsed = parseClassName('focus:ring-2');
      const css = generateCSSString(parsed, 'focus:ring-2');
      expect(css).not.toBeNull();
      expect(css).toContain(':focus');
      expect(css).toContain('box-shadow');
    });

    it('should generate CSS for focus:ring-offset-2 with :focus pseudo-class', () => {
      const parsed = parseClassName('focus:ring-offset-2');
      const css = generateCSSString(parsed, 'focus:ring-offset-2');
      expect(css).not.toBeNull();
      expect(css).toContain(':focus');
      expect(css).toContain('--tw-ring-offset-width');
    });

    it('should generate CSS for hover:bg-blue-700 with :hover pseudo-class', () => {
      const parsed = parseClassName('hover:bg-blue-700');
      const css = generateCSSString(parsed, 'hover:bg-blue-700');
      expect(css).not.toBeNull();
      expect(css).toContain(':hover');
      expect(css).toContain('background-color');
    });

    it('should have outline and ring utilities registered', () => {
      const registered = getRegisteredUtilities();
      expect(registered).toContain('outline');
      expect(registered).toContain('ring');
      expect(registered).toContain('ring-offset');
    });
  });
});


describe('Color utility CSS generation for TypeScript example', () => {
  const colorClasses = [
    'bg-green-100',
    'bg-gray-100',
    'bg-red-100',
    'bg-blue-50',
    'bg-yellow-50',
    'bg-purple-100',
    'border-blue-200',
    'border-red-300',
    'border-green-300',
    'text-green-800',
    'text-gray-700',
    'text-purple-700',
    'opacity-60',
    'bg-gray-50',
  ];

  for (const className of colorClasses) {
    it(`should generate CSS for "${className}"`, () => {
      const parsed = parseClassName(className);
      const css = generateCSSString(parsed, className);
      if (!css) {
        const registered = getRegisteredUtilities();
        const compoundKey = parsed.value ? `${parsed.utility}-${parsed.value}` : parsed.utility;
        console.log(`FAIL: "${className}" → utility="${parsed.utility}", value="${parsed.value}"`);
        console.log(`  registry has "${parsed.utility}": ${registered.includes(parsed.utility)}`);
        console.log(`  registry has "${compoundKey}": ${registered.includes(compoundKey)}`);
      }
      expect(css).not.toBeNull();
    });
  }
});
