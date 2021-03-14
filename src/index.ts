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

export default class LimestoneApi {
  defaultProvider: string;
  useCache: boolean;
  version: string;
  verifySignature: boolean;
  arweaveProxy: ArweaveProxy;
  cacheProxy: CacheProxy;

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

  async getPrice(
    tokenSymbol: string,
    opts: GetPriceOptions = {}): Promise<PriceData | undefined> {
      const provider = _.defaultTo(opts.provider, this.defaultProvider);

      if (this.useCache) {
        const price = await this.cacheProxy.getPrice({
          symbol: tokenSymbol,
          provider,
        });

        // Signature verification
        const shouldVerifySignature = _.defaultTo(
          opts.verifySignature,
          this.verifySignature);
        if (shouldVerifySignature && price !== undefined) {
          await this.assertValidSignature(price);
        }

        return price;
      } else {
        const txId = await this.arweaveProxy.findTxIdInGraphQL({
          type: "data",
          provider,
          version,
        });

        if (txId === undefined) {
          return undefined;
        }

        const prices = await this.arweaveProxy.getTxDataById(txId, {
          parseJSON: true,
        });

        for (const price of prices) {
          if (price.symbol === tokenSymbol) {
            return {
              ...price,
              provider, // TODO: maybe we want to return provider address here
              permawebTx: txId,
            }
          }
        }
      }
    }

  async getHistoricalPrice(
    tokenSymbol: string,
    date: Date,
    opts: GetPriceOptions = {}): Promise<PriceData | undefined> {
      if (this.useCache) {
        const price = await this.cacheProxy.getPrice({
          symbol: tokenSymbol,
          provider: _.defaultTo(opts.provider, this.defaultProvider),
          timestamp: date.getTime(),
        });

        // Signature verification
        const shouldVerifySignature = _.defaultTo(
          opts.verifySignature,
          this.verifySignature);
        if (shouldVerifySignature && price !== undefined) {
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

  async getHistoricalPrices(
    tokenSymbol: string,
    startDate: Date,
    endDate: Date,
    opts: GetPriceOptions = {}): Promise<PriceData[]> {
      if (this.useCache) {
        const prices = await this.cacheProxy.getManyPrices({
          symbol: tokenSymbol,
          provider: _.defaultTo(opts.provider, this.defaultProvider),
          fromTimestamp: startDate.getTime(),
          toTimestamp: endDate.getTime(),
        });

        // Signature verification for all prices
        const shouldVerifySignature = _.defaultTo(
          opts.verifySignature,
          this.verifySignature);
        if (shouldVerifySignature) {
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

  async assertValidSignature(price: PriceDataWithSignature): Promise<void> {
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
