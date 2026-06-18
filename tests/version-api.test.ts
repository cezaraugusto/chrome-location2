import {describe, expect, test, vi, beforeEach, afterEach} from 'vitest'

describe('getChromeVersion API (cross-platform, non-exec by default)', () => {
  const originalPlatform = process.platform
  const originalEnv = {...process.env}
  const readMock: any = vi.fn()
  const existsMock: any = vi.fn()
  const execMock: any = vi.fn()

  beforeEach(() => {
    vi.resetModules()
    readMock.mockReset()
    existsMock.mockReset()
    execMock.mockReset()
    vi.doMock('node:fs', () => ({
      default: {
        existsSync: (...args: any[]) => existsMock(...args),
        readFileSync: (...args: any[]) => readMock(...args)
      }
    }))
    vi.doMock('child_process', () => ({
      execFileSync: (...args: any[]) => execMock(...args)
    }))
  })

  afterEach(() => {
    Object.defineProperty(process, 'platform', {value: originalPlatform})
    process.env = {...originalEnv}
    vi.restoreAllMocks()
  })

  it('windows: reads ProductVersion via PowerShell without launching GUI', async () => {
    Object.defineProperty(process, 'platform', {value: 'win32'})
    execMock.mockImplementation((cmd: string, args: string[]) => {
      if (
        cmd === 'powershell.exe' &&
        args.join(' ').includes('ProductVersion')
      ) {
        return '120.0.6099.109'
      }

      if (cmd === 'powershell.exe' && args.join(' ').includes('ProductName')) {
        return 'Google Chrome for Testing'
      }

      throw new Error('unexpected')
    })
    const {getChromeVersion} = await import('../src/index')
    const v = getChromeVersion('C:\\Chrome\\Application\\chrome.exe')

    expect(v).toBe('120.0.6099.109')
    // Ensure no direct binary exec when allowExec=false (default)
    expect(
      execMock.mock.calls.find((c: any[]) => c[0] !== 'powershell.exe')
    ).toBeUndefined()
  })

  it('darwin: reads Info.plist (CFBundleShortVersionString)', async () => {
    Object.defineProperty(process, 'platform', {value: 'darwin'})
    existsMock.mockReturnValue(true)
    readMock.mockReturnValue(`
      <?xml version="1.0" encoding="UTF-8"?>
      <plist version="1.0">
        <dict>
          <key>CFBundleShortVersionString</key>
          <string>120.0.6099.109</string>
        </dict>
      </plist>
    `)
    const {getChromeVersion} = await import('../src/index')
    const v = getChromeVersion(
      '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
    )

    expect(v).toBe('120.0.6099.109')
    expect(execMock).not.toHaveBeenCalled()
  })

  it('linux: no metadata, returns null unless allowExec=true', async () => {
    Object.defineProperty(process, 'platform', {value: 'linux'})
    const {getChromeVersion} = await import('../src/index')
    const v1 = getChromeVersion('/usr/bin/google-chrome')

    expect(v1).toBeNull()
    execMock.mockReturnValue('Google Chrome 120.0.6099.109')
    const v2 = getChromeVersion('/usr/bin/google-chrome', {allowExec: true})

    expect(v2).toBe('120.0.6099.109')
    expect(execMock).toHaveBeenCalled()
  })
})
