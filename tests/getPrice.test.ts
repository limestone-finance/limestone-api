import LimestoneApi from "../src/index";

describe("test getPrice method", () => {
  const limestonApiClient: LimestoneApi = LimestoneApi.init();

  test("Should get AR price", async () => {
    const symbol = "AR";
    const price: any = await limestonApiClient.getPrice(symbol);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(0.1);
  });

  test("Should get ETH price", async () => {
    const symbol = "ETH";
    const price: any = await limestonApiClient.getPrice(symbol);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(10);
  });
  
});
