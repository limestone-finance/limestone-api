import _  from "lodash";
import ArweaveProxy from "./proxies/arweave-proxy";
import CacheProxy from "./proxies/cache-proxy";
import { LimestoneApiConfig, PriceData } from "./types";

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
      if (this.useCache) {
        const price = await this.cacheProxy.getPrice({
          symbol: tokenSymbol,
          provider: _.defaultTo(opts.provider, this.defaultProvider),
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
        // TODO
        // update this function to support new bulk prices on arweave
        // implement support for provider filtering here
        return await findGraphQL({
          type: "data",
          tokenSymbol,
          version,
        });
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
        throw new Error(
          "Fetching historical price from arweave is not implemented yet");
      }
  }

  async getHistoricalPrices(
    tokenSymbol: string,
    startDate: Date,
    endDate: Date,
    opts: GetPriceOptions = {}): Promise<PriceData[]> {
      if (this.useCache) {
        return await this.cacheProxy.getManyPrices({
          symbol: tokenSymbol,
          provider: _.defaultTo(opts.provider, this.defaultProvider),
          fromTimestamp: startDate.getTime(),
          toTimestamp: endDate.getTime(),
        });
      } else {
        throw new Error(
          "Fetching historical prices from arweave is not implemented yet");
      }
    }

  async assertValidSignature(price: PriceData): Promise<void> {
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

    const valid = await this.arweaveProxy.verifySignature({
      signedData,
      signature: price.signature,
      signerPublicKey: String(price.providerPublicKey),
    });

    if (!valid) {
      throw new Error(
        "Signature verification failed for price: " + signedData);
    }
  }
};
