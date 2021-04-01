import limestone from "../src/index";
import LimestoneApi from "../src/limestone-api";

const MAX_TIME_DIFF = 90000; // 90s
const MAX_TIME_DIFF_ARWEAVE = 7200 * 1000; // 2 hours

const shouldNotHaveTechProps = (price: any) => {
  const technicalProps = ["signature", "version", "providerPublicKey"];
  for (const prop of technicalProps) {
    expect(price).not.toHaveProperty(prop);
  }
};

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

  test("Should not have technical props", async () => {
    const prices = await limestone.getAllPrices();
    for (const price of Object.values(prices)) {
      shouldNotHaveTechProps(price);
    }
  });

  test("Should get all prices from arweave", async () => {
    const noCacheApi = LimestoneApi.init({ useCache: false });
    const prices = await noCacheApi.getAllPrices();
    expect(Object.keys(prices).length).toBeGreaterThan(3);
    expect(Date.now() - prices["AR"].timestamp).toBeLessThan(MAX_TIME_DIFF_ARWEAVE);
    expect(Date.now() - prices["BTC"].timestamp).toBeLessThan(MAX_TIME_DIFF_ARWEAVE);
    for (const price of Object.values(prices)) {
      shouldNotHaveTechProps(price);
    }
  });

});
