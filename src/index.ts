import scanOsxPath from './scan-osx-path';
import scanWindowsPath from './scan-windows-path';
import scanUnknownPlatformPath from './scan-unknown-platform-path';
import { execFileSync } from 'child_process';
import fs from 'node:fs';
import path from 'node:path';
import { resolveFromPuppeteerCache } from './resolve-puppeteer-cache';

export type FsLike = { existsSync: (p: string) => boolean };
export type WhichLike = { sync: (cmd: string) => string };
export type Deps = {
  fs?: FsLike;
  which?: WhichLike;
  env?: NodeJS.ProcessEnv;
  platform?: NodeJS.Platform;
  // Pass-through for scanOsxPath (optional)
  userhome?: (p: string) => string;
};

export default function locateChrome(
  allowFallbackOrDeps?: boolean | Deps,
  depsMaybe?: Deps,
) {
  const isBoolean = typeof allowFallbackOrDeps === 'boolean';
  const allowFallback = isBoolean ? (allowFallbackOrDeps as boolean) : false;
  const deps: Deps | undefined = isBoolean
    ? depsMaybe
    : (allowFallbackOrDeps as Deps | undefined);

  const f: FsLike = deps?.fs ?? fs;
  const e = deps?.env ?? process.env;
  const platform = deps?.platform ?? process.platform;

  let found: string | null = null;
  switch (platform) {
    case 'darwin':
      found = scanOsxPath(allowFallback, { fs: f, userhome: deps?.userhome });
      break;
    case 'win32':
      found = scanWindowsPath(allowFallback, { fs: f, env: e });
      break;
    default:
      found = scanUnknownPlatformPath(allowFallback, { which: deps?.which });
      break;
  }

  // Try Puppeteer cache
  if (!found) found = resolveFromPuppeteerCache({ fs: f, env: e, platform });

  // Last resort: short, silent CLI probe of @puppeteer/browsers cache path
  // Skip during tests to avoid timeouts and external process spawning
  const isTestEnv =
    e?.NODE_ENV === 'test' ||
    typeof (e as any)?.VITEST !== 'undefined' ||
    typeof (e as any)?.JEST_WORKER_ID !== 'undefined';
  // Allow CLI probing in tests for non-darwin platforms (unit test covers Linux CLI fallback)
  const skipCliProbe = isTestEnv && platform === 'darwin';
  if (!found && !skipCliProbe) found = resolveFromPuppeteerBrowsersCLI();

  return found;
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
    "Alternatively, install Chromium via your system's package manager and re-run.",
  ].join('\n');
}

export function locateChromeOrExplain(
  options?: boolean | { allowFallback?: boolean },
): string {
  const allowFallback =
    typeof options === 'boolean' ? options : Boolean(options?.allowFallback);
  const found = locateChrome(allowFallback) || locateChrome(true);
  if (typeof found === 'string' && found) return found;
  throw new Error(getInstallGuidance());
}

/**
 * Cross-platform Chrome version resolver.
 * - Never executes the browser by default.
 * - Tries to read version from Puppeteer cache paths or platform metadata.
 * - If opts.allowExec is true, may invoke the binary as a last resort (Linux/other).
 */
export function getChromeVersion(
  bin: string,
  opts?: { allowExec?: boolean },
): string | null {
  // 1) Try to extract from Puppeteer cache layout (works on all platforms)
  const fromPptr = extractVersionFromPuppeteerPath(bin);
  if (fromPptr) return fromPptr;

  // 2) Platform-specific metadata (no GUI spawn)
  if (process.platform === 'win32') {
    try {
      const psPath = bin.replace(/'/g, "''");
      const pv = execFileSync(
        'powershell.exe',
        [
          '-NoProfile',
          '-Command',
          `(Get-Item -LiteralPath '${psPath}').VersionInfo.ProductVersion`,
        ],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      ).trim();
      return normalizeVersion(pv);
    } catch {}
    // Optional last resort if explicitly allowed
    if (opts?.allowExec) {
      const v =
        tryExec(bin, ['--product-version']) || tryExec(bin, ['--version']);
      return normalizeVersion(v);
    }
    return null;
  }

  if (process.platform === 'darwin') {
    try {
      // From .../Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing
      // Walk to .../Contents/Info.plist
      const contentsDir = path.dirname(path.dirname(bin));
      const infoPlist = path.join(contentsDir, 'Info.plist');
      if (fs.existsSync(infoPlist)) {
        const xml = fs.readFileSync(infoPlist, 'utf8');
        const v =
          parsePlistString(xml, 'CFBundleShortVersionString') ||
          parsePlistString(xml, 'CFBundleVersion') ||
          '';
        return normalizeVersion(v);
      }
    } catch {}
    if (opts?.allowExec) {
      const v = tryExec(bin, ['--version']);
      return normalizeVersion(v);
    }
    return null;
  }

  // linux and others: prefer Puppeteer path; metadata usually unavailable
  if (opts?.allowExec) {
    const v = tryExec(bin, ['--version']);
    return normalizeVersion(v);
  }
  return null;
}

function extractVersionFromPuppeteerPath(p: string): string | null {
  // .../puppeteer/chrome/<osTag>-<version>/(chrome-win64|chrome-linux*)/chrome(.exe)
  const m = p.match(
    /[\\/]puppeteer[\\/]chrome[\\/](?:mac(?:_arm)?|win(?:32|64)|linux)-(\d+(?:\.\d+)*)(?:[\\/]|$)/i,
  );
  return m ? normalizeVersion(m[1]) : null;
}

function normalizeVersion(s: string | null | undefined): string | null {
  if (!s) return null;
  const m = String(s).match(/(\d+(?:\.\d+){1,3})/);
  return m ? m[1] : null;
}

function parsePlistString(xml: string, key: string): string | null {
  const re = new RegExp(`<key>${key}<\\/key>\\s*<string>([^<]+)<\\/string>`);
  const m = xml.match(re);
  return m ? m[1].trim() : null;
}

function tryExec(bin: string, args: string[]): string | null {
  try {
    return execFileSync(bin, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

function resolveFromPuppeteerBrowsersCLI(): string | null {
  const attempts: Array<{ cmd: string; args: string[] }> = [
    {
      cmd: 'npx',
      args: ['-y', '@puppeteer/browsers', 'path', 'chrome@stable'],
    },
    {
      cmd: 'pnpm',
      args: ['dlx', '@puppeteer/browsers', 'path', 'chrome@stable'],
    },
    {
      cmd: 'yarn',
      args: ['dlx', '@puppeteer/browsers', 'path', 'chrome@stable'],
    },
    { cmd: 'bunx', args: ['@puppeteer/browsers', 'path', 'chrome@stable'] },
  ];

  for (const { cmd, args } of attempts) {
    try {
      const out = execFileSync(cmd, args, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        timeout: 2000,
      }).trim();
      if (out && fs.existsSync(out)) return out;
    } catch {}
  }
  return null;
}
