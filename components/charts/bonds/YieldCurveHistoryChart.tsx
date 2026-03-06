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

interface YieldCurveHistoryChartProps {
  spreadT10Y2Y: Observation[]
  isLoading?: boolean
  error?: string
}

export function YieldCurveHistoryChart({ spreadT10Y2Y, isLoading, error }: YieldCurveHistoryChartProps) {
  const chartData = spreadT10Y2Y.slice(-252).map((d) => ({
    date: d.date.slice(0, 10),
    spread: d.value,
  }))

  return (
    <ChartWrapper
      title="10Y-2Y Treasury Spread"
      subtitle="Yield curve inversion indicator — negative = inverted (FRED: T10Y2Y)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="spreadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={50} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
          <Tooltip formatter={(v: number | undefined) => [`${(v ?? 0).toFixed(2)}%`, '10Y-2Y Spread']} contentStyle={{ fontSize: 11 }} />
          <ReferenceLine y={0} stroke="#ef4444" strokeWidth={1.5} label={{ value: 'Inversion', fontSize: 9, fill: '#ef4444' }} />
          <Area type="monotone" dataKey="spread" stroke="#3b82f6" strokeWidth={2} fill="url(#spreadGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
