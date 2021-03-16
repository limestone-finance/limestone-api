import _  from "lodash";
import ArweaveProxy from "./proxies/arweave-proxy";
import CacheProxy from "./proxies/cache-proxy";
import { LimestoneApiConfig, PriceData, PriceDataWithSignature } from "./types";

const { version } = require("../package.json") as { version: string };

const LIMESTON_API_DEFAULTS = {
  provider: "limestone",
  useCache: true,
};

interface GetPriceOptions {
  provider?: string;
  verifySignature?: boolean; 
};

interface GetHistoricalPriceOptions extends GetPriceOptions {
  date: Date;
};

interface GetHistoricalPriceForIntervalOptions extends GetPriceOptions {
  startDate: Date;
  endDate: Date;
  interval: number; // ms
};

export default class LimestoneApi {
  private defaultProvider: string;
  private useCache: boolean;
  private version: string;
  private verifySignature: boolean;
  private arweaveProxy: ArweaveProxy;
  private cacheProxy: CacheProxy;

  constructor(opts: {
    defaultProvider?: string;
    useCache?: boolean;
    version?: string;
    verifySignature?: boolean;
    arweaveProxy: ArweaveProxy;
  }) {
    this.arweaveProxy = opts.arweaveProxy;
    this.cacheProxy = new CacheProxy();
    this.version = _.defaultTo(opts.version, version);
    this.verifySignature = _.defaultTo(opts.verifySignature, false);
    this.defaultProvider = _.defaultTo(
      opts.defaultProvider,
      LIMESTON_API_DEFAULTS.provider);
    this.useCache = _.defaultTo(
      opts.useCache,
      LIMESTON_API_DEFAULTS.useCache);
  }

  // Here we can pass any async code that we need to execute on api init
  // For example we can load provider name to address mapping here
  static init(config: LimestoneApiConfig = {}): LimestoneApi {
    const arweaveProxy = new ArweaveProxy();
    const optsToCopy = _.pick(config, [
      "defaultProvider",
      "verifySignature",
      "useCache",
      "version",
    ]);

    return new LimestoneApi({
      ...optsToCopy,
      arweaveProxy,
    });
  }


  async getPrice(symbol: string,
    opts?: GetPriceOptions): Promise<PriceData | undefined>;
  async getPrice(symbols: string[],
    opts?: GetPriceOptions): Promise<{ [token: string]: PriceData }>;
  async getPrice(symbolOrSymbols: any,
    opts: GetPriceOptions = {}): Promise<any> {
    const provider = _.defaultTo(opts.provider, this.defaultProvider);
    const shouldVerifySignature = _.defaultTo(
      opts.verifySignature,
      this.verifySignature);

    if (_.isArray(symbolOrSymbols)) {
      return await this.getLatestPriceForManySymbols({
        symbols: symbolOrSymbols,
        provider,
        shouldVerifySignature,
      });
    } else if (typeof symbolOrSymbols === "string") {
      return await this.getLatestPriceForOneToken({
        symbol: symbolOrSymbols,
        provider,
        shouldVerifySignature,
      });
    }
  }

  async getHistoricalPrice(symbol: string,
    opts: GetHistoricalPriceOptions): Promise<PriceData | undefined>;
  async getHistoricalPrice(symbol: string,
    opts: GetHistoricalPriceForIntervalOptions): Promise<PriceData[]>;
  async getHistoricalPrice(symbols: string[],
    opts: GetHistoricalPriceOptions): Promise<{ [token: string]: PriceData }>;
  async getHistoricalPrice(symbolOrSymbols: any, opts: any): Promise<any> {
    const provider = _.defaultTo(opts.provider, this.defaultProvider);
    const shouldVerifySignature = _.defaultTo(
      opts.verifySignature,
      this.verifySignature);

    if (_.isArray(symbolOrSymbols)) {
      // TODO: Fetch historical price for each passed symbol
      throw new Error(
        "Fetching historical prices for many symbols is not implemented");
    } else if (typeof symbolOrSymbols === "string") {
      if (opts.interval !== undefined) {
        return await this.getHistoricalPricesInIntervalForOneSymbol({
          symbol: symbolOrSymbols,
          fromTimestamp: opts.startDate.getTime(),
          toTimestamp: opts.endDate.getTime(),
          interval: opts.interval,
          provider,
          shouldVerifySignature,
        });
      } else {
        return await this.getHistoricalPriceForOneSymbol({
          symbol: symbolOrSymbols,
          timestamp: opts.date.getTime(),
          provider,
          shouldVerifySignature,
        });
      }
    }
  }

  async getAllPrices(opts: GetPriceOptions = {}): Promise<PriceData[]> {
    const provider = _.defaultTo(opts.provider, this.defaultProvider);

    if (this.useCache) {
      return await this.cacheProxy.getPriceForManyTokens({ provider });
    } else {
      return await this.getPricesFromArweave(provider);
    }
  }

