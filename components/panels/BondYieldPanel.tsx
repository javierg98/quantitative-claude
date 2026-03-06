import { getBondsSection } from '@/lib/data/aggregator'
import { YieldCurveSnapshotChart, YieldCurveHistoryChart, BondYieldComparisonChart } from '@/components/charts'
import { MetricCard } from '@/components/ui/MetricCard'

export async function BondYieldPanel() {
  let data
  let error: string | undefined
  try {
    data = await getBondsSection()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load bond data'
  }

  const tenYear = data?.snapshot.find((s) => s.maturity === '10Y')
  const twoYear = data?.snapshot.find((s) => s.maturity === '2Y')
  const spread = data?.spreadT10Y2Y[data.spreadT10Y2Y.length - 1]

  return (
    <section id="bonds" className="scroll-mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Bond Yield Curve</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <MetricCard
          label="10-Year Yield"
          value={tenYear ? `${tenYear.yield.toFixed(2)}%` : '—'}
        />
        <MetricCard
          label="2-Year Yield"
          value={twoYear ? `${twoYear.yield.toFixed(2)}%` : '—'}
        />
        <MetricCard
          label="10Y-2Y Spread"
          value={spread?.value != null ? `${spread.value.toFixed(2)}%` : '—'}
          trend={spread?.value != null ? (spread.value < 0 ? 'down' : 'up') : 'neutral'}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <YieldCurveSnapshotChart snapshot={data?.snapshot ?? []} error={error} />
        <YieldCurveHistoryChart spreadT10Y2Y={data?.spreadT10Y2Y ?? []} error={error} />
        <BondYieldComparisonChart
          yield2y={data?.historical['DGS2'] ?? []}
          yield10y={data?.historical['DGS10'] ?? []}
          yield30y={data?.historical['DGS30'] ?? []}
          error={error}
        />
      </div>
    </section>
  )
}
