import fs from 'node:fs';
import path from 'node:path';

export default function scanWindowsPath() {
  const prefixes = [
    process.env.LOCALAPPDATA,
    process.env.PROGRAMFILES,
    process.env['PROGRAMFILES(X86)'],
  ].filter(Boolean);

  const suffixes = [
    '\\Google\\Chrome\\Application\\chrome.exe',
    '\\Google\\Chrome Beta\\Application\\chrome.exe',
    '\\Google\\Chrome Dev\\Application\\chrome.exe',
    '\\Google\\Chrome SxS\\Application\\chrome.exe', // Canary
  ];

  for (const prefix of prefixes) {
    for (const suffix of suffixes) {
      const exe = path.join(prefix as string, suffix);
      if (fs.existsSync(exe)) return exe;
    }
  }

  return null;
}
