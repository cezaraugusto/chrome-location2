import fs from 'node:fs'
import path from 'node:path'

type FsLike = Pick<typeof fs, 'existsSync' | 'readdirSync' | 'statSync'>
type EnvLike = NodeJS.ProcessEnv

export function resolveFromPuppeteerCache (deps?: {
  fs?: FsLike;
  env?: EnvLike;
  platform?: NodeJS.Platform;
  homeDir?: string;
  localAppData?: string;
}): string | null {
  const f: FsLike = deps?.fs ?? fs
  const env: EnvLike = deps?.env ?? process.env
  const platform: NodeJS.Platform = deps?.platform ?? process.platform

  try {
    if (platform === 'darwin') {
      const home = deps?.homeDir ?? env.HOME ?? ''
      const bases: string[] = []

      if (home) { bases.push(path.join(home, 'Library', 'Caches', 'puppeteer', 'chrome')) }

      if (env.PUPPETEER_CACHE_DIR) bases.push(env.PUPPETEER_CACHE_DIR)

      bases.push(path.join(process.cwd(), 'chrome'))
      bases.push(
        path.join(process.cwd(), 'dist', 'extension-js', 'chrome-binary')
      )

      for (const base of bases) {
        const dirs = listDirs(f, base).filter(
          (d) =>
            d.startsWith('mac-') ||
            d.startsWith('mac_arm-') ||
            d.startsWith('mac-arm')
        )

        const candidates: string[] = []

        for (const d of dirs) {
          // Newer layouts include chrome-mac or chrome-mac-arm64 subdirectory
          candidates.push(
            path.join(
              base,
              d,
              'chrome-mac',
              'Google Chrome for Testing.app',
              'Contents',
              'MacOS',
              'Google Chrome for Testing'
            )
          )
          candidates.push(
            path.join(
              base,
              d,
              'chrome-mac-arm64',
              'Google Chrome for Testing.app',
              'Contents',
              'MacOS',
              'Google Chrome for Testing'
            )
          )
          // Older/alternate layout without chrome-mac*
          candidates.push(
            path.join(
              base,
              d,
              'Google Chrome for Testing.app',
              'Contents',
              'MacOS',
              'Google Chrome for Testing'
            )
          )
        }

        const hit = firstExisting(f, candidates)

        if (hit) return hit
      }

      return null
    }

    if (platform === 'win32') {
      const lad = deps?.localAppData ?? env.LOCALAPPDATA

      if (!lad) return null

      const base = path.join(lad, 'puppeteer', 'chrome')
      const dirs = listDirs(f, base)
      // Prefer win64-* if present, then win32-*
      const ordered = [
        ...dirs.filter((d) => d.startsWith('win64-')),
        ...dirs.filter((d) => d.startsWith('win32-'))
      ]

      const candidates: string[] = []

      for (const d of ordered) {
        // Typical subfolder layout: chrome-win64/chrome.exe or chrome-win32/chrome.exe
        candidates.push(path.join(base, d, 'chrome-win64', 'chrome.exe'))
        candidates.push(path.join(base, d, 'chrome-win32', 'chrome.exe'))
        // Fallback: direct chrome.exe under the version dir
        candidates.push(path.join(base, d, 'chrome.exe'))
      }

      return firstExisting(f, candidates)
    }

    // Linux and others
    const xdg = env.XDG_CACHE_HOME
    const home = deps?.homeDir ?? env.HOME ?? ''
    const cacheBase = xdg || (home ? path.join(home, '.cache') : undefined)
    const bases = [
      ...(cacheBase ? [path.join(cacheBase, 'puppeteer', 'chrome')] : []),
      env.PUPPETEER_CACHE_DIR || '',
      path.join(process.cwd(), 'chrome'),
      path.join(process.cwd(), 'dist', 'extension-js', 'chrome-binary')
    ].filter(Boolean) as string[]

    for (const base of bases) {
      const dirs = listDirs(f, base).filter((d) => d.startsWith('linux-'))
      const candidates: string[] = []

      for (const d of dirs) {
        // Common subfolder names observed: chrome-linux, chrome-linux64
        candidates.push(path.join(base, d, 'chrome-linux64', 'chrome'))
        candidates.push(path.join(base, d, 'chrome-linux', 'chrome'))
        // Fallback: direct file under the version dir
        candidates.push(path.join(base, d, 'chrome'))
      }

      const hit = firstExisting(f, candidates)

      if (hit) return hit
    }

    return null
  } catch {
    return null
  }
}

function listDirs (f: FsLike, dir: string): string[] {
  try {
    return f
      .readdirSync(dir, {withFileTypes: true} as any)
      .filter((e: any) => {
        if (!e) return false

        const v = (e as any).isDirectory

        return typeof v === 'function' ? v.call(e) : Boolean(v)
      })
      .map((e: any) => e.name || String(e))
  } catch {
    return []
  }
}

function firstExisting (f: FsLike, candidates: string[]): string | null {
  for (const c of candidates) {
    try {
      if (c && f.existsSync(c)) return c
    } catch {}
  }

  return null
}
