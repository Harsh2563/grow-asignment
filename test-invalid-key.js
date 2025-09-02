// Test script to check what Alpha Vantage returns for invalid keys
async function testInvalidKey() {
  const invalidKey = "INVALID_KEY_123";
  const symbols = ["MSFT", "GOOGL", "TSLA", "NVDA"];

  for (const symbol of symbols) {
    const testUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${invalidKey}`;

    try {
      console.log(`\nTesting invalid key with ${symbol}:`);
      console.log("URL:", testUrl);

      const response = await fetch(testUrl);
      const data = await response.json();

      console.log("Response status:", response.status);
      console.log("Response data:", JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

// Also test with a demo key
async function testDemoKey() {
  const demoKey = "demo";
  const symbols = ["MSFT", "GOOGL", "TSLA", "NVDA"];

  for (const symbol of symbols) {
    const testUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${demoKey}`;

    try {
      console.log(`\nTesting demo key with ${symbol}:`);
      console.log("URL:", testUrl);

      const response = await fetch(testUrl);
      const data = await response.json();

      console.log("Response status:", response.status);
      console.log("Response data:", JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

testInvalidKey().then(() => testDemoKey());
