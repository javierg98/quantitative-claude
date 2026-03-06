'use client'

import { ChartWrapper } from '@/components/charts/ChartWrapper'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Observation } from '@/lib/types/economic-data'

interface ForexHistoricalChartProps {
  eurUsdHistory: Observation[]
  isLoading?: boolean
  error?: string
}

export function ForexHistoricalChart({ eurUsdHistory, isLoading, error }: ForexHistoricalChartProps) {
  const chartData = eurUsdHistory.slice(-90).map((d) => ({
    date: d.date.slice(0, 10),
    value: d.value,
  }))

  return (
    <ChartWrapper
      title="EUR/USD — 90-Day History"
      subtitle="Daily FX rate (Alpha Vantage)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={17} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
          <Tooltip formatter={(v: number | undefined) => [(v ?? 0).toFixed(4), 'EUR/USD']} contentStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
