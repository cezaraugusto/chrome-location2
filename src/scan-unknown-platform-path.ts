import which from 'which';

type WhichLike = { sync: (cmd: string) => string };
type Deps = { which?: WhichLike };

export default function scanUnknownPlatform(deps?: Deps) {
  const w = deps?.which ?? which;
  const candidates = [
    'google-chrome',
    'google-chrome-beta',
    'google-chrome-unstable', // Canary on some distros
    'chromium-browser',
    'chromium',
  ];

  for (const cmd of candidates) {
    try {
      const resolved = w.sync(cmd);
      if (resolved) return resolved;
    } catch (_) {}
  }

  return null;
}
