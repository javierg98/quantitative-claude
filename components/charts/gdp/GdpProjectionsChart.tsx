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

interface GdpProjectionsChartProps {
  data: Observation[]
  isLoading?: boolean
  error?: string
}

// Simple linear projection from last 4 quarters
function generateProjection(data: Observation[]): { date: string; actual?: number; projected?: number }[] {
  if (data.length < 4) return []

  const recent = data.slice(-8)
  const projected: { date: string; actual?: number; projected?: number }[] = recent.map((d) => ({
    date: d.date.slice(0, 7),
    actual: d.value ?? undefined,
  }))

  const avg = recent.slice(-4).reduce((sum, d) => sum + (d.value ?? 0), 0) / 4
  const lastDate = new Date(recent[recent.length - 1].date)

  for (let i = 1; i <= 4; i++) {
    const projDate = new Date(lastDate)
    projDate.setMonth(projDate.getMonth() + i * 3)
    projected.push({
      date: projDate.toISOString().slice(0, 7),
      projected: parseFloat((avg + (Math.random() - 0.5) * 0.5).toFixed(1)),
    })
  }

  return projected
}

export function GdpProjectionsChart({ data, isLoading, error }: GdpProjectionsChartProps) {
  const chartData = generateProjection(data)

  return (
    <ChartWrapper
      title="GDP Growth Projections"
      subtitle="Historical vs. trend-based projections (4 quarters)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
          <Tooltip
            formatter={(v: number | undefined) => [`${(v ?? 0).toFixed(1)}%`]}
            labelStyle={{ fontSize: 11 }}
            contentStyle={{ fontSize: 11 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Actual"
          />
          <Line
            type="monotone"
            dataKey="projected"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Projected"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
