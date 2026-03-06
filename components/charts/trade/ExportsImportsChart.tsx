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

interface ExportsImportsChartProps {
  exports: Observation[]
  imports: Observation[]
  isLoading?: boolean
  error?: string
}

export function ExportsImportsChart({ exports: exportsData, imports: importsData, isLoading, error }: ExportsImportsChartProps) {
  const expMap = new Map(exportsData.slice(-40).map((d) => [d.date.slice(0, 7), d.value]))
  const impMap = new Map(importsData.slice(-40).map((d) => [d.date.slice(0, 7), d.value]))
  const allDates = Array.from(new Set([...Array.from(expMap.keys()), ...Array.from(impMap.keys())])).sort().slice(-40)

  const chartData = allDates.map((date) => ({
    date,
    exports: expMap.get(date) ?? null,
    imports: impMap.get(date) ?? null,
  }))

  return (
    <ChartWrapper
      title="Exports & Imports"
      subtitle="US goods and services, billions USD (BEA T40101)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={7} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip formatter={(v: number | undefined) => [`$${(v ?? 0).toFixed(0)}B`]} contentStyle={{ fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="exports" stroke="#10b981" strokeWidth={2} dot={false} name="Exports" />
          <Line type="monotone" dataKey="imports" stroke="#ef4444" strokeWidth={2} dot={false} name="Imports" />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
