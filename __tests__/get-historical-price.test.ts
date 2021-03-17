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

  test("Should get AR, BTC and ETH price for 2021-03-17", async () => {
    const symbols = ["AR", "BTC", "ETH"];
    const date = new Date("2021-03-17");
    const prices: any =
      await limestone.getHistoricalPrice(symbols, { date });

    expect(prices["AR"]).toBeDefined();
    expect(prices["BTC"]).toBeDefined();
    expect(prices["ETH"]).toBeDefined();
    expect(prices["AR"].value).toBeGreaterThan(0.1);
    expect(prices["ETH"].value).toBeGreaterThan(100);
    expect(prices["BTC"].value).toBeGreaterThan(1000);
  });

  test("Should get AR prices", async () => {
    const symbol = "AR";

    const startDate = new Date("2021-03-14");
    const endDate = new Date("2021-03-15");

    const prices: any = await limestone.getHistoricalPrice(symbol, {
      startDate,
      endDate,
      interval: 60000,
    });

    expect(prices).toBeDefined();
    expect(prices.map((p: any) => p.value)).toStrictEqual(
      [14.72, 14.93, 14.91, 14.91]);
  });

  test("Should get AR prices and verify signatures", async () => {
    const symbol = "AR";

    const startDate = new Date("2021-03-10");
    const endDate = new Date("2021-03-15");

    const prices: any = await limestone.getHistoricalPrice(symbol, {
      startDate,
      endDate,
      interval: 120000,
      verifySignature: true,
    });

    expect(prices).toBeDefined();
    expect(prices.map((p: any) => p.value)).toStrictEqual([
      13.9,
      13.9,
      13.89,
      14.3,
      14.4,
      14.4,
      14.08,
      13.98,
      14.72,
      14.93,
      14.91]);
  });
  
});
