import { getHousingSection } from '@/lib/data/aggregator'
import { HousingPriceIndexChart, HousingRegionalChart, HousingStartsChart } from '@/components/charts'
import { MetricCard } from '@/components/ui/MetricCard'

export async function HousingPanel() {
  let data
  let error: string | undefined
  try {
    data = await getHousingSection()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load housing data'
  }

  const latestPrice = data?.medianSalePrice[data.medianSalePrice.length - 1]

  return (
    <section id="housing" className="scroll-mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Housing Market</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <MetricCard
          label="Median Sale Price"
          value={
            latestPrice?.value != null
              ? `$${(latestPrice.value / 1000).toFixed(0)}K`
              : '—'
          }
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <HousingPriceIndexChart
          caseShiller={data?.caseShiller ?? []}
          zhvi={data?.zhvi}
          error={error}
        />
        <HousingRegionalChart medianPrice={data?.medianSalePrice ?? []} error={error} />
        <HousingStartsChart data={data?.housingStarts ?? []} error={error} />
      </div>
    </section>
  )
}
