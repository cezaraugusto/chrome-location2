[npm-version-image]: https://img.shields.io/npm/v/chrome-location2.svg?color=0971fe
[npm-version-url]: https://www.npmjs.com/package/chrome-location2
[npm-downloads-image]: https://img.shields.io/npm/dm/chrome-location2.svg?color=2ecc40
[npm-downloads-url]: https://www.npmjs.com/package/chrome-location2
[action-image]: https://github.com/cezaraugusto/chrome-location2/actions/workflows/ci.yml/badge.svg?branch=main
[action-url]: https://github.com/cezaraugusto/chrome-location2/actions

> Approximates the current location of the Chrome browser across platforms.

# chrome-location2 [![Version][npm-version-image]][npm-version-url] [![Downloads][npm-downloads-image]][npm-downloads-url] [![workflow][action-image]][action-url]

<img alt="Chrome" align="right" src="https://cdn.jsdelivr.net/gh/extension-js/media@db5deb23fbfa85530f8146718812972998e13a4d/browser_logos/svg/chrome.svg" width="10.5%" />

- By default checks only `stable`. Optionally can cascade to `beta` / `dev` / `canary`.
- Supports macOS / Windows / Linux
- Works both as an ES module or CommonJS

## Installation

```bash
npm i chrome-location2
```

## Usage

**Via Node.js (strict by default):**

```js
import chromeLocation from 'chrome-location2'

// Strict (Stable only)
console.log(chromeLocation())
// => "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" or null

// Enable fallback (Stable / Beta / Dev / Canary; includes Chromium on macOS/Windows; Chromium/Chromium-browser on Linux)
console.log(chromeLocation(true))
// => first found among Stable/Beta/Dev/Canary (or Chromium) or null

// Throw with a friendly, copy-pasteable guide when not found (path-only resolution; never executes the browser)
import {locateChromeOrExplain, getInstallGuidance, getChromeVersion} from 'chrome-location2'
try {
  const path = locateChromeOrExplain({allowFallback: true})
  console.log(path)

  // Cross-platform version (no exec by default)
  const v = getChromeVersion(path)
  console.log(v) // e.g. "120.0.6099.109" or null

  // Opt-in: allow executing the binary to fetch version on platforms without metadata (e.g. Linux)
  const v2 = getChromeVersion(path, {allowExec: true})
  console.log(v2)
} catch (e) {
  console.error(String(e))
  // Or print getInstallGuidance() explicitly
}
```

**CommonJS:**

```js
const api = require('chrome-location2')
const locateChrome = api.default || api
```

**Via CLI:**

```bash
npx chrome-location2
# Strict (Stable only)

npx chrome-location2 --fallback
# Enable cascade (Stable / Beta / Dev / Canary)

# Short flag
npx chrome-location2 -f

# Respect environment overrides
CHROME_FOR_TESTING_PATH=/custom/path/to/chrome npx chrome-location2

# Print Chrome version instead of path (no exec by default)
npx chrome-location2 --chrome-version

# Allow executing the binary if metadata is unavailable (mainly Linux)
npx chrome-location2 --chrome-version --allow-exec
```

Exit behavior:

- Prints the resolved path on success
- Exits with code 1 and prints a guidance message if nothing suitable is found
- When `--chrome-version` is used: prints version or exits with code 2 if not determinable without exec and `--allow-exec` was not provided

Notes:

- Output is colorized when printed to a TTY (green success, red error)
- After you run `npx @puppeteer/browsers install chrome@stable` once, we auto-detect Chrome for Testing from Puppeteer's cache on all platforms. No env vars needed.

### When nothing is found

The helper returns actionable guidance (Vercel-like tone):

```
We couldn't find a Chrome/Chromium browser on this machine.

Here's the fastest way to get set up:

1) Install Chrome for Testing (recommended)
   npx @puppeteer/browsers install chrome@stable

Then re-run your command, and we'll detect it automatically.

Alternatively, install Chromium via your system's package manager and re-run.
```

## Support table

By default, only the Stable channel is checked. When fallback is enabled, Beta, Dev, and Canary (plus Chromium where applicable) are also checked (in that order) and the first existing path is returned.

<details>
<summary>Default locations checked per platform and channel</summary>

