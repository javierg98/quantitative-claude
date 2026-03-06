import { getConsumerSection } from '@/lib/data/aggregator'
import { ConsumerConfidenceChart, ConsumerSentimentHistoryChart } from '@/components/charts'
import { MetricCard } from '@/components/ui/MetricCard'

export async function ConsumerConfidencePanel() {
  let data
  let error: string | undefined
  try {
    data = await getConsumerSection()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load consumer data'
  }

  const latestUmich = data?.umichSentiment[data.umichSentiment.length - 1]
  const prevUmich = data?.umichSentiment[data.umichSentiment.length - 2]
  const umichChange =
    latestUmich?.value != null && prevUmich?.value != null
      ? (latestUmich.value - prevUmich.value).toFixed(1)
      : undefined

  return (
    <section id="consumer" className="scroll-mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Consumer Confidence</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <MetricCard
          label="U of Michigan Sentiment"
          value={latestUmich?.value != null ? latestUmich.value.toFixed(1) : '—'}
          change={umichChange ? `${Number(umichChange) > 0 ? '+' : ''}${umichChange} MoM` : undefined}
          trend={umichChange ? (Number(umichChange) > 0 ? 'up' : 'down') : 'neutral'}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ConsumerConfidenceChart
          umich={data?.umichSentiment ?? []}
          conferenceboard={data?.conferenceBoardConfidence ?? []}
          error={error}
        />
        <ConsumerSentimentHistoryChart data={data?.umichSentiment ?? []} error={error} />
      </div>
    </section>
  )
}
