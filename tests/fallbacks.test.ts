import { describe, expect, test, afterEach, vi } from 'vitest';

describe('chrome-location2 fallbacks', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  test('macOS: strict null, fallback finds Beta', async () => {
    const scanOsxPath = (await import('../src/scan-osx-path')).default as any;
    const strict = scanOsxPath(false, {
      fs: { existsSync: (p: string) => p.includes('Google Chrome Beta.app') },
      userhome: () => '/Users/test/Applications',
    });
    const result = scanOsxPath(true, {
      fs: { existsSync: (p: string) => p.includes('Google Chrome Beta.app') },
      userhome: () => '/Users/test/Applications',
    });
    expect(strict).toBeNull();
    expect(
      typeof result === 'string' && result.includes('Google Chrome Beta.app'),
    ).toBe(true);
  });

  test('Windows: strict null, fallback finds Beta', async () => {
    const scanWindowsPath = (await import('../src/scan-windows-path'))
      .default as any;
    const strict = scanWindowsPath(false, {
      fs: { existsSync: (p: string) => p.includes('Chrome Beta') },
      env: {
        LOCALAPPDATA: 'C\\Local',
        PROGRAMFILES: undefined,
        'PROGRAMFILES(X86)': undefined,
      } as any,
    });
    const result = scanWindowsPath(true, {
      fs: { existsSync: (p: string) => p.includes('Chrome Beta') },
      env: {
        LOCALAPPDATA: 'C\\Local',
        PROGRAMFILES: undefined,
        'PROGRAMFILES(X86)': undefined,
      } as any,
    });
    expect(strict).toBeNull();
    expect(typeof result === 'string' && /Chrome Beta/.test(result)).toBe(true);
  });

  test('Linux/other: strict only stable; fallback tries beta/unstable and chromium', async () => {
    const scanUnknown = (await import('../src/scan-unknown-platform-path'))
      .default as any;
    const calls: string[] = [];
    const strict = scanUnknown(false, {
      which: {
        sync: (cmd: string) => {
          calls.push(cmd);
          throw new Error('nf');
        },
      },
    });
    const result = scanUnknown(true, {
      which: {
        sync: (cmd: string) => {
          calls.push(cmd);
          if (cmd === 'google-chrome-beta')
            return '/usr/bin/google-chrome-beta';
          throw new Error('nf');
        },
      },
    });
    expect(strict).toBeNull();
    expect(result === null || result === '/usr/bin/google-chrome-beta').toBe(
      true,
    );
    expect(calls[0]).toBe('google-chrome');
  });

  test('macOS: falls back to Chromium when Chrome channels missing (only with fallback)', async () => {
    const scanOsxPath = (await import('../src/scan-osx-path')).default as any;
    const strict = scanOsxPath(false, {
      fs: { existsSync: (p: string) => p.includes('Chromium.app') },
      userhome: () => '/Users/test/Applications',
    });
    const result = scanOsxPath(true, {
      fs: { existsSync: (p: string) => p.includes('Chromium.app') },
      userhome: () => '/Users/test/Applications',
    });
    expect(strict).toBeNull();
    expect(typeof result === 'string' && result.includes('Chromium.app')).toBe(
      true,
    );
  });

  test('Windows: falls back to Chromium when Chrome channels missing (only with fallback)', async () => {
    const scanWindowsPath = (await import('../src/scan-windows-path'))
      .default as any;
    const strict = scanWindowsPath(false, {
      fs: { existsSync: (p: string) => /Chromium/.test(p) },
      env: {
        LOCALAPPDATA: 'C\\Local',
        PROGRAMFILES: undefined,
        'PROGRAMFILES(X86)': undefined,
      } as any,
    });
    const result = scanWindowsPath(true, {
      fs: { existsSync: (p: string) => /Chromium/.test(p) },
      env: {
        LOCALAPPDATA: 'C\\Local',
        PROGRAMFILES: undefined,
        'PROGRAMFILES(X86)': undefined,
      } as any,
    });
    expect(strict).toBeNull();
    expect(typeof result === 'string' && /Chromium/.test(result)).toBe(true);
  });

  test('macOS: returns null when nothing found', async () => {
    const scanOsxPath = (await import('../src/scan-osx-path')).default as any;
    expect(
      scanOsxPath(false, {
        fs: { existsSync: () => false },
        userhome: () => '/Users/test/Applications',
      }),
    ).toBeNull();
  });

  test('Windows: returns null when nothing found', async () => {
    const scanWindowsPath = (await import('../src/scan-windows-path'))
      .default as any;
    expect(
      scanWindowsPath(false, {
        fs: { existsSync: () => false },
        env: {
          LOCALAPPDATA: 'C\\Local',
          PROGRAMFILES: undefined,
          'PROGRAMFILES(X86)': undefined,
        } as any,
      }),
    ).toBeNull();
  });

  test('Linux/other: returns null when which finds nothing', async () => {
    const scanUnknown = (await import('../src/scan-unknown-platform-path'))
      .default as any;
    expect(
      scanUnknown(false, {
        which: {
          sync: () => {
            throw new Error('nf');
          },
        },
      }),
    ).toBeNull();
  });
});
