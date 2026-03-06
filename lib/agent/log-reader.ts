import fs from 'fs'
import path from 'path'

const LOG_DIR = path.join(process.cwd(), 'data', 'agent-logs')

export function getLatestLog(type: 'improve' | 'insight' | 'heal' | 'forecast'): string | null {
  try {
    if (!fs.existsSync(LOG_DIR)) return null
    const files = fs
      .readdirSync(LOG_DIR)
      .filter((f) => f.startsWith(`${type}-`) && f.endsWith('.log'))
      .sort()
      .reverse()
    return files[0] ? path.join(LOG_DIR, files[0]) : null
  } catch {
    return null
  }
}

export function readLogTail(logFile: string, lines = 50): string[] {
  try {
    if (!fs.existsSync(logFile)) return []
    const content = fs.readFileSync(logFile, 'utf-8')
    return content.split('\n').slice(-lines)
  } catch {
    return []
  }
}

export function isAgentRunning(logFile: string): boolean {
  try {
    if (!fs.existsSync(logFile)) return false
    const stats = fs.statSync(logFile)
    const content = fs.readFileSync(logFile, 'utf-8')
    // If file was modified in last 30s and doesn't contain "exited" line, consider running
    const ageMs = Date.now() - stats.mtimeMs
    const hasExited = content.includes('=== Agent exited')
    return ageMs < 30000 && !hasExited
  } catch {
    return false
  }
}

export function getLogMetadata(logFile: string): {
  startedAt: string | null
  completedAt: string | null
  status: 'running' | 'completed' | 'failed' | 'unknown'
} {
  try {
    if (!fs.existsSync(logFile)) {
      return { startedAt: null, completedAt: null, status: 'unknown' }
    }
    const content = fs.readFileSync(logFile, 'utf-8')
    const startMatch = content.match(/Started: (.+)/)
    const exitMatch = content.match(/Agent exited with code (\d+) at (.+)/)

    const startedAt = startMatch?.[1] ?? null
    const completedAt = exitMatch?.[2] ?? null
    const exitCode = exitMatch?.[1]

    let status: 'running' | 'completed' | 'failed' | 'unknown' = 'unknown'
    if (exitMatch) {
      status = exitCode === '0' ? 'completed' : 'failed'
    } else if (startedAt) {
      status = 'running'
    }

    return { startedAt, completedAt, status }
  } catch {
    return { startedAt: null, completedAt: null, status: 'unknown' }
  }
}

export function listAllLogs(): Array<{
  file: string
  type: 'improve' | 'insight' | 'heal' | 'forecast'
  name: string
}> {
  try {
    if (!fs.existsSync(LOG_DIR)) return []
    return fs
      .readdirSync(LOG_DIR)
      .filter((f) => f.endsWith('.log'))
      .map((f) => {
        const type: 'improve' | 'insight' | 'heal' | 'forecast' = f.startsWith('improve')
          ? 'improve'
          : f.startsWith('insight')
          ? 'insight'
          : f.startsWith('forecast')
          ? 'forecast'
          : 'heal'
        return { file: path.join(LOG_DIR, f), type, name: f }
      })
      .sort((a, b) => b.name.localeCompare(a.name))
  } catch {
    return []
  }
}
