import fs from 'node:fs';
// @ts-expect-error userhome is not typed
import userhome from 'userhome';

export default function scanOsxPath() {
  const defaultPath =
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const alternativePath = userhome(defaultPath.slice(1));

  if (fs.existsSync(defaultPath)) return defaultPath;

  return alternativePath;
}
