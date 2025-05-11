import fs from 'node:fs';
import path from 'node:path';

export default function scanWindowsPath() {
  let browserPath = null;

  const prefixes = [
    process.env.LOCALAPPDATA,
    process.env.PROGRAMFILES,
    process.env['PROGRAMFILES(X86)'],
  ];
  const suffix = '\\Google\\Chrome\\Application\\chrome.exe';

  for (const prefix of prefixes) {
    if (!prefix) continue;

    const exe = path.join(prefix, suffix);

    if (fs.existsSync(exe)) {
      browserPath = exe;
      break;
    }
  }

  return browserPath;
}
