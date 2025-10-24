import fs from 'node:fs';
// @ts-expect-error userhome is not typed
import userhome from 'userhome';

export default function scanOsxPath() {
  const apps = [
    { app: 'Google Chrome.app', exec: 'Google Chrome' },
    { app: 'Google Chrome Beta.app', exec: 'Google Chrome Beta' },
    { app: 'Google Chrome Dev.app', exec: 'Google Chrome Dev' },
    { app: 'Google Chrome Canary.app', exec: 'Google Chrome Canary' },
  ];

  const systemBase = '/Applications';
  const userBase = userhome('Applications');

  for (const { app, exec } of apps) {
    const systemPath = `${systemBase}/${app}/Contents/MacOS/${exec}`;
    if (fs.existsSync(systemPath)) return systemPath;

    const userPath = `${userBase}/${app}/Contents/MacOS/${exec}`;
    if (fs.existsSync(userPath)) return userPath;
  }

  // preserve previous behavior of returning a string path under user Applications
  const defaultPath =
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const alternativePath = userhome(defaultPath.slice(1));
  return alternativePath;
}
