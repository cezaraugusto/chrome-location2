import {describe, expect, test, vi, beforeEach, afterEach} from 'vitest'

describe('no version probing during path resolution', () => {
  const originalPlatform = process.platform
  const execMock: any = vi.fn()

  beforeEach(() => {
    vi.resetModules()
    execMock.mockReset()
    vi.doMock('child_process', () => ({
      execFileSync: (...args: any[]) => execMock(...args)
    }))
  })

  afterEach(() => {
    Object.defineProperty(process, 'platform', {value: originalPlatform})
    vi.restoreAllMocks()
  })

  it('locateChromeOrExplain does not spawn the browser binary', async () => {
    Object.defineProperty(process, 'platform', {value: 'linux'})
    vi.doMock('../src/scan-unknown-platform-path', () => ({
      default: () => '/usr/bin/google-chrome'
    }))

    const {locateChromeOrExplain} = await import('../src/index')
    const out = locateChromeOrExplain({allowFallback: true})

    expect(out).toBe('/usr/bin/google-chrome')
    expect(execMock).not.toHaveBeenCalled()
  })
})
