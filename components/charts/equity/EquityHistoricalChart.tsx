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

interface EquityHistoricalChartProps {
  sp500History: Observation[]
  isLoading?: boolean
  error?: string
}

export function EquityHistoricalChart({ sp500History, isLoading, error }: EquityHistoricalChartProps) {
  const chartData = sp500History.slice(-252).map((d) => ({
    date: d.date.slice(0, 10),
    value: d.value,
  }))

  return (
    <ChartWrapper
      title="S&P 500 — 1-Year History"
      subtitle="Daily closing prices (Yahoo Finance)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="spGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={50} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
          <Tooltip
            formatter={(v: number | undefined) => [(v ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 }), 'S&P 500']}
            contentStyle={{ fontSize: 11 }}
          />
          <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#spGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
