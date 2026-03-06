import { getCachedOrFetch } from '@/lib/cache/data-cache'
import { CACHE_KEYS } from '@/lib/cache/cache-keys'
import type { Observation, CachedSeries } from '@/lib/types/economic-data'

// Zillow ZHVI — National Median (All Homes, smoothed)
// URL from: https://www.zillow.com/research/data/
const ZHVI_URL =
  'https://files.zillowstatic.com/research/public_csvs/zhvi/Metro_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv'

function parseZhviCsv(csv: string): Observation[] {
  const lines = csv.split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',')
  // Find the "United States" row
  const usRow = lines.find((l) => l.includes('United States'))
  if (!usRow) return []

  const values = usRow.split(',')
  const observations: Observation[] = []

  // Date columns start at index 5 (after RegionID, SizeRank, RegionName, RegionType, StateName)
  for (let i = 5; i < headers.length; i++) {
    const dateHeader = headers[i]?.trim()
    const val = values[i]?.trim()
    if (dateHeader && val && val !== '') {
      const parsed = parseFloat(val)
      if (!isNaN(parsed)) {
        observations.push({ date: dateHeader, value: parsed })
      }
    }
  }

  return observations.slice(-60) // last 5 years
}

export function getZillowNational(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.ZILLOW_ZHVI,
    async () => {
      const res = await fetch(ZHVI_URL)
      if (!res.ok) throw new Error(`Zillow CSV error ${res.status}`)
      const csv = await res.text()
      const data = parseZhviCsv(csv)
      return { data, source: 'ZILLOW' }
    },
    86400 // 24h — Zillow updates monthly
  )
}
