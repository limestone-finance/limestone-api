import limestone from "../src/index";

const shouldNotHaveTechProps = (price: any) => {
  const technicalProps = ["signature", "version", "providerPublicKey"];
  for (const prop of technicalProps) {
    expect(price).not.toHaveProperty(prop);
  }
};

describe("Test getHistoricalPrice method", () => {
  test("Should get AR price for 2021-04-17", async () => {
    const symbol = "AR";
    const date = new Date("2021-04-17");
    const price: any =
      await limestone.getHistoricalPrice(symbol, { date });

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBe(25.923827794046517);
    shouldNotHaveTechProps(price);
  });

  test("Should get ETH price for 2021-04-17", async () => {
    const symbol = "ETH";
    const date = new Date("2021-04-17");
    const price: any =
      await limestone.getHistoricalPrice(symbol, { date });

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBe(2421.882615498678);
    shouldNotHaveTechProps(price);
  });

  test("Should get ETH price for 2021-04-17 and verify signature", async () => {
    const symbol = "ETH";
    const date = new Date("2021-04-17");

    await limestone.getHistoricalPrice(symbol, {
      date,
      verifySignature: true,
    });
  });

  test("Should get AR, BTC and ETH price for 2021-04-17", async () => {
    const symbols = ["AR", "BTC", "ETH"];
    const prices: any =
      await limestone.getHistoricalPrice(symbols, {
        date: "2021-04-17",
      });

    for (const symbol of symbols) {
      expect(prices[symbol]).toBeDefined();
      shouldNotHaveTechProps(prices[symbol]);
    }

    expect(prices["AR"].value).toBeGreaterThan(0.1);
    expect(prices["ETH"].value).toBeGreaterThan(100);
    expect(prices["BTC"].value).toBeGreaterThan(1000);
  });

  test("Should get AR prices", async () => {
    const symbol = "AR";

    const prices: any = await limestone.getHistoricalPrice(symbol, {
      startDate: "2021-04-17",
      endDate: "2021-04-18",
      interval: 600000,
    });

    expect(prices).toBeDefined();
    expect(prices.length).toBe(144);

    for (const price of prices) {
      shouldNotHaveTechProps(price);
    }
  });

  test("Should get AR prices with hourly interval", async () => {
    const symbol = "AR";


    const endDate = new Date("2021-04-20T23:59:00+00:00").getTime();
    const startDate = endDate - 2 * 24 * 3600 * 1000; // 2 days before

    const prices: any = await limestone.getHistoricalPrice(symbol, {
      startDate,
      endDate,
      interval: 3600 * 1000, // 1 hour
      verifySignature: true,
    });

    expect(prices).toBeDefined();
    expect(prices.length).toBe(48);
  });
});
