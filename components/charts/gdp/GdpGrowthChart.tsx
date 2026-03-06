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
  ReferenceLine,
} from 'recharts'
import type { Observation } from '@/lib/types/economic-data'

interface GdpGrowthChartProps {
  data: Observation[]
  isLoading?: boolean
  error?: string
}

export function GdpGrowthChart({ data, isLoading, error }: GdpGrowthChartProps) {
  const chartData = data.slice(-20).map((d) => ({
    date: d.date.slice(0, 7),
    value: d.value,
  }))

  return (
    <ChartWrapper
      title="GDP Growth Rate"
      subtitle="Real GDP, quarterly % change (annualized)"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
          <Tooltip
            formatter={(v: number | undefined) => [`${(v ?? 0).toFixed(1)}%`, 'Growth Rate']}
            labelStyle={{ fontSize: 11 }}
            contentStyle={{ fontSize: 11 }}
          />
          <ReferenceLine y={0} stroke="#9ca3af" />
          <Bar
            dataKey="value"
            fill="#3b82f6"
            radius={[2, 2, 0, 0]}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shape={(props: any) => {
              const { x, y, width, height, value } = props
              const fill = value < 0 ? '#ef4444' : '#3b82f6'
              return <rect x={x} y={y} width={width} height={height} fill={fill} rx={2} />
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
