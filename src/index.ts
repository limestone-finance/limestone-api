import ArweaveProxy from "./proxies/arweave-proxy";
import { LimestoneApiConfig, ProviderNameToAddress } from "./types";

const { version } = require('./package.json');


export default class LimestoneApi {
  useCache: boolean;
  defaultProvider: string;
  arweaveProxy: ArweaveProxy;

  constructor(
    defaultProvider: string,
    useCache: boolean,
    arweaveProxy: ArweaveProxy) {
      this.defaultProvider = defaultProvider;
      this.useCache = useCache;
      this.arweaveProxy = arweaveProxy;
    }

  async init(config: LimestoneApiConfig): Promise<LimestoneApi> {
    const arweave = new ArweaveProxy();
    // const providerNameToAddress: ProviderNameToAddress =
    //   await arweave.getProivderNameToAddressMapping();
    return new LimestoneApi(
      config.defaultProvider,
      config.useCache,
      arweave);
  }

  async getPrice() {
    // TODO: implement
  }
};
