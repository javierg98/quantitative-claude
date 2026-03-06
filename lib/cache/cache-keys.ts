export const CACHE_KEYS = {
  // FRED series
  GDP: 'fred_GDP',
  GDP_GROWTH: 'fred_A191RL1Q225SBEA',
  CPI: 'fred_CPIAUCSL',
  CORE_CPI: 'fred_CPILFESL',
  PCE: 'fred_PCEPI',
  PPI: 'fred_PPIFIS',
  UNRATE: 'fred_UNRATE',
  PAYEMS: 'fred_PAYEMS',
  UMICH: 'fred_UMCSENT',
  CONFERENCE_BOARD: 'fred_CONCCONF',
  CASE_SHILLER: 'fred_CSUSHPISA',
  MEDIAN_HOME_PRICE: 'fred_MSPUS',
  HOUSING_STARTS: 'fred_HOUST',
  YIELD_1MO: 'fred_DGS1MO',
  YIELD_3MO: 'fred_DGS3MO',
  YIELD_6MO: 'fred_DGS6MO',
  YIELD_1Y: 'fred_DGS1',
  YIELD_2Y: 'fred_DGS2',
  YIELD_5Y: 'fred_DGS5',
  YIELD_10Y: 'fred_DGS10',
  YIELD_20Y: 'fred_DGS20',
  YIELD_30Y: 'fred_DGS30',
  YIELD_SPREAD: 'fred_T10Y2Y',
  FED_FUNDS: 'fred_FEDFUNDS',
  TRADE_BALANCE: 'fred_BOPGSTB',
  // Market data
  EQUITY_QUOTES: 'yahoo_equity_quotes',
  COMMODITY_QUOTES: 'yahoo_commodity_quotes',
  EQUITY_HISTORY_SP500: 'yahoo_history_GSPC',
  COMMODITY_HISTORY_OIL: 'yahoo_history_CL',
  COMMODITY_HISTORY_GOLD: 'yahoo_history_GC',
  // Forex
  FOREX_RATES: 'yahoo_forex',
  // Housing
  ZILLOW_ZHVI: 'zillow_zhvi',
  // Trade / BEA
  BEA_TRADE: 'bea_T40101',
  BEA_GDP: 'bea_T10101',
} as const

export type CacheKey = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS]
