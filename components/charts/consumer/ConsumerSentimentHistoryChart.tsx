'use client'

import { ChartWrapper } from '@/components/charts/ChartWrapper'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Observation } from '@/lib/types/economic-data'

interface ConsumerSentimentHistoryChartProps {
  data: Observation[]
  isLoading?: boolean
  error?: string
}

export function ConsumerSentimentHistoryChart({ data, isLoading, error }: ConsumerSentimentHistoryChartProps) {
  const chartData = data.slice(-120).map((d) => ({
    date: d.date.slice(0, 7),
    value: d.value,
  }))

  return (
    <ChartWrapper
      title="U of Michigan Sentiment — 10-Year History"
      subtitle="Consumer sentiment index (FRED: UMCSENT)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={23} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[40, 120]} />
          <Tooltip formatter={(v: number | undefined) => [(v ?? 0).toFixed(1), 'Sentiment']} contentStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#sentGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
