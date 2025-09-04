/**
 * Finance API Service
 * Handles all financial data API calls for the application
 */

export interface StockData {
  symbol: string;
  c: number; // Current price
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

export interface StockSymbol {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  mic: string;
  symbol: string;
  type: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider?: "nseindia";
  createdAt: string;
  lastUsed?: string;
  isValid?: boolean;
  lastTested?: string;
}

/**
 * Get popular stock symbols from all available symbols
 */
export const getPopularStockSymbols = (symbols: StockSymbol[]): string[] => {
  // Indian popular companies for NSE India API
  const popularIndianCompanies = [
    "RELIANCE",
    "TCS", 
    "HDFCBANK",
    "INFY",
    "HINDUNILVR",
    "ICICIBANK",
    "KOTAKBANK",
    "LT",
    "ASIANPAINT",
    "MARUTI",
    "BHARTIARTL",
    "ITC",
    "SBIN",
    "AXISBANK",
    "BAJFINANCE",
    "WIPRO",
    "ULTRACEMCO",
    "NESTLEIND",
    "POWERGRID",
    "NTPC"
  ];

  // For NSE India, just return the popular symbols directly
  // since we're using mock data from the API
  return popularIndianCompanies.slice(0, 8);
};

/**
 * Fetch all available stock symbols from the API
 */
export const fetchAllSymbols = async (
  apiKey: ApiKey
): Promise<StockSymbol[]> => {
  try {
    const response = await fetch("/api/financial-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol: "",
        apiKey: apiKey.key,
        provider: apiKey.provider || "nseindia",
        dataType: "symbols",
      }),
    });

    const result = await response.json();

    if (result.success && result.data && Array.isArray(result.data)) {
      return result.data;
    }
    return [];
  } catch (err) {
    console.error("Error fetching symbols:", err);
    return [];
  }
};

/**
 * Fetch stock data for a specific symbol
 */
export const fetchStockData = async (
  symbol: string,
  apiKey: ApiKey
): Promise<StockData | null> => {
  try {
    const response = await fetch("/api/financial-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol: symbol,
        apiKey: apiKey.key,
        provider: apiKey.provider || "nseindia",
        dataType: "quote",
      }),
    });

    const result = await response.json();

    if (result.success && result.data) {
      return { ...result.data, symbol };
    }
    return null;
  } catch (err) {
    console.error(`Error fetching data for ${symbol}:`, err);
    return null;
  }
};

/**
 * Fetch multiple stocks data
 */
export const fetchMultipleStocksData = async (
  symbols: string[],
  apiKey: ApiKey
): Promise<StockData[]> => {
  const promises = symbols.map((symbol: string) =>
    fetchStockData(symbol, apiKey)
  );
  const results = await Promise.all(promises);

  // Filter out null results
  return results.filter(
    (data: StockData | null): data is StockData => data !== null
  );
};

/**
 * Fetch popular stocks data
 */
export const fetchPopularStocksData = async (
  apiKey: ApiKey,
  availableSymbols?: StockSymbol[]
): Promise<{
  stocksData: StockData[];
  symbols: StockSymbol[];
}> => {
  let symbols = availableSymbols;

  // Fetch symbols if not provided
  if (!symbols || symbols.length === 0) {
    symbols = await fetchAllSymbols(apiKey);
  }

  const stockSymbols = getPopularStockSymbols(symbols);
  const stocksData = await fetchMultipleStocksData(stockSymbols, apiKey);

  return {
    stocksData,
    symbols,
  };
};

/**
 * Search and fetch data for a specific stock symbol
 */
export const searchStockData = async (
  symbol: string,
  apiKey: ApiKey
): Promise<StockData | null> => {
  const trimmedSymbol = symbol.trim().toUpperCase();
  return await fetchStockData(trimmedSymbol, apiKey);
};

/**
 * Calculate stock price change
 */
export const calculateStockChange = (stockData: StockData) => {
  const amount = stockData.c - stockData.pc;
  const percentage = (amount / stockData.pc) * 100;
  const isPositive = amount >= 0;

  return { amount, percentage, isPositive };
};

/**
 * Format currency value
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format percentage value
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};
