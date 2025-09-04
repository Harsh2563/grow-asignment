// Widget Types
export interface Widget {
  id: string;
  type: "finance-table" | "stock-chart" | "comprehensive-finance";
  title: string;
  symbol?: string;
  apiKeyId?: string;
  position: number;
  config?: {
    interval?: string;
    range?: string;
    showVolume?: boolean;
    [key: string]: string | number | boolean | undefined;
  };
}

// API Key Types
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider: "alpha-vantage" | "finnhub" | "polygon" | "nseindia";
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  isValid?: boolean;
  lastTested?: string;
}

// Finance Data Types
export interface FinanceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
  pe?: number;
  eps?: number;
  dividend?: number;
  beta?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  timestamp: string;
}

// Chart Data Types
export interface ChartDataPoint {
  timestamp: string;
  price: number;
  volume?: number;
}

export interface LineChartData {
  symbol: string;
  data: ChartDataPoint[];
  interval: string;
}

export type ChartInterval =
  | "1min"
  | "5min"
  | "15min"
  | "30min"
  | "60min"
  | "daily"
  | "weekly"
  | "monthly";

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Common UI Types
export interface SelectOption {
  value: string;
  label: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

// Theme Types
export type Theme = "light" | "dark" | "system";
