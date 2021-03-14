import axios from "axios";
import { PriceData, PriceDataWithSignature } from "../types";

export default class CacheProxy {
  cacheApiUrl: string = "https://api.limestone.finance/prices";

  constructor(cacheApiUrl?: string) {
    if (cacheApiUrl !== undefined) {
      this.cacheApiUrl = cacheApiUrl;
    }
  }

  async getPrice(args: {
    symbol: string;
    provider: string;
    timestamp?: number; }): Promise<PriceDataWithSignature | undefined> {
      const params: any = {
        symbol: args.symbol,
        provider: args.provider,
        limit: 1,
      };

      // If timestamp is passed we fetch the first price
      // with timestamp which is greater or equal to the passed one
      if (args.timestamp !== undefined) {
        params.fromTimestamp = args.timestamp;
        params.sortAsc = true;
      }

      const { data } = await axios.get(this.cacheApiUrl, { params });

      if (Array.isArray(data) && data.length == 1) {
        return data[0];
      } else {
        return undefined;
      }
    }

  async getManyPrices(args: {
    symbol: string;
    provider: string;
    fromTimestamp: number;
    toTimestamp: number }): Promise<PriceDataWithSignature[]> {
      const { data } = await axios.get(this.cacheApiUrl, { params: args });
      return data;
    }
};
