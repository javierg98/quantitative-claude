'use server'

import { getAllCacheFiles } from '@/lib/cache/data-cache'
import type { DataSourceHealth } from '@/lib/types/economic-data'

export async function getDataSourceHealth(): Promise<DataSourceHealth[]> {
  const cacheFiles = getAllCacheFiles()
  const sourceMap = new Map<string, DataSourceHealth>()

  for (const cached of cacheFiles) {
    const existing = sourceMap.get(cached.source) ?? {
      source: cached.source,
      status: 'healthy' as const,
      lastFetch: null,
      seriesCount: 0,
    }

    existing.seriesCount++

    const fetchedAt = cached.fetchedAt
    if (!existing.lastFetch || fetchedAt > existing.lastFetch) {
      existing.lastFetch = fetchedAt
    }

    if (cached.error) {
      existing.status = 'error'
      existing.error = cached.error
    } else {
      const expiresAt = new Date(cached.expiresAt)
      const now = new Date()
      if (expiresAt < now && existing.status !== 'error') {
        existing.status = 'stale'
      }
    }

    sourceMap.set(cached.source, existing)
  }

  // Add any sources with no cache yet
  const allSources = ['FRED', 'BEA', 'BLS', 'YAHOO', 'ZILLOW', 'WORLDBANK']
  for (const source of allSources) {
    if (!sourceMap.has(source)) {
      sourceMap.set(source, {
        source,
        status: 'stale',
        lastFetch: null,
        seriesCount: 0,
      })
    }
  }

  return Array.from(sourceMap.values()).sort((a, b) => a.source.localeCompare(b.source))
}
