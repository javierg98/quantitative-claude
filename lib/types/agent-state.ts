export type AgentType = 'improve' | 'insight' | 'heal' | 'forecast'
export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed'

export interface AgentRun {
  id: string
  type: AgentType
  status: AgentStatus
  startedAt: string
  completedAt?: string
  logFile: string
  pid?: number
}

export interface AgentState {
  improve: AgentRun | null
  insight: AgentRun | null
  heal: AgentRun | null
  forecast: AgentRun | null
}

export interface LogLine {
  line: string
  index: number
}
