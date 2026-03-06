import { getUnemploymentSection } from '@/lib/data/aggregator'
import {
  UnemploymentRateChart,
  UnemploymentByRegionChart,
  UnemploymentByIndustryChart,
  UnemploymentForecastChart,
} from '@/components/charts'
import { MetricCard } from '@/components/ui/MetricCard'

export async function UnemploymentPanel() {
  let data
  let error: string | undefined
  try {
    data = await getUnemploymentSection()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load unemployment data'
  }

  const latest = data?.national[data.national.length - 1]
  const prev = data?.national[data.national.length - 2]
  const change = latest?.value != null && prev?.value != null
    ? (latest.value - prev.value).toFixed(1)
    : undefined

  return (
    <section id="unemployment" className="scroll-mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Unemployment</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <MetricCard
          label="National Unemployment"
          value={latest?.value != null ? `${latest.value.toFixed(1)}%` : '—'}
          change={change ? `${Number(change) > 0 ? '+' : ''}${change}% MoM` : undefined}
          trend={change ? (Number(change) > 0 ? 'up' : 'down') : 'neutral'}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <UnemploymentRateChart data={data?.national ?? []} error={error} />
        <UnemploymentByRegionChart data={data?.byState['Top States'] ?? []} error={error} />
        <UnemploymentByIndustryChart payrolls={data?.payrolls ?? []} error={error} />
        <UnemploymentForecastChart data={[] /* populated by forecast agent */} error={error} />
      </div>
    </section>
  )
}
