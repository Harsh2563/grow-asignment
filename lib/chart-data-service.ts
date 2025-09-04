import { ApiKey } from "./finance-api";

export interface ChartDataPoint {
  date: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface LineChartData {
  date: string;
  timestamp: number;
  price: number;
  volume?: number;
}

export type ChartInterval = "daily" | "weekly" | "monthly";

/**
 * Convert candlestick data to line chart data
 */
export const convertToLineData = (
  candlestickData: ChartDataPoint[]
): LineChartData[] => {
  return candlestickData.map((point) => ({
    date: point.date,
    timestamp: point.timestamp,
    price: point.close,
    volume: point.volume,
  }));
};

/**
 * Fetch historical chart data for a symbol from Alpha Vantage API
 */
export const fetchChartData = async (
  symbol: string,
  apiKey: ApiKey,
  interval: ChartInterval = "daily"
): Promise<ChartDataPoint[]> => {
  try {
    // Calculate number of days and resolution based on interval
    let days: number;
    let resolution: "D" | "W" | "M";
    switch (interval) {
      case "daily":
        days = 30; // ~1 month of daily data
        resolution = "D";
        break;
      case "weekly":
        days = 365; // ~1 year lookback, Alpha Vantage provides daily data
        resolution = "W";
        break;
      case "monthly":
        days = 365 * 2; // ~2 years lookback, aggregated by M
        resolution = "M";
        break;
      default:
        days = 30;
        resolution = "D";
    }

    const response = await fetch("/api/financial-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol: symbol,
        apiKey: apiKey.key,
        provider: apiKey.provider || "nseindia",
        dataType: "history",
        days: days,
        resolution,
      }),
    });

    const result = await response.json();

    if (result.success && result.data) {
      const { c, h, l, o, t, v } = result.data;

      if (!c || !h || !l || !o || !t || c.length === 0) {
        throw new Error("No historical data available for this symbol");
      }

      const chartData: ChartDataPoint[] = [];

      for (let i = 0; i < c.length; i++) {
        const date = new Date(t[i] * 1000); 
        chartData.push({
          date: date.toISOString().split("T")[0],
          timestamp: t[i] * 1000,
          open: Number(o[i].toFixed(2)),
          high: Number(h[i].toFixed(2)),
          low: Number(l[i].toFixed(2)),
          close: Number(c[i].toFixed(2)),
          volume: v ? v[i] : undefined,
        });
      }

      return chartData.sort((a, b) => a.timestamp - b.timestamp);
    } else {
      throw new Error(result.message || "Failed to fetch historical data");
    }
  } catch (error) {
    console.error(`Error fetching chart data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Format chart data for different time intervals
 */
export const formatChartDataForInterval = (
  data: ChartDataPoint[],
  interval: ChartInterval
): ChartDataPoint[] => {
  if (interval === "daily") {
    return data;
  }

  const groupedData: { [key: string]: ChartDataPoint[] } = {};

  data.forEach((point) => {
    const date = new Date(point.timestamp);
    let key: string;

    if (interval === "weekly") {
      // Group by week (Monday to Sunday)
      const mondayDate = new Date(date);
      mondayDate.setDate(date.getDate() - date.getDay() + 1);
      key = mondayDate.toISOString().split("T")[0];
    } else {
      // Group by month
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    }

    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(point);
  });

  // Aggregate grouped data
  const aggregatedData: ChartDataPoint[] = [];

  Object.entries(groupedData).forEach(([key, points]) => {
    if (points.length === 0) return;

    const sortedPoints = points.sort((a, b) => a.timestamp - b.timestamp);
    const open = sortedPoints[0].open;
    const close = sortedPoints[sortedPoints.length - 1].close;
    const high = Math.max(...sortedPoints.map((p) => p.high));
    const low = Math.min(...sortedPoints.map((p) => p.low));
    const volume = sortedPoints.reduce((sum, p) => sum + (p.volume || 0), 0);
    const timestamp = sortedPoints[0].timestamp;

    aggregatedData.push({
      date: key,
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    });
  });

  return aggregatedData.sort((a, b) => a.timestamp - b.timestamp);
};
