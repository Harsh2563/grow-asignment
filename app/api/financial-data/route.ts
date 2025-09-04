import { NextRequest, NextResponse } from "next/server";

export interface FinancialDataRequest {
  symbol: string;
  apiKey: string;
  provider: "nseindia";
  dataType:
    | "quote"
    | "gainers"
    | "losers"
    | "market-movers"
    | "performance"
    | "financial"
    | "symbols"
    | "history";
  days?: number;
  resolution?: "D" | "W" | "M";
}

export interface FinancialDataResponse {
  success: boolean;
  data?: unknown;
  message?: string;
  provider: string;
  symbol: string;
}

async function fetchNSEIndiaData(
  symbol: string,
  apiKey: string,
  dataType: string,
  days?: number,
  resolution?: "D" | "W" | "M"
) {
  console.log("Fetching NSE India data:", {
    symbol,
    dataType,
    days,
    resolution,
  });

  switch (dataType) {
    case "quote":
      const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS`;
      const quoteResponse = await fetch(quoteUrl);
      if (!quoteResponse.ok) {
        throw new Error(`Quote request failed (${quoteResponse.status})`);
      }
      const quoteData = await quoteResponse.json();

      if (quoteData?.chart?.result?.[0]) {
        const result = quoteData.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators?.quote?.[0];

        return {
          c: meta.regularMarketPrice || meta.previousClose,
          h: meta.regularMarketDayHigh || 0,
          l: meta.regularMarketDayLow || 0,
          o: quote?.open?.[quote.open.length - 1] || meta.previousClose,
          pc: meta.previousClose,
          t: Math.floor(Date.now() / 1000),
        };
      }
      throw new Error("No quote data available");

    case "symbols":
      return [
        {
          symbol: "RELIANCE",
          description: "Reliance Industries Limited",
          type: "Common Stock",
        },
        {
          symbol: "TCS",
          description: "Tata Consultancy Services",
          type: "Common Stock",
        },
        {
          symbol: "HDFCBANK",
          description: "HDFC Bank Limited",
          type: "Common Stock",
        },
        {
          symbol: "INFY",
          description: "Infosys Limited",
          type: "Common Stock",
        },
        {
          symbol: "HINDUNILVR",
          description: "Hindustan Unilever Limited",
          type: "Common Stock",
        },
        {
          symbol: "ICICIBANK",
          description: "ICICI Bank Limited",
          type: "Common Stock",
        },
        {
          symbol: "KOTAKBANK",
          description: "Kotak Mahindra Bank",
          type: "Common Stock",
        },
        {
          symbol: "LT",
          description: "Larsen & Toubro Limited",
          type: "Common Stock",
        },
        {
          symbol: "ASIANPAINT",
          description: "Asian Paints Limited",
          type: "Common Stock",
        },
        {
          symbol: "MARUTI",
          description: "Maruti Suzuki India Limited",
          type: "Common Stock",
        },
      ];

    case "gainers":
    case "losers":
    case "market-movers":
      // Fetch real market data for multiple Indian stocks
      const indianStocks = [
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
        "NTPC",
        "ADANIPORTS",
        "COALINDIA",
        "ONGC",
        "TECHM",
        "GRASIM",
        "HCLTECH",
        "JSWSTEEL",
        "TATASTEEL",
        "SUNPHARMA",
        "DRREDDY",
      ];

      const marketData = [];

      for (const stock of indianStocks) {
        try {
          const stockUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${stock}.NS`;
          const stockResponse = await fetch(stockUrl);

          if (stockResponse.ok) {
            const stockData = await stockResponse.json();

            if (stockData?.chart?.result?.[0]) {
              const result = stockData.chart.result[0];
              const meta = result.meta;

              const currentPrice =
                meta.regularMarketPrice || meta.previousClose;
              const previousClose = meta.previousClose;
              const change = currentPrice - previousClose;
              const changePercent = (change / previousClose) * 100;

              marketData.push({
                symbol: stock,
                price: currentPrice.toFixed(2),
                change_amount: change.toFixed(2),
                change_percentage: changePercent.toFixed(2),
                change_percent_numeric: changePercent,
              });
            }
          }
        } catch (error) {
          console.log(`Error fetching data for ${stock}:`, error);
        }
      }

      // Sort by change percentage
      marketData.sort(
        (a, b) =>
          Math.abs(b.change_percent_numeric) -
          Math.abs(a.change_percent_numeric)
      );

      if (dataType === "gainers") {
        const gainers = marketData
          .filter((stock) => parseFloat(stock.change_percentage) > 0)
          .slice(0, 10);
        return { top_gainers: gainers };
      } else if (dataType === "losers") {
        const losers = marketData
          .filter((stock) => parseFloat(stock.change_percentage) < 0)
          .slice(0, 10);
        return { top_losers: losers };
      } else {
        // market-movers: return both gainers and losers
        const gainers = marketData
          .filter((stock) => parseFloat(stock.change_percentage) > 0)
          .slice(0, 5);
        const losers = marketData
          .filter((stock) => parseFloat(stock.change_percentage) < 0)
          .slice(0, 5);
        return {
          top_gainers: gainers,
          top_losers: losers,
          all_movers: marketData.slice(0, 20),
        };
      }

    case "performance":
      try {
        // Fetch detailed stock information from Yahoo Finance
        const summaryUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}.NS?modules=summaryDetail,defaultKeyStatistics,financialData`;
        const summaryResponse = await fetch(summaryUrl);

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          const result = summaryData?.quoteSummary?.result?.[0];

          if (result) {
            const summaryDetail = result.summaryDetail || {};
            const keyStatistics = result.defaultKeyStatistics || {};
            const financialData = result.financialData || {};

            return {
              Symbol: symbol,
              MarketCapitalization:
                keyStatistics.marketCap?.fmt ||
                keyStatistics.marketCap?.raw?.toString() ||
                "N/A",
              PERatio:
                summaryDetail.trailingPE?.fmt ||
                summaryDetail.trailingPE?.raw?.toString() ||
                "N/A",
              PEGRatio:
                keyStatistics.pegRatio?.fmt ||
                keyStatistics.pegRatio?.raw?.toString() ||
                "N/A",
              BookValue:
                keyStatistics.bookValue?.fmt ||
                keyStatistics.bookValue?.raw?.toString() ||
                "N/A",
              FiftyTwoWeekHigh: summaryDetail.fiftyTwoWeekHigh?.raw || 0,
              FiftyTwoWeekLow: summaryDetail.fiftyTwoWeekLow?.raw || 0,
              Volume: summaryDetail.volume?.raw || 0,
              AverageVolume: summaryDetail.averageVolume?.raw || 0,
              DividendYield: summaryDetail.dividendYield?.fmt || "N/A",
              EarningsPerShare: keyStatistics.trailingEps?.raw || 0,
              RevenuePerShare: financialData.revenuePerShare?.raw || 0,
              ReturnOnEquity: financialData.returnOnEquity?.fmt || "N/A",
              CurrentRatio: financialData.currentRatio?.raw || 0,
              DebtToEquity: financialData.debtToEquity?.raw || 0,
            };
          }
        }

        // Fallback if detailed data is not available
        return {
          Symbol: symbol,
          MarketCapitalization: "N/A",
          PERatio: "N/A",
          PEGRatio: "N/A",
          BookValue: "N/A",
          FiftyTwoWeekHigh: 0,
          FiftyTwoWeekLow: 0,
          Volume: 0,
          AverageVolume: 0,
          DividendYield: "N/A",
          EarningsPerShare: 0,
          RevenuePerShare: 0,
          ReturnOnEquity: "N/A",
          CurrentRatio: 0,
          DebtToEquity: 0,
        };
      } catch (error) {
        console.error("Error fetching performance data:", error);
        return {
          Symbol: symbol,
          MarketCapitalization: "N/A",
          PERatio: "N/A",
          PEGRatio: "N/A",
          BookValue: "N/A",
          FiftyTwoWeekHigh: 0,
          FiftyTwoWeekLow: 0,
          Volume: 0,
          AverageVolume: 0,
          DividendYield: "N/A",
          EarningsPerShare: 0,
          RevenuePerShare: 0,
          ReturnOnEquity: "N/A",
          CurrentRatio: 0,
          DebtToEquity: 0,
        };
      }

    case "history": {
      const period1 = Math.floor(
        (Date.now() - (days || 30) * 24 * 60 * 60 * 1000) / 1000
      );
      const period2 = Math.floor(Date.now() / 1000);
      const historyUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?period1=${period1}&period2=${period2}&interval=1d`;

      console.log("NSE History URL:", historyUrl);

      const historyResponse = await fetch(historyUrl);
      if (!historyResponse.ok) {
        throw new Error(`History request failed (${historyResponse.status})`);
      }
      const historyData = await historyResponse.json();

      console.log("NSE History Response keys:", Object.keys(historyData));

      if (historyData?.chart?.error) {
        throw new Error(`NSE Error: ${historyData.chart.error.description}`);
      }

      const result = historyData?.chart?.result?.[0];
      if (!result || !result.timestamp) {
        console.log(
          "No historical data found. Full response:",
          JSON.stringify(historyData, null, 2)
        );
        throw new Error("No historical data available for this symbol");
      }

      const timestamps = result.timestamp;
      const quotes = result.indicators?.quote?.[0];

      if (!quotes || !quotes.close) {
        throw new Error("No price data available");
      }

      console.log(`Processing ${timestamps.length} days of data for ${symbol}`);

      const c: number[] = [];
      const h: number[] = [];
      const l: number[] = [];
      const o: number[] = [];
      const t: number[] = [];
      const v: number[] = [];

      for (let i = 0; i < timestamps.length; i++) {
        if (quotes.close[i] !== null) {
          c.push(quotes.close[i]);
          h.push(quotes.high[i] || quotes.close[i]);
          l.push(quotes.low[i] || quotes.close[i]);
          o.push(quotes.open[i] || quotes.close[i]);
          t.push(timestamps[i]);
          v.push(quotes.volume?.[i] || 0);
        }
      }

      return { c, h, l, o, t, v, s: "ok" };
    }

    default:
      return await fetchNSEIndiaData(symbol, apiKey, "quote");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: FinancialDataRequest = await request.json();
    const { symbol, apiKey, provider, dataType, days, resolution } = body;

    console.log("API Request:", {
      symbol,
      provider,
      dataType,
      days,
      resolution,
    });

    if (
      !symbol &&
      dataType !== "gainers" &&
      dataType !== "losers" &&
      dataType !== "market-movers" &&
      dataType !== "symbols"
    ) {
      return NextResponse.json({
        success: false,
        message: "Symbol is required for this data type",
        provider,
        symbol,
      } as FinancialDataResponse);
    }

    const data = await fetchNSEIndiaData(
      symbol,
      apiKey || "dummy",
      dataType,
      days,
      resolution
    );

    console.log(
      "API Response data:",
      JSON.stringify(data, null, 2).slice(0, 500)
    );

    // Type-safe error checking
    const hasError =
      typeof data === "object" &&
      data !== null &&
      ("error" in data ||
        "Error Message" in data ||
        ("message" in data &&
          typeof data.message === "string" &&
          data.message.includes("Invalid")));

    if (hasError) {
      const errorMessage =
        "error" in data && typeof data.error === "string"
          ? data.error
          : "Error Message" in data && typeof data["Error Message"] === "string"
          ? data["Error Message"]
          : "message" in data && typeof data.message === "string"
          ? data.message
          : "API returned an error";

      return NextResponse.json({
        success: false,
        message: errorMessage,
        provider,
        symbol,
      } as FinancialDataResponse);
    }

    return NextResponse.json({
      success: true,
      data,
      provider,
      symbol,
    } as FinancialDataResponse);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({
      success: false,
      message: `Server error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      provider: "nseindia",
      symbol: "n/a",
    } as FinancialDataResponse);
  }
}
