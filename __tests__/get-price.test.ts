import limestone from "../src/index";

// TODO: check if time is close to now

describe("Test getPrice method", () => {
  test("Should get AR price", async () => {
    const symbol = "AR";
    const price: any = await limestone.getPrice(symbol);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(0.1);
  });

  test("Should get ETH price", async () => {
    const symbol = "ETH";
    const price: any = await limestone.getPrice(symbol);

    expect(price).toBeDefined();
    expect(price.symbol).toBe(symbol);
    expect(price.value).toBeGreaterThan(10);
  });

  // TODO finish this test
  // test("Should get prices for AR, ETH and BTC", async () => {
  //   const symbols = ["AR", "ETH", "BTC"];
  //   const prices: any = await limestone.getPrice(symbols);
  //   console.log(prices);
  // });

  test("Should verify signature for latest ETH price", async () => {
    const symbol = "ETH";
    const price = await limestone.getPrice(symbol, {
      verifySignature: true,
    });

    expect(price).toBeDefined();
  });
  
});
