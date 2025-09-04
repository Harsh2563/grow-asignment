"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConditionalRenderer } from "@/ConditionalRenderer/ConditionalRenderer";
import {
  fetchChartData,
  convertToLineData,
  calculateMovingAverage,
  formatChartDataForInterval,
  type ChartDataPoint,
  type LineChartData,
  type ChartInterval,
} from "@/lib/chart-data-service";
import { fetchStockData, type ApiKey, type StockData } from "@/lib/finance-api";
import { CandlestickChart } from "./candlestick-chart";

interface StockChartWidgetProps {
  widgetId: string;
  symbol: string;
  chartType: "line" | "candlestick";
  apiKey: ApiKey;
  refreshInterval: number;
  onError?: (error: string) => void;
}

export const StockChartWidget: React.FC<StockChartWidgetProps> = ({
  widgetId,
  symbol,
  chartType,
  apiKey,
  refreshInterval,
  onError,
}) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [lineData, setLineData] = useState<LineChartData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<StockData | null>(null);
  const [selectedInterval, setSelectedInterval] =
    useState<ChartInterval>("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMA, setShowMA] = useState(false);
  const [movingAverages, setMovingAverages] = useState<{
    ma20: Array<{ date: string; ma: number }>;
    ma50: Array<{ date: string; ma: number }>;
  }>({ ma20: [], ma50: [] });

  // Fetch current stock price
  const fetchCurrentPrice = async () => {
    try {
      const stockData = await fetchStockData(symbol, apiKey);
      if (stockData) {
        setCurrentPrice(stockData);
      }
    } catch (err) {
      console.error("Error fetching current price:", err);
    }
  };

  // Fetch chart data
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch current price first
      await fetchCurrentPrice();

      // Fetch historical data
      const data = await fetchChartData(
        symbol,
        apiKey,
        selectedInterval,
        currentPrice?.c
      );

      if (data.length === 0) {
        throw new Error("No chart data available");
      }

      // Format data for the selected interval
      const formattedData = formatChartDataForInterval(data, selectedInterval);
      setChartData(formattedData);

      // Convert to line data if needed
      if (chartType === "line") {
        setLineData(convertToLineData(formattedData));
      }

      // Calculate moving averages
      if (formattedData.length >= 50) {
        const ma20 = calculateMovingAverage(formattedData, 20);
        const ma50 = calculateMovingAverage(formattedData, 50);
        setMovingAverages({ ma20, ma50 });
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch chart data";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [symbol, apiKey, selectedInterval]);

  // Auto-refresh data
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, symbol, apiKey, selectedInterval]);

  // Custom tooltip for line chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Date: ${label}`}</p>
          <p className="text-blue-600">{`Price: $${payload[0].value.toFixed(
            2
          )}`}</p>
          {data.volume && (
            <p className="text-gray-500 text-sm">{`Volume: ${data.volume.toLocaleString()}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate price change
  const getPriceChange = () => {
    if (!currentPrice) return null;
    const change = currentPrice.c - currentPrice.pc;
    const changePercent = (change / currentPrice.pc) * 100;
    const isPositive = change >= 0;

    return { change, changePercent, isPositive };
  };

  const priceChange = getPriceChange();

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">{symbol} Price Chart</h3>
          <ConditionalRenderer isVisible={!!currentPrice}>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold">
                ${currentPrice?.c.toFixed(2)}
              </span>
              <ConditionalRenderer isVisible={!!priceChange}>
                <span
                  className={`text-sm ${
                    priceChange?.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {priceChange?.isPositive ? "+" : ""}
                  {priceChange?.change.toFixed(2)}(
                  {priceChange?.isPositive ? "+" : ""}
                  {priceChange?.changePercent.toFixed(2)}%)
                </span>
              </ConditionalRenderer>
            </div>
          </ConditionalRenderer>
        </div>

        {/* Chart Type Badge */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
            {chartType === "line" ? "Line Chart" : "Candlestick"}
          </span>
        </div>
      </div>

      {/* Interval Selector */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Interval:</span>
        {(["daily", "weekly", "monthly"] as ChartInterval[]).map((interval) => (
          <Button
            key={interval}
            variant={selectedInterval === interval ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedInterval(interval)}
          >
            {interval.charAt(0).toUpperCase() + interval.slice(1)}
          </Button>
        ))}
      </div>

      {/* Chart Controls */}
      <ConditionalRenderer isVisible={chartType === "line"}>
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showMA}
              onChange={(e) => setShowMA(e.target.checked)}
              className="rounded"
            />
            Show Moving Averages
          </label>
        </div>
      </ConditionalRenderer>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ConditionalRenderer isVisible={chartType === "line"}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return selectedInterval === "daily"
                    ? date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : selectedInterval === "weekly"
                    ? date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : date.toLocaleDateString("en-US", {
                        month: "short",
                        year: "2-digit",
                      });
                }}
              />
              <YAxis
                domain={["dataMin - 5", "dataMax + 5"]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Main price line */}
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: "#2563eb", strokeWidth: 2 }}
              />

              {/* Moving averages */}
              <ConditionalRenderer
                isVisible={showMA && movingAverages.ma20.length > 0}
              >
                <Line
                  type="monotone"
                  dataKey="ma20"
                  stroke="#f59e0b"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="5 5"
                  data={movingAverages.ma20}
                />
              </ConditionalRenderer>

              <ConditionalRenderer
                isVisible={showMA && movingAverages.ma50.length > 0}
              >
                <Line
                  type="monotone"
                  dataKey="ma50"
                  stroke="#ef4444"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="5 5"
                  data={movingAverages.ma50}
                />
              </ConditionalRenderer>
            </LineChart>
          </ConditionalRenderer>

          <ConditionalRenderer isVisible={chartType === "candlestick"}>
            <CandlestickChart
              data={chartData}
              selectedInterval={selectedInterval}
            />
          </ConditionalRenderer>
        </ResponsiveContainer>
      </div>

      {/* Legend for moving averages */}
      <ConditionalRenderer isVisible={chartType === "line" && showMA}>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-600"></div>
            <span>Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-amber-500 border-dashed"></div>
            <span>MA(20)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-500 border-dashed"></div>
            <span>MA(50)</span>
          </div>
        </div>
      </ConditionalRenderer>

      {/* Data info */}
      <div className="mt-4 text-xs text-muted-foreground">
        Last updated: {new Date().toLocaleTimeString()} • Data points:{" "}
        {chartType === "line" ? lineData.length : chartData.length}
      </div>
    </Card>
  );
};
