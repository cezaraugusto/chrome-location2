import scanOsxPath from './scan-osx-path'
import scanWindowsPath from './scan-windows-path'
import scanUnknownPlatformPath from './scan-unknown-platform-path'
import {execFileSync} from 'child_process'
import fs from 'node:fs'
import {resolveFromPuppeteerCache} from './resolve-puppeteer-cache'

export default function locateChrome(allowFallback = false) {
  let found: string | null = null
  switch (process.platform) {
    case 'darwin':
      found = scanOsxPath(allowFallback)
      break
    case 'win32':
      found = scanWindowsPath(allowFallback)
      break
    default:
      found = scanUnknownPlatformPath(allowFallback)
      break
  }

  // Try Puppeteer cache
  if (!found) found = resolveFromPuppeteerCache()

  // Last resort: short, silent CLI probe of @puppeteer/browsers cache path
  if (!found) found = resolveFromPuppeteerBrowsersCLI()

  return found
}

export function getInstallGuidance(): string {
  return [
    "We couldn't find a Chrome/Chromium browser on this machine.",
    '',
    "Here's the fastest way to get set up:",
    '',
    '1) Install Chrome for Testing (recommended)',
    '   npx @puppeteer/browsers install chrome@stable',
    '',
    "Then re-run your command , we'll detect it automatically.",
    '',
    "Alternatively, install Chromium via your system's package manager and re-run."
  ].join('\n')
}

export function locateChromeOrExplain(
  options?: boolean | {allowFallback?: boolean}
): string {
  const allowFallback =
    typeof options === 'boolean' ? options : Boolean(options?.allowFallback)
  let found = locateChrome(allowFallback) || locateChrome(true)

  // Reject official Google Chrome builds that removed --load-extension (>=137)
  if (typeof found === 'string' && found) {
    const versionLine = getVersionLine(found)
    const major = parseMajor(versionLine)
    if (
      looksOfficialChrome(versionLine) &&
      typeof major === 'number' &&
      major >= 137
    ) {
      found = null as any
    }
  }

  if (typeof found === 'string' && found) return found
  throw new Error(getInstallGuidance())
}

function getVersionLine(bin: string): string {
  try {
    return execFileSync(bin, ['--version'], {encoding: 'utf8'}).trim()
  } catch {
    return ''
  }
}

function looksOfficialChrome(line: string): boolean {
  return /^Google Chrome\s/i.test(line)
}

function parseMajor(line: string): number | undefined {
  const m = line.match(/(\d+)\./)
  return m ? parseInt(m[1], 10) : undefined
}

function resolveFromPuppeteerBrowsersCLI(): string | null {
  try {
    const out = execFileSync(
      'npx',
      ['-y', '@puppeteer/browsers', 'path', 'chrome@stable'],
      {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        timeout: 1500
      }
    ).trim()
    if (out && fs.existsSync(out)) return out
  } catch {}
  return null
}
