"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { Widget } from "@/store/slices/widgetsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  DollarSign,
} from "lucide-react";
import {
  StockData,
  calculateStockChange,
  formatCurrency,
  formatPercentage,
} from "@/lib/finance-api";
import {
  useStockData,
  useMarketMovers,
  useStockPerformance,
  useInvalidateQueries,
  useAutoRefresh,
} from "@/lib/use-finance-queries";

interface ComprehensiveFinanceCardProps {
  widget: Widget;
}

export const ComprehensiveFinanceCard = ({
  widget,
}: ComprehensiveFinanceCardProps) => {
  const [activeTab, setActiveTab] = useState<"main" | "movers" | "performance">(
    "main"
  );

  const apiKeys = useAppSelector((state) => state.apiKeys.apiKeys);
  const selectedApiKey = apiKeys.find((key) => key.id === widget.apiKeyId);

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

  const { invalidateStock, invalidateMarketMovers, invalidatePerformance } =
    useInvalidateQueries();

  // Use auto-refresh hook for reliable data updates
  useAutoRefresh(widget.refreshInterval, selectedApiKey?.id || "");

  const handleRefresh = async () => {
    if (!selectedApiKey) return;

    try {
      // First invalidate all relevant queries to clear cache
      if (widget.stockSymbol) {
        invalidateStock(widget.stockSymbol, selectedApiKey.id);
        invalidatePerformance(widget.stockSymbol, selectedApiKey.id);
      }
      invalidateMarketMovers(selectedApiKey.id);

      // Wait a moment for cache invalidation to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Then refetch data based on current active tab
      const refetchPromises = [];

      if (activeTab === "main" || activeTab === "performance") {
        refetchPromises.push(refetchStock());
      }
      if (activeTab === "movers") {
        refetchPromises.push(refetchMovers());
      }
      if (activeTab === "performance") {
        refetchPromises.push(refetchPerformance());
      }

      // Wait for all refetches to complete
      await Promise.all(refetchPromises);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  };

  const loading = isLoadingStock || isLoadingMovers || isLoadingPerformance;
  const error = stockError || moversError || performanceError;

  if (!widget.isVisible) return null;

  const renderMainSection = () => {
    if (!mainStockData) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          {widget.stockSymbol
            ? `No data available for ${widget.stockSymbol}`
            : "No stock symbol provided"}
        </div>
      );
    }

    const change = calculateStockChange(mainStockData);

    return (
      <div className="space-y-6">
        {/* Main Stock Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg border">
          <div className="flex items-start justify-between">
            {/* Left side - Stock info and OHLC */}
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">{mainStockData.symbol}</h3>
                <p className="text-muted-foreground">Stock Price</p>
              </div>

              {/* Open, High, Low - Left aligned */}
              <div className="flex gap-6">
                <div className="text-left">
                  <p className="text-xs text-muted-foreground mb-1">Open</p>
                  <p className="font-semibold text-sm">
                    {formatCurrency(mainStockData.o)}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground mb-1">High</p>
                  <p className="font-semibold text-sm">
                    {formatCurrency(mainStockData.h)}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground mb-1">Low</p>
                  <p className="font-semibold text-sm">
                    {formatCurrency(mainStockData.l)}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Current price and change */}
            <div className="text-right">
              <div className="text-3xl font-bold">
                {formatCurrency(mainStockData.c)}
              </div>
              <div
                className={`flex items-center gap-1 justify-end ${
                  change.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {change.isPositive ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {change.isPositive ? "+" : ""}
                  {formatCurrency(change.amount)} (
                  {formatPercentage(change.percentage)})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMoversSection = () => {
    const gainers = marketMovers?.gainers?.slice(0, 5) || [];
    const losers = marketMovers?.losers?.slice(0, 5) || [];

    return (
      <div className="space-y-6">
        {/* Top Gainers */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Top Gainers (Indian Market)
          </h4>
          <div className="space-y-2">
            {gainers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Loading market gainers...</p>
              </div>
            ) : (
              gainers.map((stock) => {
                const change = calculateStockChange(stock);
                return (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(stock.c)}
                      </p>
                    </div>
                    <div className="text-right text-green-600">
                      <p className="font-medium">
                        +{formatPercentage(change.percentage)}
                      </p>
                      <p className="text-sm">
                        +{formatCurrency(change.amount)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Losers */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-600" />
            Top Losers (Indian Market)
          </h4>
          <div className="space-y-2">
            {losers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <TrendingDown className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Loading market losers...</p>
              </div>
            ) : (
              losers.map((stock) => {
                const change = calculateStockChange(stock);
                return (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(stock.c)}
                      </p>
                    </div>
                    <div className="text-right text-red-600">
                      <p className="font-medium">
                        {formatPercentage(change.percentage)}
                      </p>
                      <p className="text-sm">{formatCurrency(change.amount)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPerformanceSection = () => {
    if (!mainStockData || !performanceData) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No performance data available
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium">52W High</p>
            </div>
            <p className="text-lg font-bold">
              {formatCurrency(performanceData.weekHigh)}
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-red-600" />
              <p className="text-sm font-medium">52W Low</p>
            </div>
            <p className="text-lg font-bold">
              {formatCurrency(performanceData.weekLow)}
            </p>
          </div>
        </div>

        {/* Financial Data */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Key Financial Metrics
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Market Cap</p>
              <p className="font-semibold">{performanceData.marketCap}</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">P/E Ratio</p>
              <p className="font-semibold">{performanceData.peRatio}</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Volume</p>
              <p className="font-semibold">
                {performanceData.volume > 0
                  ? performanceData.volume.toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full h-[380px] flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5" />
            {widget.name}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-1.5 rounded-md hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh data"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            {(mainStockData || marketMovers) && (
              <span>Updated: {new Date().toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        {/* Navigation Tabs - Removed Watchlist */}
        <div className="flex gap-1 mt-4 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab("main")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "main"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("movers")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "movers"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Market Movers
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "performance"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Performance
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        {loading && !mainStockData ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-destructive">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span>{error?.message || "An error occurred"}</span>
          </div>
        ) : (
          <div>
            {activeTab === "main" && renderMainSection()}
            {activeTab === "movers" && renderMoversSection()}
            {activeTab === "performance" && renderPerformanceSection()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
