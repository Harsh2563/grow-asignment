// API Key Testing Utilities
// Provides functions to test API keys for financial data providers

export interface TestApiKeyRequest {
  apiKey: string;
  provider?: "finnhub";
}

export interface TestApiKeyResponse {
  success: boolean;
  message: string;
  provider?: string;
  data?: unknown;
}

/**
 * Test if an API key is valid and working
 * @param apiKey The API key to test
 * @param provider The financial data provider (defaults to 'alphavantage')
 * @returns Promise with test results
 */
export async function testApiKey(
  apiKey: string
): Promise<TestApiKeyResponse> {
  try {
    const response = await fetch("/api/test-api-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey,
        provider: "finnhub",
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
      provider: "finnhub",
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
    provider?: "finnhub";
  }>
): Promise<Array<{ id: string; result: TestApiKeyResponse }>> {
  const promises = apiKeys.map(async ({ id, key }) => ({
    id,
    result: await testApiKey(key),
  }));

  return Promise.all(promises);
}

/**
 * Get supported financial data providers
 * @returns Array of supported provider names
 */
export function getSupportedProviders(): Array<{
  id: "finnhub";
  name: string;
  description: string;
  websiteUrl: string;
}> {
  return [
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
  apiKey: string
): { isValid: boolean; message: string } {
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      isValid: false,
      message: "API key cannot be empty",
    };
  }

  const trimmedKey = apiKey.trim();

  // Finnhub keys are typically 20 characters, alphanumeric
  if (!/^[A-Za-z0-9]{15,25}$/.test(trimmedKey)) {
    return {
      isValid: false,
      message: "Finnhub API keys should be 15-25 alphanumeric characters",
    };
  }

  return {
    isValid: true,
    message: "API key format is valid",
  };
}
