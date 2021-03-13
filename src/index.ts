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
  verifySignatire?: boolean; 
};

export default class LimestoneApi {
  defaultProvider: string;
  useCache: boolean;
  version: string;
  arweaveProxy: ArweaveProxy;
  cacheProxy: CacheProxy;

  constructor(opts: {
    defaultProvider?: string;
    useCache?: boolean;
    version?: string;
    arweaveProxy: ArweaveProxy;
  }) {
    this.arweaveProxy = opts.arweaveProxy;
    this.cacheProxy = new CacheProxy();

    this.defaultProvider = _.defaultTo(
      opts.defaultProvider,
      LIMESTON_API_DEFAULTS.provider);

    this.useCache = _.defaultTo(
      opts.useCache,
      LIMESTON_API_DEFAULTS.useCache);

    this.version = _.defaultTo(opts.version, version);
  }

  // Here we can pass any async code that we need to execute on api init
  // For example we can load provider name to address mapping here
  static init(config: LimestoneApiConfig = {}): LimestoneApi {
    const arweaveProxy = new ArweaveProxy();
    const optsToCopy = _.pick(config, [
      "defaultProvider",
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
        return await this.cacheProxy.getPrice({
          symbol: tokenSymbol,
          provider: _.defaultTo(opts.provider, this.defaultProvider),
        });
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
        return await this.cacheProxy.getPrice({
          symbol: tokenSymbol,
          provider: _.defaultTo(opts.provider, this.defaultProvider),
          timestamp: date.getTime(),
        });
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
};
