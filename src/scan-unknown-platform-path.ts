import which from 'which';

type WhichLike = { sync: (cmd: string) => string };
type Deps = { which?: WhichLike };

export default function scanUnknownPlatform(
  allowFallback = false,
  deps?: Deps,
) {
  const w = deps?.which ?? which;

  // 0) Environment overrides (Chrome for Testing / Chromium / Chrome)
  const rawEnv = [
    process.env.CHROME_FOR_TESTING_PATH,
    process.env.CHROMIUM_BINARY,
    process.env.CHROME_BINARY,
  ];
  const envPath = rawEnv.find((v) => {
    if (!v) return false;
    const s = String(v).trim().toLowerCase();
    return s.length > 0 && s !== 'undefined' && s !== 'null';
  });
  if (envPath) {
    try {
      // If it's on PATH as a command, resolve; otherwise use as a file path
      const maybeCmd = w.sync(envPath);
      if (maybeCmd) return maybeCmd;
    } catch (_) {}
    return envPath;
  }
  const stable = ['google-chrome'];
  const fallbacks = [
    // Prefer CfT commands if present
    'google-chrome-for-testing',
    'chrome-for-testing',
    'google-chrome-beta',
    'google-chrome-unstable',
    'chromium-browser',
    'chromium',
  ];
  const candidates = allowFallback ? [...stable, ...fallbacks] : stable;

  for (const cmd of candidates) {
    try {
      const resolved = w.sync(cmd);
      if (resolved) return resolved;
    } catch (_) {}
  }

  return null;
}
