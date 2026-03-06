import { getCachedOrFetch } from '@/lib/cache/data-cache'
import { CACHE_KEYS } from '@/lib/cache/cache-keys'
import type { Observation, CachedSeries } from '@/lib/types/economic-data'

const BASE_URL = 'https://apps.bea.gov/api/data'

interface BeaData {
  TableName: string
  SeriesCode: string
  LineNumber: string
  LineDescription: string
  TimePeriod: string
  CL_UNIT: string
  MULT_FACTOR: string
  DataValue: string
  NoteRef?: string
}

interface BeaResponse {
  BEAAPI: {
    Results?: {
      Data: BeaData[]
    }
    Error?: {
      APIErrorCode: string
      APIErrorDescription: string
    }
  }
}

async function fetchBeaTable(
  tableName: string,
  frequency: string,
  year: string
): Promise<BeaData[]> {
  const apiKey = process.env.BEA_API_KEY
  if (!apiKey) throw new Error('BEA_API_KEY not configured')

  const params = new URLSearchParams({
    UserID: apiKey,
    method: 'GetData',
    datasetname: 'NIPA',
    TableName: tableName,
    Frequency: frequency,
    Year: year,
    ResultFormat: 'JSON',
  })

  const res = await fetch(`${BASE_URL}?${params}`)
  if (!res.ok) throw new Error(`BEA API error ${res.status}`)

  const json = (await res.json()) as BeaResponse
  if (json.BEAAPI.Error) {
    throw new Error(`BEA error: ${json.BEAAPI.Error.APIErrorDescription}`)
  }
  return json.BEAAPI.Results?.Data ?? []
}

// GDP from BEA T10101 — line 1 is Real GDP
export function getBeaGdp(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.BEA_GDP,
    async () => {
      const years = Array.from(
        { length: 10 },
        (_, i) => String(new Date().getFullYear() - 9 + i)
      ).join(',')
      const records = await fetchBeaTable('T10101', 'Q', years)
      // Line 1 = Real Gross Domestic Product, Percent change
      const gdpLine = records.filter((r) => r.LineNumber === '1')
      const data: Observation[] = gdpLine
        .map((r) => ({
          date: r.TimePeriod.replace('Q1', '-01-01')
            .replace('Q2', '-04-01')
            .replace('Q3', '-07-01')
            .replace('Q4', '-10-01'),
          value: parseFloat(r.DataValue.replace(',', '')),
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
      return { data, source: 'BEA' }
    },
    86400
  )
}

// Trade from BEA T40101
export function getBeaTrade(): Promise<CachedSeries> {
  return getCachedOrFetch(
    CACHE_KEYS.BEA_TRADE,
    async () => {
      const years = Array.from(
        { length: 5 },
        (_, i) => String(new Date().getFullYear() - 4 + i)
      ).join(',')
      const records = await fetchBeaTable('T40101', 'Q', years)
      // Line 1 = Exports, line 2 = Imports
      const exportLine = records.filter((r) => r.LineNumber === '1')
      const data: Observation[] = exportLine
        .map((r) => ({
          date: r.TimePeriod.replace(/(\d{4})Q(\d)/, (_, y, q) => {
            const monthMap: Record<string, string> = { '1': '01', '2': '04', '3': '07', '4': '10' }
            return `${y}-${monthMap[q]}-01`
          }),
          value: parseFloat(r.DataValue.replace(',', '')),
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
      return { data, source: 'BEA' }
    },
    86400
  )
}
