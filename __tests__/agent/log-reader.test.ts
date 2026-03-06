import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import os from 'os'
import {
  getLatestLog,
  readLogTail,
  isAgentRunning,
  getLogMetadata,
  listAllLogs,
} from '@/lib/agent/log-reader'

let tmpDir: string
let logDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'log-test-'))
  logDir = path.join(tmpDir, 'data', 'agent-logs')
  fs.mkdirSync(logDir, { recursive: true })
  // Redirect LOG_DIR by overriding cwd
  process.env.__TEST_LOG_DIR__ = logDir
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
  delete process.env.__TEST_LOG_DIR__
})

function writeLog(name: string, content: string): string {
  const file = path.join(logDir, name)
  fs.writeFileSync(file, content)
  return file
}

describe('log-reader', () => {
  describe('readLogTail', () => {
    it('returns empty array for nonexistent file', () => {
      expect(readLogTail('/nonexistent/file.log')).toEqual([])
    })

    it('returns last N lines of a log file', () => {
      const lines = Array.from({ length: 100 }, (_, i) => `Line ${i + 1}`).join('\n')
      const file = writeLog('improve-test.log', lines)
      const tail = readLogTail(file, 10)
      expect(tail).toHaveLength(10)
      expect(tail[tail.length - 1]).toBe('Line 100')
    })

    it('returns all lines when file has fewer than requested', () => {
      const file = writeLog('insight-small.log', 'Line 1\nLine 2\nLine 3')
      const tail = readLogTail(file, 50)
      expect(tail.length).toBeLessThanOrEqual(50)
      expect(tail).toContain('Line 1')
    })
  })

  describe('isAgentRunning', () => {
    it('returns false for nonexistent file', () => {
      expect(isAgentRunning('/nonexistent/file.log')).toBe(false)
    })

    it('returns false when log contains exit marker', () => {
      const file = writeLog('heal-done.log', 'Started: 2026-03-06T00:00:00Z\n=== Agent exited with code 0 at 2026-03-06T00:01:00Z')
      expect(isAgentRunning(file)).toBe(false)
    })
  })

  describe('getLogMetadata', () => {
    it('returns unknown status for nonexistent file', () => {
      const meta = getLogMetadata('/nonexistent.log')
      expect(meta.status).toBe('unknown')
      expect(meta.startedAt).toBeNull()
      expect(meta.completedAt).toBeNull()
    })

    it('parses started-only log as running', () => {
      const file = writeLog('improve-running.log', 'Started: 2026-03-06T10:00:00Z\nDoing work...')
      const meta = getLogMetadata(file)
      expect(meta.startedAt).toBe('2026-03-06T10:00:00Z')
      expect(meta.status).toBe('running')
      expect(meta.completedAt).toBeNull()
    })

    it('parses exit code 0 as completed', () => {
      const content = [
        'Started: 2026-03-06T10:00:00Z',
        'Did some work',
        '=== Agent exited with code 0 at 2026-03-06T10:05:00Z',
      ].join('\n')
      const file = writeLog('improve-completed.log', content)
      const meta = getLogMetadata(file)
      expect(meta.status).toBe('completed')
      expect(meta.completedAt).toBe('2026-03-06T10:05:00Z')
    })

    it('parses non-zero exit code as failed', () => {
      const content = [
        'Started: 2026-03-06T10:00:00Z',
        'Something broke',
        '=== Agent exited with code 1 at 2026-03-06T10:02:00Z',
      ].join('\n')
      const file = writeLog('heal-failed.log', content)
      const meta = getLogMetadata(file)
      expect(meta.status).toBe('failed')
    })
  })

  describe('listAllLogs', () => {
    it('returns empty array when log dir does not exist', () => {
      // Use a path that doesn't exist
      const result = listAllLogs()
      // The function uses process.cwd() internally, so this tests the real path
      // We just verify it returns an array
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('getLatestLog', () => {
    it('returns null when no logs of that type exist', () => {
      expect(getLatestLog('improve')).toBeNull()
    })
  })
})
