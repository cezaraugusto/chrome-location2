import fs from 'node:fs'
import path from 'node:path'

type FsLike = Pick<typeof fs, 'existsSync' | 'readdirSync' | 'statSync'>
type EnvLike = NodeJS.ProcessEnv

export function resolveFromPuppeteerCache(deps?: {
  fs?: FsLike
  env?: EnvLike
  platform?: NodeJS.Platform
  homeDir?: string
  localAppData?: string
}): string | null {
  const f: FsLike = deps?.fs ?? fs
  const env: EnvLike = deps?.env ?? process.env
  const platform: NodeJS.Platform = deps?.platform ?? process.platform

  try {
    if (platform === 'darwin') {
      const home = deps?.homeDir ?? env.HOME ?? ''
      if (!home) return null
      const base = path.join(home, 'Library', 'Caches', 'puppeteer', 'chrome')
      const candidates = listDirs(f, base)
        .filter((d) => d.startsWith('mac-') || d.startsWith('mac_arm-'))
        .map((d) =>
          path.join(
            base,
            d,
            'Google Chrome for Testing.app',
            'Contents',
            'MacOS',
            'Google Chrome for Testing'
          )
        )
      return firstExisting(f, candidates)
    }

    if (platform === 'win32') {
      const lad = deps?.localAppData ?? env.LOCALAPPDATA
      if (!lad) return null
      const base = path.join(lad, 'puppeteer', 'chrome')
      const dirs = listDirs(f, base)
      // Prefer win64-* if present, then win32-*
      const preferred = [
        ...dirs.filter((d) => d.startsWith('win64-')),
        ...dirs.filter((d) => d.startsWith('win32-'))
      ]
      const candidates = preferred.map((d) => path.join(base, d, 'chrome.exe'))
      return firstExisting(f, candidates)
    }

    // linux and others
    const xdg = env.XDG_CACHE_HOME
    const home = deps?.homeDir ?? env.HOME ?? ''
    const cacheBase = xdg || (home ? path.join(home, '.cache') : undefined)
    if (!cacheBase) return null
    const base = path.join(cacheBase, 'puppeteer', 'chrome')
    const dirs = listDirs(f, base).filter((d) => d.startsWith('linux-'))
    const candidates = dirs.map((d) => path.join(base, d, 'chrome'))
    return firstExisting(f, candidates)
  } catch {
    return null
  }
}

function listDirs(f: FsLike, dir: string): string[] {
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

function firstExisting(f: FsLike, candidates: string[]): string | null {
  for (const c of candidates) {
    try {
      if (c && f.existsSync(c)) return c
    } catch {}
  }
  return null
}
