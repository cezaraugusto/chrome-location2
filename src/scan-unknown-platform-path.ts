import which from 'which';

export default function scanUnknownPlatform() {
  const candidates = [
    'google-chrome',
    'google-chrome-beta',
    'google-chrome-unstable', // Canary on some distros
    'chromium-browser',
    'chromium',
  ];

  for (const cmd of candidates) {
    try {
      const resolved = which.sync(cmd);
      if (resolved) return resolved;
    } catch (_) {}
  }

  return null;
}