  private async getLatestPriceForOneToken(args: {
    symbol: string,
    provider: string,
    shouldVerifySignature: boolean,
  }): Promise<PriceData | undefined> {
    if (this.useCache) {
      // Getting price from cache
      const price = await this.cacheProxy.getPrice(
        _.pick(args, ["symbol", "provider"]));
      if (args.shouldVerifySignature && price !== undefined) {
        await this.assertValidSignature(price);
      }
      return price;
    } else {
      // Getting price from arweave
      const prices = await this.getPricesFromArweave(args.provider);
      const priceForSymbol = prices.find(p => p.symbol === args.symbol);
      return priceForSymbol;
    }
  }

  private async getLatestPriceForManySymbols(args: {
    symbols: string[],
    provider: string,
    shouldVerifySignature: boolean,
  }): Promise<{ [token: string]: PriceData }> {
    // Fetching prices
    let prices = [];
    if (this.useCache) {
      prices = await this.cacheProxy.getPriceForManyTokens(
        _.pick(args, ["symbols", "provider"]));
    } else {
      const allPrices = await this.getPricesFromArweave(args.provider);
      prices = allPrices.filter(p => args.symbols.includes(p.symbol));
    }

    // Building prices object from array
    const pricesObj: { [token: string]: PriceData } = {};
    for (const price of prices) {
      pricesObj[price.symbol] = price;
    }

    return pricesObj;
  }

  private async getPricesFromArweave(provider: string): Promise<PriceData[]> {
    const txId = await this.arweaveProxy.findTxIdInGraphQL({
      type: "data",
      provider,
      version: this.version,
    });

    if (txId === undefined) {
      return [];
    }

    const prices = await this.arweaveProxy.getTxDataById(txId, {
      parseJSON: true,
    });

    return prices.map((price: any) => {
      return {
        ...price,
        provider, // TODO: maybe we want to return provider address here
        permawebTx: txId,
      }
    });
  }

  private async getHistoricalPriceForOneSymbol(args: {
    symbol: string,
    provider: string,
    timestamp: number,
    shouldVerifySignature: boolean,
  }): Promise<PriceData | undefined> {
    if (this.useCache) {
      const price = await this.cacheProxy.getPrice(
        _.pick(args, ["symbol", "provider", "timestamp"]));

      // Signature verification
      if (args.shouldVerifySignature && price !== undefined) {
        await this.assertValidSignature(price);
      }

      return price;
    } else {
      // TODO: we cannot query ArGQL with timestamp camparators like timestamp_gt
      // But in future we can think of querying based on block numbers
      throw new Error(
        "Fetching historical price from arweave is not supported");
    }
  }

  private async getHistoricalPricesInIntervalForOneSymbol(args: {
    symbol: string,
    provider: string,
    fromTimestamp: number,
    toTimestamp: number,
    interval: number,
    shouldVerifySignature: boolean,
  }): Promise<PriceData[]> {
    if (this.useCache) {
      const prices = await this.cacheProxy.getManyPrices(_.pick(args, [
        "symbol",
        "provider",
        "fromTimestamp",
        "toTimestamp",
        "interval",
      ]));

      // Signature verification for all prices
      if (args.shouldVerifySignature) {
        for (const price of prices) {
          await this.assertValidSignature(price);
        }
      }

      return prices;
    } else {
      // TODO: we cannot query ArGQL with timestamp camparators like timestamp_gt
      // But in future we can think of querying based on block numbers
      throw new Error(
        "Fetching historical prices from arweave is not supported");
    }
  }

  private async assertValidSignature(price: PriceDataWithSignature): Promise<void> {
    // TODO: Maybe we can pass the signed string in broadcaster
    // to avoid potential problems with signature verification

    // It is important to have properties of price object in the
    // same order as they have been set before signing
    const signedData = JSON.stringify(_.pick(price, [
      "id",
      "source",
      "symbol",
      "timestamp",
      "version",
      "value",
      "permawebTx",
      "provider",
    ]));
    const publicKey = String(price.providerPublicKey);

    const validSignature = await this.arweaveProxy.verifySignature({
      signedData,
      signature: price.signature,
      signerPublicKey: publicKey,
    });

    const addressFromPublicKey =
      await this.arweaveProxy.arweaveClient.wallets.ownerToAddress(publicKey);

    if (!validSignature) {
      throw new Error(
        "Signature verification failed for price: " + signedData);
    }

    if (addressFromPublicKey !== price.provider) {
      throw new Error(
        `Provider address doesn't match the public key.`
        + ` Address: ${price.provider}.`
        + ` Public key: ${publicKey}.`);
    }
  }
};
