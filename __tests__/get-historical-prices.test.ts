import LimestoneApi from "../src/index";

describe("Test getHistoricalPrices method", () => {
  const limestoneApiClient: LimestoneApi = LimestoneApi.init();

  test("Should get AR prices", async () => {
    const symbol = "AR";

    const startDate = new Date("2021-03-10");
    const endDate = new Date("2021-03-15");

    const prices: any = await limestoneApiClient.getHistoricalPrices(
      symbol,
      startDate,
      endDate
    );

    expect(prices).toBeDefined();
    expect(prices.length).toBeGreaterThan(0);
    expect(prices.map((p: any) => p.value)).toStrictEqual(
      [14.91, 14.91, 14.91, 14.91, 14.91, 14.93, 14.93, 14.93, 14.72, 13.98]);
  });

  test("Should get AR prices and verify signatures", async () => {
    const symbol = "AR";

    const startDate = new Date("2021-03-10");
    const endDate = new Date("2021-03-15");

    const prices: any = await limestoneApiClient.getHistoricalPrices(
      symbol,
      startDate,
      endDate,
      { verifySignature: true }
    );

    expect(prices).toBeDefined();
    expect(prices.length).toBeGreaterThan(0);
    expect(prices.map((p: any) => p.value)).toStrictEqual(
      [14.91, 14.91, 14.91, 14.91, 14.91, 14.93, 14.93, 14.93, 14.72, 13.98]);
  });
  
});
