interface DataStatusBadgeProps {
  status: 'healthy' | 'degraded' | 'error' | 'stale'
  lastUpdated?: string
}

const STATUS_CONFIG = {
  healthy: { label: 'Live', color: 'bg-green-100 text-green-700' },
  degraded: { label: 'Degraded', color: 'bg-yellow-100 text-yellow-700' },
  error: { label: 'Error', color: 'bg-red-100 text-red-700' },
  stale: { label: 'Stale', color: 'bg-gray-100 text-gray-600' },
}

export function DataStatusBadge({ status, lastUpdated }: DataStatusBadgeProps) {
  const { label, color } = STATUS_CONFIG[status]
  return (
    <span
      title={lastUpdated ? `Last updated: ${lastUpdated}` : undefined}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
      {label}
    </span>
  )
}
