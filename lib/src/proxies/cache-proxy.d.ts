import { PriceDataWithSignature } from "../types";
export default class CacheProxy {
    cacheApiUrl: string;
    constructor(cacheApiUrl?: string);
    getPrice(args: {
        symbol: string;
        provider: string;
        timestamp?: number;
    }): Promise<PriceDataWithSignature | undefined>;
    getPriceForManyTokens(args: {
        provider: string;
        timestamp?: number;
        symbols?: string[];
    }): Promise<{
        [symbol: string]: PriceDataWithSignature;
    }>;
    getManyPrices(args: {
        symbol: string;
        provider: string;
        interval: number;
        fromTimestamp: number;
        toTimestamp: number;
    }): Promise<PriceDataWithSignature[]>;
}
