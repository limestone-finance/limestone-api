import limestone from "../src/index";

const MAX_TIME_DIFF = 30000; // 30s

describe("Test getPrice method", () => {
  test("Should get AR price", async () => {
    const symbol = "AR";
    const price: any = await limestone.getPrice(symbol);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(0.1);
    expect(Date.now() - price.timestamp).toBeLessThan(MAX_TIME_DIFF);
  });

  test("Should get ETH price", async () => {
    const symbol = "ETH";
    const price: any = await limestone.getPrice(symbol);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(10);
    expect(Date.now() - price.timestamp).toBeLessThan(MAX_TIME_DIFF);
  });

  test("Should get prices for AR, ETH and BTC", async () => {
    const symbols = ["AR", "ETH", "BTC"];
    const prices: any = await limestone.getPrice(symbols);
    
    expect(prices["AR"]).toBeDefined();
    expect(prices["ETH"]).toBeDefined();
    expect(prices["BTC"]).toBeDefined();
    expect(prices["AR"].value).toBeGreaterThan(0.1);
    expect(prices["ETH"].value).toBeGreaterThan(100);
    expect(prices["BTC"].value).toBeGreaterThan(1000);
    expect(Date.now() - prices["AR"].timestamp).toBeLessThan(MAX_TIME_DIFF);
    expect(Date.now() - prices["BTC"].timestamp).toBeLessThan(MAX_TIME_DIFF);
  });

  test("Should get prices for AR, ETH, BNB, EUR, BTC and verify signature", async () => {
    const symbols = ["AR", "ETH", "BNB", "EUR", "BTC"];
    const prices: any = await limestone.getPrice(symbols, {
      verifySignature: true,
    });
    expect(prices["AR"]).toBeDefined();
    expect(prices["ETH"]).toBeDefined();
    expect(prices["BNB"]).toBeDefined();
    expect(prices["EUR"]).toBeDefined();
    expect(prices["BTC"]).toBeDefined();
  });

  test("Should verify signature for latest ETH price", async () => {
    const symbol = "ETH";
    const price = await limestone.getPrice(symbol, {
      verifySignature: true,
    });

    expect(price).toBeDefined();
  });
  
});
