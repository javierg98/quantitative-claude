'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { AgentStatusCard } from '@/components/ui/AgentStatusCard'
import { DataStatusBadge } from '@/components/ui/DataStatusBadge'

interface AgentStatus {
  status: 'idle' | 'running' | 'completed' | 'failed' | 'unknown'
  logFile: string | null
  lines: string[]
  meta: { startedAt: string | null; completedAt: string | null } | null
}

interface SourceHealth {
  source: string
  status: 'healthy' | 'degraded' | 'error' | 'stale'
  lastFetch: string | null
  error?: string
  seriesCount: number
}

export default function AdminPage() {
  const [improveStatus, setImproveStatus] = useState<AgentStatus | null>(null)
  const [insightStatus, setInsightStatus] = useState<AgentStatus | null>(null)
  const [healStatus, setHealStatus] = useState<AgentStatus | null>(null)
  const [forecastStatus, setForecastStatus] = useState<AgentStatus | null>(null)
  const [health, setHealth] = useState<SourceHealth[]>([])
  const [activeLog, setActiveLog] = useState<string[]>([])
  const [polling, setPolling] = useState(false)

  const fetchStatus = useCallback(async () => {
    try {
      const [imp, ins, hea, fcst] = await Promise.all([
        fetch('/api/agent/status?type=improve').then((r) => r.json()),
        fetch('/api/agent/status?type=insight').then((r) => r.json()),
        fetch('/api/agent/status?type=heal').then((r) => r.json()),
        fetch('/api/agent/status?type=forecast').then((r) => r.json()),
      ])
      setImproveStatus(imp)
      setInsightStatus(ins)
      setHealStatus(hea)
      setForecastStatus(fcst)

      // Show the most recent active log
      const activeAgent = [imp, ins, hea, fcst].find((s: AgentStatus) => s.status === 'running')
      if (activeAgent?.lines) setActiveLog(activeAgent.lines)
      else if (imp?.lines?.length) setActiveLog(imp.lines)
    } catch (e) {
      console.error('Status fetch error:', e)
    }
  }, [])

  const fetchHealth = useCallback(async () => {
    try {
      const data = await fetch('/api/health').then((r) => r.json())
      setHealth(data)
    } catch (e) {
      console.error('Health fetch error:', e)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
    fetchHealth()
  }, [fetchStatus, fetchHealth])

  useEffect(() => {
    const running = [improveStatus, insightStatus, healStatus, forecastStatus].some(
      (s) => s?.status === 'running'
    )
    if (running && !polling) {
      setPolling(true)
      const timer = setInterval(() => {
        fetchStatus()
      }, 3000)
      return () => {
        clearInterval(timer)
        setPolling(false)
      }
    }
  }, [improveStatus, insightStatus, healStatus, forecastStatus, polling, fetchStatus])

  const triggerAgent = async (type: 'improve' | 'insight' | 'heal' | 'forecast') => {
    await fetch('/api/agent/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    })
    setTimeout(fetchStatus, 500)
    setPolling(false)
  }

  const errorSources = health.filter((h) => h.status === 'error')

  return (
    <main className="max-w-screen-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Control Panel</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage self-improvement, insight generation, and self-healing agents
          </p>
        </div>
        <Link href="/admin/logs" className="text-sm text-blue-600 hover:underline">
          View all logs →
        </Link>
      </div>

      {errorSources.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Data Source Errors</h3>
          {errorSources.map((s) => (
            <p key={s.source} className="text-sm text-red-700">
              <strong>{s.source}:</strong> {s.error}
            </p>
          ))}
          <button
            onClick={() => triggerAgent('heal')}
            className="mt-3 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700"
          >
            Trigger Self-Healing
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <AgentStatusCard
          type="improve"
          label="Self-Improvement"
          description="Claude Code reads the codebase, finds gaps, and adds missing chart components"
          status={improveStatus?.status ?? 'idle'}
          lastRun={improveStatus?.meta?.startedAt}
          onTrigger={() => triggerAgent('improve')}
        />
        <AgentStatusCard
          type="insight"
          label="Insight Generation"
          description="Claude Code analyzes latest data and writes structured economic commentary"
          status={insightStatus?.status ?? 'idle'}
          lastRun={insightStatus?.meta?.startedAt}
          onTrigger={() => triggerAgent('insight')}
        />
        <AgentStatusCard
          type="heal"
          label="Self-Healing"
          description="Diagnoses broken data pipelines and fixes 404 / parse errors automatically"
          status={healStatus?.status ?? 'idle'}
          lastRun={healStatus?.meta?.startedAt}
          onTrigger={() => triggerAgent('heal')}
        />
        <AgentStatusCard
          type="forecast"
          label="Forecasting"
          description="Generates 90-day statistical forecasts for key economic indicators"
          status={forecastStatus?.status ?? 'idle'}
          lastRun={forecastStatus?.meta?.startedAt}
          onTrigger={() => triggerAgent('forecast')}
        />
      </div>

      {/* Live Log */}
      {activeLog.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Live Agent Output</h2>
          <div className="bg-gray-900 rounded-xl p-4 overflow-auto max-h-96">
            <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
              {activeLog.join('\n')}
            </pre>
          </div>
        </div>
      )}

      {/* Data Health Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Data Source Health</h2>
          <button
            onClick={fetchHealth}
            className="text-xs text-blue-600 hover:underline"
          >
            Refresh
          </button>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Source</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Series Cached</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Last Fetch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {health.map((source) => (
                <tr key={source.source}>
                  <td className="px-4 py-3 font-medium text-gray-800">{source.source}</td>
                  <td className="px-4 py-3">
                    <DataStatusBadge
                      status={source.status}
                      lastUpdated={source.lastFetch ?? undefined}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{source.seriesCount}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {source.lastFetch
                      ? new Date(source.lastFetch).toLocaleString()
                      : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
