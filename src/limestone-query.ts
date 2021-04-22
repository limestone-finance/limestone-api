import _ from "lodash";
import { ConvertableToDate, GetPriceOptions, PriceData } from "./types";
import limestone from "./index";

type QueryParams = {
  symbols: string[],
  startDate?: ConvertableToDate,
  endDate?: ConvertableToDate,
  date?: ConvertableToDate,
  interval?: number,
  latest?: boolean,
};

class LimestoneQuery {
  protected params: QueryParams;

  constructor(params = {}) {
    this.params = {
      symbols: [],
      ...params,
    };
  }

  symbol(symbol: string): LimestoneQueryForSingleSymbol {
    return new LimestoneQueryForSingleSymbol({
      symbols: [symbol],
    });
  }

  symbols(symbols: string[]): LimestoneQueryForSeveralSymbols {
    return new LimestoneQueryForSeveralSymbols({ symbols });
  }

  allSymbols(): LimestoneQueryForSeveralSymbols {
    // return this.getQueryWithUpdatedSymbols<{ [symbol: string]: PriceData }>([]);
    return new LimestoneQueryForSeveralSymbols({
      symbols: [],
    });
  }

};

class LimestoneQueryForSingleOrSeveralSymbols<QueryResultType> {
  protected params: QueryParams;

  constructor(params: QueryParams) {
    this.params = params;
  }

  // TODO: Maybe improve the type (not any)
  protected getExecutableQuery<T>(update: any): LimestoneQueryExecutable<T> {
    return new LimestoneQueryExecutable<T>({
      ...this.params,
      ...update,
    });
  }

  latest(): LimestoneQueryExecutable<QueryResultType> {
    return this.getExecutableQuery({});
  }

  hoursAgo(hoursCount: number): LimestoneQueryExecutable<QueryResultType> {
    return this.getExecutableQuery({
      date: Date.now() - hoursCount * 3600 * 1000,
    });
  }

  atDate(date: ConvertableToDate): LimestoneQueryExecutable<QueryResultType> {
    return this.getExecutableQuery({ date });
  }

}

class LimestoneQueryForSingleSymbol extends LimestoneQueryForSingleOrSeveralSymbols<PriceData> {
  constructor(params: QueryParams) {
    super(params);
  }

  fromDate(date: ConvertableToDate): LimestoneQueryForSingleSymbol {
    return new LimestoneQueryForSingleSymbol({
      ...this.params,
      startDate: date,
    });
  }

  toDate(date: ConvertableToDate): LimestoneQueryExecutable<PriceData[]> {
    if (this.params.startDate === undefined) {
      throw new Error("Please specify fromDate before using toDate");
    }
    return this.getExecutableQuery<PriceData[]>({ endDate: date });
  }

  forLastHours(hoursCount: number): LimestoneQueryExecutable<PriceData[]> {
    const endDate = Date.now();
    return this.getExecutableQuery({
      endDate,
      startDate: endDate - hoursCount * 3600 * 1000,
      interval: 600 * 1000,
    });
  }

  forLastDays(daysCount: number): LimestoneQueryExecutable<PriceData[]> {
    const endDate = Date.now();
    return this.getExecutableQuery({
      endDate,
      startDate: endDate - daysCount * 24 * 3600 * 1000,
      interval: 3600 * 1000,
    });
  }
}

class LimestoneQueryForSeveralSymbols extends LimestoneQueryForSingleOrSeveralSymbols<{ [symbol: string]: PriceData }> {
  constructor(params: QueryParams) {
    super(params);
  }
}

class LimestoneQueryExecutable<QueryResultType> {
  private params: QueryParams;

  constructor(params = {}) {
    this.params = {
      symbols: [],
      ...params,
    };
  }

  async exec(): Promise<QueryResultType> {
    const symbols = this.params.symbols;
    if (symbols.length > 0) {
      const symbolOrSymbols = symbols.length === 1 ? symbols[0] : symbols;
      const { startDate, endDate, date, interval } = this.params;

      if ([startDate, endDate, date].every(el => el === undefined)) {
        // Fetch the latest price
        return await limestone.getPrice(
          symbolOrSymbols as any,
          this.params as any) as any;
      } else {
        // Fetch the historical price
        if (startDate !== undefined && endDate !== undefined && interval === undefined) {
          const diff = getTimeDiff(startDate, endDate);
          if (diff >= 24 * 3600 * 1000) {
            this.params.interval = 3600 * 1000;
          } else {
            this.params.interval = 1;
          }
        }

        // TODO: check types
        return await limestone.getHistoricalPrice(
          symbolOrSymbols as any,
          this.params as any) as any;
      }

    } else {
      // Fetch prices for all tokens
      return await limestone.getAllPrices(this.params as GetPriceOptions) as any;
    }
  }
}

function getTimeDiff(date1: ConvertableToDate, date2: ConvertableToDate): number {
  const timestamp1 = new Date(date1).getTime();
  const timestamp2 = new Date(date2).getTime()
  return Math.abs(timestamp2 - timestamp1);
}

export default () => new LimestoneQuery();
