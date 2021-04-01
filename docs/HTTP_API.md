# Limestone HTTP Api

Limestone HTTP Api is accessible at https://api.limestone.finance/prices.

It allows to fetch financial data from [Limesteone data ecosystem](https://github.com/limestone-finance/limestone/blob/master/README.md).

## Usage

### Using curl

#### ⦿ Fetch latest price for a single currency
```bash
curl "https://api.limestone.finance/prices/?symbol=ETH&provider=limestone&limit=1"
```

💡 Note: You can replace symbol query param with a currency symbol of [any supported token](ALL_SUPPORTED_CURRENCIES.md)

#### ⦿ Fetch latest price for several currencies
```bash
curl "https://api.limestone.finance/prices/?symbols=ETH,BTC,AR,EUR,CHF,BNB&provider=limestone"
```
