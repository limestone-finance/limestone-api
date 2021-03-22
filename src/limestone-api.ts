import _ from "lodash";
import ArweaveProxy from "./proxies/arweave-proxy";
import CacheProxy from "./proxies/cache-proxy";
import { LimestoneApiConfig, PriceData, PriceDataWithSignature } from "./types";
import pjson from "../package.json";

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
    this.version = _.defaultTo(opts.version, pjson.version);
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
      // Getting latest price for many tokens
      return await this.getPriceForManyTokens({
        symbols: symbolOrSymbols,
        provider,
        shouldVerifySignature,
      });
    } else if (typeof symbolOrSymbols === "string") {
      // Getting latest price for one token
      return await this.getLatestPriceForOneToken({
        symbol: symbolOrSymbols,
        provider,
        shouldVerifySignature,
      });
    }
  }

  /**
   * Returns the historical price for a token or a list of tokens
   *
   * @remarks
   * Some remark
   *
   * @param symbol - Token symbol
   * @param opts - Options
   * @returns The historical price for symbol
   *
   * @beta
   */
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
      // Getting historical price for many tokens
      return await this.getPriceForManyTokens({
        symbols: symbolOrSymbols,
        timestamp: opts.date.getTime(),
        provider,
        shouldVerifySignature,
      });
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

  async getAllPrices(
    opts: GetPriceOptions = {}): Promise<{ [symbol: string]: PriceData }> {
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

      // Try to get price from graphql if possible
      if (args.symbol === "AR") {
        const price = await this.tryToGetPriceFromGQL(
          _.pick(args, ["provider", "symbol"]));
        if (price !== undefined) {
          return price;
        }
      }

      // Getting price from arweave in a "standard" way (from data)
      const prices = await this.getPricesFromArweave(args.provider);
      const priceForSymbol = prices[args.symbol];
      return priceForSymbol;
    }
  }

  // private async getLatestPriceForManySymbols(args: {
  //   symbols: string[],
  //   provider: string,
  //   shouldVerifySignature: boolean,
  // }): Promise<{ [token: string]: PriceData }> {
    
  // }

  private async getPriceForManyTokens(args: {
    symbols: string[],
    provider: string,
    timestamp?: number,
    shouldVerifySignature: boolean,
  }): Promise<{ [token: string]: PriceData }> {
    // Fetching prices
    if (this.useCache) {
      const pricesObj = await this.cacheProxy.getPriceForManyTokens(
        _.pick(args, ["symbols", "provider", "timestamp"]));
      
      // Signature verification
      if (args.shouldVerifySignature) {
        for (const symbol of _.keys(pricesObj)) {
          this.assertValidSignature(pricesObj[symbol]);
        }
      }

      return pricesObj;
    } else {
      if (args.timestamp !== undefined) {
        throw new Error(
          "Getting historical prices from arweave is not supported");
      }
      const allPrices = await this.getPricesFromArweave(args.provider);
      return _.pick(allPrices, args.symbols);
    }
  }

  private async getPricesFromArweave(
    provider: string): Promise<{ [symbol: string]: PriceData }> {
      const { address } = await this.arweaveProxy.getProviderDetails(provider);

      const gqlResponse = await this.arweaveProxy.findPricesInGraphQL({
        type: "data",
        providerAddress: address,
        version: this.version,
      });

      if (gqlResponse === undefined) {
        return {};
      }

      const prices = await this.arweaveProxy.getTxDataById(
        gqlResponse.permawebTx, { parseJSON: true });

      // Building prices object
      const pricesObj: any = {};
      for (const price of prices) {
        pricesObj[price.symbol] = {
          ...price,
          provider: address,
          permawebTx: gqlResponse.permawebTx,
        };
      }

      return pricesObj;
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

  private async tryToGetPriceFromGQL(args: {
    symbol: string,
    provider: string,
  }): Promise<PriceData | undefined> {
    const { address } =
      await this.arweaveProxy.getProviderDetails(args.provider);

    const response = await this.arweaveProxy.findPricesInGraphQL({
      type: "data",
      providerAddress: address,
      version: this.version,
    });

    if (response === undefined || response.tags[args.symbol] === undefined) {
      return undefined;
    } else {
      return {
        symbol: args.symbol,
        value: Number(response.tags[args.symbol]),
        permawebTx: response.permawebTx,
        timestamp: Number(response.tags.timestamp),
        provider: address,
        version: response.tags.version,
      };
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
