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

interface CommodityHistoricalChartProps {
  oilHistory: Observation[]
  goldHistory: Observation[]
  isLoading?: boolean
  error?: string
}

export function CommodityHistoricalChart({ oilHistory, goldHistory, isLoading, error }: CommodityHistoricalChartProps) {
  const oilMap = new Map(oilHistory.slice(-252).map((d) => [d.date, d.value]))
  const goldMap = new Map(goldHistory.slice(-252).map((d) => [d.date, d.value]))

  const allDates = Array.from(new Set([...Array.from(oilMap.keys()), ...Array.from(goldMap.keys())])).sort().slice(-252)

  const chartData = allDates.map((date) => ({
    date: date.slice(0, 10),
    oil: oilMap.get(date) ?? null,
    gold: goldMap.get(date) != null ? Math.round((goldMap.get(date) ?? 0) / 10) : null,
  }))

  return (
    <ChartWrapper
      title="Oil & Gold — 1-Year History"
      subtitle="WTI crude ($/bbl) vs. Gold ($/10 oz), Yahoo Finance"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={50} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
          <Tooltip contentStyle={{ fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="oil" stroke="#f97316" strokeWidth={2} dot={false} name="WTI Oil ($/bbl)" />
          <Line type="monotone" dataKey="gold" stroke="#f59e0b" strokeWidth={2} dot={false} name="Gold ($/10oz)" strokeDasharray="4 4" />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
