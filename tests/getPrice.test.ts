import LimestoneApi from "../src/index";

// TODO: check if time is close to now

describe("Test getPrice method", () => {
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

  test("Should verify signature for latest ETH price", async () => {
    const symbol = "ETH";
    // const price = await limestonApiClient.getPrice(symbol, {
    //   verifySignature: true,
    // });

    // expect(price).toBeDefined();
  });
  
});
