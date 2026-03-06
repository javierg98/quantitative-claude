import { getGdpSection } from '@/lib/data/aggregator'
import { GdpGrowthChart, GdpHistoricalChart, GdpProjectionsChart, GdpForecastChart } from '@/components/charts'
import { MetricCard } from '@/components/ui/MetricCard'

export async function GdpPanel() {
  let data
  let error: string | undefined
  try {
    data = await getGdpSection()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load GDP data'
  }

  const latestGrowth = data?.growthRate[data.growthRate.length - 1]

  return (
    <section id="gdp" className="scroll-mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-4">GDP Growth Rate</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <MetricCard
          label="Latest Growth Rate"
          value={latestGrowth?.value != null ? `${latestGrowth.value.toFixed(1)}%` : '—'}
          unit="annualized"
          trend={
            latestGrowth?.value == null ? 'neutral' : latestGrowth.value > 0 ? 'up' : 'down'
          }
          change={latestGrowth?.date ? `Q: ${latestGrowth.date.slice(0, 7)}` : undefined}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <GdpGrowthChart data={data?.growthRate ?? []} error={error} />
        <GdpHistoricalChart data={data?.current ?? []} error={error} />
        <GdpProjectionsChart data={data?.growthRate ?? []} error={error} />
        {/* Forecast chart will load once forecasts are generated */}
        <GdpForecastChart data={[] /* placeholder, real data injected by forecast agent */} error={error} />
      </div>
    </section>
  )
}
