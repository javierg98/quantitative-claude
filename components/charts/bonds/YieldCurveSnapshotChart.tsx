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
  ReferenceLine,
} from 'recharts'
import type { YieldPoint } from '@/lib/types/economic-data'

interface YieldCurveSnapshotChartProps {
  snapshot: YieldPoint[]
  isLoading?: boolean
  error?: string
}

export function YieldCurveSnapshotChart({ snapshot, isLoading, error }: YieldCurveSnapshotChartProps) {
  const isInverted =
    snapshot.length >= 2 &&
    snapshot[0].yield > snapshot[snapshot.length - 1].yield

  return (
    <ChartWrapper
      title="US Treasury Yield Curve"
      subtitle={`Current snapshot ${isInverted ? '⚠️ INVERTED' : '(normal)'}`}
      isLoading={isLoading}
      error={error}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={snapshot} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="maturity" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" domain={['auto', 'auto']} />
          <Tooltip
            formatter={(v: number | undefined) => [`${(v ?? 0).toFixed(2)}%`, 'Yield']}
            contentStyle={{ fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="yield"
            stroke={isInverted ? '#ef4444' : '#3b82f6'}
            strokeWidth={2.5}
            dot={{ r: 4, fill: isInverted ? '#ef4444' : '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
