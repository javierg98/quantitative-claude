'use client'

import { ChartWrapper } from '@/components/charts/ChartWrapper'
import type { MarketQuote } from '@/lib/types/economic-data'

interface CommodityPricesChartProps {
  quotes: MarketQuote[]
  isLoading?: boolean
  error?: string
}

const COMMODITY_META: Record<string, { label: string; unit: string }> = {
  'CL=F': { label: 'Crude Oil (WTI)', unit: '/bbl' },
  'GC=F': { label: 'Gold', unit: '/oz' },
  'SI=F': { label: 'Silver', unit: '/oz' },
  'NG=F': { label: 'Natural Gas', unit: '/MMBtu' },
  'ZC=F': { label: 'Corn', unit: '/bu' },
  'ZW=F': { label: 'Wheat', unit: '/bu' },
}

export function CommodityPricesChart({ quotes, isLoading, error }: CommodityPricesChartProps) {
  return (
    <ChartWrapper
      title="Commodity Prices"
      subtitle="Current spot/front-month futures (Yahoo Finance)"
      isLoading={isLoading}
      error={error}
    >
      <div className="grid grid-cols-2 gap-2 py-2">
        {quotes.map((q) => {
          const meta = COMMODITY_META[q.ticker]
          const isPositive = q.changePercent >= 0
          return (
            <div key={q.ticker} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 truncate">{meta?.label ?? q.ticker}</p>
              <p className="text-base font-bold text-gray-900 mt-1">
                ${q.price > 0 ? q.price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—'}
                <span className="text-xs font-normal text-gray-400 ml-1">{meta?.unit}</span>
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
