import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { getLatestLog, readLogTail, getLogMetadata, listAllLogs } from '@/lib/agent/log-reader'

const LOG_DIR = path.join(process.cwd(), 'data', 'agent-logs')

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') as 'improve' | 'insight' | 'heal' | 'forecast' | null
  const logName = searchParams.get('logName')
  const listAll = searchParams.get('list') === 'true'

  if (listAll) {
    const allLogs = listAllLogs()
    const latest = type ? getLatestLog(type) : null
    const lines = latest ? readLogTail(latest, 50) : []
    const meta = latest ? getLogMetadata(latest) : null
    return NextResponse.json({
      allLogs,
      status: meta?.status ?? 'idle',
      logFile: latest,
      lines,
      meta,
    })
  }

  if (logName) {
    const logFile = path.join(LOG_DIR, logName)
    const lines = readLogTail(logFile, 200)
    return NextResponse.json({ lines })
  }

  if (!type) {
    return NextResponse.json({ error: 'type or logName required' }, { status: 400 })
  }

  const logFile = getLatestLog(type)
  if (!logFile) {
    return NextResponse.json({ status: 'idle', logFile: null, lines: [], meta: null })
  }

  const meta = getLogMetadata(logFile)
  const lines = readLogTail(logFile, 50)

  return NextResponse.json({
    status: meta.status,
    logFile,
    lines,
    meta,
  })
}
