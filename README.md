# Limestone API

An api to access trusted token pricing data secured on Arweave and protected by provider's collateral.

## Usage

```
const limestone = require('@limestone/api');

const price = limestone.getPrice("AR");

console.log(price.value);
```

## Data format

- TODO: udpate data format

```
{
  value: 2.05, // as Float
  timestamp: "1615855810023", // as String
}
```

## Building & testing

```
yarn
yarn test
```
