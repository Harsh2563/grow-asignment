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
  searchStockData,
  calculateStockChange,
  formatCurrency,
  formatPercentage,
  fetchMarketMovers,
  fetchPerformanceData,
} from "@/lib/finance-api";

interface ComprehensiveFinanceCardProps {
  widget: Widget;
}

export const ComprehensiveFinanceCard = ({
  widget,
}: ComprehensiveFinanceCardProps) => {
  const [mainStockData, setMainStockData] = useState<StockData | null>(null);

  const [marketMovers, setMarketMovers] = useState<{
    gainers: StockData[];
    losers: StockData[];
  }>({ gainers: [], losers: [] });

  const [performanceData, setPerformanceData] = useState<{
    weekHigh: number;
    weekLow: number;
    marketCap: string;
    peRatio: string;
    volume: number;
    avgVolume: number;
    dividendYield: string;
    eps: number;
    revenuePerShare: number;
    roe: string;
    currentRatio: number;
    debtToEquity: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"main" | "movers" | "performance">(
    "main"
  );

  const apiKeys = useAppSelector((state) => state.apiKeys.apiKeys);
  const selectedApiKey = apiKeys.find((key) => key.id === widget.apiKeyId);

  const fetchAllData = async () => {
    if (!selectedApiKey) {
      setError("No API key found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (widget.stockSymbol) {
        const stockData = await searchStockData(
          widget.stockSymbol,
          selectedApiKey
        );
        if (stockData) {
          setMainStockData(stockData);

          // Fetch real performance data from API
          const realPerformanceData = await fetchPerformanceData(
            widget.stockSymbol,
            selectedApiKey
          );
          if (realPerformanceData) {
            setPerformanceData(realPerformanceData);
          }
        }
      }

      // Fetch market movers data using the new API
      const marketMoversResult = await fetchMarketMovers(selectedApiKey);
      setMarketMovers(marketMoversResult);

      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching comprehensive finance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    const interval = setInterval(() => {
      fetchAllData();
    }, widget.refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [widget.apiKeyId, widget.stockSymbol, widget.refreshInterval]);

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{mainStockData.symbol}</h3>
              <p className="text-muted-foreground">Stock Price</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {formatCurrency(mainStockData.c)}
              </div>
              <div
                className={`flex items-center gap-1 ${
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

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="font-semibold">{formatCurrency(mainStockData.o)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">High</p>
              <p className="font-semibold">{formatCurrency(mainStockData.h)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Low</p>
              <p className="font-semibold">{formatCurrency(mainStockData.l)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMoversSection = () => {
    const gainers = marketMovers.gainers.slice(0, 5);
    const losers = marketMovers.losers.slice(0, 5);

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
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5" />
            {widget.name}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            {lastUpdated && (
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
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

      <CardContent>
        {loading && !mainStockData ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-destructive">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span>{error}</span>
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
