/**
 * Forecasting Model Utilities
 * Provides data extraction and basic statistical functions for the forecast agent.
 * The agent itself will use Python (via Claude Code) for advanced model fitting.
 */

export interface DataPoint {
  date: Date
  value: number
}

export interface ForecastConfig {
  series: string
  title: string
  dataFile: string
  modelHint: 'ARIMA' | 'Prophet' | 'LinearTrend'
}

/**
 * Extract time series from FRED/BLS cache JSON format
 */
export function extractTimeSeriesFromCache(
  cacheData: Record<string, unknown>
): DataPoint[] {
  const points: DataPoint[] = []
  
  // Handle FRED format: { observations: [{ date, value }] }
  if (Array.isArray(cacheData.observations)) {
    for (const obs of cacheData.observations) {
      const obsRecord = obs as Record<string, unknown>
      if (obsRecord.date && obsRecord.value !== null && obsRecord.value !== undefined) {
        const value = typeof obsRecord.value === 'string' ? parseFloat(obsRecord.value as string) : (obsRecord.value as number)
        if (!isNaN(value)) {
          points.push({
            date: new Date(obsRecord.date as string),
            value,
          })
        }
      }
    }
    return points.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  // Handle Yahoo Finance format: { chart: { result: [{ timestamp, close }] } }
  const chartData = cacheData.chart as Record<string, unknown> | undefined
  if (chartData?.result) {
    const result = (chartData.result as Array<Record<string, unknown>>)[0]
    const timestamps = result?.timestamp as number[] | undefined
    const closes = result?.close as number[] | undefined
    if (timestamps && closes) {
      for (let i = 0; i < timestamps.length; i++) {
        const value = closes[i]
        if (value !== null && !isNaN(value)) {
          points.push({
            date: new Date(timestamps[i] * 1000), // Convert Unix timestamp to ms
            value,
          })
        }
      }
      return points.sort((a, b) => a.date.getTime() - b.date.getTime())
    }
  }

  // Handle BLS format: { Results: { series: [{ data: [{ year, period, value }] }] } }
  const results = cacheData.Results as Record<string, unknown> | undefined
  if (results?.series) {
    const series = results.series as Array<Record<string, unknown>>
    if (series[0]) {
      const data = series[0].data as Array<Record<string, unknown>> | undefined
      if (data) {
        for (const point of data) {
          const monthNum = point.period ? parseInt((point.period as string).replace('M', '')) : 1
          const date = new Date(parseInt(point.year as string), monthNum - 1, 1)
          const value = parseFloat(point.value as string)
          if (!isNaN(value)) {
            points.push({ date, value })
          }
        }
        return points.sort((a, b) => a.date.getTime() - b.date.getTime())
      }
    }
  }

  return points
}

/**
 * Detect if series has strong seasonality (12-month cycle)
 */
export function detectSeasonality(values: number[]): boolean {
  if (values.length < 24) return false

  // Simple check: compare variance within months vs between months
  const monthlyGroups: number[][] = Array(12)
    .fill(null)
    .map(() => [])

  for (let i = 0; i < Math.min(values.length, 36); i++) {
    monthlyGroups[i % 12].push(values[values.length - 36 + i])
  }

  const monthlyMeans = monthlyGroups.map((g) => (g.length > 0 ? g.reduce((a, b) => a + b) / g.length : 0))
  const overallMean = values.reduce((a, b) => a + b) / values.length

  // If monthly means vary significantly from overall mean, seasonality exists
  const residual = monthlyMeans.reduce((sum, m) => sum + Math.abs(m - overallMean), 0) / 12
  const threshold = (Math.max(...values) - Math.min(...values)) * 0.1

  return residual > threshold
}

/**
 * Calculate trend direction and slope
 */
export function calculateTrend(
  values: number[]
): { direction: 'up' | 'down' | 'sideways'; slope: number; volatility: number } {
  if (values.length < 2) {
    return { direction: 'sideways', slope: 0, volatility: 0 }
  }

  const n = values.length
  const indices = Array.from({ length: n }, (_, i) => i)

  // Simple linear regression
  const sumX = (n * (n - 1)) / 2
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6
  const sumY = values.reduce((a, b) => a + b, 0)
  const sumXY = indices.reduce((sum, i) => sum + i * values[i], 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const mean = sumY / n
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n
  const volatility = Math.sqrt(variance)

  let direction: 'up' | 'down' | 'sideways' = 'sideways'
  if (slope > volatility * 0.05) direction = 'up'
  else if (slope < -volatility * 0.05) direction = 'down'

  return { direction, slope, volatility }
}

/**
 * Generate simple linear forecast (fallback model)
 */
export function linearForecast(
  values: number[],
  forecastSteps: number
): { point: number[]; lower95: number[]; upper95: number[] } {
  const { slope, volatility } = calculateTrend(values)
  const lastValue = values[values.length - 1]
  const mean = values.reduce((a, b) => a + b) / values.length

  const point: number[] = []
  const lower95: number[] = []
  const upper95: number[] = []

  for (let i = 1; i <= forecastSteps; i++) {
    const pred = lastValue + slope * i
    const stdErr = volatility * Math.sqrt(1 + i / values.length)
    const ci = 1.96 * stdErr

    point.push(pred)
    lower95.push(pred - ci)
    upper95.push(pred + ci)
  }

  return { point, lower95, upper95 }
}

/**
 * Common forecast series configurations
 */
export const FORECAST_CONFIGS: ForecastConfig[] = [
  {
    series: 'UNRATE',
    title: 'Unemployment Rate',
    dataFile: 'fred_UNRATE.json',
    modelHint: 'Prophet',
  },
  {
    series: 'CPIAUCSL',
    title: 'Consumer Price Index',
    dataFile: 'fred_CPIAUCSL.json',
    modelHint: 'ARIMA',
  },
  {
    series: 'GDP',
    title: 'Real Gross Domestic Product',
    dataFile: 'fred_GDP.json',
    modelHint: 'ARIMA',
  },
  {
    series: 'DGS10',
    title: '10-Year Treasury Yield',
    dataFile: 'fred_DGS10.json',
    modelHint: 'ARIMA',
  },
  {
    series: 'HOUST',
    title: 'Housing Starts',
    dataFile: 'fred_HOUST.json',
    modelHint: 'Prophet',
  },
  {
    series: 'MSPUS',
    title: 'Median Home Sale Price',
    dataFile: 'fred_MSPUS.json',
    modelHint: 'ARIMA',
  },
]

export interface ForecastPoint {
  date: string // ISO 8601
  point: number
  lower95: number
  upper95: number
}

export interface SeriesForecast {
  series: string
  seriesTitle: string
  lastObservedValue: number
  lastObservedDate: string
  modelType: string
  forecastPoints: ForecastPoint[]
  modelDiagnostics: {
    dataPointsUsed: number
    seasonalityDetected: boolean
    trendDirection: 'up' | 'down' | 'sideways'
    volatility: number
  }
  riskFactors: string[]
}

export interface ForecastOutput {
  id: string
  generatedAt: string
  forecastHorizon: string
  dataSnapshotDate: string
  forecasts: SeriesForecast[]
  summary: string
}
