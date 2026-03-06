'use client'

import type { ReactNode } from 'react'

interface ChartWrapperProps {
  title: string
  subtitle?: string
  isLoading?: boolean
  error?: string
  children: ReactNode
  className?: string
}

export function ChartWrapper({
  title,
  subtitle,
  isLoading,
  error,
  children,
  className = '',
}: ChartWrapperProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="h-2 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            <div className="h-2 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ) : error ? (
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-red-500 font-medium">Data unavailable</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">{error}</p>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
