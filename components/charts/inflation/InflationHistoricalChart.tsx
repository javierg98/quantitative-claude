'use client'

import { ChartWrapper } from '@/components/charts/ChartWrapper'
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { Observation } from '@/lib/types/economic-data'

interface InflationHistoricalChartProps {
  cpi: Observation[]
  pce: Observation[]
  ppi: Observation[]
  isLoading?: boolean
  error?: string
}

function toYoyChange(data: Observation[]): Map<string, number | null> {
  const map = new Map<string, number | null>()
  for (let i = 12; i < data.length; i++) {
    const prev = data[i - 12]
    const curr = data[i]
    const yoy =
      prev?.value && curr.value != null
        ? parseFloat((((curr.value - prev.value) / prev.value) * 100).toFixed(2))
        : null
    map.set(curr.date.slice(0, 7), yoy)
  }
  return map
}

export function InflationHistoricalChart({ cpi, pce, ppi, isLoading, error }: InflationHistoricalChartProps) {
  const cpiMap = toYoyChange(cpi)
  const pceMap = toYoyChange(pce)
  const ppiMap = toYoyChange(ppi)

  const dates = Array.from(new Set([...Array.from(cpiMap.keys()), ...Array.from(pceMap.keys())])).sort().slice(-48)

  const chartData = dates.map((date) => ({
    date,
    cpi: cpiMap.get(date) ?? null,
    pce: pceMap.get(date) ?? null,
    ppi: ppiMap.get(date) ?? null,
  }))

  return (
    <ChartWrapper
      title="Inflation Measures — Historical"
      subtitle="CPI, PCE, PPI year-over-year, last 4 years"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={11} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
          <Tooltip formatter={(v: number | undefined) => [`${(v ?? 0).toFixed(2)}%`]} contentStyle={{ fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="cpi" stroke="#ef4444" strokeWidth={2} dot={false} name="CPI" />
          <Line type="monotone" dataKey="pce" stroke="#3b82f6" strokeWidth={2} dot={false} name="PCE" />
          <Bar dataKey="ppi" fill="#f59e0b" opacity={0.6} name="PPI" />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
