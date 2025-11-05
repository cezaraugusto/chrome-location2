import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'

describe('version gate for unsupported official Chrome', () => {
  const originalPlatform = process.platform

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    Object.defineProperty(process, 'platform', { value: originalPlatform })
    vi.restoreAllMocks()
  })

  test('locateChromeOrExplain rejects Google Chrome >=137 and throws guidance', async () => {
    Object.defineProperty(process, 'platform', { value: 'linux' })
    vi.doMock('../src/scan-unknown-platform-path', () => ({ default: () => '/usr/bin/google-chrome' }))
    vi.doMock('child_process', () => ({ execFileSync: () => 'Google Chrome 138.0.0.0' }))

    const { locateChromeOrExplain } = await import('../src/index')
    expect(() => locateChromeOrExplain({ allowFallback: true })).toThrow(/Install Chrome for Testing|CHROME_FOR_TESTING_PATH/)
  })
})


