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

interface TradeBalanceChartProps {
  balance: Observation[]
  isLoading?: boolean
  error?: string
}

export function TradeBalanceChart({ balance, isLoading, error }: TradeBalanceChartProps) {
  const chartData = balance.slice(-60).map((d) => ({
    date: d.date.slice(0, 7),
    value: d.value,
  }))

  return (
    <ChartWrapper
      title="US Trade Balance"
      subtitle="Goods and services balance, billions USD (FRED: BOPGSTB)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="tradeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={11} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip formatter={(v: number | undefined) => [`$${(v ?? 0).toFixed(1)}B`, 'Trade Balance']} contentStyle={{ fontSize: 11 }} />
          <ReferenceLine y={0} stroke="#9ca3af" />
          <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} fill="url(#tradeGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
