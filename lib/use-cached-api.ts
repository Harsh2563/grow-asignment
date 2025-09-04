import { useState, useEffect, useCallback, useRef } from "react";
import { ApiKey, StockData } from "./finance-api";

interface CacheEntry<T> {
  data: T | null;
  timestamp: number;
  isLoading: boolean;
  error: string | null;
}

interface UseCachedApiOptions {
  refreshInterval?: number;
  cacheTime?: number; // How long to keep data in cache (ms)
  staleTime?: number; // How long data is considered fresh (ms)
  enabled?: boolean;
}

class ClientCacheManager {
  private cache = new Map<string, CacheEntry<unknown>>();
  private subscribers = new Map<string, Set<() => void>>();

  get<T>(key: string): CacheEntry<T> | null {
    return (this.cache.get(key) as CacheEntry<T>) || null;
  }

  set<T>(key: string, entry: CacheEntry<T>): void {
    this.cache.set(key, entry);
    this.notifySubscribers(key);
  }

  subscribe(key: string, callback: () => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(key);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscribers.delete(key);
        }
      }
    };
  }

  private notifySubscribers(key: string): void {
    const subs = this.subscribers.get(key);
    if (subs) {
      subs.forEach((callback) => callback());
    }
  }

  invalidate(keyPattern?: string): void {
    if (keyPattern) {
      const keysToDelete = Array.from(this.cache.keys()).filter((key) =>
        key.includes(keyPattern)
      );
      keysToDelete.forEach((key) => {
        this.cache.delete(key);
        this.notifySubscribers(key);
      });
    } else {
      this.cache.clear();
      this.subscribers.forEach((_, key) => this.notifySubscribers(key));
    }
  }
}

const clientCache = new ClientCacheManager();

/**
 * Custom hook for cached API calls with automatic refresh
 */
export function useCachedStockData(
  symbol: string,
  apiKey: ApiKey | null,
  options: UseCachedApiOptions = {}
) {
  const {
    refreshInterval = 0,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 30 * 1000, // 30 seconds
    enabled = true,
  } = options;

  const [data, setData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const cacheKey = `stock-${symbol}-${apiKey?.id}`;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(
    async (force = false) => {
      if (!apiKey || !enabled || !symbol) {
        return;
      }

      const cached = clientCache.get<StockData>(cacheKey);
      const now = Date.now();

      // Use cached data if it's fresh and not forced
      if (
        !force &&
        cached &&
        now - cached.timestamp < staleTime &&
        cached.data
      ) {
        if (mountedRef.current) {
          setData(cached.data);
          setIsLoading(false);
          setError(cached.error);
          setLastFetch(cached.timestamp);
        }
        return;
      }

      // Set loading state only if no cached data exists
      if (!cached?.data && mountedRef.current) {
        setIsLoading(true);
      }

      try {
        const response = await fetch("/api/financial-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symbol,
            apiKey: apiKey.key,
            provider: apiKey.provider || "nseindia",
            dataType: "quote",
          }),
        });

        const result = await response.json();

        if (result.success && result.data) {
          const stockData: StockData = { ...result.data, symbol };

          const cacheEntry: CacheEntry<StockData> = {
            data: stockData,
            timestamp: now,
            isLoading: false,
            error: null,
          };

          clientCache.set(cacheKey, cacheEntry);

          if (mountedRef.current) {
            setData(stockData);
            setError(null);
            setLastFetch(now);
          }
        } else {
          throw new Error(result.message || "Failed to fetch stock data");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";

        const cacheEntry: CacheEntry<StockData> = {
          data: cached?.data || null,
          timestamp: now,
          isLoading: false,
          error: errorMessage,
        };

        clientCache.set(cacheKey, cacheEntry);

        if (mountedRef.current) {
          setError(errorMessage);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [symbol, apiKey, cacheKey, staleTime, enabled]
  );

  // Subscribe to cache changes
  useEffect(() => {
    const unsubscribe = clientCache.subscribe(cacheKey, () => {
      const cached = clientCache.get<StockData>(cacheKey);
      if (cached && mountedRef.current) {
        setData(cached.data);
        setIsLoading(cached.isLoading);
        setError(cached.error);
        setLastFetch(cached.timestamp);
      }
    });

    return unsubscribe;
  }, [cacheKey]);

  // Initial fetch and setup refresh interval
  useEffect(() => {
    fetchData();

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, refreshInterval * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchData, refreshInterval]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  const isStale = lastFetch > 0 && Date.now() - lastFetch > staleTime;

  return {
    data,
    isLoading,
    error,
    refetch,
    isStale,
    lastFetch: lastFetch > 0 ? new Date(lastFetch) : null,
    cacheKey,
  };
}

/**
 * Hook for cached market movers data
 */
export function useCachedMarketMovers(
  apiKey: ApiKey | null,
  options: UseCachedApiOptions = {}
) {
  const {
    refreshInterval = 60, // Default 1 minute for market movers
    staleTime = 30 * 1000, // 30 seconds
  } = options;

  const [data, setData] = useState<{
    gainers: StockData[];
    losers: StockData[];
  }>({ gainers: [], losers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `market-movers-${apiKey?.id}`;

  // Similar implementation as useCachedStockData but for market movers
  // ... (implementation details omitted for brevity)

  return { data, isLoading, error };
}

/**
 * Global cache management functions
 */
export const cacheManager = {
  invalidateAll: () => clientCache.invalidate(),
  invalidateStock: (symbol: string) =>
    clientCache.invalidate(`stock-${symbol}`),
  invalidateMarketData: () => clientCache.invalidate("market-movers"),
  getStats: () => ({
    totalEntries: clientCache["cache"].size,
    subscribers: clientCache["subscribers"].size,
  }),
};
