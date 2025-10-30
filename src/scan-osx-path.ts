import fs from 'fs';
// @ts-expect-error userhome is not typed
import userhome from 'userhome';

type FsLike = { existsSync: (path: string) => boolean };
type Deps = { fs?: FsLike; userhome?: (path: string) => string };

export default function scanOsxPath(allowFallback = false, deps?: Deps) {
  const f: FsLike = deps?.fs ?? fs;
  const uh = deps?.userhome ?? userhome;
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
