import { NextRequest, NextResponse } from 'next/server'
import { spawnClaudeAgent } from '@/lib/agent/spawn'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { type?: string; errorContext?: string }
    const type = body.type as 'improve' | 'insight' | 'heal' | 'forecast' | undefined

    if (!type || !['improve', 'insight', 'heal', 'forecast'].includes(type)) {
      return NextResponse.json({ error: 'Invalid agent type' }, { status: 400 })
    }

    const extraEnv: Record<string, string> = {}
    if (type === 'heal' && body.errorContext) {
      extraEnv.HEAL_ERROR_CONTEXT = body.errorContext
    }

    const { pid, logFile } = spawnClaudeAgent(type, extraEnv)
    return NextResponse.json({ success: true, pid, logFile })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
