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

interface HousingRegionalChartProps {
  medianPrice: Observation[]
  isLoading?: boolean
  error?: string
}

export function HousingRegionalChart({ medianPrice, isLoading, error }: HousingRegionalChartProps) {
  const chartData = medianPrice.slice(-40).map((d) => ({
    date: d.date.slice(0, 7),
    value: d.value != null ? Math.round(d.value / 1000) : null,
  }))

  return (
    <ChartWrapper
      title="Median US Home Sale Price"
      subtitle="Median sales price, thousands USD (FRED: MSPUS)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={7} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="K" />
          <Tooltip formatter={(v: number | undefined) => [`$${v ?? 0}K`, 'Median Price']} contentStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
