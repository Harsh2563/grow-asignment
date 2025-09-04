/**
 * Cache Service for Financial Data
 * Implements in-memory caching with TTL and smart invalidation
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheService {
  private cache = new Map<string, CacheItem<unknown>>();
  private maxSize = 1000; // Maximum cache entries

  /**
   * Generate cache key based on request parameters
   */
  private generateKey(params: {
    symbol?: string;
    dataType: string;
    provider: string;
    days?: number;
    resolution?: string;
  }): string {
    const { symbol, dataType, provider, days, resolution } = params;
    return `${provider}:${dataType}:${symbol || "all"}:${days || "default"}:${
      resolution || "default"
    }`;
  }

  /**
   * Get data from cache if valid
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;

    if (!item) {
      return null;
    }

    // Check if cache item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Set data in cache with TTL
   */
  set<T>(key: string, data: T, ttlInSeconds: number): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlInSeconds * 1000,
    });
  }

  /**
   * Get or set cached data with fallback
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlInSeconds: number
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      console.log(`Cache HIT: ${key}`);
      return cached;
    }

    console.log(`Cache MISS: ${key}`);
    const data = await fetcher();
    this.set(key, data, ttlInSeconds);
    return data;
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidatePattern(pattern: string): void {
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
    console.log(
      `Invalidated ${keysToDelete.length} cache entries for pattern: ${pattern}`
    );
  }

  /**
   * Get cache statistics
   */
  getStats() {
    let hitCount = 0;
    let expiredCount = 0;
    const now = Date.now();

    for (const item of this.cache.values()) {
      if (now - item.timestamp <= item.ttl) {
        hitCount++;
      } else {
        expiredCount++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries: hitCount,
      expiredEntries: expiredCount,
      memoryUsage: JSON.stringify([...this.cache.entries()]).length,
    };
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    console.log("Cache cleared");
  }
}

// Cache TTL configurations (in seconds)
export const CACHE_TTL = {
  QUOTE: 30, // Real-time quotes - 30 seconds
  SYMBOLS: 3600, // Symbols list - 1 hour
  MARKET_MOVERS: 60, // Market movers - 1 minute
  PERFORMANCE: 300, // Performance data - 5 minutes
  HISTORY: 1800, // Historical data - 30 minutes
} as const;

// Singleton instance
export const cacheService = new CacheService();

/**
 * Cache decorator for API functions
 */
export function withCache<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  ttlInSeconds: number
) {
  return async (...args: T): Promise<R> => {
    const key = keyGenerator(...args);
    return cacheService.getOrSet(key, () => fn(...args), ttlInSeconds);
  };
}
