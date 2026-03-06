'use server'

import { spawnClaudeAgent } from '@/lib/agent/spawn'
import { getLatestLog, getLogMetadata, readLogTail } from '@/lib/agent/log-reader'

export async function triggerImprovement(): Promise<{ logFile: string; pid: number }> {
  const { logFile, pid } = spawnClaudeAgent('improve')
  return { logFile, pid }
}

export async function triggerInsight(): Promise<{ logFile: string; pid: number }> {
  const { logFile, pid } = spawnClaudeAgent('insight')
  return { logFile, pid }
}

export async function triggerHeal(errorContext: string): Promise<{ logFile: string; pid: number }> {
  const { logFile, pid } = spawnClaudeAgent('heal', {
    HEAL_ERROR_CONTEXT: errorContext,
  })
  return { logFile, pid }
}

export async function triggerForecast(): Promise<{ logFile: string; pid: number }> {
  const { logFile, pid } = spawnClaudeAgent('forecast')
  return { logFile, pid }
}

export async function getAgentStatus(type: 'improve' | 'insight' | 'heal' | 'forecast') {
  const logFile = getLatestLog(type)
  if (!logFile) return { status: 'idle' as const, logFile: null, lines: [], meta: null }
  const meta = getLogMetadata(logFile)
  const lines = readLogTail(logFile, 50)
  return { status: meta.status, logFile, lines, meta }
}
