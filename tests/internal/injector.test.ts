/**
 * Tests for the CSS Injector module
 * 
 * The Jest test environment is set to 'node', so by default we are in SSR mode
 * (no `document` global). Browser-mode tests set up a mock document.
 */
import {
  injectCSS,
  extractCriticalCSS,
  resetSSRCollector,
  clearInjectedStyles,
  isSSR,
} from '../../src/internal/injector';

describe('injector - SSR mode', () => {
  beforeEach(() => {
    resetSSRCollector();
  });

  test('isSSR() returns true when document is undefined', () => {
    expect(isSSR()).toBe(true);
  });

  test('injectCSS collects CSS in memory buffer', () => {
    injectCSS('.test { color: red; }');
    const css = extractCriticalCSS();
    expect(css).toContain('.test { color: red; }');
  });

  test('injectCSS deduplicates identical rules', () => {
    injectCSS('.dup { margin: 0; }');
    injectCSS('.dup { margin: 0; }');
    const css = extractCriticalCSS();
    // Should only appear once
    const occurrences = css.split('.dup { margin: 0; }').length - 1;
    expect(occurrences).toBe(1);
  });

  test('injectCSS ignores empty strings', () => {
    injectCSS('');
    const css = extractCriticalCSS();
    expect(css).toBe('');
  });

  test('extractCriticalCSS returns all collected rules joined by newline', () => {
    injectCSS('.a { color: red; }');
    injectCSS('.b { color: blue; }');
    const css = extractCriticalCSS();
    expect(css).toBe('.a { color: red; }\n.b { color: blue; }');
  });

  test('resetSSRCollector clears the buffer and deduplication set', () => {
    injectCSS('.reset-test { padding: 4px; }');
    expect(extractCriticalCSS()).toContain('.reset-test');

    resetSSRCollector();

    expect(extractCriticalCSS()).toBe('');
    // After reset, the same rule can be injected again
    injectCSS('.reset-test { padding: 4px; }');
    expect(extractCriticalCSS()).toContain('.reset-test');
  });

  test('clearInjectedStyles clears buffer and deduplication set', () => {
    injectCSS('.clear-test { display: flex; }');
    clearInjectedStyles();
    expect(extractCriticalCSS()).toBe('');
  });

  test('multiple rules maintain insertion order', () => {
    injectCSS('.first { order: 1; }');
    injectCSS('.second { order: 2; }');
    injectCSS('.third { order: 3; }');
    const css = extractCriticalCSS();
    const firstIdx = css.indexOf('.first');
    const secondIdx = css.indexOf('.second');
    const thirdIdx = css.indexOf('.third');
    expect(firstIdx).toBeLessThan(secondIdx);
    expect(secondIdx).toBeLessThan(thirdIdx);
  });

  test('does not throw in SSR mode', () => {
    expect(() => injectCSS('.safe { color: green; }')).not.toThrow();
    expect(() => extractCriticalCSS()).not.toThrow();
    expect(() => resetSSRCollector()).not.toThrow();
    expect(() => clearInjectedStyles()).not.toThrow();
  });
});

describe('injector - Browser mode (mocked DOM)', () => {
  let mockStyleTag: {
    id: string;
    textContent: string;
    childNodes: string[];
    _attributes: Record<string, string>;
    setAttribute: jest.Mock;
    appendChild: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(() => {
    resetSSRCollector();

    // Create a mock style element
    mockStyleTag = {
      id: 'twx-react-styles',
      textContent: '',
      childNodes: [],
      _attributes: {},
      setAttribute: jest.fn((name: string, value: string) => {
        mockStyleTag._attributes[name] = value;
      }),
      appendChild: jest.fn((textNode: { data: string }) => {
        mockStyleTag.textContent += textNode.data;
      }),
      remove: jest.fn(),
    };

    // Mock document global
    (globalThis as any).document = {
      getElementById: jest.fn((_id: string) => {
        return mockStyleTag;
      }),
      createElement: jest.fn((_tag: string) => {
        return mockStyleTag;
      }),
      createTextNode: jest.fn((text: string) => ({ data: text })),
      head: {
        appendChild: jest.fn(),
      },
    };
  });

  afterEach(() => {
    // Remove the mock
    delete (globalThis as any).document;
    clearInjectedStyles();
  });

  test('isSSR() returns false when document is defined', () => {
    expect(isSSR()).toBe(false);
  });

  test('injectCSS appends to DOM style element', () => {
    injectCSS('.browser-test { color: green; }');
    expect(mockStyleTag.appendChild).toHaveBeenCalled();
    expect(mockStyleTag.textContent).toContain('.browser-test { color: green; }');
  });

  test('injectCSS deduplicates in browser mode', () => {
    injectCSS('.dup-browser { margin: 0; }');
    injectCSS('.dup-browser { margin: 0; }');
    // appendChild should only be called once
    expect(mockStyleTag.appendChild).toHaveBeenCalledTimes(1);
  });

  test('extractCriticalCSS reads from DOM style element in browser', () => {
    injectCSS('.extract-test { padding: 8px; }');
    const css = extractCriticalCSS();
    expect(css).toContain('.extract-test { padding: 8px; }');
  });

  test('clearInjectedStyles removes style tag from DOM', () => {
    injectCSS('.clear-browser { display: block; }');
    clearInjectedStyles();
    expect(mockStyleTag.remove).toHaveBeenCalled();
  });

  test('creates style tag with correct ID and data attribute', () => {
    // Make getElementById return null to force creation
    (globalThis as any).document.getElementById = jest.fn(() => null);

    injectCSS('.create-test { color: red; }');

    expect((globalThis as any).document.createElement).toHaveBeenCalledWith('style');
    expect(mockStyleTag.setAttribute).toHaveBeenCalledWith('data-twx-react', '');
    expect((globalThis as any).document.head.appendChild).toHaveBeenCalled();
  });
});
