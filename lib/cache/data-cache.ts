import fs from 'fs'
import path from 'path'
import type { CachedSeries, Observation } from '@/lib/types/economic-data'

const CACHE_DIR = path.join(process.cwd(), 'data', 'cache')

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }
}

function getCachePath(key: string): string {
  return path.join(CACHE_DIR, `${key}.json`)
}

export function readCache(key: string): CachedSeries | null {
  try {
    ensureCacheDir()
    const filePath = getCachePath(key)
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as CachedSeries
  } catch {
    return null
  }
}

export function writeCache(key: string, data: Omit<CachedSeries, 'seriesId'>): void {
  try {
    ensureCacheDir()
    const filePath = getCachePath(key)
    const cached: CachedSeries = { seriesId: key, ...data }
    fs.writeFileSync(filePath, JSON.stringify(cached, null, 2))
  } catch (err) {
    console.error(`Cache write error for ${key}:`, err)
  }
}

export function isCacheValid(cached: CachedSeries): boolean {
  if (cached.error) return false
  return new Date(cached.expiresAt) > new Date()
}

export function getCachedOrFetch<T extends Observation[]>(
  key: string,
  fetcher: () => Promise<{ data: T; source: CachedSeries['source'] }>,
  ttlSeconds: number
): Promise<CachedSeries> {
  return _getCachedOrFetch(key, fetcher, ttlSeconds)
}

async function _getCachedOrFetch<T extends Observation[]>(
  key: string,
  fetcher: () => Promise<{ data: T; source: CachedSeries['source'] }>,
  ttlSeconds: number
): Promise<CachedSeries> {
  const existing = readCache(key)
  if (existing && isCacheValid(existing)) {
    return existing
  }

  try {
    const { data, source } = await fetcher()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + ttlSeconds * 1000)
    const cached: CachedSeries = {
      seriesId: key,
      fetchedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      data,
      source,
    }
    writeCache(key, cached)
    return cached
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    // Return stale cache with error if available
    if (existing) {
      const withError = { ...existing, error: errorMsg }
      writeCache(key, withError)
      return withError
    }
    const errCached: CachedSeries = {
      seriesId: key,
      fetchedAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
      data: [],
      source: 'FRED',
      error: errorMsg,
    }
    writeCache(key, errCached)
    return errCached
  }
}

export function getAllCacheFiles(): CachedSeries[] {
  try {
    ensureCacheDir()
    const files = fs.readdirSync(CACHE_DIR).filter((f) => f.endsWith('.json'))
    return files.map((f) => {
      const raw = fs.readFileSync(path.join(CACHE_DIR, f), 'utf-8')
      return JSON.parse(raw) as CachedSeries
    })
  } catch {
    return []
  }
}
