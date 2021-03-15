import LimestoneApi from "../src/index";

describe("Test getHistoricalPrice method", () => {
  const limestoneApiClient: LimestoneApi = LimestoneApi.init();

  test("Should get AR price for 2021-03-14", async () => {
    const symbol = "AR";
    const date = new Date("2021-03-14");
    const price: any =
      await limestoneApiClient.getHistoricalPrice(symbol, date);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBe(13.98);
  });

  test("Should get ETH price for 2021-03-14", async () => {
    const symbol = "ETH";
    const date = new Date("2021-03-14");
    const price: any =
      await limestoneApiClient.getHistoricalPrice(symbol, date);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBe(1741.16);
  });

  test("Should get ETH price for 2021-03-14 and verify signature", async () => {
    const symbol = "ETH";
    const date = new Date("2021-03-14");
    await limestoneApiClient.getHistoricalPrice(symbol, date, {
      verifySignature: true,
    });
  });
  
});
