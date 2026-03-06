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

interface ConsumerConfidenceChartProps {
  umich: Observation[]
  conferenceboard: Observation[]
  isLoading?: boolean
  error?: string
}

export function ConsumerConfidenceChart({ umich, conferenceboard, isLoading, error }: ConsumerConfidenceChartProps) {
  const umichMap = new Map(umich.slice(-36).map((d) => [d.date.slice(0, 7), d.value]))
  const cbMap = new Map(conferenceboard.slice(-36).map((d) => [d.date.slice(0, 7), d.value]))

  const allDates = Array.from(new Set([...Array.from(umichMap.keys()), ...Array.from(cbMap.keys())])).sort()
  const chartData = allDates.map((date) => ({
    date,
    umich: umichMap.get(date) ?? null,
    cb: cbMap.get(date) ?? null,
  }))

  return (
    <ChartWrapper
      title="Consumer Confidence"
      subtitle="U of Michigan Sentiment vs. Conference Board Index"
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip formatter={(v: number | undefined) => [(v ?? 0).toFixed(1)]} contentStyle={{ fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="umich" stroke="#3b82f6" strokeWidth={2} dot={false} name="U of Michigan" />
          <Line type="monotone" dataKey="cb" stroke="#10b981" strokeWidth={2} dot={false} name="Conference Board" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
