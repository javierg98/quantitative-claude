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
  AreaChart,
  Area,
} from 'recharts'

export interface ForecastPoint {
  date: string
  point: number
  lower95: number
  upper95: number
}

interface UnemploymentForecastChartProps {
  data: ForecastPoint[]
  isLoading?: boolean
  error?: string
}

export function UnemploymentForecastChart({ data, isLoading, error }: UnemploymentForecastChartProps) {
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    point: parseFloat(d.point.toFixed(2)),
    lower95: parseFloat(d.lower95.toFixed(2)),
    upper95: parseFloat(d.upper95.toFixed(2)),
  }))

  return (
    <ChartWrapper
      title="Unemployment Forecast"
      subtitle="90-day projection with 95% confidence interval"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUnemployment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
          <Tooltip
            formatter={(v: number | undefined) => `${(v ?? 0).toFixed(2)}%`}
            labelStyle={{ fontSize: 11 }}
            contentStyle={{ fontSize: 11 }}
          />
          <Area
            type="monotone"
            dataKey="upper95"
            stroke="none"
            fill="url(#colorUnemployment)"
            stackId="1"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="lower95"
            stroke="none"
            fill="#fff"
            stackId="2"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="point"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
