import type {
  GdpData,
  UnemploymentData,
  InflationData,
  ConsumerData,
  HousingData,
  EquityData,
  CommodityData,
  YieldCurveData,
  ForexData,
  TradeData,
  YieldPoint,
  MarketQuote,
  ForexRate,
} from '@/lib/types/economic-data'

import {
  getGdpLevel,
  getGdpGrowthRate,
  getUnemploymentRate,
  getPayrolls,
  getCpi,
  getCoreCpi,
  getPce,
  getPpi,
  getUmichSentiment,
  getConferenceBoardConfidence,
  getCaseShiller,
  getMedianHomeSalePrice,
  getHousingStarts,
  getAllYieldCurve,
  getYieldSpread,
  getTradeBalance,
} from '@/lib/data/fred'

import { getEquityQuotes, getCommodityQuotes, getSp500History, getOilHistory, getGoldHistory } from '@/lib/data/market'
import { getForexRates, getEurUsdHistory } from '@/lib/data/forex'
import { getNationalUnemployment, getStateUnemployment } from '@/lib/data/bls'
import { getZillowNational } from '@/lib/data/zillow'

export async function getGdpSection(): Promise<GdpData> {
  const [level, growth] = await Promise.allSettled([getGdpLevel(), getGdpGrowthRate()])
  return {
    current: level.status === 'fulfilled' ? level.value.data : [],
    historical: level.status === 'fulfilled' ? level.value.data : [],
    growthRate: growth.status === 'fulfilled' ? growth.value.data : [],
  }
}

export async function getUnemploymentSection(): Promise<UnemploymentData> {
  const [national, bls, states, payrolls] = await Promise.allSettled([
    getUnemploymentRate(),
    getNationalUnemployment(),
    getStateUnemployment(),
    getPayrolls(),
  ])
  return {
    national: national.status === 'fulfilled' ? national.value.data : [],
    byState:
      states.status === 'fulfilled'
        ? { 'Top States': states.value.data }
        : {},
    byIndustry: {},
    payrolls: payrolls.status === 'fulfilled' ? payrolls.value.data : [],
  }
}

export async function getInflationSection(): Promise<InflationData> {
  const [cpi, core, pce, ppi] = await Promise.allSettled([
    getCpi(),
    getCoreCpi(),
    getPce(),
    getPpi(),
  ])
  return {
    cpi: cpi.status === 'fulfilled' ? cpi.value.data : [],
    coreCpi: core.status === 'fulfilled' ? core.value.data : [],
    pce: pce.status === 'fulfilled' ? pce.value.data : [],
    ppi: ppi.status === 'fulfilled' ? ppi.value.data : [],
  }
}

export async function getConsumerSection(): Promise<ConsumerData> {
  const [umich, cb] = await Promise.allSettled([
    getUmichSentiment(),
    getConferenceBoardConfidence(),
  ])
  return {
    umichSentiment: umich.status === 'fulfilled' ? umich.value.data : [],
    conferenceBoardConfidence: cb.status === 'fulfilled' ? cb.value.data : [],
  }
}

export async function getHousingSection(): Promise<HousingData> {
  const [cs, median, starts, zillow] = await Promise.allSettled([
    getCaseShiller(),
    getMedianHomeSalePrice(),
    getHousingStarts(),
    getZillowNational(),
  ])
  return {
    caseShiller: cs.status === 'fulfilled' ? cs.value.data : [],
    medianSalePrice: median.status === 'fulfilled' ? median.value.data : [],
    housingStarts: starts.status === 'fulfilled' ? starts.value.data : [],
    zhvi: zillow.status === 'fulfilled' ? zillow.value.data : [],
  }
}

function parseEquityQuotes(data: { date: string; value: number }[]): MarketQuote[] {
  const tickerMap: Record<string, string> = {
    '^GSPC': 'S&P 500',
    '^IXIC': 'NASDAQ',
    '^RUT': 'Russell 2000',
    '^DJI': 'Dow Jones',
    '^VIX': 'VIX',
  }
  return data.map((d) => ({
    ticker: d.date,
    price: d.value,
    change: 0,
    changePercent: 0,
  }))
}

