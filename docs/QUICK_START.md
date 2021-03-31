# Quick start for Limestone API

## Install npm module
```bash
npm install limestone-api
```
## Fetch price for a single token
```js
const limestone = require("limestone-api");

// Prints the latest price for AR token in USD
limestone.getPrice("AR").then((price) => {
  console.log(price.value);
});
```
