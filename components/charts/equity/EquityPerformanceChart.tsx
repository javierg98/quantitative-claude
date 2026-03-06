'use client'

import { ChartWrapper } from '@/components/charts/ChartWrapper'
import type { MarketQuote } from '@/lib/types/economic-data'

interface EquityPerformanceChartProps {
  quotes: MarketQuote[]
  isLoading?: boolean
  error?: string
}

const INDEX_LABELS: Record<string, string> = {
  '^GSPC': 'S&P 500',
  '^IXIC': 'NASDAQ',
  '^RUT': 'Russell 2000',
  '^DJI': 'Dow Jones',
}

export function EquityPerformanceChart({ quotes, isLoading, error }: EquityPerformanceChartProps) {
  const filtered = quotes.filter((q) => q.ticker !== '^VIX')

  return (
    <ChartWrapper
      title="US Equity Market Overview"
      subtitle="Major index levels and daily change"
      isLoading={isLoading}
      error={error}
    >
      <div className="grid grid-cols-2 gap-3 py-2">
        {filtered.map((q) => {
          const isPositive = q.changePercent >= 0
          return (
            <div key={q.ticker} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500">{INDEX_LABELS[q.ticker] ?? q.ticker}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {q.price > 0 ? q.price.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
              </p>
              <p className={`text-xs font-medium mt-0.5 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(q.changePercent).toFixed(2)}%
              </p>
            </div>
          )
        })}
      </div>
    </ChartWrapper>
  )
}
