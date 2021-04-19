import { ConvertableToDate } from "./types";
import limestone from "./index";

class LimestoneQuery {
  private params: any; // TODO improve the type later

  constructor() {
    this.params = {
      symbols: [],
    };
  }

  symbol(symbol: string) {
    this.params.symbols = [symbol];
    return this;
  }

  symbols(symbols: string[]) {
    this.params.symbols = symbols;
    return this;
  }

  latest() {
    for (const param of ["date", "fromDate", "toDate"]) {
      this.params[param] = undefined;
    }
    return this;
  }

  hoursAgo(hoursCount: number) {
    this.params.date = Date.now() - hoursCount * 3600 * 1000;
    return this;
  }

  atDate(date: ConvertableToDate) {
    this.params.date = date;
    return this;
  }

  fromDate(date: ConvertableToDate) {
    this.params.fromDate = date;
    return this;
  }

  toDate(date: ConvertableToDate) {
    this.params.toDate = date;
    return this;
  }

  // TODO: maybe implement a limit for 24 hours
  forLastHours(hoursCount: number) {
    this.params.fromDate = Date.now() - hoursCount * 3600 * 1000;
    this.params.interval = 600 * 1000;
    return this;
  }

  forLastDays(daysCount: number) {
    this.params.fromDate = Date.now() - daysCount * 24 * 3600 * 1000;
    this.params.interval = 3600 * 1000;
    return this;
  }

  allSymbols() {
    this.params.symbols = [];
    return this;
  }

  async get() {
    const symbols = this.params.symbols;
    if (symbols.length > 0) {
      const symbolOrSymbols = symbols.length === 1 ? symbols[0] : symbols;
      const { fromDate, toDate, date } = this.params;

      if ([fromDate, toDate, date].every(el => el === undefined)) {
        // Fetch the latest price
        return await limestone.getPrice(symbolOrSymbols, this.params);
      } else {
        // Fetch the historical price
        return await limestone.getHistoricalPrice(
          symbolOrSymbols,
          this.params);
      }

    } else {
      // Fetch prices for all tokens
      return await limestone.getAllPrices(this.params);
    }
  }

};

export default () => new LimestoneQuery;
