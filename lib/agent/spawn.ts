import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

const LOG_DIR = path.join(process.cwd(), 'data', 'agent-logs')

export function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true })
  }
}

export function getLogFilePath(type: 'improve' | 'insight' | 'heal' | 'forecast'): string {
  ensureLogDir()
  return path.join(LOG_DIR, `${type}-${Date.now()}.log`)
}

export interface SpawnResult {
  pid: number
  logFile: string
}

export function spawnClaudeAgent(
  promptType: 'improve' | 'insight' | 'heal' | 'forecast',
  extraEnv?: Record<string, string>
): SpawnResult {
  const promptPath = path.join(process.cwd(), '.claude', 'prompts', `${promptType}.md`)
  const logFile = getLogFilePath(promptType)

  if (!fs.existsSync(promptPath)) {
    throw new Error(`Prompt file not found: ${promptPath}`)
  }

  const promptContent = fs.readFileSync(promptPath, 'utf-8')

  const logStream = fs.createWriteStream(logFile, { flags: 'a' })
  logStream.write(`=== Claude Agent: ${promptType} ===\n`)
  logStream.write(`Started: ${new Date().toISOString()}\n`)
  logStream.write(`Prompt: ${promptPath}\n`)
  logStream.write(`===\n\n`)

  const proc = spawn(
    'claude',
    ['--dangerously-skip-permissions', '--print', '-p', promptContent],
    {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        ...extraEnv,
      },
      detached: true,
    }
  )

  proc.stdout?.pipe(logStream)
  proc.stderr?.on('data', (data: Buffer) => {
    logStream.write(`[STDERR] ${data.toString()}`)
  })

  proc.on('close', (code) => {
    logStream.write(`\n\n=== Agent exited with code ${code} at ${new Date().toISOString()} ===\n`)
    logStream.end()
  })

  proc.unref()

  return { pid: proc.pid ?? 0, logFile }
}
