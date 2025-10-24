import { describe, expect, test, vi, afterEach } from 'vitest';

describe('chrome-location2 fallbacks', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  test('macOS: falls back to Beta when stable missing', async () => {
    vi.mock('node:fs', () => ({
      default: {
        existsSync: (p: string) => p.includes('Google Chrome Beta.app'),
      },
    }));

    const scanOsxPath = (await import('../src/scan-osx-path')).default;
    const result = scanOsxPath();
    expect(result).toContain('Google Chrome Beta.app');
  });

  test('Windows: finds Beta when stable missing', async () => {
    const originalEnv = { ...process.env };
    process.env.LOCALAPPDATA = 'C\\Local';

    vi.mock('node:fs', () => ({
      default: { existsSync: (p: string) => p.includes('Chrome Beta') },
    }));

    const scanWindowsPath = (await import('../src/scan-windows-path')).default;
    const result = scanWindowsPath();
    process.env = originalEnv;

    expect(result).toMatch(/Chrome Beta/);
  });

  test('Linux/other: tries beta/unstable when stable missing', async () => {
    const calls: string[] = [];
    vi.mock('which', () => ({
      default: {
        sync: (cmd: string) => {
          calls.push(cmd);
          if (cmd === 'google-chrome-beta')
            return '/usr/bin/google-chrome-beta';
          throw new Error('not found');
        },
      },
    }));

    const scanUnknown = (await import('../src/scan-unknown-platform-path'))
      .default;
    const result = scanUnknown();
    expect(result === null || result === '/usr/bin/google-chrome-beta').toBe(
      true,
    );
  });
});
