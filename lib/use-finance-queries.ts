"use client";

import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  fetchAllSymbols,
  fetchStockData,
  fetchPopularStocksData,
  fetchMarketMovers,
  fetchPerformanceData,
  searchStockData,
  fetchMultipleStocksData,
  StockData,
  StockSymbol,
  ApiKey,
} from "@/lib/finance-api";
import {
  fetchChartData,
  formatChartDataForInterval,
  type ChartInterval,
} from "@/lib/chart-data-service";

// Query keys for consistent caching
export const queryKeys = {
  allSymbols: (apiKeyId: string) => ["symbols", apiKeyId] as const,
  stockData: (symbol: string, apiKeyId: string) =>
    ["stock", symbol, apiKeyId] as const,
  chartData: (symbol: string, interval: ChartInterval, apiKeyId: string) =>
    ["chart", symbol, interval, apiKeyId] as const,
  popularStocks: (apiKeyId: string) => ["popular-stocks", apiKeyId] as const,
  marketMovers: (apiKeyId: string) => ["market-movers", apiKeyId] as const,
  performance: (symbol: string, apiKeyId: string) =>
    ["performance", symbol, apiKeyId] as const,
  multipleStocks: (symbols: string[], apiKeyId: string) =>
    ["multiple-stocks", symbols.sort().join(","), apiKeyId] as const,
};

/**
 * Hook to fetch all available stock symbols
 */
export const useAllSymbols = (apiKey: ApiKey | null) => {
  return useQuery({
    queryKey: queryKeys.allSymbols(apiKey?.id || ""),
    queryFn: () => fetchAllSymbols(apiKey!),
    enabled: !!apiKey,
    staleTime: 30 * 60 * 1000, // 30 minutes - symbols don't change frequently
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook to fetch single stock data with smart caching
 */
export const useStockData = (symbol: string, apiKey: ApiKey | null) => {
  return useQuery({
    queryKey: queryKeys.stockData(symbol, apiKey?.id || ""),
    queryFn: () => fetchStockData(symbol, apiKey!),
    enabled: !!apiKey && !!symbol,
    staleTime: 30 * 1000, // 30 seconds - short stale time for more frequent updates
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in memory
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnMount: false, // Use cache first
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

/**
 * Hook to fetch chart data for a specific symbol and interval
 */
export const useChartData = (
  symbol: string,
  interval: ChartInterval,
  apiKey: ApiKey | null
) => {
  return useQuery({
    queryKey: queryKeys.chartData(symbol, interval, apiKey?.id || ""),
    queryFn: async () => {
      const data = await fetchChartData(symbol, apiKey!, interval);
      return formatChartDataForInterval(data, interval);
    },
    enabled: !!apiKey && !!symbol,
    staleTime: 30 * 1000, // 30 seconds - short stale time for more frequent updates
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false, // Use cache first
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });
};
export const usePopularStocks = (
  apiKey: ApiKey | null,
  availableSymbols?: StockSymbol[]
) => {
  return useQuery({
    queryKey: queryKeys.popularStocks(apiKey?.id || ""),
    queryFn: () => fetchPopularStocksData(apiKey!, availableSymbols),
    enabled: !!apiKey,
    staleTime: 30 * 1000, // 30 seconds - short stale time for more frequent updates
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false, // Use cache first
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

/**
 * Hook to fetch market movers (gainers and losers) with smart caching
 */
export const useMarketMovers = (apiKey: ApiKey | null) => {
  return useQuery({
    queryKey: queryKeys.marketMovers(apiKey?.id || ""),
    queryFn: () => fetchMarketMovers(apiKey!),
    enabled: !!apiKey,
    staleTime: 60 * 1000, // 1 minute - market movers change less frequently but still need updates
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false, // Use cache first
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

/**
 * Hook to fetch stock performance data
 */
export const useStockPerformance = (symbol: string, apiKey: ApiKey | null) => {
  return useQuery({
    queryKey: queryKeys.performance(symbol, apiKey?.id || ""),
    queryFn: () => fetchPerformanceData(symbol, apiKey!),
    enabled: !!apiKey && !!symbol,
    staleTime: 10 * 60 * 1000, // 10 minutes - performance data changes less frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to search for specific stock data
 */
export const useStockSearch = (
  symbol: string,
  apiKey: ApiKey | null,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.stockData(symbol, apiKey?.id || ""),
    queryFn: () => searchStockData(symbol, apiKey!),
    enabled: !!apiKey && !!symbol && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch multiple stocks data with optimized parallel queries
 */
export const useMultipleStocks = (symbols: string[], apiKey: ApiKey | null) => {
  return useQuery({
    queryKey: queryKeys.multipleStocks(symbols, apiKey?.id || ""),
    queryFn: () => fetchMultipleStocksData(symbols, apiKey!),
    enabled: !!apiKey && symbols.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch individual stock data for multiple symbols using parallel queries
 * This is useful when you need more granular control over individual stock queries
 */
export const useParallelStockQueries = (
  symbols: string[],
  apiKey: ApiKey | null
) => {
  return useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: queryKeys.stockData(symbol, apiKey?.id || ""),
      queryFn: () => fetchStockData(symbol, apiKey!),
      enabled: !!apiKey && !!symbol,
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    })),
  });
};

/**
 * Hook to prefetch stock data - useful for hover effects or anticipated navigation
 */
export const usePrefetchStock = () => {
  const queryClient = useQueryClient();

  return (symbol: string, apiKey: ApiKey) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.stockData(symbol, apiKey.id),
      queryFn: () => fetchStockData(symbol, apiKey),
      staleTime: 2 * 60 * 1000,
    });
  };
};

/**
 * Hook to invalidate specific queries when needed
 */
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateStock: (symbol: string, apiKeyId: string) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stockData(symbol, apiKeyId),
      });
    },
    invalidateAllStocks: (apiKeyId: string) => {
      queryClient.invalidateQueries({
        queryKey: ["stock", "*", apiKeyId],
      });
    },
    invalidatePopularStocks: (apiKeyId: string) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.popularStocks(apiKeyId),
      });
    },
    invalidateMarketMovers: (apiKeyId: string) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.marketMovers(apiKeyId),
      });
    },
    invalidatePerformance: (symbol: string, apiKeyId: string) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.performance(symbol, apiKeyId),
      });
    },
  };
};

/**
 * Simple and reliable auto-refresh hook that respects user's refresh intervals
 * This will force refresh data at the specified interval regardless of cache staleness
 */
export const useAutoRefresh = (
  refreshInterval: number, // in seconds from widget settings
  apiKeyId: string,
  onRefresh?: () => void
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!apiKeyId || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      // Invalidate all queries for this API key to force refresh
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          // Check if this query belongs to the current API key
          return queryKey.includes(apiKeyId);
        },
        refetchType: "active", // Only refetch queries that have active observers
      });

      // Call optional refresh callback
      onRefresh?.();

      console.log(`🔄 Auto-refresh triggered for API key: ${apiKeyId}`);
    }, refreshInterval * 1000);

    console.log(`⏰ Auto-refresh set up with ${refreshInterval}s interval`);
    return () => {
      clearInterval(interval);
      console.log(`⏰ Auto-refresh cleared`);
    };
  }, [queryClient, refreshInterval, apiKeyId, onRefresh]);
};
