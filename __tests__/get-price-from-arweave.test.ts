import LimestoneApi from "../src/limestone-api";

// TODO: check if time is close to now

describe("Test getPrice method", () => {
  const limestoneApiClient: LimestoneApi = LimestoneApi.init({
    useCache: false,
  });

  test("Should get AR price from arweave", async () => {
    const symbol = "AR";
    const price: any = await limestoneApiClient.getPrice(symbol);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(0.1);
  });

  test("Should get ETH price from arweave", async () => {
    const symbol = "ETH";
    const price: any = await limestoneApiClient.getPrice(symbol);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(10);
  });
});
