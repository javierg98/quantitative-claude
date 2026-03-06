import { getForexSection } from '@/lib/data/aggregator'
import { ForexRatesChart, ForexHistoricalChart } from '@/components/charts'
import { MetricCard } from '@/components/ui/MetricCard'

export async function ForexPanel() {
  let data
  let error: string | undefined
  try {
    data = await getForexSection()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load forex data'
  }

  const eurUsd = data?.rates.find((r) => r.pair === 'EURUSD')

  return (
    <section id="forex" className="scroll-mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Foreign Exchange</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <MetricCard
          label="EUR / USD"
          value={eurUsd?.rate ? eurUsd.rate.toFixed(4) : '—'}
          trend={eurUsd?.changePercent != null ? (eurUsd.changePercent >= 0 ? 'up' : 'down') : 'neutral'}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ForexRatesChart rates={data?.rates ?? []} error={error} />
        <ForexHistoricalChart eurUsdHistory={data?.historicalEURUSD ?? []} error={error} />
      </div>
    </section>
  )
}
