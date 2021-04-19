import lQuery from "../src/limestone-query";

// const MAX_TIME_DIFF = 90000; // 90s

describe("Should get latest AR price", () => {

  /********* SINGLE SYMBOL *********/

  test("Should get AR price", async () => {
    const price = await lQuery().symbol("AR").latest().get();

    expect(price).toBeDefined();
    // expect(price.symbol).toBe("AR");
    // expect(price.value).toBeGreaterThan(1);
  });

  test("Should get a single historical AR price", async () => {
    const price: any = await lQuery().symbol("AR").atDate("2021-04-05").get();
  });

  test("Should get historical AR price for the last 12 hours", async () => {
    const symbol = "AR";
    const prices: any = await lQuery().symbol("AR").forLastHours(12).get();

    // TODO
  });

  test("Should get historical AR price for last 7 days", async () => {
    const symbol = "AR";
    const prices: any = await lQuery().symbol("AR").forLastDays(7).get();

    // TODO
  });

  test("Should get historical AR price for the last 1 day", async () => {
    const symbol = "AR";
    const prices: any = await lQuery().symbol("AR").forLastDays(1).get();

    // TODO
  });

  test("Should get AR price in interval", async () => {
    const symbol = "AR";
    const prices: any = await lQuery()
      .symbol("AR")
      .fromDate("2020-04-05")
      .toDate("2021-04-09")
      .get();

    // TODO
  });

  /********* SEVERAL SYMBOLS *********/

  test("Should get latest prices for AR, ETH and BTC", async () => {
    const prices: any = await lQuery().symbols(["AR", "ETH", "BTC"]).latest().get();

    // TODO
  });

  test("Should get the historical price for AR, ETH and BTC", async () => {
    const prices: any = await lQuery()
      .symbols(["AR", "ETH", "BTC"])
      .atDate("2021-04-09")
      .get();
  });


  /********* ALL SYMBOLS *********/

  test("Should get the latest prices for all symbols", async () => {
    const prices: any = await lQuery().allSymbols().latest().get();
  });

});
