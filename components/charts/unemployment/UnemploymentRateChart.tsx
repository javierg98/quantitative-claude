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
  ReferenceLine,
} from 'recharts'
import type { Observation } from '@/lib/types/economic-data'

interface UnemploymentRateChartProps {
  data: Observation[]
  isLoading?: boolean
  error?: string
}

export function UnemploymentRateChart({ data, isLoading, error }: UnemploymentRateChartProps) {
  const chartData = data.slice(-60).map((d) => ({
    date: d.date.slice(0, 7),
    value: d.value,
  }))

  return (
    <ChartWrapper
      title="US Unemployment Rate"
      subtitle="Seasonally adjusted, % of labor force (FRED: UNRATE)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="unempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={11} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" domain={['auto', 'auto']} />
          <Tooltip
            formatter={(v: number | undefined) => [`${(v ?? 0).toFixed(1)}%`, 'Unemployment Rate']}
            labelStyle={{ fontSize: 11 }}
            contentStyle={{ fontSize: 11 }}
          />
          <ReferenceLine y={4} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Natural rate', fontSize: 9, fill: '#10b981' }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#unempGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
