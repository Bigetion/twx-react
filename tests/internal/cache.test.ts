import { LRUCache, createCache, cssCache } from '../../src/internal/cache';

describe('LRUCache', () => {
  let cache: LRUCache<string, string>;

  beforeEach(() => {
    cache = new LRUCache<string, string>({ maxSize: 3 });
  });

  describe('get()', () => {
    it('returns undefined for missing keys', () => {
      expect(cache.get('missing')).toBeUndefined();
    });

    it('returns the cached value for existing keys', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('moves accessed entry to most recently used position', () => {
      cache.set('a', '1');
      cache.set('b', '2');
      cache.set('c', '3');

      // Access 'a' to move it to most recent
      cache.get('a');

      // Adding a new entry should evict 'b' (the oldest), not 'a'
      cache.set('d', '4');

      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(false);
      expect(cache.has('c')).toBe(true);
      expect(cache.has('d')).toBe(true);
    });
  });

  describe('set()', () => {
    it('adds entries to the cache', () => {
      cache.set('key1', 'value1');
      expect(cache.size()).toBe(1);
      expect(cache.get('key1')).toBe('value1');
    });

    it('updates existing entries without increasing size', () => {
      cache.set('key1', 'old');
      cache.set('key1', 'new');
      expect(cache.size()).toBe(1);
      expect(cache.get('key1')).toBe('new');
    });

    it('evicts the oldest entry when at capacity', () => {
      cache.set('a', '1');
      cache.set('b', '2');
      cache.set('c', '3');
      cache.set('d', '4'); // should evict 'a'

      expect(cache.size()).toBe(3);
      expect(cache.has('a')).toBe(false);
      expect(cache.has('b')).toBe(true);
      expect(cache.has('c')).toBe(true);
      expect(cache.has('d')).toBe(true);
    });

    it('moves updated entry to most recent position', () => {
      cache.set('a', '1');
      cache.set('b', '2');
      cache.set('c', '3');

      // Update 'a', moving it to most recent
      cache.set('a', 'updated');

      // Adding new entry should evict 'b' (now oldest)
      cache.set('d', '4');

      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(false);
      expect(cache.get('a')).toBe('updated');
    });
  });

  describe('has()', () => {
    it('returns false for missing keys', () => {
      expect(cache.has('nope')).toBe(false);
    });

    it('returns true for existing keys', () => {
      cache.set('key', 'val');
      expect(cache.has('key')).toBe(true);
    });
  });

  describe('clear()', () => {
    it('removes all entries', () => {
      cache.set('a', '1');
      cache.set('b', '2');
      cache.clear();
      expect(cache.size()).toBe(0);
      expect(cache.has('a')).toBe(false);
    });

    it('resets stats', () => {
      cache.set('a', '1');
      cache.get('a');
      cache.get('missing');
      cache.clear();
      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.size).toBe(0);
    });
  });

  describe('size()', () => {
    it('returns 0 for empty cache', () => {
      expect(cache.size()).toBe(0);
    });

    it('returns current entry count', () => {
      cache.set('a', '1');
      cache.set('b', '2');
      expect(cache.size()).toBe(2);
    });

    it('does not exceed maxSize', () => {
      cache.set('a', '1');
      cache.set('b', '2');
      cache.set('c', '3');
      cache.set('d', '4');
      cache.set('e', '5');
      expect(cache.size()).toBe(3);
    });
  });

  describe('getStats()', () => {
    it('tracks hits correctly', () => {
      cache.set('a', '1');
      cache.get('a');
      cache.get('a');
      expect(cache.getStats().hits).toBe(2);
    });

    it('tracks misses correctly', () => {
      cache.get('missing1');
      cache.get('missing2');
      expect(cache.getStats().misses).toBe(2);
    });

    it('reports current size', () => {
      cache.set('a', '1');
      cache.set('b', '2');
      expect(cache.getStats().size).toBe(2);
    });

    it('returns combined stats object', () => {
      cache.set('a', '1');
      cache.get('a'); // hit
      cache.get('x'); // miss
      const stats = cache.getStats();
      expect(stats).toEqual({ hits: 1, misses: 1, size: 1 });
    });
  });

  describe('default maxSize', () => {
    it('defaults to 500 entries when no options provided', () => {
      const defaultCache = new LRUCache();
      for (let i = 0; i < 600; i++) {
        defaultCache.set(`key-${i}`, `val-${i}`);
      }
      expect(defaultCache.size()).toBe(500);
    });
  });
});

describe('createCache()', () => {
  it('creates a cache with specified maxSize', () => {
    const cache = createCache(10);
    for (let i = 0; i < 20; i++) {
      cache.set(`k${i}`, `v${i}`);
    }
    expect(cache.size()).toBe(10);
  });

  it('creates a cache with default maxSize when no arg provided', () => {
    const cache = createCache();
    for (let i = 0; i < 600; i++) {
      cache.set(`k${i}`, `v${i}`);
    }
    expect(cache.size()).toBe(500);
  });
});

