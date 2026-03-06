import { getCommoditiesSection } from '@/lib/data/aggregator'
import { CommodityPricesChart, CommodityHistoricalChart } from '@/components/charts'
import { MetricCard } from '@/components/ui/MetricCard'

export async function CommoditiesPanel() {
  let data
  let error: string | undefined
  try {
    data = await getCommoditiesSection()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load commodities data'
  }

  const oil = data?.oil
  const gold = data?.gold

  return (
    <section id="commodities" className="scroll-mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Commodities</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <MetricCard
          label="WTI Crude Oil"
          value={oil?.price ? `$${oil.price.toFixed(2)}` : '—'}
          unit="/bbl"
          trend={oil?.changePercent != null ? (oil.changePercent >= 0 ? 'up' : 'down') : 'neutral'}
          change={oil?.changePercent != null ? `${oil.changePercent >= 0 ? '+' : ''}${oil.changePercent.toFixed(2)}%` : undefined}
        />
        <MetricCard
          label="Gold"
          value={gold?.price ? `$${gold.price.toFixed(0)}` : '—'}
          unit="/oz"
          trend={gold?.changePercent != null ? (gold.changePercent >= 0 ? 'up' : 'down') : 'neutral'}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CommodityPricesChart
          quotes={[
            data?.oil ?? { ticker: 'CL=F', price: 0, change: 0, changePercent: 0 },
            data?.gold ?? { ticker: 'GC=F', price: 0, change: 0, changePercent: 0 },
            data?.silver ?? { ticker: 'SI=F', price: 0, change: 0, changePercent: 0 },
            data?.naturalGas ?? { ticker: 'NG=F', price: 0, change: 0, changePercent: 0 },
            data?.corn ?? { ticker: 'ZC=F', price: 0, change: 0, changePercent: 0 },
            data?.wheat ?? { ticker: 'ZW=F', price: 0, change: 0, changePercent: 0 },
          ]}
          error={error}
        />
        <CommodityHistoricalChart
          oilHistory={data?.historicalOil ?? []}
          goldHistory={data?.historicalGold ?? []}
          error={error}
        />
      </div>
    </section>
  )
}
