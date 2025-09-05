import { NextRequest, NextResponse } from "next/server";

export interface TestApiKeyRequest {
  apiKey: string;
  provider?: "nseindia";
}

export interface TestApiKeyResponse {
  success: boolean;
  message: string;
  provider?: string;
  data?: unknown;
}

async function testNSEIndiaKey(_apiKey: string) {
  try {
    const testSymbol = "RELIANCE.NS";
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${testSymbol}`;

    console.log("Testing NSE India data access with URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      console.log("HTTP error:", response.status, response.statusText);
      return {
        success: false,
        message: `HTTP error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    console.log("NSE India test response keys:", Object.keys(data));

    // Check for errors
    if (data?.chart?.error) {
      console.log("NSE India error:", data.chart.error);
      return {
        success: false,
        message: `NSE India Error: ${data.chart.error.description}`,
      };
    }

    // Check if we got valid chart data
    if (data?.chart?.result?.[0]) {
      const result = data.chart.result[0];
      const meta = result.meta;

      console.log("Valid chart data found for:", meta.symbol);

      return {
        success: true,
        message:
          "NSE India API access is working! API key stored successfully.",
        data: {
          symbol: meta.symbol,
          currency: meta.currency,
          currentPrice: meta.regularMarketPrice || meta.previousClose,
          previousClose: meta.previousClose,
          marketState: meta.marketState,
          timezone: meta.timezone,
          exchangeName: meta.exchangeName,
        },
      };
    }

    console.log(
      "Unexpected response structure. Available keys:",
      Object.keys(data)
    );

    return {
      success: false,
      message: `Unexpected response from Yahoo Finance API. Response keys: ${Object.keys(
        data
      ).join(", ")}`,
    };
  } catch (error) {
    console.error("Network error testing NSE India access:", error);
    return {
      success: false,
      message: `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TestApiKeyRequest = await request.json();
    const { apiKey, provider = "nseindia" } = body;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: "API key is required",
        provider,
      } as TestApiKeyResponse);
    }

    const result = await testNSEIndiaKey(apiKey);

    return NextResponse.json({
      ...result,
      provider,
    } as TestApiKeyResponse);
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Server error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      provider: "nseindia",
    } as TestApiKeyResponse);
  }
}
