export interface KeyMetric {
  name: string
  value: string
  change: string
  signal: 'positive' | 'negative' | 'neutral'
}

export interface Insight {
  id: string
  generatedAt: string
  title: string
  summary: string
  body: string
  keyMetrics: KeyMetric[]
  outlook: string
  riskFactors: string[]
  dataSnapshotDate: string
}
