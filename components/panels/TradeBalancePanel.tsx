import { getTradeSection } from '@/lib/data/aggregator'
import { TradeBalanceChart, ExportsImportsChart } from '@/components/charts'
import { MetricCard } from '@/components/ui/MetricCard'

export async function TradeBalancePanel() {
  let data
  let error: string | undefined
  try {
    data = await getTradeSection()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load trade data'
  }

  const latestBalance = data?.balance[data.balance.length - 1]
  const prevBalance = data?.balance[data.balance.length - 2]

  return (
    <section id="trade" className="scroll-mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Trade Balance</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <MetricCard
          label="Trade Balance"
          value={latestBalance?.value != null ? `$${latestBalance.value.toFixed(1)}B` : '—'}
          trend={latestBalance?.value != null ? (latestBalance.value > 0 ? 'up' : 'down') : 'neutral'}
          change={
            latestBalance?.value != null && prevBalance?.value != null
              ? `${(latestBalance.value - prevBalance.value) > 0 ? '+' : ''}${(latestBalance.value - prevBalance.value).toFixed(1)}B`
              : undefined
          }
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TradeBalanceChart balance={data?.balance ?? []} error={error} />
        <ExportsImportsChart exports={data?.exports ?? []} imports={data?.imports ?? []} error={error} />
      </div>
    </section>
  )
}
