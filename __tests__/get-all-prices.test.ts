import limestone from "../src/index";
import LimestoneApi from "../src/limestone-api";

const MAX_TIME_DIFF = 30000; // 30s
const MAX_TIME_DIFF_ARWEAVE = 1200 * 1000; // 20 minutes

describe("Test getAllPrices method", () => {
  test("Should get all prices", async () => {
    const prices = await limestone.getAllPrices();
    
    expect(Object.keys(prices)).toContain("BTC");
    expect(Object.keys(prices)).toContain("ETH");
    expect(Object.keys(prices)).toContain("AR");
    expect(Object.keys(prices)).toContain("EUR");
    expect(Object.keys(prices).length).toBeGreaterThan(100);
    expect(Date.now() - prices["AR"].timestamp).toBeLessThan(MAX_TIME_DIFF);
    expect(Date.now() - prices["BTC"].timestamp).toBeLessThan(MAX_TIME_DIFF);
  });

  test("Should get all prices and verify their signatures", async () => {
    const prices = await limestone.getAllPrices({
      verifySignature: true,
    });

    expect(Object.keys(prices).length).toBeGreaterThan(100);
  });

  test("Should get all prices from arweave", async () => {
    const noCacheApi = LimestoneApi.init({ useCache: false });
    const prices = await noCacheApi.getAllPrices();
    expect(Object.keys(prices).length).toBeGreaterThan(3);
    expect(Date.now() - prices["AR"].timestamp).toBeLessThan(MAX_TIME_DIFF_ARWEAVE);
    expect(Date.now() - prices["BTC"].timestamp).toBeLessThan(MAX_TIME_DIFF_ARWEAVE);
  });

});
