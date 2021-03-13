import LimestoneApi from "../src/index";

describe("test getHistoricalPrices method", () => {
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

    // TODO: remove this log later
    // When tests will be fully automated
    console.log("Historical AR prices", prices);

    expect(prices).toBeDefined();
    expect(prices.length).toBeGreaterThan(0);
  });
  
});
