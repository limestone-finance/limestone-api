# Limestone API

An api to access trusted token pricing data secured on Arweave and protected by provider's collateral.

## Usage

```
const LimestoneApi = require('@limestone/api').init();

const price = LimestoneApi.getPrice("AR");

console.log(price.value);
```

## Data format

- TODO: udpate data format

```
{
  value: 2.05, // as Float
  updated: '2020-11-03 16:00:00', // as Date
}
```

## Building & testing

```
yarn
yarn test
```
