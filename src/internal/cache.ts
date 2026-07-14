/**
 * Internal LRU Cache Module
 * Caches generated CSS for performance
 * 
 * @internal
 */

export interface CacheOptions {
  maxSize?: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
}

/**
 * LRU (Least Recently Used) Cache implementation.
 * Uses a Map which maintains insertion order in JS for O(1) get/set operations.
 * On `get()`: deletes and re-inserts to move to most recent position.
 * On `set()`: if at max size, deletes the first (oldest) entry.
 */
export class LRUCache<K = string, V = string> {
  private cache: Map<K, V>;
  private maxSize: number;
  private hits: number;
  private misses: number;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 500;
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get a value from the cache. Moves the entry to the most recently used position.
   */
  get(key: K): V | undefined {
    const value = this.cache.get(key);

    if (value !== undefined) {
      this.hits++;
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }

    this.misses++;
    return undefined;
  }

  /**
   * Set a value in the cache. Evicts the oldest entry if at capacity.
   */
  set(key: K, value: V): void {
    // Remove if exists (to update position)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add to end (most recently used)
    this.cache.set(key, value);

    // Evict oldest if over size limit
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey as K);
    }
  }

  /**
   * Check if key exists in cache (does not affect LRU ordering).
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Clear all cache entries and reset stats.
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get current number of entries in the cache.
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache performance metrics.
   */
  getStats(): CacheStats {
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
    };
  }
}

/**
 * Factory function to create a new LRU cache instance.
 */
export function createCache(maxSize?: number): LRUCache<string, string> {
  return new LRUCache<string, string>({ maxSize });
}

/**
 * Default singleton cache instance for the library to use.
 * Max size: 500 entries (default).
 */
export const cssCache = /*#__PURE__*/ createCache(500);
