import { useState } from "react";
import * as React from "react";
import { useAppSelector } from "@/store/hooks";
import { Widget } from "@/store/slices/widgetsSlice";
import {
  useStockData,
  useMarketMovers,
  useStockPerformance,
  useInvalidateQueries,
  useAutoRefresh,
} from "@/lib/use-finance-queries";

type TabType = "main" | "movers" | "performance";

export const useComprehensiveFinanceCard = (widget: Widget) => {
  const [activeTab, setActiveTab] = useState<TabType>("main");

  const apiKeys = useAppSelector((state) => state.apiKeys.apiKeys);
  const selectedApiKey = apiKeys.find((key) => key.id === widget.apiKeyId);

  // API calls for different data types
  const {
    data: mainStockData,
    isLoading: isLoadingStock,
    error: stockError,
    refetch: refetchStock,
  } = useStockData(widget.stockSymbol || "", selectedApiKey || null);

  const {
    data: marketMovers,
    isLoading: isLoadingMovers,
    error: moversError,
    refetch: refetchMovers,
  } = useMarketMovers(selectedApiKey || null);

  const {
    data: performanceData,
    isLoading: isLoadingPerformance,
    error: performanceError,
    refetch: refetchPerformance,
  } = useStockPerformance(widget.stockSymbol || "", selectedApiKey || null);

  // Debug performance data
  React.useEffect(() => {
    if (performanceData) {
      console.log("Performance data received:", performanceData);
    }
    if (performanceError) {
      console.log("Performance error:", performanceError);
    }
  }, [performanceData, performanceError]);

  const { invalidateStock, invalidateMarketMovers, invalidatePerformance } =
    useInvalidateQueries();

  // Use auto-refresh hook for reliable data updates
  useAutoRefresh(widget.refreshInterval, selectedApiKey?.id || "");

  // Handle tab switching
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Calculate loading states based on active tab
  const loading = (() => {
    switch (activeTab) {
      case "main":
        return isLoadingStock;
      case "movers":
        return isLoadingMovers;
      case "performance":
        return isLoadingPerformance;
      default:
        return false;
    }
  })();

  // Calculate error states based on active tab
  const error = (() => {
    switch (activeTab) {
      case "main":
        return stockError;
      case "movers":
        return moversError;
      case "performance":
        return performanceError;
      default:
        return null;
    }
  })();

  // Get current tab data
  const currentTabData = (() => {
    switch (activeTab) {
      case "main":
        return mainStockData;
      case "movers":
        return marketMovers;
      case "performance":
        return performanceData;
      default:
        return null;
    }
  })();

  // Refetch current tab data
  const refetchCurrentTab = () => {
    switch (activeTab) {
      case "main":
        refetchStock();
        break;
      case "movers":
        refetchMovers();
        break;
      case "performance":
        refetchPerformance();
        break;
    }
  };

  // Invalidate current tab data
  const invalidateCurrentTab = () => {
    if (!selectedApiKey) return;

    switch (activeTab) {
      case "main":
        invalidateStock(widget.stockSymbol || "", selectedApiKey.id);
        break;
      case "movers":
        invalidateMarketMovers(selectedApiKey.id);
        break;
      case "performance":
        invalidatePerformance(widget.stockSymbol || "", selectedApiKey.id);
        break;
    }
  };

  return {
    // Tab management
    activeTab,
    setActiveTab: handleTabChange,

    // Data states
    mainStockData,
    marketMovers,
    performanceData,
    currentTabData,

    // Loading states
    loading,
    isLoadingStock,
    isLoadingMovers,
    isLoadingPerformance,

    // Error states
    error,
    stockError,
    moversError,
    performanceError,

    // API key
    selectedApiKey,

    // Actions
    refetchCurrentTab,
    invalidateCurrentTab,
    refetchStock,
    refetchMovers,
    refetchPerformance,
    invalidateStock,
    invalidateMarketMovers,
    invalidatePerformance,
  };
};
