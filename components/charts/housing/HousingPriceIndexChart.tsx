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

interface HousingPriceIndexChartProps {
  caseShiller: Observation[]
  zhvi?: Observation[]
  isLoading?: boolean
  error?: string
}

export function HousingPriceIndexChart({ caseShiller, zhvi, isLoading, error }: HousingPriceIndexChartProps) {
  const csMap = new Map(caseShiller.slice(-60).map((d) => [d.date.slice(0, 7), d.value]))
  const zhviMap = new Map((zhvi ?? []).slice(-60).map((d) => [d.date.slice(0, 7), d.value]))

  const allDates = Array.from(new Set([...Array.from(csMap.keys()), ...Array.from(zhviMap.keys())])).sort()
  const chartData = allDates.map((date) => ({
    date,
    caseShiller: csMap.get(date) ?? null,
    zhvi: zhviMap.get(date) != null ? Math.round((zhviMap.get(date) ?? 0) / 1000) : null,
  }))

  return (
    <ChartWrapper
      title="Housing Price Index"
      subtitle="Case-Shiller National HPI vs. Zillow ZHVI (K USD)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={11} />
          <YAxis yAxisId="cs" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis yAxisId="zhvi" orientation="right" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="K" />
          <Tooltip contentStyle={{ fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line yAxisId="cs" type="monotone" dataKey="caseShiller" stroke="#3b82f6" strokeWidth={2} dot={false} name="Case-Shiller" />
          <Line yAxisId="zhvi" type="monotone" dataKey="zhvi" stroke="#10b981" strokeWidth={2} dot={false} name="ZHVI ($K)" />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
