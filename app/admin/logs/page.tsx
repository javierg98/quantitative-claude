'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LogEntry {
  file: string
  type: 'improve' | 'insight' | 'heal'
  name: string
}

const TYPE_COLORS = {
  improve: 'bg-blue-100 text-blue-700',
  insight: 'bg-purple-100 text-purple-700',
  heal: 'bg-green-100 text-green-700',
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [content, setContent] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/agent/status?type=improve&list=true')
      .then((r) => r.json())
      .then((data) => {
        if (data.allLogs) setLogs(data.allLogs)
      })
      .catch(console.error)
  }, [])

  const loadLog = async (logName: string) => {
    setSelected(logName)
    try {
      const res = await fetch(`/api/agent/status?logName=${encodeURIComponent(logName)}`)
      const data = await res.json()
      setContent(data.lines ?? [])
    } catch (e) {
      setContent(['Error loading log file'])
    }
  }

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          ← Admin
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Agent Logs</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Log Files</h2>
          <div className="space-y-1">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-400">No logs yet</p>
            ) : (
              logs.map((log) => (
                <button
                  key={log.name}
                  onClick={() => loadLog(log.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                    selected === log.name ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium mr-2 ${TYPE_COLORS[log.type]}`}>
                    {log.type}
                  </span>
                  {log.name}
                </button>
              ))
            )}
          </div>
        </div>
        <div className="col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Log Content</h2>
          <div className="bg-gray-900 rounded-xl p-4 overflow-auto h-[70vh]">
            <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
              {content.length > 0 ? content.join('\n') : 'Select a log file to view'}
            </pre>
          </div>
        </div>
      </div>
    </main>
  )
}
