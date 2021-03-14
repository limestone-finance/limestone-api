import LimestoneApi from "../src/index";

describe("Test getHistoricalPrice method", () => {
  const limestonApiClient: LimestoneApi = LimestoneApi.init();

  test("Should get AR price for 2021-03-12", async () => {
    const symbol = "AR";
    const date = new Date("2021-03-12");
    const price: any =
      await limestonApiClient.getHistoricalPrice(symbol, date);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(0.1);
  });

  test("Should get ETH price for 2021-03-12", async () => {
    const symbol = "ETH";
    const date = new Date("2021-03-12");
    const price: any =
      await limestonApiClient.getHistoricalPrice(symbol, date);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(10);
  });

  test("Should get ETH price for 2021-03-12 and verify signature", async () => {
    const symbol = "ETH";
    const date = new Date("2021-03-12");
    await limestonApiClient.getHistoricalPrice(symbol, date, {
      verifySignature: true,
    });
  });
  
});
