import axios from "axios";
import { PriceDataWithSignature } from "../types";

export default class CacheProxy {
  cacheApiUrl: string;

  constructor(cacheApiUrl: string) {
    this.cacheApiUrl = cacheApiUrl;
  }

  async getPrice(args: {
    symbol: string;
    provider: string;
    timestamp?: number;
  }): Promise<PriceDataWithSignature | undefined> {
    const params: any = {
      symbol: args.symbol,
      provider: args.provider,
      limit: 1,
    };

    // If timestamp is passed we fetch the latest price
    // with timestamp which is less or equal to the passed one
    if (args.timestamp !== undefined) {
      params.toTimestamp = args.timestamp;
    }

    const { data } = await axios.get(this.cacheApiUrl, { params });

    if (Array.isArray(data) && data.length === 1) {
      return data[0];
    } else {
      return undefined;
    }
  }

  // If 'symbols' is not passed it will fetch prices for all tokens
  async getPriceForManyTokens(args: {
    provider: string;
    timestamp?: number;
    symbols?: string[];
  }): Promise<{ [symbol: string]: PriceDataWithSignature }> {
    const params: any = {
      provider: args.provider,
      toTimestamp: args.timestamp,
    };

    if (args.symbols !== undefined) {
      params.symbols = args.symbols.join(",");
    }

    const { data } = await axios.get(this.cacheApiUrl, { params });

    return data;
  }

  async getManyPrices(args: {
    symbol: string;
    provider: string;
    interval: number;
    fromTimestamp: number;
    toTimestamp: number;
  }): Promise<PriceDataWithSignature[]> {
    const { data } = await axios.get(this.cacheApiUrl, { params: args });
    return data;
  }
}
