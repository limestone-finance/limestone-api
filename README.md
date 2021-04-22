# Limestone API

[![License](https://img.shields.io/badge/license-MIT-green)](https://choosealicense.com/licenses/mit/)
[![Github activity](https://img.shields.io/github/commit-activity/m/limestone-finance/limestone-api)](https://github.com/limestone-finance/limestone-api)
[![Discord](https://img.shields.io/discord/786251205008949258?logo=discord)](https://discord.gg/2CT6hN6C)
[![NPM](https://img.shields.io/npm/v/limestone-api)](https://www.npmjs.com/package/limestone-api)
[![Twitter](https://img.shields.io/twitter/follow/limestone_defi?style=flat&logo=twitter)](https://twitter.com/intent/follow?screen_name=limestone_defi)

Limestone API is a Javascript library for fetching trusted token pricing data from [Limestone data ecosystem](https://github.com/limestone-finance/limestone/blob/master/README.md).

It is a Javascript wrapper for [Limestone HTTP Api](docs/HTTP_API.md).

## ✅ Why Limestone API
### ✓ Secure
Limestone pricing data is secured on Arweave and protected by the provider's collateral.
[Learn more](https://github.com/limestone-finance/limestone/blob/master/README.md)

### ✓ Easy to use
You don't need any API keys. Just install the npm package and add a single line of code.
[Quick start](docs/QUICK_START.md)

### ✓ 100+ tokens
We support BTC, ETH, AR, EUR, and many other crypto and fiat currencies.
[All supported tokens](docs/ALL_SUPPORTED_TOKENS.md)

### ✓ TypeScript Support
Limestone API is fully written in Typescript and then compiled to JavaScript.
[Source code](https://github.com/limestone-finance/limestone-api)

## 📖 Documentation
This readme should provide you with all the required information for starting using limestone api. If you want to see the full documentation visit [docs.limestone.finance](https://docs.limestone.finance)

## 📦 Installation

### Using npm
```bash
npm install limestone-api
```

### Using yarn
```bash
yarn add limestone-api
```

## 🤖 Usage

### Importing

```js
// Using Node.js `require()`
const limestone = require('limestone-api');

// Using ES6 imports
import limestone from 'limestone-api';

```

### Get the latest price for a single token
```js
const price = await limestone.getPrice("AR");

console.log(price.value); // latest price value for AR token (in USD)
console.log(price.timestamp); // the exact timestamp of the price
```
💡 Note: All the prices are denominated in USD. You can fetch price data for BTC, ETH, AR, EUR and any other of [ 100+ supported tokens.](docs/ALL_SUPPORTED_TOKENS.md)

<br/>

<details>
  <summary>Price data format</summary>

  ```js
  {
    value: 123.23, // Number: Price value in USD
    timestamp: 1617146511173, // Number: Timestamp (ms) for price
    provider: "I-5rWUehEv-MjdK9gFw09RxfSLQX9DIHxG614Wf8qo0", // String: Provider arweave address
    permawebTx: "V8FUU0BG4kVOJwKWHzgkn1aEFm-eanhqqEXfPFY7pmI", // String: Arweave transaction id
    source: {"coingecko": 123,"sushiswap": 123.23,"uniswap": 123.35}, // Object: Prices from different sources
  }
  ```
</details>

<br/>

<details>
  <summary>Fetch price using promises</summary>

  ```js
  // As async/await is only a syntactic sugar on Javascript
  // Promises you can use them in a "standard" way
  const price = limestone.getPrice("AR").then((price) => {
    console.log(price.value); // latest price value for AR token
  });
  ```
</details>
<br/>

----------------------------------------------

### Get the latest prices for several tokens
To fetch prices for several tokens use the `getPrice` method and pass an array with any subset of [supported tokens](docs/ALL_SUPPORTED_TOKENS.md).
```js
const prices = await limestone.getPrice(["BTC", "ETH", "AR", "EUR"]);

console.log(prices); // Example output below
/*
{
  "BTC": {
    value: 58953.39,
    timestamp: 1617152802779,
    ...
  },
  "ETH": {
    value: 1856.75,
    timestamp: 1617152802779,
    ...
  },
  ...
}
*/


console.log(prices["BTC"].value); // latest price value for BTC
console.log(prices["ETH"].value); // latest price value for ETH
console.log(prices["AR"].value); // latest price value for AR

```

----------------------------------------------

### Get prices for all available tokens
To fetch the latest prices for all available tokens use the `getAllPrices` method.
```js
const prices = await limestone.getAllPrices();

console.log(prices); // Example output below
/*
{
  "BTC": {...},
  "ETH": {...},
  ...
}
*/

console.log(prices["AR"].value); // latest price value for AR
console.log(prices["EUR"].value); // latest price value for EUR
```

----------------------------------------------

### Get the historical price for a single token
To get the historical price use the `getHistoricalPrice` method.
```js
const price = await limestone.getHistoricalPrice("AR", {
  date: "2021-03-30T12:35:09", // Any convertable to date type
});

console.log(price.value); // AR price for specific time
```

💡 Note: `date` argument must be convertable to Date type. You may pass date (e.g. `new Date(2021-04-01)`), timestamp (e.g. `1617709771289`), or just string (e.g. `2021-04-01` or `2021-04-01T12:30:58`).

----------------------------------------------

### Get the historical price for several tokens
To fetch the historical price for several tokens pass an array of symbols to `getHistoricalPrice` method.
```js
const symbols = ["AR", "BTC", "UNI", "ETH", "EUR"];
const prices = await limestone.getHistoricalPrice(symbols, {
  date: "2021-03-30T12:35:09",
});

console.log(prices["BTC"].value); // BTC price for specific time
```

----------------------------------------------

### Get the historical prices in a time range
To fetch the historical prices in a time range specify token symbol as the first argument of the `getHistoricalPrice` method, and `startDate`, `endDate` and `interval` as fields of the second argument.

💡 Note: currently Limestone API supports fetching historical prices in a time range only for a single token.
```js
const prices = await limestone.getHistoricalPrice("AR", {
  startDate: "2021-03-29T12:35:09",
  endDate: "2021-03-30T12:35:09",
  interval: 3600 * 1000, // 1 hour
});

console.log(prices); // Example output below
/*
[
  {
    value: 28.8,
    timestamp: 1617016995624,
    ...
  },
  {
    value: 28.59,
    timestamp: 1617014111705,
    ...
  },
  ...
]
*/
```

💡 Note: `startDate` and `endDate` argument must be convertable to Date type.

----------------------------------------------

### Verify signature
All prices saved in Limestone have a signature, thanks to which you always can verify if the price data has been submitted by the trusted provider.

To do so you can set `verifySignature` option to `true` in `getPrice`, `getHistoricalPrice` or `getAllPrices` methods. If signature is invalid - error will be thrown.
```js
const price = await limestone.getPrice("AR", {
  verifySignature: true,
});
console.log(price.value);
```

----------------------------------------------

### Get prices from Arweave
By default, Limestone API fetches data from the Limestone cache layer. It works way faster than fetching directly from Arweave Blockchain. Even so, thanks to signature verification prices data is still trusted and secure.

We strongly recommend using the default fetching mechanism. But if you want to fetch data directly from Arweave you can do it by initialising a new `LimestoneApi` client and setting `useCache` option to `false`.

```js
const limestoneArweaveClient = new limestone.LimestoneApi({
  useCache: false,
});

const price = await limestoneArweaveClient.getPrice("AR");

console.log(price.value); // AR price value fetched directly from Arweave
```

----------------------------------------------

### Fluent Interface
Limestone also implements an additional fluent interface to make it even simpler to execute some price fetching queries for popular use cases. [Learn more](docs/FLUENT_INTERFACE.md)

## 🚀 Examples
- [Discord bot](examples/discord-bot)
- [Web app](https://github.com/limestone-finance/limestone)

## 💬 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## 📜 License
This software is licensed under the [MIT](https://choosealicense.com/licenses/mit/) © [Limestone](https://github.com/limestone-finance)
