export interface LimestoneApiConfig {
  useCache: boolean;
  defaultProvider: string; // Name of default provider
};

export interface PriceData {
  symbol: string;
  timestamp: number;
  provider: {
    name: string;
    address: string;
  };
}
