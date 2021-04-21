import _ from "lodash";
import { ConvertableToDate, GetPriceOptions, PriceData } from "./types";
import limestone from "./index";

type LimestoneQueryResult = PriceData | PriceData[] | { [token: string]: PriceData };

class LimestoneQuery {
  private params: {
    symbols: string[],
    startDate?: ConvertableToDate,
    endDate?: ConvertableToDate,
    date?: ConvertableToDate,
    interval?: number,
  };

  constructor() {
    this.params = {
      symbols: [],
    };
  }

  symbol(symbol: string): LimestoneQuery {
    this.params.symbols = [symbol];
    return this;
  }

  symbols(symbols: string[]): LimestoneQuery {
    this.params.symbols = symbols;
    return this;
  }

  latest(): LimestoneQuery {
    this.params.date = undefined;
    this.params.startDate = undefined;
    this.params.endDate = undefined;
    return this;
  }

  hoursAgo(hoursCount: number) {
    this.params.date = Date.now() - hoursCount * 3600 * 1000;
    return this;
  }

  atDate(date: ConvertableToDate): LimestoneQuery {
    this.params.date = date;
    return this;
  }

  fromDate(date: ConvertableToDate): LimestoneQuery {
    this.params.startDate = date;
    return this;
  }

  toDate(date: ConvertableToDate): LimestoneQuery {
    this.params.endDate = date;
    return this;
  }

  forLastHours(hoursCount: number): LimestoneQuery {
    this.params.endDate = Date.now();
    this.params.startDate =
      this.params.endDate - hoursCount * 3600 * 1000;
    this.params.interval = 600 * 1000;
    return this;
  }

  forLastDays(daysCount: number): LimestoneQuery {
    this.params.endDate = Date.now();
    this.params.startDate =
      this.params.endDate - daysCount * 24 * 3600 * 1000;
    this.params.interval = 3600 * 1000;
    return this;
  }

  allSymbols(): LimestoneQuery {
    this.params.symbols = [];
    return this;
  }

  async exec(): Promise<LimestoneQueryResult> {
    const symbols = this.params.symbols;
    if (symbols.length > 0) {
      const symbolOrSymbols = symbols.length === 1 ? symbols[0] : symbols;
      const { startDate, endDate, date, interval } = this.params;

      if ([startDate, endDate, date].every(el => el === undefined)) {
        // Fetch the latest price
        return await limestone.getPrice(
          symbolOrSymbols as any,
          this.params as any);
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

        return await limestone.getHistoricalPrice(
          symbolOrSymbols as any,
          this.params as any);
      }

    } else {
      // Fetch prices for all tokens
      return await limestone.getAllPrices(this.params as GetPriceOptions);
    }
  }

};

function getTimeDiff(date1: ConvertableToDate, date2: ConvertableToDate): number {
  const timestamp1 = new Date(date1).getTime();
  const timestamp2 = new Date(date2).getTime()
  return Math.abs(timestamp2 - timestamp1);
}

export default () => new LimestoneQuery;
