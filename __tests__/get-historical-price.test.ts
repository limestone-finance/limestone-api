import limestone from "../src/index";

describe("Test getHistoricalPrice method", () => {
  test("Should get AR price for 2021-03-14", async () => {
    const symbol = "AR";
    const date = new Date("2021-03-14");
    const price: any =
      await limestone.getHistoricalPrice(symbol, { date });

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBe(13.98);
  });

  test("Should get ETH price for 2021-03-14", async () => {
    const symbol = "ETH";
    const date = new Date("2021-03-14");
    const price: any =
      await limestone.getHistoricalPrice(symbol, { date });

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBe(1741.16);
  });

  test("Should get ETH price for 2021-03-14 and verify signature", async () => {
    const symbol = "ETH";
    const date = new Date("2021-03-14");
    await limestone.getHistoricalPrice(symbol, {
      date,
      verifySignature: true,
    });
  });

  test("Should get AR prices", async () => {
    const symbol = "AR";

    const startDate = new Date("2021-03-10");
    const endDate = new Date("2021-03-15");

    const prices: any = await limestone.getHistoricalPrice(symbol, {
      startDate,
      endDate,
      interval: 1, // TODO: change it
    });

    expect(prices).toBeDefined();
    expect(prices.length).toBeGreaterThan(0);
    expect(prices.map((p: any) => p.value)).toStrictEqual(
      [14.91, 14.91, 14.91, 14.91, 14.91, 14.93, 14.93, 14.93, 14.72, 13.98]);
  });

  test("Should get AR prices and verify signatures", async () => {
    const symbol = "AR";

    const startDate = new Date("2021-03-10");
    const endDate = new Date("2021-03-15");

    const prices: any = await limestone.getHistoricalPrice(symbol, {
      startDate,
      endDate,
      interval: 1, // TODO: change it
      verifySignature: true,
    });

    expect(prices).toBeDefined();
    expect(prices.length).toBeGreaterThan(0);
    expect(prices.map((p: any) => p.value)).toStrictEqual(
      [14.91, 14.91, 14.91, 14.91, 14.91, 14.93, 14.93, 14.93, 14.72, 13.98]);
  });
  
  
});
