export type ConvertableToDate = Date | number | string;

export interface LimestoneApiConfig {
  useCache?: boolean;
  defaultProvider?: string; // Name of default provider
  version?: string;
  verifySignature?: boolean;
}

export interface PriceData {
  id?: string;
  symbol: string;
  provider: string;
  value: number;
  permawebTx: string;
  source?: string;
  timestamp: number;
}

export interface PriceDataWithSignature extends PriceData {
  signature: string;
  version?: string;
  providerPublicKey?: string;
}

export interface ProviderNameToAddressMapping {
  [name: string]: string;
}

export interface GetPriceOptions {
  provider?: string;
  verifySignature?: boolean;
}

export interface GetHistoricalPriceOptions extends GetPriceOptions {
  date: ConvertableToDate;
}

export interface GetHistoricalPriceForIntervalOptions extends GetPriceOptions {
  startDate: ConvertableToDate;
  endDate: ConvertableToDate;
  interval: number; // ms
}
