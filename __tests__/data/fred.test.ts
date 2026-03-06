import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import os from 'os'

let tmpDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fred-test-'))
  vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe('fred data client', () => {
  describe('getGdpGrowthRate', () => {
    it('returns error series when FRED_API_KEY is not set', async () => {
      vi.stubEnv('FRED_API_KEY', '')
      const { getGdpGrowthRate } = await import('@/lib/data/fred')
      const result = await getGdpGrowthRate()
      expect(result.error).toContain('FRED_API_KEY not configured')
      expect(result.data).toEqual([])
    })

    it('fetches and caches GDP growth data', async () => {
      const mockObservations = [
        { date: '2024-01-01', value: '2.5' },
        { date: '2024-04-01', value: '3.1' },
      ]
      vi.stubEnv('FRED_API_KEY', 'test-key')
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ observations: mockObservations }),
      }))

      const { getGdpGrowthRate } = await import('@/lib/data/fred')
      const result = await getGdpGrowthRate()

      expect(result.data).toHaveLength(2)
      expect(result.data[0].value).toBe(2.5)
      expect(result.data[1].value).toBe(3.1)
      expect(result.source).toBe('FRED')
    })
  })

  describe('getCpi', () => {
    it('filters out missing values (dots)', async () => {
      const mockObservations = [
        { date: '2024-01-01', value: '310.5' },
        { date: '2024-02-01', value: '.' },
        { date: '2024-03-01', value: '311.2' },
      ]
      vi.stubEnv('FRED_API_KEY', 'test-key')
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ observations: mockObservations }),
      }))

      const { getCpi } = await import('@/lib/data/fred')
      const result = await getCpi()

      expect(result.data).toHaveLength(2)
      expect(result.data.every((o) => o.value !== null)).toBe(true)
    })
  })

  describe('getUnemploymentRate', () => {
    it('returns error series on API failure', async () => {
      vi.stubEnv('FRED_API_KEY', 'test-key')
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
      }))

      const { getUnemploymentRate } = await import('@/lib/data/fred')
      const result = await getUnemploymentRate()

      expect(result.error).toContain('429')
      expect(result.data).toEqual([])
    })
  })

  describe('getAllYieldCurve', () => {
    it('returns an object keyed by series ID', async () => {
      vi.stubEnv('FRED_API_KEY', 'test-key')
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ observations: [{ date: '2026-03-01', value: '4.5' }] }),
      }))

      const { getAllYieldCurve } = await import('@/lib/data/fred')
      const result = await getAllYieldCurve()

      expect(result).toHaveProperty('DGS10')
      expect(result).toHaveProperty('DGS2')
      expect(result).toHaveProperty('DGS30')
    })
  })
})
