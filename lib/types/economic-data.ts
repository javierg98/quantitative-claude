export interface Observation {
  date: string
  value: number | null
}

export interface CachedSeries {
  seriesId: string
  fetchedAt: string
  expiresAt: string
  data: Observation[]
  source: 'FRED' | 'BEA' | 'BLS' | 'YAHOO' | 'ZILLOW' | 'WORLDBANK'
  error?: string
}

export interface GdpData {
  current: Observation[]
  historical: Observation[]
  growthRate: Observation[]
}

export interface UnemploymentData {
  national: Observation[]
  byState: Record<string, Observation[]>
  byIndustry: Record<string, Observation[]>
  payrolls: Observation[]
}

export interface InflationData {
  cpi: Observation[]
  coreCpi: Observation[]
  pce: Observation[]
  ppi: Observation[]
}

export interface ConsumerData {
  umichSentiment: Observation[]
  conferenceBoardConfidence: Observation[]
}

export interface HousingData {
  caseShiller: Observation[]
  medianSalePrice: Observation[]
  housingStarts: Observation[]
  zhvi?: Observation[]
}

export interface EquityData {
  sp500: MarketQuote
  nasdaq: MarketQuote
  russell2000: MarketQuote
  dowJones: MarketQuote
  vix: MarketQuote
  historicalSp500: Observation[]
}

export interface MarketQuote {
  ticker: string
  price: number
  change: number
  changePercent: number
  high52w?: number
  low52w?: number
}

export interface CommodityData {
  oil: MarketQuote
  gold: MarketQuote
  silver: MarketQuote
  naturalGas: MarketQuote
  corn: MarketQuote
  wheat: MarketQuote
  historicalOil: Observation[]
  historicalGold: Observation[]
}

export interface YieldCurveData {
  snapshot: YieldPoint[]
  historical: Record<string, Observation[]>
  spreadT10Y2Y: Observation[]
}

export interface YieldPoint {
  maturity: string
  months: number
  yield: number
}

export interface ForexData {
  rates: ForexRate[]
  historicalEURUSD: Observation[]
  dxy?: Observation[]
}

export interface ForexRate {
  pair: string
  rate: number
  change: number
  changePercent: number
}

export interface TradeData {
  balance: Observation[]
  exports: Observation[]
  imports: Observation[]
}

export interface DashboardData {
  gdp: GdpData | null
  unemployment: UnemploymentData | null
  inflation: InflationData | null
  consumer: ConsumerData | null
  housing: HousingData | null
  equity: EquityData | null
  commodities: CommodityData | null
  bonds: YieldCurveData | null
  forex: ForexData | null
  trade: TradeData | null
  lastUpdated: string
}

export interface DataSourceHealth {
  source: string
  status: 'healthy' | 'degraded' | 'error' | 'stale'
  lastFetch: string | null
  error?: string
  seriesCount: number
}
