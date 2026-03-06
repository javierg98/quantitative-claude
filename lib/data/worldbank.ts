import { getCachedOrFetch } from '@/lib/cache/data-cache'
import type { Observation, CachedSeries } from '@/lib/types/economic-data'

const WB_BASE = 'https://api.worldbank.org/v2'

interface WbEntry {
  date: string
  value: number | null
}

type WbResponse = [{ total: number }, WbEntry[]]

async function fetchWorldBankSeries(
  indicator: string,
  country = 'US'
): Promise<Observation[]> {
  const url = `${WB_BASE}/country/${country}/indicator/${indicator}?format=json&mrv=20&per_page=20`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`World Bank API error ${res.status}`)

  const json = (await res.json()) as WbResponse
  const entries = json[1] ?? []
  return entries
    .filter((e) => e.value !== null)
    .map((e) => ({ date: `${e.date}-01-01`, value: e.value as number }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// US trade openness: exports + imports as % of GDP
export function getUsTradeGdpRatio(): Promise<CachedSeries> {
  return getCachedOrFetch(
    'worldbank_ne_trd_gnfs_zs',
    async () => {
      const data = await fetchWorldBankSeries('NE.TRD.GNFS.ZS')
      return { data, source: 'WORLDBANK' }
    },
    86400
  )
}

// US current account balance
export function getUsCurrentAccount(): Promise<CachedSeries> {
  return getCachedOrFetch(
    'worldbank_bn_cab_xoka_cd',
    async () => {
      const data = await fetchWorldBankSeries('BN.CAB.XOKA.CD')
      return { data, source: 'WORLDBANK' }
    },
    86400
  )
}
