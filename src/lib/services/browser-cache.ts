/**
 * Browser Cache Utility
 * Provides persistent caching for API keys and user preferences
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn?: number; // milliseconds
}

class BrowserCache {
  private static instance: BrowserCache;
  private storage: Storage;

  private constructor() {
    // Use localStorage if available, fallback to sessionStorage
    this.storage =
      typeof window !== "undefined"
        ? window.localStorage || window.sessionStorage
        : ({} as Storage);
  }

  static getInstance(): BrowserCache {
    if (!BrowserCache.instance) {
      BrowserCache.instance = new BrowserCache();
    }
    return BrowserCache.instance;
  }

  /**
   * Set an item in cache with optional expiration
   */
  set<T>(key: string, data: T, expiresIn?: number): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn,
      };
      this.storage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn("Failed to cache item:", error);
    }
  }

  /**
   * Get an item from cache
   */
  get<T>(key: string): T | null {
    try {
      const cached = this.storage.getItem(key);
      if (!cached) return null;

      const item: CacheItem<T> = JSON.parse(cached);

      // Check if item has expired
      if (item.expiresIn && Date.now() - item.timestamp > item.expiresIn) {
        this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn("Failed to retrieve cached item:", error);
      return null;
    }
  }

  /**
   * Check if an item exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove an item from cache
   */
  remove(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.warn("Failed to remove cached item:", error);
    }
  }

  /**
   * Clear all cached items
   */
  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
  }

  /**
   * Get all cache keys
   */
  getKeys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key) keys.push(key);
      }
      return keys;
    } catch (error) {
      console.warn("Failed to get cache keys:", error);
      return [];
    }
  }

  /**
   * Get cache size (number of items)
   */
  getSize(): number {
    return this.getKeys().length;
  }

  /**
   * Clear expired items
   */
  clearExpired(): void {
    const keys = this.getKeys();
    keys.forEach((key) => {
      // This will automatically remove expired items when accessed
      this.get(key);
    });
  }
}

// Cache keys for different types of data
export const CACHE_KEYS = {
  API_KEYS: "finboard_api_keys",
  USER_PREFERENCES: "finboard_user_prefs",
  WIDGET_CONFIGURATIONS: "finboard_widget_configs",
  THEME_PREFERENCE: "finboard_theme",
  LAST_API_KEY_TEST: "finboard_last_api_test",
} as const;

// Cache expiration times (in milliseconds)
export const CACHE_EXPIRY = {
  FIVE_MINUTES: 5 * 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// Export singleton instance
export const browserCache = BrowserCache.getInstance();

// Utility functions for common caching patterns
export const cacheUtils = {
  /**
   * Cache API keys with long expiration
   */
  cacheApiKeys: (apiKeys: Record<string, unknown>[]) => {
    browserCache.set(CACHE_KEYS.API_KEYS, apiKeys, CACHE_EXPIRY.ONE_WEEK);
  },

  /**
   * Get cached API keys
   */
  getCachedApiKeys: () => {
    return browserCache.get(CACHE_KEYS.API_KEYS) || [];
  },

  /**
   * Cache user preferences
   */
  cacheUserPreferences: (preferences: Record<string, unknown>) => {
    browserCache.set(
      CACHE_KEYS.USER_PREFERENCES,
      preferences,
      CACHE_EXPIRY.ONE_WEEK
    );
  },

  /**
   * Get cached user preferences
   */
  getCachedUserPreferences: () => {
    return browserCache.get(CACHE_KEYS.USER_PREFERENCES) || {};
  },

  /**
   * Cache widget configurations
   */
  cacheWidgetConfigs: (configs: Record<string, unknown>) => {
    browserCache.set(
      CACHE_KEYS.WIDGET_CONFIGURATIONS,
      configs,
      CACHE_EXPIRY.ONE_WEEK
    );
  },

  /**
   * Get cached widget configurations
   */
  getCachedWidgetConfigs: () => {
    return browserCache.get(CACHE_KEYS.WIDGET_CONFIGURATIONS) || {};
  },

  /**
   * Clear all app-specific cache
   */
  clearAppCache: () => {
    Object.values(CACHE_KEYS).forEach((key) => {
      browserCache.remove(key);
    });
  },

  /**
   * Initialize cache cleanup (call this on app startup)
   */
  initCacheCleanup: () => {
    // Clear expired items on startup
    browserCache.clearExpired();

    // Set up periodic cleanup (every 30 minutes)
    if (typeof window !== "undefined") {
      setInterval(() => {
        browserCache.clearExpired();
      }, 30 * 60 * 1000);
    }
  },
};
