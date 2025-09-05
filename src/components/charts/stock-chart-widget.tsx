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
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConditionalRenderer } from "@/components/ui/ConditionalRenderer";
import {
  fetchChartData,
  convertToLineData,
  formatChartDataForInterval,
  type ChartDataPoint,
  type LineChartData,
  type ChartInterval,
} from "@/lib/services/chart-data-service";
import {
  fetchStockData,
  type ApiKey,
  type StockData,
} from "@/lib/api/finance-api";
import { VolumeChart } from "./volume-chart";
import { UI } from "@/constants";

interface StockChartWidgetProps {
  widgetId: string;
  symbol: string;
  chartType: "line";
  apiKey: ApiKey;
  refreshInterval: number;
  onError?: (error: string) => void;
}

export const StockChartWidget: React.FC<StockChartWidgetProps> = ({
  symbol,
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

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch current price first
      await fetchCurrentPrice();

      // Fetch historical data
      const data = await fetchChartData(symbol, apiKey, selectedInterval);

      if (data.length === 0) {
        throw new Error("No chart data available");
      }

      // Format data for the selected interval
      const formattedData = formatChartDataForInterval(data, selectedInterval);
      setChartData(formattedData);

      // Convert to line data
      setLineData(convertToLineData(formattedData));
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch chart data";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ payload: { volume: number }; value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Date: ${label}`}</p>
          <p className="text-blue-600">{`Price: ₹${payload[0].value.toFixed(
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
      <Card className="p-6 h-[550px] flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 h-[550px] flex flex-col">
        <div className="text-center flex items-center justify-center flex-1">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline">
            {UI.RETRY}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3 sm:p-6 h-[400px] sm:h-[550px] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 flex-shrink-0 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold truncate">{symbol} Price Chart</h3>
          <ConditionalRenderer isVisible={!!currentPrice}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
              <span className="text-lg sm:text-2xl font-bold">
                ₹{currentPrice?.c.toFixed(2)}
              </span>
              <ConditionalRenderer isVisible={!!priceChange}>
                <span
                  className={`text-xs sm:text-sm ${
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
          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs sm:text-sm font-medium">
            Line Chart
          </span>
        </div>
      </div>

      {/* Interval Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
        <span className="text-xs sm:text-sm font-medium">Interval:</span>
        <div className="flex gap-1 sm:gap-2">
          {(["daily", "weekly", "monthly"] as ChartInterval[]).map((interval) => (
            <Button
              key={interval}
              variant={selectedInterval === interval ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedInterval(interval)}
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              <span className="hidden sm:inline">
                {interval.charAt(0).toUpperCase() + interval.slice(1)}
              </span>
              <span className="sm:hidden">
                {interval.charAt(0).toUpperCase()}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
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
              tickFormatter={(value) => `₹${value.toFixed(0)}`}
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
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <VolumeChart data={chartData} height={80} />

      {/* Data info */}
      <div className="mt-4 text-xs text-muted-foreground">
        Last updated: {new Date().toLocaleTimeString()} • Data points:{" "}
        {lineData.length}
      </div>
    </Card>
  );
};
