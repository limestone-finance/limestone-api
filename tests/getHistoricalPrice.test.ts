import LimestoneApi from "../src/index";

describe("test getHistoricalPrice method", () => {
  const limestonApiClient: LimestoneApi = LimestoneApi.init();

  test("Should get AR price for 2021-03-12", async () => {
    const symbol = "AR";
    const date = new Date("2021-03-12");
    const price: any =
      await limestonApiClient.getHistoricalPrice(symbol, date);

    // TODO: remove this log later
    // When tests will be fully automated
    console.log("AR price for specific date", price);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(0.1);
  });

  test("Should get ETH price for 2021-03-12", async () => {
    const symbol = "ETH";
    const date = new Date("2021-03-12");
    const price: any =
      await limestonApiClient.getHistoricalPrice(symbol, date);

    // TODO: remove this log later
    // When tests will be fully automated
    console.log("ETH price for specific date", price);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(10);
  });
  
});
