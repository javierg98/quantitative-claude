'use client'

import { useState } from 'react'
import type { AgentType } from '@/lib/types/agent-state'

interface AgentStatusCardProps {
  type: AgentType
  label: string
  description: string
  status: 'idle' | 'running' | 'completed' | 'failed' | 'unknown'
  lastRun?: string | null
  onTrigger: () => Promise<void>
  disabled?: boolean
}

const STATUS_CONFIG = {
  idle: { label: 'Idle', color: 'bg-gray-100 text-gray-600' },
  running: { label: 'Running...', color: 'bg-blue-100 text-blue-700 animate-pulse' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700' },
  unknown: { label: 'Unknown', color: 'bg-gray-100 text-gray-500' },
}

export function AgentStatusCard({
  type,
  label,
  description,
  status,
  lastRun,
  onTrigger,
  disabled,
}: AgentStatusCardProps) {
  const [loading, setLoading] = useState(false)
  const { label: statusLabel, color } = STATUS_CONFIG[status]

  const handleTrigger = async () => {
    setLoading(true)
    try {
      await onTrigger()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">{label}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          {lastRun && (
            <p className="text-xs text-gray-400 mt-2">
              Last run: {new Date(lastRun).toLocaleString()}
            </p>
          )}
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${color}`}>
          {statusLabel}
        </span>
      </div>
      <button
        onClick={handleTrigger}
        disabled={loading || status === 'running' || disabled}
        className="mt-4 w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Triggering...' : `Run ${label}`}
      </button>
    </div>
  )
}
