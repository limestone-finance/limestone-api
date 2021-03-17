import limestone from "../src/index";
import LimestoneApi from "../src/limestone-api";

describe("Test getAllPrices method", () => {
  test("Should get all prices", async () => {
    const prices = await limestone.getAllPrices();
    
    expect(Object.keys(prices)).toContain("BTC");
    expect(Object.keys(prices)).toContain("ETH");
    expect(Object.keys(prices)).toContain("AR");
    expect(Object.keys(prices)).toContain("EUR");
    expect(Object.keys(prices).length).toBeGreaterThan(100);
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
  });

});