describe('cssCache singleton', () => {
  beforeEach(() => {
    cssCache.clear();
  });

  it('is an instance of LRUCache', () => {
    expect(cssCache).toBeInstanceOf(LRUCache);
  });

  it('functions as expected', () => {
    cssCache.set('px-4', 'padding-left: 1rem; padding-right: 1rem;');
    expect(cssCache.get('px-4')).toBe('padding-left: 1rem; padding-right: 1rem;');
  });

  it('has a maxSize of 500', () => {
    for (let i = 0; i < 600; i++) {
      cssCache.set(`class-${i}`, `css-${i}`);
    }
    expect(cssCache.size()).toBe(500);
  });
});

// ─── Cache Integration with Generator ────────────────────────────────────────

import {
  registerUtility,
  clearRegistry,
  generateCSSString,
} from '../../src/internal/generator';
import type { ParsedClass } from '../../src/internal/parser';

describe('Cache integration with generator (Task 6.2)', () => {
  beforeEach(() => {
    cssCache.clear();
    clearRegistry();

    // Register a simple test utility
    registerUtility('flex', () => ({ display: 'flex' }));
    registerUtility('px', (parsed) => {
      if (!parsed.value) return null;
      const rem = (Number(parsed.value) * 0.25).toString();
      return {
        'padding-left': `${rem}rem`,
        'padding-right': `${rem}rem`,
      };
    });
    registerUtility('hidden', () => ({ display: 'none' }));
  });

  afterEach(() => {
    cssCache.clear();
    clearRegistry();
  });

  describe('generateCSSString()', () => {
    it('returns a CSS string for a registered utility', () => {
      const parsed: ParsedClass = { utility: 'flex', variants: [], modifiers: [] };
      const result = generateCSSString(parsed, 'flex');
      expect(result).not.toBeNull();
      expect(result).toContain('.flex');
      expect(result).toContain('display: flex');
    });

    it('returns null for an unregistered utility', () => {
      const parsed: ParsedClass = { utility: 'unknown', variants: [], modifiers: [] };
      const result = generateCSSString(parsed, 'unknown');
      expect(result).toBeNull();
    });

    it('returns null when the generator cannot produce properties (missing value)', () => {
      const parsed: ParsedClass = { utility: 'px', variants: [], modifiers: [] };
      const result = generateCSSString(parsed, 'px');
      expect(result).toBeNull();
    });

    it('populates cache on a cache miss', () => {
      const parsed: ParsedClass = { utility: 'flex', variants: [], modifiers: [] };
      expect(cssCache.has('flex')).toBe(false);

      generateCSSString(parsed, 'flex');

      expect(cssCache.has('flex')).toBe(true);
      expect(cssCache.get('flex')).toContain('display: flex');
    });

    it('returns the cached value on a cache hit without re-generating', () => {
      // Pre-seed the cache with a sentinel value
      cssCache.set('flex', '/* cached sentinel */');

      const parsed: ParsedClass = { utility: 'flex', variants: [], modifiers: [] };
      const result = generateCSSString(parsed, 'flex');

      expect(result).toBe('/* cached sentinel */');
    });

    it('increments cache hits on repeated calls for the same class', () => {
      const parsed: ParsedClass = { utility: 'flex', variants: [], modifiers: [] };

      // First call — cache miss
      generateCSSString(parsed, 'flex');
      const afterMiss = cssCache.getStats();
      expect(afterMiss.misses).toBe(1);
      expect(afterMiss.hits).toBe(0);

      // Second call — cache hit
      generateCSSString(parsed, 'flex');
      const afterHit = cssCache.getStats();
      expect(afterHit.hits).toBe(1);
      expect(afterHit.misses).toBe(1);
    });

    it('caches responsive-variant CSS under its full class name key', () => {
      const parsed: ParsedClass = { utility: 'flex', variants: ['md'], modifiers: [] };
      generateCSSString(parsed, 'md:flex');

      expect(cssCache.has('md:flex')).toBe(true);
      const css = cssCache.get('md:flex')!;
      expect(css).toContain('@media (min-width: 768px)');
      expect(css).toContain('display: flex');
    });

    it('caches pseudo-class variant CSS under its full class name key', () => {
      const parsed: ParsedClass = { utility: 'hidden', variants: ['hover'], modifiers: [] };
      generateCSSString(parsed, 'hover:hidden');

      expect(cssCache.has('hover:hidden')).toBe(true);
      const css = cssCache.get('hover:hidden')!;
      expect(css).toContain(':hover');
      expect(css).toContain('display: none');
    });

    it('caches different classes independently', () => {
      const flexParsed: ParsedClass = { utility: 'flex', variants: [], modifiers: [] };
      const hiddenParsed: ParsedClass = { utility: 'hidden', variants: [], modifiers: [] };

      generateCSSString(flexParsed, 'flex');
      generateCSSString(hiddenParsed, 'hidden');

      expect(cssCache.has('flex')).toBe(true);
      expect(cssCache.has('hidden')).toBe(true);
      expect(cssCache.get('flex')).toContain('display: flex');
      expect(cssCache.get('hidden')).toContain('display: none');
    });

    it('does not cache null results (unregistered utilities)', () => {
      const parsed: ParsedClass = { utility: 'unknown', variants: [], modifiers: [] };
      generateCSSString(parsed, 'unknown');

      // null result should not be stored in cache
      expect(cssCache.has('unknown')).toBe(false);
    });
  });
});
