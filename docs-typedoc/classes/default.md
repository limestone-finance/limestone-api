[limestone-api](../doc.md) / [Exports](../modules.md) / default

# Class: default

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [arweaveProxy](default.md#arweaveproxy)
- [cacheProxy](default.md#cacheproxy)
- [defaultProvider](default.md#defaultprovider)
- [signatureVerifier](default.md#signatureverifier)
- [useCache](default.md#usecache)
- [verifySignature](default.md#verifysignature)
- [version](default.md#version)

### Methods

- [getAllPrices](default.md#getallprices)
- [getHistoricalPrice](default.md#gethistoricalprice)
- [getHistoricalPriceForOneSymbol](default.md#gethistoricalpriceforonesymbol)
- [getHistoricalPricesInIntervalForOneSymbol](default.md#gethistoricalpricesinintervalforonesymbol)
- [getLatestPriceForOneToken](default.md#getlatestpriceforonetoken)
- [getPrice](default.md#getprice)
- [getPriceForManyTokens](default.md#getpriceformanytokens)
- [getPricesFromArweave](default.md#getpricesfromarweave)
- [tryToGetPriceFromGQL](default.md#trytogetpricefromgql)

## Constructors

### constructor

\+ **new default**(`limestoneConfig?`: LimestoneApiConfig): [*default*](default.md)

#### Parameters:

| Name | Type | Default value |
| :------ | :------ | :------ |
| `limestoneConfig` | LimestoneApiConfig | {} |

**Returns:** [*default*](default.md)

Defined in: [limestone-api.ts:30](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L30)

## Properties

### arweaveProxy

• `Private` **arweaveProxy**: *default*

Defined in: [limestone-api.ts:28](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L28)

___

### cacheProxy

• `Private` **cacheProxy**: *default*

Defined in: [limestone-api.ts:29](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L29)

___

### defaultProvider

• `Private` **defaultProvider**: *string*

Defined in: [limestone-api.ts:24](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L24)

___

### signatureVerifier

• `Private` **signatureVerifier**: *default*

Defined in: [limestone-api.ts:30](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L30)

___

### useCache

• `Private` **useCache**: *boolean*

Defined in: [limestone-api.ts:25](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L25)

___

### verifySignature

• `Private` **verifySignature**: *boolean*

Defined in: [limestone-api.ts:27](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L27)

___

### version

• `Private` **version**: *string*

Defined in: [limestone-api.ts:26](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L26)

## Methods

### getAllPrices

▸ **getAllPrices**(`opts?`: GetPriceOptions): *Promise*<{ [symbol: string]: PriceData;  }\>

Returns the latest price for all the supported symbols

#### Parameters:

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `opts` | GetPriceOptions | {} | Optioanl options object. * opts.provider: provider name (string) * opts.verifySignature: enable signature verification (boolean) |

**Returns:** *Promise*<{ [symbol: string]: PriceData;  }\>

The latest price for all the supported tokens

Defined in: [limestone-api.ts:202](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L202)

___

### getHistoricalPrice

▸ **getHistoricalPrice**(`symbol`: *string*, `opts`: GetHistoricalPriceOptions): *Promise*<PriceData\>

Returns the historical price for a single token

**`remarks`** 
Full list of supported tokens is available at
[https://github.com/limestone-finance/limestone-api/blob/main/ALL_SUPPORTED_TOKENS.md](https://github.com/limestone-finance/limestone-api/blob/main/ALL_SUPPORTED_TOKENS.md)

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `symbol` | *string* | Token symbol (string) |
| `opts` | GetHistoricalPriceOptions | Optional params (object) * opts.date: Date for the historical price * opts.provider: provider name (string) * opts.verifySignature: enable signature verification (boolean) |

**Returns:** *Promise*<PriceData\>

The historical price for token

Defined in: [limestone-api.ts:116](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L116)

▸ **getHistoricalPrice**(`symbol`: *string*, `opts`: GetHistoricalPriceForIntervalOptions): *Promise*<PriceData[]\>

Returns the historical prices for a token in a time range with the specified interval

**`remarks`** 
This method can be used to display charts with historical prices.
Full list of supported tokens is available at
[https://github.com/limestone-finance/limestone-api/blob/main/ALL_SUPPORTED_TOKENS.md](https://github.com/limestone-finance/limestone-api/blob/main/ALL_SUPPORTED_TOKENS.md)

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `symbol` | *string* | Token symbol |
| `opts` | GetHistoricalPriceForIntervalOptions | Options object. It must contain startDate, endDate, and interval properties. * opts.startDate: Start time for the time range (date \| timestamp \| string) * opts.endDate: End time for the time range (date \| timestamp \| string) * opts.interval: Interval in miliseconds (number) * opts.provider: provider name (string) * opts.verifySignature: enable signature verification (boolean) |

**Returns:** *Promise*<PriceData[]\>

The historical prices for the symbol with the passed interval

Defined in: [limestone-api.ts:138](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L138)

▸ **getHistoricalPrice**(`symbols`: *string*[], `opts`: GetHistoricalPriceOptions): *Promise*<{ [token: string]: PriceData;  }\>

Returns the historical prices for several tokens

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `symbols` | *string*[] | Array of token symbols |
| `opts` | GetHistoricalPriceOptions | Options object. It must contain the date property. * opts.date: Date for the historical price (date \| timestamp \| string) * opts.provider: provider name (string) * opts.verifySignature: enable signature verification (boolean) |

**Returns:** *Promise*<{ [token: string]: PriceData;  }\>

The historical prices for several tokens

Defined in: [limestone-api.ts:153](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L153)

___

### getHistoricalPriceForOneSymbol

▸ `Private`**getHistoricalPriceForOneSymbol**(`args`: { `provider`: *string* ; `shouldVerifySignature`: *boolean* ; `symbol`: *string* ; `timestamp`: *number*  }): *Promise*<PriceData\>

#### Parameters:

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.provider` | *string* |
| `args.shouldVerifySignature` | *boolean* |
| `args.symbol` | *string* |
| `args.timestamp` | *number* |

**Returns:** *Promise*<PriceData\>

Defined in: [limestone-api.ts:330](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L330)

___

### getHistoricalPricesInIntervalForOneSymbol

▸ `Private`**getHistoricalPricesInIntervalForOneSymbol**(`args`: { `fromTimestamp`: *number* ; `interval`: *number* ; `provider`: *string* ; `shouldVerifySignature`: *boolean* ; `symbol`: *string* ; `toTimestamp`: *number*  }): *Promise*<PriceData[]\>

#### Parameters:

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.fromTimestamp` | *number* |
| `args.interval` | *number* |
| `args.provider` | *string* |
| `args.shouldVerifySignature` | *boolean* |
| `args.symbol` | *string* |
| `args.toTimestamp` | *number* |

**Returns:** *Promise*<PriceData[]\>

Defined in: [limestone-api.ts:387](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L387)

___

### getLatestPriceForOneToken

▸ `Private`**getLatestPriceForOneToken**(`args`: { `provider`: *string* ; `shouldVerifySignature`: *boolean* ; `symbol`: *string*  }): *Promise*<PriceData\>

#### Parameters:

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.provider` | *string* |
| `args.shouldVerifySignature` | *boolean* |
| `args.symbol` | *string* |

**Returns:** *Promise*<PriceData\>

Defined in: [limestone-api.ts:225](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L225)

___

### getPrice

▸ **getPrice**(`symbol`: *string*, `opts?`: GetPriceOptions): *Promise*<PriceData\>

Returns the latest price for a single symbol

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `symbol` | *string* | Token symbol (string) |
| `opts?` | GetPriceOptions | Optional params (object) * opts.provider: provider name (string) * opts.verifySignature: enable signature verification (boolean) |

**Returns:** *Promise*<PriceData\>

The latest price for the token

Defined in: [limestone-api.ts:59](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L59)

▸ **getPrice**(`symbols`: *string*[], `opts?`: GetPriceOptions): *Promise*<{ [token: string]: PriceData;  }\>

Returns the latest price for several symbols

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `symbols` | *string*[] | Token symbols (array of strings) |
| `opts?` | GetPriceOptions | Optional params (object) * opts.provider: provider name (string) * opts.verifySignature: enable signature verification (boolean) |

**Returns:** *Promise*<{ [token: string]: PriceData;  }\>

The latest price for the tokens

Defined in: [limestone-api.ts:70](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L70)

___

### getPriceForManyTokens

▸ `Private`**getPriceForManyTokens**(`args`: { `provider`: *string* ; `shouldVerifySignature`: *boolean* ; `symbols`: *string*[] ; `timestamp?`: *number*  }): *Promise*<{ [token: string]: PriceData;  }\>

#### Parameters:

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.provider` | *string* |
| `args.shouldVerifySignature` | *boolean* |
| `args.symbols` | *string*[] |
| `args.timestamp?` | *number* |

**Returns:** *Promise*<{ [token: string]: PriceData;  }\>

Defined in: [limestone-api.ts:264](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L264)

___

### getPricesFromArweave

▸ `Private`**getPricesFromArweave**(`provider`: *string*): *Promise*<{ [symbol: string]: PriceData;  }\>

#### Parameters:

| Name | Type |
| :------ | :------ |
| `provider` | *string* |

**Returns:** *Promise*<{ [symbol: string]: PriceData;  }\>

Defined in: [limestone-api.ts:297](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L297)

___

### tryToGetPriceFromGQL

▸ `Private`**tryToGetPriceFromGQL**(`args`: { `provider`: *string* ; `symbol`: *string*  }): *Promise*<PriceData\>

#### Parameters:

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.provider` | *string* |
| `args.symbol` | *string* |

**Returns:** *Promise*<PriceData\>

Defined in: [limestone-api.ts:360](https://github.com/limestone-finance/limestone-api/blob/6ba5e3a/src/limestone-api.ts#L360)
