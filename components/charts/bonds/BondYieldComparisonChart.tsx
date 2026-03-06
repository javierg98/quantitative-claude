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
  Legend,
} from 'recharts'
import type { Observation } from '@/lib/types/economic-data'

interface BondYieldComparisonChartProps {
  yield2y: Observation[]
  yield10y: Observation[]
  yield30y: Observation[]
  isLoading?: boolean
  error?: string
}

export function BondYieldComparisonChart({ yield2y, yield10y, yield30y, isLoading, error }: BondYieldComparisonChartProps) {
  const map2y = new Map(yield2y.slice(-252).map((d) => [d.date, d.value]))
  const map10y = new Map(yield10y.slice(-252).map((d) => [d.date, d.value]))
  const map30y = new Map(yield30y.slice(-252).map((d) => [d.date, d.value]))

  const allDates = Array.from(new Set([...Array.from(map2y.keys()), ...Array.from(map10y.keys()), ...Array.from(map30y.keys())])).sort().slice(-252)

  const chartData = allDates.map((date) => ({
    date: date.slice(0, 10),
    '2Y': map2y.get(date) ?? null,
    '10Y': map10y.get(date) ?? null,
    '30Y': map30y.get(date) ?? null,
  }))

  return (
    <ChartWrapper
      title="Treasury Yield Comparison"
      subtitle="2Y, 10Y, and 30Y yields over past year (FRED)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={50} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" domain={['auto', 'auto']} />
          <Tooltip formatter={(v: number | undefined) => [`${(v ?? 0).toFixed(2)}%`]} contentStyle={{ fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="2Y" stroke="#ef4444" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="10Y" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="30Y" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
