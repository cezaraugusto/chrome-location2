import fs from 'fs';
// @ts-expect-error userhome is not typed
import userhome from 'userhome';

type FsLike = { existsSync: (path: string) => boolean };
type Deps = { fs?: FsLike; userhome?: (path: string) => string };

export default function scanOsxPath(allowFallback = false, deps?: Deps) {
  const f: FsLike = deps?.fs ?? fs;
  const uh = deps?.userhome ?? userhome;

  // 0) Environment overrides (Chrome for Testing / Chromium / Chrome)
  const envPath = process.env.CHROME_FOR_TESTING_PATH
    || process.env.CHROMIUM_BINARY
    || process.env.CHROME_BINARY;

  if (envPath && f.existsSync(envPath)) return envPath;

  // 1) Chrome for Testing (well-known macOS App name)
  const cft = '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

  if (f.existsSync(cft)) return cft;

  const chromeChannels = [
    { app: 'Google Chrome.app', exec: 'Google Chrome' },
    { app: 'Google Chrome Beta.app', exec: 'Google Chrome Beta' },
    { app: 'Google Chrome Dev.app', exec: 'Google Chrome Dev' },
    { app: 'Google Chrome Canary.app', exec: 'Google Chrome Canary' },
  ];
  const chromium = { app: 'Chromium.app', exec: 'Chromium' };

  const apps = allowFallback
    ? [...chromeChannels, chromium]
    : [chromeChannels[0]];

  const systemBase = '/Applications';
  const userBase = uh('Applications');

  for (const { app, exec } of apps) {
    const systemPath = `${systemBase}/${app}/Contents/MacOS/${exec}`;
    if (f.existsSync(systemPath)) return systemPath;

    const userPath = `${userBase}/${app}/Contents/MacOS/${exec}`;
    if (f.existsSync(userPath)) return userPath;
  }

  return null;
}
