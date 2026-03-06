'use client'

import { ChartWrapper } from '@/components/charts/ChartWrapper'
import type { ForexRate } from '@/lib/types/economic-data'

interface ForexRatesChartProps {
  rates: ForexRate[]
  isLoading?: boolean
  error?: string
}

const PAIR_LABELS: Record<string, string> = {
  EURUSD: 'EUR / USD',
  USDJPY: 'USD / JPY',
  GBPUSD: 'GBP / USD',
  USDCNY: 'USD / CNY',
  USDCAD: 'USD / CAD',
}

export function ForexRatesChart({ rates, isLoading, error }: ForexRatesChartProps) {
  return (
    <ChartWrapper
      title="Foreign Exchange Rates"
      subtitle="Current rates (Alpha Vantage, 1h cache)"
      isLoading={isLoading}
      error={error}
    >
      <div className="divide-y divide-gray-100">
        {rates.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">No FX data available</p>
        ) : (
          rates.map((r) => {
            const isPositive = r.changePercent >= 0
            return (
              <div key={r.pair} className="flex items-center justify-between py-2.5">
                <span className="text-sm font-medium text-gray-700">
                  {PAIR_LABELS[r.pair] ?? r.pair}
                </span>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">
                    {r.rate > 0 ? r.rate.toFixed(4) : '—'}
                  </span>
                  {r.changePercent !== 0 && (
                    <span className={`text-xs ml-2 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                      {isPositive ? '▲' : '▼'} {Math.abs(r.changePercent).toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </ChartWrapper>
  )
}
