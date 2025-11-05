import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'

// exec mock is shared via factory so we can assert call counts
const execMock: any = vi.fn()
vi.mock('node:child_process', () => ({
  execFileSync: (...args: any[]) => execMock(...args),
}))

describe('CLI fallback (npx @puppeteer/browsers path)', () => {
  const originalPlatform = process.platform
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.resetModules()
    execMock.mockReset()
  })

  afterEach(() => {
    Object.defineProperty(process, 'platform', { value: originalPlatform })
    process.env = { ...originalEnv }
    vi.restoreAllMocks()
  })

  test('uses CLI fallback when standard + cache fail', async () => {
    // Force linux platform to use scan-unknown
    Object.defineProperty(process, 'platform', { value: 'linux' })

    // Make platform scanners return null
    vi.doMock('../src/scan-unknown-platform-path', () => ({ default: () => null }))

    // Make cache resolver return null
    vi.doMock('../src/resolve-puppeteer-cache', () => ({ resolveFromPuppeteerCache: () => null }))

    // Mock execFileSync to return a fake path
    execMock.mockReturnValue('/tmp/cft/chrome')

    // Stub fs.existsSync to true for returned path
    vi.doMock('node:fs', () => ({ default: { existsSync: (p: string) => p === '/tmp/cft/chrome' } }))

    const mod = await import('../src/index')
    const out = mod.default(false)
    expect(out).toBe('/tmp/cft/chrome')
    expect(execMock).toHaveBeenCalled()
  })

  test('does not call CLI when cache finds a path', async () => {
    Object.defineProperty(process, 'platform', { value: 'linux' })
    vi.doMock('../src/scan-unknown-platform-path', () => ({ default: () => null }))
    vi.doMock('../src/resolve-puppeteer-cache', () => ({ resolveFromPuppeteerCache: () => '/from/cache/chrome' }))
    execMock.mockImplementation(() => '' as any)

    const mod = await import('../src/index')
    const out = mod.default(false)
    expect(out).toBe('/from/cache/chrome')
    expect(execMock).not.toHaveBeenCalled()
  })
})
