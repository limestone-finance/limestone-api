# limestone-api

An api to access trusted token pricing data secured on Arweave and protected by provider's collateral.

## Usage

```
const Api = require('@limestone/api');

let price = await Api.getPrice("AR");
```

## Data format

```
{
  price: 2.05, //as Float
  updated: '2020-11-03 16:00:00', //as Date
}
```

## Building & testing

```
npm i
npm test
```
