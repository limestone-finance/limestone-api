# Fluent interface for limestone

Limestone API supports a fluent interface to make the price fetching even simpler.

### Importing
To use the fluent interface you should import the limestone-query module
```js
// Using Node.js `require()`
const lQuery = require('limestone-api/limestone-query');

// Using ES6 imports
import lQuery from 'limestone-api/limestone-query';

```

### Get the latest price for a single token
```js
const price = await lQuery().symbol("AR").latest().get();

console.log(price.value); // latest price value for AR token (in USD)
console.log(price.timestamp); // the exact timestamp of the price
```

### Get the latest prices for several tokens
```js
const price = await lQuery()
  .symbols(["AR", "BTC", "ETH"])
  .latest()
  .get();

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
```

### Get prices for all available tokens
```js
const prices = await lQuery().allSymbols().latest().get();

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

