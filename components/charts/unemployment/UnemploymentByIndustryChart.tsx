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

interface UnemploymentByIndustryChartProps {
  payrolls: Observation[]
  isLoading?: boolean
  error?: string
}

export function UnemploymentByIndustryChart({ payrolls, isLoading, error }: UnemploymentByIndustryChartProps) {
  const chartData = payrolls.slice(-36).map((d) => ({
    date: d.date.slice(0, 7),
    value: d.value != null ? Math.round(d.value / 1000) : null,
  }))

  return (
    <ChartWrapper
      title="Total Nonfarm Payrolls"
      subtitle="Seasonally adjusted, millions of jobs (FRED: PAYEMS)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
          <Tooltip
            formatter={(v: number | undefined) => [`${v ?? 0}M jobs`, 'Payrolls']}
            labelStyle={{ fontSize: 11 }}
            contentStyle={{ fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
