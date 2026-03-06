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

interface GdpHistoricalChartProps {
  data: Observation[]
  isLoading?: boolean
  error?: string
}

export function GdpHistoricalChart({ data, isLoading, error }: GdpHistoricalChartProps) {
  const chartData = data.map((d) => ({
    date: d.date.slice(0, 7),
    value: d.value != null ? Math.round((d.value / 1000)) : null,
  }))

  return (
    <ChartWrapper
      title="GDP Level"
      subtitle="Nominal GDP, billions USD"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="T" tickFormatter={(v) => `$${v}T`} />
          <Tooltip
            formatter={(v: number | undefined) => [`$${v ?? 0}T`, 'GDP']}
            labelStyle={{ fontSize: 11 }}
            contentStyle={{ fontSize: 11 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#gdpGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
