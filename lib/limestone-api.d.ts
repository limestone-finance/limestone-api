import ArweaveProxy from "./proxies/arweave-proxy";
import { LimestoneApiConfig, PriceData } from "./types";
interface GetPriceOptions {
    provider?: string;
    verifySignature?: boolean;
}
interface GetHistoricalPriceOptions extends GetPriceOptions {
    date: Date;
}
interface GetHistoricalPriceForIntervalOptions extends GetPriceOptions {
    startDate: Date;
    endDate: Date;
    interval: number;
}
export default class LimestoneApi {
    private defaultProvider;
    private useCache;
    private version;
    private verifySignature;
    private arweaveProxy;
    private cacheProxy;
    constructor(opts: {
        defaultProvider?: string;
        useCache?: boolean;
        version?: string;
        verifySignature?: boolean;
        arweaveProxy: ArweaveProxy;
    });
    static init(config?: LimestoneApiConfig): LimestoneApi;
    getPrice(symbol: string, opts?: GetPriceOptions): Promise<PriceData | undefined>;
    getPrice(symbols: string[], opts?: GetPriceOptions): Promise<{
        [token: string]: PriceData;
    }>;
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
    getHistoricalPrice(symbol: string, opts: GetHistoricalPriceOptions): Promise<PriceData | undefined>;
    getHistoricalPrice(symbol: string, opts: GetHistoricalPriceForIntervalOptions): Promise<PriceData[]>;
    getHistoricalPrice(symbols: string[], opts: GetHistoricalPriceOptions): Promise<{
        [token: string]: PriceData;
    }>;
    getAllPrices(opts?: GetPriceOptions): Promise<{
        [symbol: string]: PriceData;
    }>;
    private getLatestPriceForOneToken;
    private getPriceForManyTokens;
    private getPricesFromArweave;
    private getHistoricalPriceForOneSymbol;
    private tryToGetPriceFromGQL;
    private getHistoricalPricesInIntervalForOneSymbol;
    private assertValidSignature;
}
export {};
