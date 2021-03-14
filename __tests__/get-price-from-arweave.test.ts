import LimestoneApi from "../src/index";

// TODO: check if time is close to now

describe("Test getPrice method", () => {
  const limestonApiClient: LimestoneApi = LimestoneApi.init({
    useCache: false,
  });

  test("Should get AR price from arweave", async () => {
    const symbol = "AR";
    const price: any = await limestonApiClient.getPrice(symbol);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(0.1);
  });

  test("Should get ETH price from arweave", async () => {
    const symbol = "ETH";
    const price: any = await limestonApiClient.getPrice(symbol);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(10);
  });
});