<table>
  <thead>
    <tr>
      <th>Platform</th>
      <th>Channel</th>
      <th>Paths checked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="4" align="center"><img alt="" width="64" height="64" src="https://cdn.jsdelivr.net/gh/extension-js/media@db5deb23fbfa85530f8146718812972998e13a4d/platform_logos/macos.png" /><br><strong>macOS</strong></td>
      <td align="center">Chrome (Stable)</td>
      <td>
        <ul>
          <li><code>/Applications/Google Chrome.app/Contents/MacOS/Google Chrome</code></li>
          <li><code>~/Applications/Google Chrome.app/Contents/MacOS/Google Chrome</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Chrome Beta</td>
      <td>
        <ul>
          <li><code>/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta</code></li>
          <li><code>~/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Chrome Dev</td>
      <td>
        <ul>
          <li><code>/Applications/Google Chrome Dev.app/Contents/MacOS/Google Chrome Dev</code></li>
          <li><code>~/Applications/Google Chrome Dev.app/Contents/MacOS/Google Chrome Dev</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Chrome Canary</td>
      <td>
        <ul>
          <li><code>/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary</code></li>
          <li><code>~/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td rowspan="4" align="center"><img alt="" width="64" height="64" src="https://cdn.jsdelivr.net/gh/extension-js/media@db5deb23fbfa85530f8146718812972998e13a4d/platform_logos/windows.png" /><br><strong>Windows</strong></td>
      <td align="center">Chrome (Stable)</td>
      <td>
        <ul>
          <li><code>%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe</code></li>
          <li><code>%PROGRAMFILES%\\Google\\Chrome\\Application\\chrome.exe</code></li>
          <li><code>%PROGRAMFILES(X86)%\\Google\\Chrome\\Application\\chrome.exe</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Chrome Beta</td>
      <td>
        <ul>
          <li><code>%LOCALAPPDATA%\\Google\\Chrome Beta\\Application\\chrome.exe</code></li>
          <li><code>%PROGRAMFILES%\\Google\\Chrome Beta\\Application\\chrome.exe</code></li>
          <li><code>%PROGRAMFILES(X86)%\\Google\\Chrome Beta\\Application\\chrome.exe</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Chrome Dev</td>
      <td>
        <ul>
          <li><code>%LOCALAPPDATA%\\Google\\Chrome Dev\\Application\\chrome.exe</code></li>
          <li><code>%PROGRAMFILES%\\Google\\Chrome Dev\\Application\\chrome.exe</code></li>
          <li><code>%PROGRAMFILES(X86)%\\Google\\Chrome Dev\\Application\\chrome.exe</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Chrome Canary</td>
      <td>
        <ul>
          <li><code>%LOCALAPPDATA%\\Google\\Chrome SxS\\Application\\chrome.exe</code></li>
          <li><code>%PROGRAMFILES%\\Google\\Chrome SxS\\Application\\chrome.exe</code></li>
          <li><code>%PROGRAMFILES(X86)%\\Google\\Chrome SxS\\Application\\chrome.exe</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td rowspan="4" align="center"><img alt="" width="64" height="64" src="https://cdn.jsdelivr.net/gh/extension-js/media@db5deb23fbfa85530f8146718812972998e13a4d/platform_logos/linux.png" /><br><strong>Linux/other</strong></td>
      <td align="center">Chrome (Stable)</td>
      <td>
        <ul>
          <li><code>google-chrome</code> (on <code>$PATH</code>)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Chrome Beta</td>
      <td>
        <ul>
          <li><code>google-chrome-beta</code> (on <code>$PATH</code>)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Chrome Unstable</td>
      <td>
        <ul>
          <li><code>google-chrome-unstable</code> (on <code>$PATH</code>)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">Chromium</td>
      <td>
        <ul>
          <li><code>chromium-browser</code> / <code>chromium</code> (on <code>$PATH</code>)</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

</details>

Returns the first existing path found (given selected channels), or <code>null</code> if none are found.

## API

- `default export locateChrome(allowFallback?: boolean): string | null`
  - Returns the first existing path among the selected channels or `null`.
  - When `allowFallback` is `true`, checks Stable → Beta → Dev → Canary. May also consider Chromium depending on platform.

- `locateChromeOrExplain(options?: boolean | { allowFallback?: boolean }): string`
  - Returns a path if found, otherwise throws an `Error` with a friendly installation guide.
  - Path resolution never executes the browser.

- `getChromeVersion(bin: string, opts?: { allowExec?: boolean }): string | null`
  - Cross-platform version resolver that does not execute the browser by default.
  - Windows: reads PE file metadata via PowerShell (no GUI spawn).
  - macOS: reads `Info.plist` (no GUI spawn).
  - Linux/other: attempts to infer from Puppeteer cache path; if not available, returns `null` unless `allowExec` is `true`.

- `getInstallGuidance(): string`
  - Returns the same guidance text used by `locateChromeOrExplain()`.

### Environment overrides

If any of these environment variables are set and point to an existing binary, they take precedence:

- `CHROME_FOR_TESTING_PATH`
- `CHROMIUM_BINARY`
- `CHROME_BINARY`

## Related projects

- [brave-location](https://github.com/cezaraugusto/brave-location)
- [chromium-location](https://github.com/cezaraugusto/chromium-location)
- [edge-location](https://github.com/cezaraugusto/edge-location)
- [firefox-location2](https://github.com/cezaraugusto/firefox-location2)
- [safari-location2](https://github.com/cezaraugusto/safari-location2)
- [opera-location2](https://github.com/cezaraugusto/opera-location2)
- [vivaldi-location2](https://github.com/cezaraugusto/vivaldi-location2)
- [waterfox-location](https://github.com/cezaraugusto/waterfox-location)
- [librewolf-location](https://github.com/cezaraugusto/librewolf-location)
- [yandex-location](https://github.com/cezaraugusto/yandex-location)

## License

MIT (c) Cezar Augusto.
