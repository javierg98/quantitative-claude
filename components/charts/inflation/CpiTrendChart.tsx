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
  ReferenceLine,
} from 'recharts'
import type { Observation } from '@/lib/types/economic-data'

interface CpiTrendChartProps {
  cpi: Observation[]
  coreCpi: Observation[]
  isLoading?: boolean
  error?: string
}

function toYoyChange(data: Observation[]): { date: string; value: number | null }[] {
  return data.slice(12).map((d, i) => {
    const prev = data[i]
    const yoy =
      prev?.value && d.value != null ? ((d.value - prev.value) / prev.value) * 100 : null
    return { date: d.date.slice(0, 7), value: yoy != null ? parseFloat(yoy.toFixed(2)) : null }
  })
}

export function CpiTrendChart({ cpi, coreCpi, isLoading, error }: CpiTrendChartProps) {
  const cpiYoy = toYoyChange(cpi)
  const coreYoy = toYoyChange(coreCpi)

  const chartData = cpiYoy.slice(-48).map((d, i) => ({
    date: d.date,
    cpi: d.value,
    core: coreYoy[coreYoy.length - 48 + i]?.value ?? null,
  }))

  return (
    <ChartWrapper
      title="CPI Inflation — Year-over-Year"
      subtitle="All items vs. core (ex. food & energy), FRED: CPIAUCSL, CPILFESL"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={11} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
          <Tooltip
            formatter={(v: number | undefined) => [`${(v ?? 0).toFixed(2)}%`]}
            labelStyle={{ fontSize: 11 }}
            contentStyle={{ fontSize: 11 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine y={2} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Fed Target 2%', fontSize: 9, fill: '#10b981' }} />
          <Line type="monotone" dataKey="cpi" stroke="#ef4444" strokeWidth={2} dot={false} name="CPI" />
          <Line type="monotone" dataKey="core" stroke="#f97316" strokeWidth={2} dot={false} name="Core CPI" strokeDasharray="4 4" />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
