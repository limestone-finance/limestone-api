import LimestoneApi from "../src/limestone-api";

const MAX_TIME_DIFF = 7200 * 1000; // 2 hours

describe("Test getPrice method", () => {
  const limestoneApiClient: LimestoneApi = LimestoneApi.init({
    useCache: false,
  });

  test("Should get AR price from arweave", async () => {
    const symbol = "AR";
    const price: any = await limestoneApiClient.getPrice(symbol);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(0.1);
    expect(Date.now() - price.timestamp).toBeLessThan(MAX_TIME_DIFF);
  });

  test("Should get ETH price from arweave", async () => {
    const symbol = "ETH";
    const price: any = await limestoneApiClient.getPrice(symbol);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(10);
    expect(Date.now() - price.timestamp).toBeLessThan(MAX_TIME_DIFF);
  });

  test("Should get ETH, BTC, and AR price from arweave", async () => {
    const symbols = ["ETH", "BTC", "AR"];
    const prices: any = await limestoneApiClient.getPrice(symbols);

    expect(Object.keys(prices)).toContain("BTC");
    expect(Object.keys(prices)).toContain("ETH");
    expect(Object.keys(prices)).toContain("AR");
    expect(prices["AR"].value).toBeGreaterThan(0.1);
    expect(prices["ETH"].value).toBeGreaterThan(100);
    expect(prices["BTC"].value).toBeGreaterThan(1000);
    expect(Date.now() - prices["ETH"].timestamp).toBeLessThan(MAX_TIME_DIFF);
    expect(Date.now() - prices["BTC"].timestamp).toBeLessThan(MAX_TIME_DIFF);
  });

  test("Should not get historical prices from arweave", async () => {
    const symbols = ["ETH", "BTC", "AR"];
    return limestoneApiClient.getHistoricalPrice(symbols, {
      date: new Date("021-03-01"),
    }).catch(e => expect(e.toString()).toMatch(
      "Getting historical prices from arweave is not supported"));
  });
});
