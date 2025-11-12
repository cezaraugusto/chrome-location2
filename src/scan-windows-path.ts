import fs from 'fs';
import path from 'node:path';

type FsLike = { existsSync: (path: string) => boolean };
type Deps = { fs?: FsLike; env?: NodeJS.ProcessEnv };

export default function scanWindowsPath(allowFallback = false, deps?: Deps) {
  const f: FsLike = deps?.fs ?? fs;
  const env = deps?.env ?? process.env;

  // 0) Environment overrides (Chrome for Testing / Chromium / Chrome)
  const envPath =
    env.CHROME_FOR_TESTING_PATH || env.CHROMIUM_BINARY || env.CHROME_BINARY;

  if (envPath && f.existsSync(envPath)) return envPath;

  const prefixes = [
    env.LOCALAPPDATA,
    env.PROGRAMFILES,
    env['PROGRAMFILES(X86)'],
  ].filter(Boolean);

  const suffixesAll = [
    // Prefer Chrome for Testing if installed in a conventional location
    '\\Google\\Chrome for Testing\\Application\\chrome.exe',
    '\\Google\\Chrome\\Application\\chrome.exe',
    '\\Google\\Chrome Beta\\Application\\chrome.exe',
    '\\Google\\Chrome Dev\\Application\\chrome.exe',
    '\\Google\\Chrome SxS\\Application\\chrome.exe', // Canary
    // Fallback to Chromium as last resort
    '\\Chromium\\Application\\chrome.exe',
  ];

  const suffixes = allowFallback ? suffixesAll : [suffixesAll[0]];

  for (const prefix of prefixes) {
    for (const suffix of suffixes) {
      const exe = path.join(prefix as string, suffix);
      if (f.existsSync(exe)) return exe;
    }
  }

  return null;
}
