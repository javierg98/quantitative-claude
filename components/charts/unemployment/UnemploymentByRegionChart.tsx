'use client'

import { ChartWrapper } from '@/components/charts/ChartWrapper'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { Observation } from '@/lib/types/economic-data'

interface UnemploymentByRegionChartProps {
  data: Observation[]
  isLoading?: boolean
  error?: string
}

const COLORS = [
  '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1',
]

export function UnemploymentByRegionChart({ data, isLoading, error }: UnemploymentByRegionChartProps) {
  const chartData = [...data].sort((a, b) => (b.value ?? 0) - (a.value ?? 0))

  return (
    <ChartWrapper
      title="Unemployment by State"
      subtitle="Latest monthly rate, top 10 states by population (BLS)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 32, left: 64, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
          <YAxis dataKey="date" type="category" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={60} />
          <Tooltip
            formatter={(v: number | undefined) => [`${(v ?? 0).toFixed(1)}%`, 'Unemployment']}
            contentStyle={{ fontSize: 11 }}
          />
          <Bar dataKey="value" radius={[0, 3, 3, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
