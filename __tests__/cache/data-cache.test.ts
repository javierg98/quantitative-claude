import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'fs'
import path from 'path'
import os from 'os'

// We need to stub process.cwd() before importing the module
let tmpDir: string

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>()
  return actual
})

describe('data-cache', () => {
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cache-test-'))
    vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  describe('readCache / writeCache', () => {
    it('returns null when cache file does not exist', async () => {
      const { readCache } = await import('@/lib/cache/data-cache')
      const result = readCache('nonexistent-key')
      expect(result).toBeNull()
    })

    it('writes and reads back a cached series', async () => {
      const { writeCache, readCache } = await import('@/lib/cache/data-cache')
      const now = new Date()
      const expires = new Date(now.getTime() + 3600 * 1000)
      writeCache('test-key', {
        fetchedAt: now.toISOString(),
        expiresAt: expires.toISOString(),
        data: [{ date: '2025-01-01', value: 42 }],
        source: 'FRED',
      })
      const result = readCache('test-key')
      expect(result).not.toBeNull()
      expect(result?.seriesId).toBe('test-key')
      expect(result?.data).toHaveLength(1)
      expect(result?.data[0].value).toBe(42)
    })

    it('written cache includes the seriesId field', async () => {
      const { writeCache, readCache } = await import('@/lib/cache/data-cache')
      const expires = new Date(Date.now() + 3600 * 1000)
      writeCache('my-series', {
        fetchedAt: new Date().toISOString(),
        expiresAt: expires.toISOString(),
        data: [],
        source: 'FRED',
      })
      const result = readCache('my-series')
      expect(result?.seriesId).toBe('my-series')
    })
  })

  describe('isCacheValid', () => {
    it('returns false when cache has an error', async () => {
      const { isCacheValid } = await import('@/lib/cache/data-cache')
      const series = {
        seriesId: 'x',
        fetchedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
        data: [],
        source: 'FRED' as const,
        error: 'something went wrong',
      }
      expect(isCacheValid(series)).toBe(false)
    })

    it('returns false when cache is expired', async () => {
      const { isCacheValid } = await import('@/lib/cache/data-cache')
      const series = {
        seriesId: 'x',
        fetchedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() - 1000).toISOString(),
        data: [],
        source: 'FRED' as const,
      }
      expect(isCacheValid(series)).toBe(false)
    })

    it('returns true when cache is fresh and has no error', async () => {
      const { isCacheValid } = await import('@/lib/cache/data-cache')
      const series = {
        seriesId: 'x',
        fetchedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
        data: [{ date: '2025-01-01', value: 1 }],
        source: 'FRED' as const,
      }
      expect(isCacheValid(series)).toBe(true)
    })
  })

  describe('getCachedOrFetch', () => {
    it('calls fetcher and caches result on cache miss', async () => {
      const { getCachedOrFetch } = await import('@/lib/cache/data-cache')
      const fetcher = vi.fn().mockResolvedValue({
        data: [{ date: '2025-01-01', value: 99 }],
        source: 'FRED' as const,
      })
      const result = await getCachedOrFetch('fresh-key', fetcher, 3600)
      expect(fetcher).toHaveBeenCalledOnce()
      expect(result.data[0].value).toBe(99)
    })

    it('returns cached result without calling fetcher on cache hit', async () => {
      const { writeCache, getCachedOrFetch } = await import('@/lib/cache/data-cache')
      const expires = new Date(Date.now() + 3600 * 1000)
      writeCache('hit-key', {
        fetchedAt: new Date().toISOString(),
        expiresAt: expires.toISOString(),
        data: [{ date: '2024-01-01', value: 7 }],
        source: 'FRED',
      })
      const fetcher = vi.fn()
      const result = await getCachedOrFetch('hit-key', fetcher, 3600)
      expect(fetcher).not.toHaveBeenCalled()
      expect(result.data[0].value).toBe(7)
    })

    it('handles fetcher errors gracefully', async () => {
      const { getCachedOrFetch } = await import('@/lib/cache/data-cache')
      const fetcher = vi.fn().mockRejectedValue(new Error('API down'))
      const result = await getCachedOrFetch('error-key', fetcher, 3600)
      expect(result.error).toBe('API down')
      expect(result.data).toEqual([])
    })
  })
})
