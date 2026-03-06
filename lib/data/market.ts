import YahooFinance from 'yahoo-finance2'
import { getCachedOrFetch } from '@/lib/cache/data-cache'
import { CACHE_KEYS } from '@/lib/cache/cache-keys'
import type { MarketQuote, Observation } from '@/lib/types/economic-data'

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] })

const EQUITY_TICKERS = ['^GSPC', '^IXIC', '^RUT', '^DJI', '^VIX']
const COMMODITY_TICKERS = ['CL=F', 'GC=F', 'SI=F', 'NG=F', 'ZC=F', 'ZW=F']

async function fetchQuote(ticker: string): Promise<MarketQuote | null> {
  try {
    const quote = await yf.quote(ticker)
    return {
      ticker,
      price: quote.regularMarketPrice ?? 0,
      change: quote.regularMarketChange ?? 0,
      changePercent: quote.regularMarketChangePercent ?? 0,
      high52w: quote.fiftyTwoWeekHigh,
      low52w: quote.fiftyTwoWeekLow,
    }
  } catch (err) {
    console.error(`Yahoo quote error for ${ticker}:`, err)
    return null
  }
}

async function fetchHistoricalObservations(
  ticker: string,
  period1: Date
): Promise<Observation[]> {
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

export function getEquityQuotes() {
  return getCachedOrFetch(
    CACHE_KEYS.EQUITY_QUOTES,
    async () => {
      const quotes = await Promise.all(EQUITY_TICKERS.map(fetchQuote))
      const data: Observation[] = quotes
        .filter((q): q is MarketQuote => q !== null)
        .map((q) => ({ date: q.ticker, value: q.price }))
      return { data, source: 'YAHOO' as const }
    },
    300
  )
}

export function getCommodityQuotes() {
  return getCachedOrFetch(
    CACHE_KEYS.COMMODITY_QUOTES,
    async () => {
      const quotes = await Promise.all(COMMODITY_TICKERS.map(fetchQuote))
      const data: Observation[] = quotes
        .filter((q): q is MarketQuote => q !== null)
        .map((q) => ({ date: q.ticker, value: q.price }))
      return { data, source: 'YAHOO' as const }
    },
    300
  )
}

export function getSp500History() {
  return getCachedOrFetch(
    CACHE_KEYS.EQUITY_HISTORY_SP500,
    async () => {
      const twoYearsAgo = new Date()
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
      const data = await fetchHistoricalObservations('^GSPC', twoYearsAgo)
      return { data, source: 'YAHOO' as const }
    },
    900
  )
}

export function getOilHistory() {
  return getCachedOrFetch(
    CACHE_KEYS.COMMODITY_HISTORY_OIL,
    async () => {
      const twoYearsAgo = new Date()
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
      const data = await fetchHistoricalObservations('CL=F', twoYearsAgo)
      return { data, source: 'YAHOO' as const }
    },
    3600
  )
}

export function getGoldHistory() {
  return getCachedOrFetch(
    CACHE_KEYS.COMMODITY_HISTORY_GOLD,
    async () => {
      const twoYearsAgo = new Date()
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
      const data = await fetchHistoricalObservations('GC=F', twoYearsAgo)
      return { data, source: 'YAHOO' as const }
    },
    3600
  )
}

// Helper to get full quote data (used by panels)
export async function getFullEquityQuotes(): Promise<MarketQuote[]> {
  const quotes = await Promise.all(EQUITY_TICKERS.map(fetchQuote))
  return quotes.filter((q): q is MarketQuote => q !== null)
}

export async function getFullCommodityQuotes(): Promise<MarketQuote[]> {
  const quotes = await Promise.all(COMMODITY_TICKERS.map(fetchQuote))
  return quotes.filter((q): q is MarketQuote => q !== null)
}
