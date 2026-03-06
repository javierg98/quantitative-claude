'use client'

import { ChartWrapper } from '@/components/charts/ChartWrapper'
import type { MarketQuote } from '@/lib/types/economic-data'

interface VixChartProps {
  vix: MarketQuote
  isLoading?: boolean
  error?: string
}

function getVixLevel(price: number): { label: string; color: string; bg: string; description: string } {
  if (price < 15) return { label: 'Low', color: 'text-green-700', bg: 'bg-green-50', description: 'Market calm, low fear' }
  if (price < 20) return { label: 'Moderate', color: 'text-blue-700', bg: 'bg-blue-50', description: 'Normal volatility' }
  if (price < 30) return { label: 'Elevated', color: 'text-yellow-700', bg: 'bg-yellow-50', description: 'Increased uncertainty' }
  if (price < 40) return { label: 'High', color: 'text-orange-700', bg: 'bg-orange-50', description: 'Significant fear' }
  return { label: 'Extreme', color: 'text-red-700', bg: 'bg-red-50', description: 'Market panic' }
}

export function VixChart({ vix, isLoading, error }: VixChartProps) {
  const level = vix.price > 0 ? getVixLevel(vix.price) : null

  return (
    <ChartWrapper
      title="VIX — Volatility Index"
      subtitle="CBOE Volatility Index (Yahoo Finance: ^VIX)"
      isLoading={isLoading}
      error={error}
    >
      <div className="flex flex-col items-center justify-center py-6 gap-3">
        <div className={`rounded-2xl px-6 py-4 ${level?.bg ?? 'bg-gray-50'} text-center`}>
          <p className={`text-5xl font-bold ${level?.color ?? 'text-gray-800'}`}>
            {vix.price > 0 ? vix.price.toFixed(2) : '—'}
          </p>
          <p className={`text-sm font-semibold mt-1 ${level?.color ?? 'text-gray-500'}`}>
            {level?.label ?? ''}
          </p>
          <p className="text-xs text-gray-500 mt-1">{level?.description}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="text-green-600">{'<'}15 Low</span>
          <span className="text-blue-600">15-20 Normal</span>
          <span className="text-yellow-600">20-30 Elevated</span>
          <span className="text-red-600">{'30+'} High</span>
        </div>
      </div>
    </ChartWrapper>
  )
}