export async function getEquitySection(): Promise<EquityData> {
  const [quotes, history] = await Promise.allSettled([getEquityQuotes(), getSp500History()])
  const quotesData = quotes.status === 'fulfilled' ? quotes.value.data : []
  const findQuote = (ticker: string): MarketQuote => {
    const found = quotesData.find((d) => d.date === ticker)
    return found
      ? { ticker, price: found.value ?? 0, change: 0, changePercent: 0 }
      : { ticker, price: 0, change: 0, changePercent: 0 }
  }
  return {
    sp500: findQuote('^GSPC'),
    nasdaq: findQuote('^IXIC'),
    russell2000: findQuote('^RUT'),
    dowJones: findQuote('^DJI'),
    vix: findQuote('^VIX'),
    historicalSp500: history.status === 'fulfilled' ? history.value.data : [],
  }
}

export async function getCommoditiesSection(): Promise<CommodityData> {
  const [quotes, oilHist, goldHist] = await Promise.allSettled([
    getCommodityQuotes(),
    getOilHistory(),
    getGoldHistory(),
  ])
  const quotesData = quotes.status === 'fulfilled' ? quotes.value.data : []
  const findQuote = (ticker: string): MarketQuote => {
    const found = quotesData.find((d) => d.date === ticker)
    return found
      ? { ticker, price: found.value ?? 0, change: 0, changePercent: 0 }
      : { ticker, price: 0, change: 0, changePercent: 0 }
  }
  return {
    oil: findQuote('CL=F'),
    gold: findQuote('GC=F'),
    silver: findQuote('SI=F'),
    naturalGas: findQuote('NG=F'),
    corn: findQuote('ZC=F'),
    wheat: findQuote('ZW=F'),
    historicalOil: oilHist.status === 'fulfilled' ? oilHist.value.data : [],
    historicalGold: goldHist.status === 'fulfilled' ? goldHist.value.data : [],
  }
}

const MATURITY_LABELS: Record<string, { label: string; months: number }> = {
  DGS1MO: { label: '1M', months: 1 },
  DGS3MO: { label: '3M', months: 3 },
  DGS6MO: { label: '6M', months: 6 },
  DGS1: { label: '1Y', months: 12 },
  DGS2: { label: '2Y', months: 24 },
  DGS5: { label: '5Y', months: 60 },
  DGS10: { label: '10Y', months: 120 },
  DGS20: { label: '20Y', months: 240 },
  DGS30: { label: '30Y', months: 360 },
}

export async function getBondsSection(): Promise<YieldCurveData> {
  const [yields, spread] = await Promise.allSettled([getAllYieldCurve(), getYieldSpread()])

  const snapshot: YieldPoint[] = []
  const historical: Record<string, import('@/lib/types/economic-data').Observation[]> = {}

  if (yields.status === 'fulfilled') {
    for (const [seriesId, cached] of Object.entries(yields.value)) {
      const meta = MATURITY_LABELS[seriesId]
      if (!meta) continue
      const latest = cached.data[cached.data.length - 1]
      if (latest?.value != null) {
        snapshot.push({ maturity: meta.label, months: meta.months, yield: latest.value })
      }
      historical[seriesId] = cached.data
    }
    snapshot.sort((a, b) => a.months - b.months)
  }

  return {
    snapshot,
    historical,
    spreadT10Y2Y: spread.status === 'fulfilled' ? spread.value.data : [],
  }
}

export async function getForexSection(): Promise<ForexData> {
  const [rates, eurUsdHist] = await Promise.allSettled([getForexRates(), getEurUsdHistory()])

  const fxData = rates.status === 'fulfilled' ? rates.value.data : []
  const forexRates: ForexRate[] = fxData.map((d) => ({
    pair: d.date,
    rate: d.value ?? 0,
    change: 0,
    changePercent: 0,
  }))

  return {
    rates: forexRates,
    historicalEURUSD: eurUsdHist.status === 'fulfilled' ? eurUsdHist.value.data : [],
  }
}

export async function getTradeSection(): Promise<TradeData> {
  const [balance] = await Promise.allSettled([getTradeBalance()])
  return {
    balance: balance.status === 'fulfilled' ? balance.value.data : [],
    exports: [],
    imports: [],
  }
}
