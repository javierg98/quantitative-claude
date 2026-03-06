import { NextRequest, NextResponse } from 'next/server'
import {
  getGdpSection,
  getUnemploymentSection,
  getInflationSection,
  getConsumerSection,
  getHousingSection,
  getEquitySection,
  getCommoditiesSection,
  getBondsSection,
  getForexSection,
  getTradeSection,
} from '@/lib/data/aggregator'

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret') ?? request.nextUrl.searchParams.get('secret')
  const expectedSecret = process.env.CRON_SECRET

  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, string> = {}

  const sections = [
    ['gdp', getGdpSection],
    ['unemployment', getUnemploymentSection],
    ['inflation', getInflationSection],
    ['consumer', getConsumerSection],
    ['housing', getHousingSection],
    ['equity', getEquitySection],
    ['commodities', getCommoditiesSection],
    ['bonds', getBondsSection],
    ['forex', getForexSection],
    ['trade', getTradeSection],
  ] as const

  await Promise.allSettled(
    sections.map(async ([name, fetcher]) => {
      try {
        await fetcher()
        results[name] = 'ok'
      } catch (e) {
        results[name] = e instanceof Error ? e.message : 'error'
      }
    })
  )

  return NextResponse.json({ refreshed: results, at: new Date().toISOString() })
}
