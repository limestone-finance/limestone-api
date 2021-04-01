import limestone from "../src/index";

const shouldNotHaveTechProps = (price: any) => {
  const technicalProps = ["signature", "version", "providerPublicKey"];
  for (const prop of technicalProps) {
    expect(price).not.toHaveProperty(prop);
  }
};

describe("Test getHistoricalPrice method", () => {
  test("Should get AR price for 2021-03-14", async () => {
    const symbol = "AR";
    const date = new Date("2021-03-14");
    const price: any =
      await limestone.getHistoricalPrice(symbol, { date });

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBe(13.98);
    shouldNotHaveTechProps(price);
  });

  test("Should get ETH price for 2021-03-14", async () => {
    const symbol = "ETH";
    const date = new Date("2021-03-14");
    const price: any =
      await limestone.getHistoricalPrice(symbol, { date });

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBe(1741.16);
    shouldNotHaveTechProps(price);
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
    const prices: any =
      await limestone.getHistoricalPrice(symbols, {
        date: "2021-03-17",
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
      startDate: "2021-03-14",
      endDate: "2021-03-15",
      interval: 60000,
    });

    expect(prices).toBeDefined();
    expect(prices.map((p: any) => p.value)).toStrictEqual(
      [14.72, 14.93, 14.91, 14.91]);

    for (const price of prices) {
      shouldNotHaveTechProps(price);
    }
  });

  test("Should get AR prices with hourly interval", async () => {
    const symbol = "AR";


    const endDate = new Date("2021-03-31T23:59:00+00:00").getTime();
    const startDate = endDate - 2 * 24 * 3600 * 1000; // 2 days before

    const prices: any = await limestone.getHistoricalPrice(symbol, {
      startDate,
      endDate,
      interval: 3600 * 1000, // 1 hour
      verifySignature: true,
    });

    expect(prices).toBeDefined();
    expect(prices.map((p: any) => p.value)).toStrictEqual([
      28.868158847104826, 28.225307662616157,  27.93151268998456,
      27.874880869724198,  26.82178389116964,      27.1770901266,
       26.99636890894052, 27.220703077242753,              27.26,
       27.81273615770254,  27.46835531543038,  27.33141939797129,
       27.65927730130618, 27.024863640232635, 27.209442470069437,
      27.366739968662397,              27.65,              28.85,
      28.366372304409797,              28.24, 28.537045761979652,
       28.27933023927142,              28.37, 28.266634400875784,
       27.97620323770879,  29.02368732450142, 28.803046291527824,
                   28.58, 28.000043814413324,  27.41803060407267,
       27.80005211171156, 27.847997405983275, 27.457686084140125,
      27.906576397598563, 28.078902814918166, 27.807743742393292,
       27.90712797362494, 28.482584683480813,               28.5,
       28.08057856269271, 28.777808550616047,  29.39464233076597,
                   30.53, 30.882765816351483,  31.91373529690236,
       31.94757983324117,  33.07764981478971,  32.29187825326885
    ]);
  });
});
