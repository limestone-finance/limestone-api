# Limestone API

Limestone API is a Javascript library for fetching trusted token pricing data from [Limestone data ecosystem](https://github.com/limestone-finance/limestone/blob/master/README.md).

It is a Javascript wrapper for [Limestone HTTP Api.](docs/HTTP_API.md)

## ✅ Why Limestone API
### ⦿ Secure
Limestone pricing data is secured on Arweave and protected by provider's collateral.  
[Learn more](https://github.com/limestone-finance/limestone/blob/master/README.md)

### ⦿ Easy to use
You don't need any API keys. Just install npm package and add a single line of code.  
[Quick start](docs/QUICK_START.md)

### ⦿ Free
Limestone API is absolutely free.

### ⦿ TypeScript Support
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

console.log(price.value); // prints latest price value for AR token
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
    source: {"coingecko": 123,"sushiswap": 123.23,"uniswap": 123.35} // Object: Price from different sources
    signature: "KWHzgkn1a...", // String: price signature
    providerPublicKey: "fPFY7pm...", // String: Provider public key
  }
  ```
  - signature
  - providerPublicKey
</details>

<br/>

<details>
  <summary>Fetch price using promises</summary>

  ```js
  const price = limestone.getPrice("AR").then((price) => {
    console.log(price.value); // prints latest price value for AR token
  });
  ```
</details>
<br/>

----------------------------------------------

### Get latest price for several currencies
```js
const price = await limestone.getPrice(["BTC", "ETH", "AR", "EUR"]);

// TODO: add response

```

----------------------------------------------

### Get prices for all available currencies
```js
// TODO: add response
```


----------------------------------------------

### Get historical price for a single currency
```js
// TODO: add response
```

----------------------------------------------

### Get historical price for several currencies
```js
// TODO: add response
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

### Fluent Interface [Work in progress]
We currently work on a fluent interface to make Limestone API even easier to use.
You can [see examples](examples/fluent-api/example.js) of fluent interface usage and let us know [what you think](mailto:dev@limestone.finance).

----------------------------------------------

## 🚀 Used By
- [Discord bot](examples/discord-bot)
- [Web app]("https://github.com/limestone-finance/limestone")

## 💬 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## 📜 License
This software is licensed under the [MIT](https://choosealicense.com/licenses/mit/) © [Limestone](https://github.com/limestone-finance)
