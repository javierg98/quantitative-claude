import { getInflationSection } from '@/lib/data/aggregator'
import { CpiTrendChart, InflationHistoricalChart, InflationForecastChart } from '@/components/charts'
import { MetricCard } from '@/components/ui/MetricCard'

function latestYoy(data: { date: string; value: number | null }[]): number | null {
  if (data.length < 13) return null
  const curr = data[data.length - 1]
  const prev = data[data.length - 13]
  if (curr.value == null || prev.value == null || prev.value === 0) return null
  return ((curr.value - prev.value) / prev.value) * 100
}

export async function InflationPanel() {
  let data
  let error: string | undefined
  try {
    data = await getInflationSection()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load inflation data'
  }

  const cpiYoy = data ? latestYoy(data.cpi) : null
  const coreCpiYoy = data ? latestYoy(data.coreCpi) : null

  return (
    <section id="inflation" className="scroll-mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Inflation Trends</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <MetricCard
          label="CPI YoY"
          value={cpiYoy != null ? `${cpiYoy.toFixed(1)}%` : '—'}
          trend={cpiYoy == null ? 'neutral' : cpiYoy > 3 ? 'up' : cpiYoy < 2 ? 'down' : 'neutral'}
        />
        <MetricCard
          label="Core CPI YoY"
          value={coreCpiYoy != null ? `${coreCpiYoy.toFixed(1)}%` : '—'}
          trend={coreCpiYoy == null ? 'neutral' : coreCpiYoy > 3 ? 'up' : 'neutral'}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CpiTrendChart cpi={data?.cpi ?? []} coreCpi={data?.coreCpi ?? []} error={error} />
        <InflationHistoricalChart cpi={data?.cpi ?? []} pce={data?.pce ?? []} ppi={data?.ppi ?? []} error={error} />
        <InflationForecastChart cpi={data?.cpi ?? []} error={error} />
      </div>
    </section>
  )
}
