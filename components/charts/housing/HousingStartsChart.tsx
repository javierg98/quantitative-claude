'use client'

import { ChartWrapper } from '@/components/charts/ChartWrapper'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Observation } from '@/lib/types/economic-data'

interface HousingStartsChartProps {
  data: Observation[]
  isLoading?: boolean
  error?: string
}

export function HousingStartsChart({ data, isLoading, error }: HousingStartsChartProps) {
  const chartData = data.slice(-36).map((d) => ({
    date: d.date.slice(0, 7),
    value: d.value,
  }))

  return (
    <ChartWrapper
      title="Housing Starts"
      subtitle="Privately-owned housing units started, thousands (FRED: HOUST)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip formatter={(v: number | undefined) => [`${v ?? 0}K`, 'Housing Starts']} contentStyle={{ fontSize: 11 }} />
          <Bar dataKey="value" fill="#10b981" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
