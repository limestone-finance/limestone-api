const fiber = require("fiber-api");

let price, prices;

// ========= Get latest price for a single token ========= //
// Simple way
price = await fiber.getPrice("AR");

// Fluent API way
// Question - should we return array or single price??
price = await fiber.PriceQuery.symbols("AR").getLatest();


// ========= Get latest price for many tokens ========= //
// Simple way
prices = await fiber.getPrice(["BTC", "USD", "ETH"]);

// Fluent API way
// Option 1 (array)
prices = await fiber.PriceQuery.symbols(["BTC", "USD", "ETH"]).getLatest();
// Option 2 (many arguments)
prices = await fiber.PriceQuery.symbols("BTC", "USD", "ETH").getLatest();


// ========= Get historical price for a single token ========= //
// Simple way
price = await fiber.getHistoricalPrice("BTC", {
  date: "2021-03-03"
});

// Fluent API way
price = await fiber.PriceQuery.symbols("BTC").getAtDate("2021-03-03");


// ========= Get historical price for many tokens ========= //
// Simple way
price = await fiber.getHistoricalPrice(["BTC", "USD", "ETH"], {
  date: "2021-03-03"
});

// Fluent API way
// Option 1 (array)
prices = await fiber.PriceQuery.symbols(["BTC", "USD", "ETH"]).getAtDate("2021-03-03");
// Option 2 (many arguments)
prices = await fiber.PriceQuery.symbols("BTC", "USD", "ETH").getAtDate("2021-03-03");

// ========= Get historical prices in time range with interval for a single token ========= //
// Simple way
price = await fiber.getHistoricalPrice("BTC", {
  startDate: "2021-03-03",
  endDate: "2021-03-05",
  interval: 3600,
});

// Fluent API way
price = await fiber.PriceQuery
  .symbols("BTC")
  .fromDate("2021-03-03")
  .toDate("2021-03-05")
  .getWithInterval(3600);

// ========= Get latest price for all tokens ========= //
// Simple way
prices = await fiber.getAllPrices();

// Fluent API way
prices = await fiber.PriceQuery.getLatest();

// ========= Potential problems (incorrect fluent api calls) ========= //

// Currently we don't support getting all tokens for a specific time
prices = await fiber.PriceQuery.getAtDate("2021-02-01");

// We don't support getting prices with interval for many currencies
prices = await fiber.PriceQuery
  .symbols(["BTC", "USD"])
  .fromDate("2020-01-01")
  .toDate("2020-02-01")
  .getWithInterval(3600);

// We don't support fetching prices with interval without specific time range
// fromDate and toDate must be specified
prices = await fiber.PriceQuery
  .symbols("BTC")
  .fromDate("2020-01-01")
  .getWithInterval(3600);
