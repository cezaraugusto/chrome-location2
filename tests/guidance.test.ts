import {describe, expect, test, vi, beforeEach, afterEach} from 'vitest'

describe('install guidance and error helper', () => {
  const originalPlatform = process.platform
  const originalEnv = {...process.env}

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    // Restore platform
    Object.defineProperty(process, 'platform', {value: originalPlatform})
    process.env = {...originalEnv}
    vi.restoreAllMocks()
  })

  test('getInstallGuidance has CfT instructions and no CHROMIUM_BINARY', async () => {
    const mod = await import('../src/index')
    const msg = mod.getInstallGuidance()

    expect(msg).toMatch(/@puppeteer\/browsers install chrome@stable/)
    expect(msg).not.toMatch(/CHROME_FOR_TESTING_PATH/)
    expect(msg).not.toMatch(/CHROMIUM_BINARY/)
  })

  test('locateChromeOrExplain throws with guidance when nothing found (darwin)', async () => {
    // Mock darwin platform
    Object.defineProperty(process, 'platform', {value: 'darwin'})
    // Mock scanner to return null
    vi.doMock('../src/scan-osx-path', () => ({default: () => null}))
    const mod = await import('../src/index')

    expect(() => mod.locateChromeOrExplain({allowFallback: true})).toThrow(
      /We couldn't find a Chrome\/Chromium browser/
    )
  })
})
