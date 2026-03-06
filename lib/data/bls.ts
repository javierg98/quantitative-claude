import { getCachedOrFetch } from '@/lib/cache/data-cache'
import type { Observation, CachedSeries } from '@/lib/types/economic-data'

const BASE_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/'

interface BlsDataItem {
  year: string
  period: string
  periodName: string
  value: string
}

interface BlsSeries {
  seriesID: string
  data: BlsDataItem[]
}

interface BlsResponse {
  status: string
  Results?: { series: BlsSeries[] }
  message?: string[]
}

async function fetchBlsSeries(seriesIds: string[]): Promise<Record<string, Observation[]>> {
  const apiKey = process.env.BLS_API_KEY

  const body: Record<string, unknown> = {
    seriesid: seriesIds,
    startyear: String(new Date().getFullYear() - 5),
    endyear: String(new Date().getFullYear()),
  }
  if (apiKey) body.registrationkey = apiKey

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error(`BLS API error ${res.status}`)

  const json = (await res.json()) as BlsResponse
  if (json.status !== 'REQUEST_SUCCEEDED') {
    throw new Error(`BLS request failed: ${json.message?.join(', ')}`)
  }

  const result: Record<string, Observation[]> = {}
  for (const series of json.Results?.series ?? []) {
    result[series.seriesID] = series.data
      .filter((d) => d.period.startsWith('M'))
      .map((d) => {
        const month = parseInt(d.period.replace('M', ''), 10)
        const date = `${d.year}-${String(month).padStart(2, '0')}-01`
        return { date, value: parseFloat(d.value) }
      })
      .sort((a, b) => a.date.localeCompare(b.date))
  }
  return result
}

export function getNationalUnemployment(): Promise<CachedSeries> {
  return getCachedOrFetch(
    'bls_LNS14000000',
    async () => {
      const data = await fetchBlsSeries(['LNS14000000'])
      return { data: data['LNS14000000'] ?? [], source: 'BLS' }
    },
    3600
  )
}

// State unemployment — top 10 states by population
const STATE_SERIES = [
  'LASST060000000000003', // California
  'LASST480000000000003', // Texas
  'LASST120000000000003', // Florida
  'LASST360000000000003', // New York
  'LASST170000000000003', // Illinois
  'LASST420000000000003', // Pennsylvania
  'LASST390000000000003', // Ohio
  'LASST130000000000003', // Georgia
  'LASST370000000000003', // North Carolina
  'LASST260000000000003', // Michigan
]

const STATE_LABELS: Record<string, string> = {
  LASST060000000000003: 'California',
  LASST480000000000003: 'Texas',
  LASST120000000000003: 'Florida',
  LASST360000000000003: 'New York',
  LASST170000000000003: 'Illinois',
  LASST420000000000003: 'Pennsylvania',
  LASST390000000000003: 'Ohio',
  LASST130000000000003: 'Georgia',
  LASST370000000000003: 'North Carolina',
  LASST260000000000003: 'Michigan',
}

export function getStateUnemployment(): Promise<CachedSeries> {
  return getCachedOrFetch(
    'bls_state_unemployment',
    async () => {
      const rawData = await fetchBlsSeries(STATE_SERIES)
      // Flatten: use state name as date prefix
      const data: Observation[] = []
      for (const [seriesId, observations] of Object.entries(rawData)) {
        const label = STATE_LABELS[seriesId] ?? seriesId
        const latest = observations[observations.length - 1]
        if (latest) {
          data.push({ date: label, value: latest.value })
        }
      }
      return { data, source: 'BLS' }
    },
    14400
  )
}
