import axios from "axios";
import { PriceData } from "../types";

export default class CacheProxy {
  cacheApiUrl: string = "https://api.limestone.finance/prices";

  constructor(cacheApiUrl?: string) {
    if (cacheApiUrl !== undefined) {
      this.cacheApiUrl = cacheApiUrl;
    }
  }

  async getPrice(
    symbol: string,
    provider: string): Promise<PriceData | undefined> {
      const { data } = await axios.get(this.cacheApiUrl, {
        params: {
          symbol,
          provider,
          limit: 1,
        }
      });

      if (Array.isArray(data) && data.length == 1) {
        return data[0];
      } else {
        return undefined;
      }
    }

  async getManyPrices(
    symbol: string,
    fromTimestamp: number,
    toTimestamp: number
    ): Promise<PriceData[]> {
      // TODO implement
      return [];
    }
};
