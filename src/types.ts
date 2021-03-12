export interface LimestoneApiConfig {
  useCache?: boolean;
  defaultProvider?: string; // Name of default provider
  version?: string;
};

export interface PriceData {
  id: string;
  symbol: string;
  provider: string;
  value: string;
  signature: string;
  permawebTx: string;
  version: string;
  source: string;
  timestamp: string;
};

export interface ProviderNameToAddressMapping {
  [name: string]: string;
};
