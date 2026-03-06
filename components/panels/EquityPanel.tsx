import { getEquitySection } from '@/lib/data/aggregator'
import { EquityPerformanceChart, EquityHistoricalChart, VixChart } from '@/components/charts'
import { MetricCard } from '@/components/ui/MetricCard'

export async function EquityPanel() {
  let data
  let error: string | undefined
  try {
    data = await getEquitySection()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load equity data'
  }

  const sp500 = data?.sp500
  const vix = data?.vix

  return (
    <section id="equity" className="scroll-mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Equity Markets</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <MetricCard
          label="S&P 500"
          value={sp500?.price ? sp500.price.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
          trend={sp500?.changePercent != null ? (sp500.changePercent >= 0 ? 'up' : 'down') : 'neutral'}
          change={sp500?.changePercent != null ? `${sp500.changePercent >= 0 ? '+' : ''}${sp500.changePercent.toFixed(2)}%` : undefined}
        />
        <MetricCard
          label="VIX"
          value={vix?.price ? vix.price.toFixed(2) : '—'}
          trend={vix?.price != null ? (vix.price > 20 ? 'up' : 'neutral') : 'neutral'}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <EquityPerformanceChart
          quotes={[
            data?.sp500 ?? { ticker: '^GSPC', price: 0, change: 0, changePercent: 0 },
            data?.nasdaq ?? { ticker: '^IXIC', price: 0, change: 0, changePercent: 0 },
            data?.russell2000 ?? { ticker: '^RUT', price: 0, change: 0, changePercent: 0 },
            data?.dowJones ?? { ticker: '^DJI', price: 0, change: 0, changePercent: 0 },
          ]}
          error={error}
        />
        <EquityHistoricalChart sp500History={data?.historicalSp500 ?? []} error={error} />
        <VixChart vix={data?.vix ?? { ticker: '^VIX', price: 0, change: 0, changePercent: 0 }} error={error} />
      </div>
    </section>
  )
}
