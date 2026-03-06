import { getCachedOrFetch } from '@/lib/cache/data-cache'
import { CACHE_KEYS } from '@/lib/cache/cache-keys'
import type { Observation, CachedSeries } from '@/lib/types/economic-data'

const BASE_URL = 'https://api.stlouisfed.org/fred/series/observations'

interface FredObservation {
  date: string
  value: string
}

interface FredResponse {
  observations: FredObservation[]
}

async function fetchFredSeries(
  seriesId: string,
  limit?: number
): Promise<Observation[]> {
  const apiKey = process.env.FRED_API_KEY
  if (!apiKey) {
    throw new Error('FRED_API_KEY not configured')
  }

  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: 'json',
    sort_order: 'asc',
    ...(limit ? { limit: String(limit) } : {}),
  })

  const res = await fetch(`${BASE_URL}?${params}`, {
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error(`FRED API error ${res.status} for ${seriesId}`)
  }

  const json = (await res.json()) as FredResponse
  return json.observations
    .filter((o) => o.value !== '.')
    .map((o) => ({
      date: o.date,
      value: parseFloat(o.value),
    }))
}

// GDP — quarterly, 24h TTL
export function getGdpLevel(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.GDP,
    async () => ({ data: await fetchFredSeries('GDP', 40), source: 'FRED' }),
    86400
  )
}

export function getGdpGrowthRate(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.GDP_GROWTH,
    async () => ({ data: await fetchFredSeries('A191RL1Q225SBEA', 40), source: 'FRED' }),
    86400
  )
}

// Inflation — 4h TTL
export function getCpi(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.CPI,
    async () => ({ data: await fetchFredSeries('CPIAUCSL', 60), source: 'FRED' }),
    14400
  )
}

export function getCoreCpi(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.CORE_CPI,
    async () => ({ data: await fetchFredSeries('CPILFESL', 60), source: 'FRED' }),
    14400
  )
}

export function getPce(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.PCE,
    async () => ({ data: await fetchFredSeries('PCEPI', 60), source: 'FRED' }),
    14400
  )
}

export function getPpi(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.PPI,
    async () => ({ data: await fetchFredSeries('PPIFIS', 60), source: 'FRED' }),
    14400
  )
}

// Unemployment — 1h TTL
export function getUnemploymentRate(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.UNRATE,
    async () => ({ data: await fetchFredSeries('UNRATE', 60), source: 'FRED' }),
    3600
  )
}

export function getPayrolls(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.PAYEMS,
    async () => ({ data: await fetchFredSeries('PAYEMS', 60), source: 'FRED' }),
    3600
  )
}

// Consumer confidence — 4h TTL
export function getUmichSentiment(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.UMICH,
    async () => ({ data: await fetchFredSeries('UMCSENT', 60), source: 'FRED' }),
    14400
  )
}

export function getConferenceBoardConfidence(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.CONFERENCE_BOARD,
    async () => ({ data: await fetchFredSeries('CONCCONF', 60), source: 'FRED' }),
    14400
  )
}

// Housing — 24h TTL
export function getCaseShiller(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.CASE_SHILLER,
    async () => ({ data: await fetchFredSeries('CSUSHPISA', 60), source: 'FRED' }),
    86400
  )
}

export function getMedianHomeSalePrice(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.MEDIAN_HOME_PRICE,
    async () => ({ data: await fetchFredSeries('MSPUS', 40), source: 'FRED' }),
    86400
  )
}

export function getHousingStarts(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.HOUSING_STARTS,
    async () => ({ data: await fetchFredSeries('HOUST', 60), source: 'FRED' }),
    86400
  )
}

// Bond yields — 5min TTL
export function getYieldSeries(
  seriesId: string,
  cacheKey: string
): Promise<CachedSeries> {
  return getCachedOrFetch(
    cacheKey,
    async () => ({ data: await fetchFredSeries(seriesId, 252), source: 'FRED' }),
    300
  )
}

export async function getAllYieldCurve(): Promise<Record<string, CachedSeries>> {
  const maturities: Array<[string, string]> = [
    ['DGS1MO', CACHE_KEYS.YIELD_1MO],
    ['DGS3MO', CACHE_KEYS.YIELD_3MO],
    ['DGS6MO', CACHE_KEYS.YIELD_6MO],
    ['DGS1', CACHE_KEYS.YIELD_1Y],
    ['DGS2', CACHE_KEYS.YIELD_2Y],
    ['DGS5', CACHE_KEYS.YIELD_5Y],
    ['DGS10', CACHE_KEYS.YIELD_10Y],
    ['DGS20', CACHE_KEYS.YIELD_20Y],
    ['DGS30', CACHE_KEYS.YIELD_30Y],
  ]

  const results = await Promise.all(
    maturities.map(([sid, ck]) => getYieldSeries(sid, ck))
  )

  return Object.fromEntries(
    maturities.map(([sid], i) => [sid, results[i]])
  )
}

export function getYieldSpread(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.YIELD_SPREAD,
    async () => ({ data: await fetchFredSeries('T10Y2Y', 252), source: 'FRED' }),
    300
  )
}

// Trade balance — 24h TTL
export function getTradeBalance(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.TRADE_BALANCE,
    async () => ({ data: await fetchFredSeries('BOPGSTB', 60), source: 'FRED' }),
    86400
  )
}
