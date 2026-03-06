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
  ReferenceLine,
} from 'recharts'
import type { Observation } from '@/lib/types/economic-data'

interface InflationForecastChartProps {
  cpi: Observation[]
  isLoading?: boolean
  error?: string
}

function toYoyChange(data: Observation[]): { date: string; value: number | null }[] {
  return data.slice(12).map((d, i) => {
    const prev = data[i]
    const yoy =
      prev?.value && d.value != null
        ? parseFloat((((d.value - prev.value) / prev.value) * 100).toFixed(2))
        : null
    return { date: d.date.slice(0, 7), value: yoy }
  })
}

export function InflationForecastChart({ cpi, isLoading, error }: InflationForecastChartProps) {
  const yoyData = toYoyChange(cpi)
  const recent = yoyData.slice(-12)
  const lastValue = recent[recent.length - 1]?.value ?? 2.5
  const trend = recent.length > 2
    ? (recent[recent.length - 1].value ?? 0) - (recent[0].value ?? 0)
    : 0
  const monthlyDrift = trend / Math.max(recent.length - 1, 1)

  const forecast = Array.from({ length: 6 }, (_, i) => {
    const lastDate = new Date(recent[recent.length - 1]?.date + '-01')
    lastDate.setMonth(lastDate.getMonth() + i + 1)
    return {
      date: lastDate.toISOString().slice(0, 7),
      forecast: parseFloat(Math.max(0, lastValue + monthlyDrift * (i + 1)).toFixed(2)),
    }
  })

  const chartData = [
    ...recent.map((d) => ({ date: d.date, actual: d.value })),
    { date: recent[recent.length - 1]?.date ?? '', actual: lastValue, forecast: lastValue },
    ...forecast,
  ]

  return (
    <ChartWrapper
      title="CPI Inflation Trend Forecast"
      subtitle="Recent trend extended 6 months (not a formal projection)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
          <Tooltip formatter={(v: number | undefined) => [`${(v ?? 0).toFixed(2)}%`]} contentStyle={{ fontSize: 11 }} />
          <ReferenceLine y={2} stroke="#10b981" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="actual" stroke="#ef4444" strokeWidth={2} dot={false} name="Actual" />
          <Line type="monotone" dataKey="forecast" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Trend" />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
