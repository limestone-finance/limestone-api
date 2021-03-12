import _  from "lodash";
import ArweaveProxy from "./proxies/arweave-proxy";
import CacheProxy from "./proxies/cache-proxy";
import { LimestoneApiConfig, PriceData } from "./types";

const { version } = require('./package.json');

const LIMESTON_API_DEFAULTS = {
  provider: "limestone",
  useCache: true,
};

export default class LimestoneApi {
  defaultProvider: string = LIMESTON_API_DEFAULTS.provider;
  useCache: boolean = LIMESTON_API_DEFAULTS.useCache;
  version: string = version;
  arweaveProxy: ArweaveProxy;
  cacheProxy: CacheProxy;

  constructor(opts: {
    defaultProvider: string;
    arweaveProxy: ArweaveProxy;
    useCache?: boolean;
    version?: string;
  }) {
    this.defaultProvider = opts.defaultProvider;
    this.arweaveProxy = opts.arweaveProxy;
    this.cacheProxy = new CacheProxy();
    
    if (opts.useCache !== undefined) {
      this.useCache = opts.useCache;
    }

    if (opts.version !== undefined) {
      this.version = opts.version;
    }
  }

  // Here we can pass any async code that we need to execute on api init
  // For example we can load provider name to address mapping here
  static async init(config: LimestoneApiConfig): Promise<LimestoneApi> {
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
    opts: { provider: string }): Promise<PriceData | undefined> {
      if (this.useCache) {
        return await this.cacheProxy.getPrice(
          tokenSymbol,
          opts.provider || this.defaultProvider);
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
    date: string // date in ISO 8601 format
  ): Promise<PriceData[]> {
    // TODO implement

    return [];
  }
};
