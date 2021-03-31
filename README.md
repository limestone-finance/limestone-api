# Limestone API

Limestone API is a Javascript library for fetching trusted token pricing data from [Limestone data ecosystem](https://github.com/limestone-finance/limestone/blob/master/README.md).

It is a Javascript wrapper for [Limestone HTTP Api](docs/HTTP_API.md).

## ✅ Why Limestone API
### ✓ Secure
Limestone pricing data is secured on Arweave and protected by provider's collateral.  
[Learn more](https://github.com/limestone-finance/limestone/blob/master/README.md)

### ✓ Easy to use
You don't need any API keys. Just install npm package and add a single line of code.  
[Quick start](docs/QUICK_START.md)

### ✓ Free
Limestone API is absolutely free.

### ✓ TypeScript Support
Limestone API is fully written in Typescript and then compiled to JavaScript.  
[Source code](https://github.com/limestone-finance/limestone-api)

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

### Get latest price for a single currency
```js
const price = await limestone.getPrice("AR");

console.log(price.value); // latest price value for AR token (in USD)
console.log(price.timestamp); // timestamp for the price
```
💡 Note: All price values are in USD. You can fetch price data for BTC, ETH, AR, EUR and any other of [ 158 supported currencies.](docs/ALL_SUPPORTED_CURRENCIES.md)

<br/>

<details>
  <summary>Price data format</summary>

  ```js
  {
    value: 123.23, // Number: Price value in USD
    timestamp: 1617146511173, // Number: Timestamp (ms) for price
    provider: "I-5rWUehEv-MjdK9gFw09RxfSLQX9DIHxG614Wf8qo0", // String: Provider arweave address
    permawebTx: "V8FUU0BG4kVOJwKWHzgkn1aEFm-eanhqqEXfPFY7pmI", // String: Arweave transaction id
    version: "0.2", // String: Limestone version
    source: {"coingecko": 123,"sushiswap": 123.23,"uniswap": 123.35}, // Object: Price from different sources
    signature: "KWHzgkn1a...", // String: price signature
    providerPublicKey: "fPFY7pm..." // String: Provider public key
  }
  ```
  - signature
  - providerPublicKey
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

### Get latest price for several currencies
To fetch prices for several currencies use `getPrice` method and pass an array with any subset of [supported currencies](docs/ALL_SUPPORTED_CURRENCIES.md).
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

### Get prices for all available currencies
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
console.log(Object.keys(prices).length); // 158
```

----------------------------------------------

### Get historical price for a single currency
To get historical prices you should use `getHistoricalPrice` method.
```js
const price = await limestone.getHistoricalPrice("AR", {
  date: new Date("2021-03-30T12:35:09")
});

console.log(price.value); // AR price for specific time
```

----------------------------------------------

### Get historical price for several currencies
To fetch historical price for several tokens you should pass an array of symbols to `getHistoricalPrice` method.
```js
const symbols = ["AR", "BTC", "UNI", "ETH", "EUR"];
const prices = await limestone.getHistoricalPrice(symbols, {
  date: new Date("2021-03-30T12:35:09")
});

console.log(prices["BTC"].value); // BTC price for specific time
```

----------------------------------------------

### Get historical prices in a time range
💡 Note: currently Limestone supports fetching historical prices in a time range only for a single token.
```js
// TODO: add response
```

----------------------------------------------

### Verify signature
💡 Note: describe what is signature verification
```js
// TODO: add response
```

----------------------------------------------

### Get prices from Arweave
💡 Note: by default Limestone API fetches data from limestone cache layer.

Add some text about the fact that we don't support fetching historical prices from Arweave.

```js
// TODO: add response
```

----------------------------------------------

## 📅 Roadmap

### Fluent Interface [Work in progress]
We currently work on a fluent interface to make Limestone API even easier to use.
You can [see examples](examples/fluent-api/example.js) of fluent interface usage and let us know [what you think](mailto:dev@limestone.finance) (we would be very grateful 😉).

## 🚀 Used By
- [Discord bot](examples/discord-bot)
- [Web app](https://github.com/limestone-finance/limestone)

## 💬 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## 📜 License
This software is licensed under the [MIT](https://choosealicense.com/licenses/mit/) © [Limestone](https://github.com/limestone-finance)
