import LimestoneApi from "../src/index";

describe("Test getHistoricalPrices method", () => {
  const limestonApiClient: LimestoneApi = LimestoneApi.init();

  test("Should get AR prices", async () => {
    const symbol = "AR";

    const startDate = new Date("2021-03-10");
    const endDate = new Date("2021-03-15");

    const prices: any = await limestonApiClient.getHistoricalPrices(
      symbol,
      startDate,
      endDate
    );

    expect(prices).toBeDefined();
    expect(prices.length).toBeGreaterThan(0);
  });

  test("Should get AR prices and verify signatures", async () => {
    const symbol = "AR";

    const startDate = new Date("2021-03-10");
    const endDate = new Date("2021-03-15");

    const prices: any = await limestonApiClient.getHistoricalPrices(
      symbol,
      startDate,
      endDate,
      { verifySignature: true }
    );

    expect(prices).toBeDefined();
    expect(prices.length).toBeGreaterThan(0);
  });
  
});
