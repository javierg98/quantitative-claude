interface MetricCardProps {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  unit?: string
}

export function MetricCard({ label, value, change, trend, unit }: MetricCardProps) {
  const trendColor =
    trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
  const trendIcon = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
      {change && (
        <p className={`text-xs mt-1 font-medium ${trendColor}`}>
          {trendIcon} {change}
        </p>
      )}
    </div>
  )
}
