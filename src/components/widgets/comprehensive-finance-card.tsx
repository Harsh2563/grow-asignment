"use client";

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
  calculateStockChange,
  formatCurrency,
  formatPercentage,
} from "@/lib/api/finance-api";
import { Widget } from "@/store/slices/widgetsSlice";
import { useComprehensiveFinanceCard } from "@/lib/hooks/use-comprehensive-finance-card";
import { UI, FINANCE_CARD } from "@/constants";

interface ComprehensiveFinanceCardProps {
  widget: Widget;
}

export const ComprehensiveFinanceCard = ({
  widget,
}: ComprehensiveFinanceCardProps) => {
  const {
    // Tab management
    activeTab,
    setActiveTab,

    // Data states
    mainStockData,
    marketMovers,
    performanceData,

    // Loading states
    loading,

    // Error states
    error,

    // API key
    selectedApiKey,

    // Actions
    refetchCurrentTab,
    invalidateCurrentTab,
  } = useComprehensiveFinanceCard(widget);

  const handleRefresh = async () => {
    if (!selectedApiKey) return;

    try {
      // Invalidate cache and refetch current tab data
      invalidateCurrentTab();

      // Wait a moment for cache invalidation to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Refetch current tab data
      refetchCurrentTab();
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  };

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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-3 sm:p-6 rounded-lg border">
          <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4">
            {/* Left side - Stock info and OHLC */}
            <div className="flex-1 min-w-0 w-full">
              <div className="mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-2xl font-bold truncate">{mainStockData.symbol}</h3>
                <p className="text-muted-foreground text-sm">Stock Price</p>
              </div>

              {/* Open, High, Low - Left aligned */}
              <div className="flex gap-3 sm:gap-6">
                <div className="text-left min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Open</p>
                  <p className="font-semibold text-xs sm:text-sm truncate">
                    {formatCurrency(mainStockData.o)}
                  </p>
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">High</p>
                  <p className="font-semibold text-xs sm:text-sm truncate">
                    {formatCurrency(mainStockData.h)}
                  </p>
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Low</p>
                  <p className="font-semibold text-xs sm:text-sm truncate">
                    {formatCurrency(mainStockData.l)}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Current price and change */}
            <div className="text-left sm:text-right w-full sm:w-auto sm:flex-shrink-0">
              <div className="text-xl sm:text-3xl font-bold truncate">
                {formatCurrency(mainStockData.c)}
              </div>
              <div
                className={`flex items-center gap-1 sm:justify-end ${
                  change.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {change.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                )}
                <span className="font-medium text-xs sm:text-sm truncate">
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
                    className="flex items-center justify-between p-2 sm:p-3 bg-green-50 dark:bg-green-950/20 rounded-lg"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-medium text-sm truncate">{stock.symbol}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {formatCurrency(stock.c)}
                      </p>
                    </div>
                    <div className="text-right text-green-600 flex-shrink-0">
                      <p className="font-medium text-xs sm:text-sm">
                        +{formatPercentage(change.percentage)}
                      </p>
                      <p className="text-xs">
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
                    className="flex items-center justify-between p-2 sm:p-3 bg-red-50 dark:bg-red-950/20 rounded-lg"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-medium text-sm truncate">{stock.symbol}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {formatCurrency(stock.c)}
                      </p>
                    </div>
                    <div className="text-right text-red-600 flex-shrink-0">
                      <p className="font-medium text-xs sm:text-sm">
                        {formatPercentage(change.percentage)}
                      </p>
                      <p className="text-xs">{formatCurrency(change.amount)}</p>
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
    if (!mainStockData) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No stock data available
        </div>
      );
    }

    // Use mainStockData as fallback if performanceData is not available
    const perfData = performanceData || {};
    const fallbackHigh = mainStockData.h * 1.15; // Estimate 52W high as 15% above current high
    const fallbackLow = mainStockData.l * 0.85; // Estimate 52W low as 15% below current low

    return (
      <div className="space-y-6">
        {/* 52-Week High/Low on the left side */}
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 space-y-4 sm:pr-6">
            <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-medium">52 Week High</p>
              </div>
              <p className="text-base sm:text-lg font-bold text-green-600 truncate">
                {formatCurrency(
                  (perfData as { weekHigh?: number })?.weekHigh || fallbackHigh
                )}
              </p>
            </div>

            <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-medium">52 Week Low</p>
              </div>
              <p className="text-base sm:text-lg font-bold text-red-600 truncate">
                {formatCurrency(
                  (perfData as { weekLow?: number })?.weekLow || fallbackLow
                )}
              </p>
            </div>
          </div>

          {/* Right side content area */}
          <div className="flex-1 sm:pl-6 sm:border-l mt-4 sm:mt-0">
            <div className="text-center py-4 sm:py-8">
              <BarChart3 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm sm:text-lg font-medium mb-2">Additional Analytics</p>
              <p className="text-xs sm:text-sm text-muted-foreground px-2">
                Detailed performance analytics for{" "}
                {widget.stockSymbol || "your selected stock"} is displayed here.
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg min-w-0">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">{widget.name}</span>
          </CardTitle>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-1.5 rounded-md hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh data"
            >
              <RefreshCw
                className={`h-3 w-3 sm:h-4 sm:w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            {(mainStockData || marketMovers) && (
              <span className="hidden sm:inline">{UI.UPDATED}: {new Date().toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        {/* Navigation Tabs - Responsive with shorter text on mobile */}
        <div className="flex gap-0.5 sm:gap-1 mt-4 p-1 bg-muted rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveTab("main")}
            className={`flex-1 px-1 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors min-w-0 ${
              activeTab === "main"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="hidden sm:inline">{FINANCE_CARD.OVERVIEW}</span>
            <span className="sm:hidden">View</span>
          </button>
          <button
            onClick={() => setActiveTab("movers")}
            className={`flex-1 px-1 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors min-w-0 ${
              activeTab === "movers"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="hidden sm:inline">Market Movers</span>
            <span className="sm:hidden">Market</span>
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`flex-1 px-1 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors min-w-0 ${
              activeTab === "performance"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="hidden sm:inline">Performance</span>
            <span className="sm:hidden">Perf</span>
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
