// API Key Testing Utilities
// Provides functions to test API keys for financial data providers

export interface TestApiKeyRequest {
  apiKey: string;
  provider?: "alphavantage" | "twelvedata" | "finnhub";
}

export interface TestApiKeyResponse {
  success: boolean;
  message: string;
  provider?: string;
  data?: any;
}

/**
 * Test if an API key is valid and working
 * @param apiKey The API key to test
 * @param provider The financial data provider (defaults to 'alphavantage')
 * @returns Promise with test results
 */
export async function testApiKey(
  apiKey: string,
  provider: "alphavantage" | "twelvedata" | "finnhub" = "alphavantage"
): Promise<TestApiKeyResponse> {
  try {
    const response = await fetch("/api/test-api-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey,
        provider,
      } as TestApiKeyRequest),
    });

    const result: TestApiKeyResponse = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      provider,
    };
  }
}

/**
 * Test multiple API keys and return results for each
 * @param apiKeys Array of objects with id, key, and optional provider
 * @returns Promise with array of test results
 */
export async function testMultipleApiKeys(
  apiKeys: Array<{
    id: string;
    key: string;
    provider?: "alphavantage" | "twelvedata" | "finnhub";
  }>
): Promise<Array<{ id: string; result: TestApiKeyResponse }>> {
  const promises = apiKeys.map(async ({ id, key, provider }) => ({
    id,
    result: await testApiKey(key, provider),
  }));

  return Promise.all(promises);
}

/**
 * Get supported financial data providers
 * @returns Array of supported provider names
 */
export function getSupportedProviders(): Array<{
  id: "alphavantage" | "twelvedata" | "finnhub";
  name: string;
  description: string;
  websiteUrl: string;
}> {
  return [
    {
      id: "alphavantage",
      name: "Alpha Vantage",
      description:
        "Real-time and historical stock data, forex, and crypto data",
      websiteUrl: "https://www.alphavantage.co/",
    },
    {
      id: "twelvedata",
      name: "Twelve Data",
      description: "Stock market data API with real-time and historical data",
      websiteUrl: "https://twelvedata.com/",
    },
    {
      id: "finnhub",
      name: "Finnhub",
      description: "Real-time stock market data and financial news API",
      websiteUrl: "https://finnhub.io/",
    },
  ];
}

/**
 * Validate API key format for different providers
 * @param apiKey The API key to validate
 * @param provider The provider to validate against
 * @returns Object with validation result and message
 */
export function validateApiKeyFormat(
  apiKey: string,
  provider: "alphavantage" | "twelvedata" | "finnhub"
): { isValid: boolean; message: string } {
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      isValid: false,
      message: "API key cannot be empty",
    };
  }

  const trimmedKey = apiKey.trim();

  switch (provider) {
    case "alphavantage":
      // Alpha Vantage keys are typically alphanumeric, 16 characters
      if (!/^[A-Za-z0-9]{10,20}$/.test(trimmedKey)) {
        return {
          isValid: false,
          message:
            "Alpha Vantage API keys should be 10-20 alphanumeric characters",
        };
      }
      break;

    case "twelvedata":
      // Twelve Data keys are typically longer alphanumeric strings
      if (!/^[A-Za-z0-9]{20,40}$/.test(trimmedKey)) {
        return {
          isValid: false,
          message:
            "Twelve Data API keys should be 20-40 alphanumeric characters",
        };
      }
      break;

    case "finnhub":
      // Finnhub keys are typically 20 characters, alphanumeric
      if (!/^[A-Za-z0-9]{15,25}$/.test(trimmedKey)) {
        return {
          isValid: false,
          message: "Finnhub API keys should be 15-25 alphanumeric characters",
        };
      }
      break;

    default:
      return {
        isValid: false,
        message: "Unsupported provider",
      };
  }

  return {
    isValid: true,
    message: "API key format is valid",
  };
}
