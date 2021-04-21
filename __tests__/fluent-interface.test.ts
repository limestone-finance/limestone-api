import lQuery from "../src/limestone-query";

// const MAX_TIME_DIFF = 90000; // 90s

describe("Fluent interface tests ", () => {

  /********* SINGLE SYMBOL *********/

  test("Should get AR price", async () => {
    const price = await lQuery().symbol("AR").latest().exec();

    expect(price).toBeDefined();
    // expect(price.symbol).toBe("AR");
    // expect(price.value).toBeGreaterThan(1);
  });

  test("Should get a single historical AR price", async () => {
    const price: any = await lQuery().symbol("AR").atDate("2021-04-19").exec();
  });

  test("Should get historical AR price for the last 12 hours", async () => {
    const symbol = "AR";
    const prices: any = await lQuery().symbol("AR").forLastHours(12).exec();

    // TODO
  });

  test("Should get single historical AR price for the 24 hours ago", async () => {
    const symbol = "AR";
    const price: any = await lQuery().symbol("AR").hoursAgo(24).exec();

    // TODO
  });

  test("Should get historical AR price for last 7 days", async () => {
    const symbol = "AR";
    const prices: any = await lQuery().symbol("AR").forLastDays(7).exec();

    // TODO
  });

  test("Should get historical AR price for the last 1 day", async () => {
    const symbol = "AR";
    const prices: any = await lQuery().symbol("AR").forLastDays(1).exec();

    // TODO
  });

  test("Should get AR price in interval", async () => {
    const symbol = "AR";
    const prices: any = await lQuery()
      .symbol("AR")
      .fromDate("2021-04-19")
      .toDate("2021-04-20")
      .exec();

    // TODO
  });

  /********* SEVERAL SYMBOLS *********/

  test("Should get latest prices for AR, ETH and BTC", async () => {
    const prices: any = await lQuery().symbols(["AR", "ETH", "BTC"]).latest().exec();

    // TODO
  });

  test("Should get the historical price for AR, ETH and BTC", async () => {
    const prices: any = await lQuery()
      .symbols(["AR", "ETH", "BTC"])
      .atDate("2021-04-19")
      .exec();
  });


  /********* ALL SYMBOLS *********/

  test("Should get the latest prices for all symbols", async () => {
    const prices: any = await lQuery().allSymbols().latest().exec();
  });

});
