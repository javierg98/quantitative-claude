import YahooFinance from 'yahoo-finance2'
import { getCachedOrFetch } from '@/lib/cache/data-cache'
import { CACHE_KEYS } from '@/lib/cache/cache-keys'
import type { Observation, CachedSeries } from '@/lib/types/economic-data'

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] })

const FX_TICKERS = [
  { ticker: 'EURUSD=X', pair: 'EURUSD' },
  { ticker: 'USDJPY=X', pair: 'USDJPY' },
  { ticker: 'GBPUSD=X', pair: 'GBPUSD' },
  { ticker: 'USDCNY=X', pair: 'USDCNY' },
  { ticker: 'USDCAD=X', pair: 'USDCAD' },
]

async function fetchFxSpot(ticker: string): Promise<number | null> {
  try {
    const quote = await yf.quote(ticker)
    return quote.regularMarketPrice ?? null
  } catch (err) {
    console.error(`FX quote error for ${ticker}:`, err)
    return null
  }
}

async function fetchFxHistory(ticker: string, days = 90): Promise<Observation[]> {
  const period1 = new Date()
  period1.setDate(period1.getDate() - days)

  const result = await yf.chart(ticker, {
    period1: period1.toISOString().split('T')[0],
    interval: '1d',
  })

  const quotes = (result as { quotes?: Array<{ date: Date | string; close?: number | null }> }).quotes ?? []
  return quotes
    .filter((q) => q.close != null)
    .map((q) => ({
      date: q.date instanceof Date ? q.date.toISOString().split('T')[0] : String(q.date).split('T')[0],
      value: q.close as number,
    }))
}

// Spot rates for all 5 pairs — stored as observations with date=pair label
// TTL: 5 minutes (no rate limit with Yahoo Finance)
export function getForexRates(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.FOREX_RATES,
    async () => {
      const data: Observation[] = []
      for (const { ticker, pair } of FX_TICKERS) {
        const rate = await fetchFxSpot(ticker)
        if (rate !== null) {
          data.push({ date: pair, value: rate })
        }
      }
      return { data, source: 'YAHOO' as const }
    },
    300 // 5 minutes — unlimited requests
  )
}

// 90-day daily EUR/USD history
export function getEurUsdHistory(): Promise<CachedSeries> {
  return getCachedOrFetch(
    'yahoo_eurusd_history',
    async () => {
      const data = await fetchFxHistory('EURUSD=X', 90)
      return { data, source: 'YAHOO' as const }
    },
    900 // 15 minutes
  )
}
