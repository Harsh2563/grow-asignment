"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConditionalRenderer } from "@/components/ui/ConditionalRenderer";

interface WidgetFormFieldsProps {
  widgetName: string;
  widgetType: string;
  stockSymbol: string;
  chartType: string;
  refreshInterval: string;
  onWidgetNameChange: (value: string) => void;
  onWidgetTypeChange: (value: string) => void;
  onStockSymbolChange: (value: string) => void;
  onChartTypeChange: (value: string) => void;
  onRefreshIntervalChange: (value: string) => void;
}

export const WidgetFormFields = ({
  widgetName,
  widgetType,
  stockSymbol,
  chartType,
  refreshInterval,
  onWidgetNameChange,
  onWidgetTypeChange,
  onStockSymbolChange,
  onChartTypeChange,
  onRefreshIntervalChange,
}: WidgetFormFieldsProps) => {
  return (
    <>
      {/* Widget Name */}
      <div className="grid gap-3">
        <Label htmlFor="widget-name">Widget Name</Label>
        <Input
          id="widget-name"
          name="widget-name"
          placeholder="e.g., Apple Stock Price"
          value={widgetName}
          onChange={(e) => onWidgetNameChange(e.target.value)}
          required
        />
      </div>

      {/* Widget Type */}
      <div className="grid gap-3">
        <Label htmlFor="widget-type">Widget Type</Label>
        <select
          id="widget-type"
          name="widget-type"
          value={widgetType}
          onChange={(e) => onWidgetTypeChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="">Select widget type</option>
          <option value="table">Stock Table</option>
          <option value="card">Comprehensive Finance Card</option>
          <option value="chart">Price Chart</option>
        </select>
      </div>

      {/* Stock Symbol - Disabled for table widgets */}
      <div className="grid gap-3">
        <Label htmlFor="stock-symbol">Stock Symbol</Label>
        {widgetType === "table" ? (
          <div className="space-y-2">
            <Input
              id="stock-symbol"
              name="stock-symbol"
              placeholder="Multiple stocks will be displayed"
              value="Multiple stocks (AAPL, GOOGL, MSFT, AMZN, TSLA, META, NVDA, NFLX)"
              disabled
              className="opacity-60"
            />
            <p className="text-xs text-muted-foreground">
              Table widgets display multiple predefined stocks automatically
            </p>
          </div>
        ) : (
          <Input
            id="stock-symbol"
            name="stock-symbol"
            placeholder="e.g., AAPL, GOOGL, TSLA"
            value={stockSymbol}
            onChange={(e) => onStockSymbolChange(e.target.value.toUpperCase())}
            required
          />
        )}
      </div>

      {/* Chart Type - Only show for chart widgets */}
      <ConditionalRenderer isVisible={widgetType === "chart"}>
        <div className="grid gap-3">
          <Label htmlFor="chart-type">Chart Type</Label>
          <select
            id="chart-type"
            name="chart-type"
            value={chartType}
            onChange={(e) => onChartTypeChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select chart type</option>
            <option value="line">Line Chart</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Line charts show price trends over time with optional moving
            averages.
          </p>
        </div>
      </ConditionalRenderer>

      {/* Card Type - Only show for card widgets */}
      <ConditionalRenderer isVisible={widgetType === "card"}>
        <div className="grid gap-3">
          <Label htmlFor="card-type">Card Description</Label>
          <div className="p-3 bg-muted/50 rounded-md border">
            <p className="text-sm text-muted-foreground">
              This comprehensive finance card includes:
            </p>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Stock Overview with live price data</li>
              <li>• Personal Watchlist management</li>
              <li>• Market Gainers and Losers</li>
              <li>• Performance and Financial Data</li>
            </ul>
          </div>
        </div>
      </ConditionalRenderer>

      {/* Refresh Interval */}
      <div className="grid gap-3">
        <Label htmlFor="refresh-interval">Refresh Interval</Label>
        <select
          id="refresh-interval"
          name="refresh-interval"
          value={refreshInterval}
          onChange={(e) => onRefreshIntervalChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="30">30 seconds</option>
          <option value="60">1 minute</option>
          <option value="300">5 minutes</option>
          <option value="900">15 minutes</option>
          <option value="1800">30 minutes</option>
          <option value="3600">1 hour</option>
        </select>
      </div>
    </>
  );
};
