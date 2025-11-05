[npm-version-image]: https://img.shields.io/npm/v/chrome-location2.svg?color=0971fe
[npm-version-url]: https://www.npmjs.com/package/chrome-location2
[npm-downloads-image]: https://img.shields.io/npm/dm/chrome-location2.svg?color=2ecc40
[npm-downloads-url]: https://www.npmjs.com/package/chrome-location2
[action-image]: https://github.com/cezaraugusto/chrome-location2/actions/workflows/ci.yml/badge.svg?branch=main
[action-url]: https://github.com/cezaraugusto/chrome-location2/actions

> Approximates the current location of the Chrome browser across platforms.

# chrome-location2 [![Version][npm-version-image]][npm-version-url] [![Downloads][npm-downloads-image]][npm-downloads-url] [![workflow][action-image]][action-url]

<img alt="Chrome" align="right" src="https://cdn.jsdelivr.net/gh/extension-js/media@db5deb23fbfa85530f8146718812972998e13a4d/browser_logos/svg/chrome.svg" width="10.5%" />

* By default checks only `stable`. Optionally can cascade to `beta` / `dev` / `canary`.
* Supports macOS / Windows / Linux
* Works both as an ES module or CommonJS

New in this version:

* Honors environment overrides: `CHROME_FOR_TESTING_PATH`, `CHROMIUM_BINARY`, `CHROME_BINARY`
* On macOS, auto-detects Chrome for Testing at `/Applications/Google Chrome for Testing.app/...`
* Optional helper to throw with a friendly install guide when nothing is found
* Ignores official Google Chrome builds that no longer support `--load-extension` (Chrome ≥137); prefers Chrome for Testing or Chromium
* CLI output is colorized (green on success, red on error)

## Installation

```bash
# Pick one
pnpm add chrome-location2
npm i chrome-location2
yarn add chrome-location2
```

## Support table

This table lists the default locations where Chrome is typically installed for each supported platform and channel. By default, only the Stable channel is checked. When fallback is enabled, the package checks these paths (in order) and returns the first one found.

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

Returns the first existing path found (given selected channels), or <code>null</code> if none are found.

## Usage

**Via Node.js (strict by default):**

```js
import chromeLocation from "chrome-location2";

// Strict (Stable only)
console.log(chromeLocation());
// => "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" or null

// Enable fallback (Stable / Beta / Dev / Canary; includes Chromium on macOS/Windows; Chromium/Chromium-browser on Linux)
console.log(chromeLocation(true));
// => first found among Stable/Beta/Dev/Canary (or Chromium) or null

// Throw with a friendly, copy-pasteable guide when not found
import { locateChromeOrExplain, getInstallGuidance } from "chrome-location2";
try {
  const path = locateChromeOrExplain({ allowFallback: true });
  console.log(path);
} catch (e) {
  console.error(String(e));
  // Or print getInstallGuidance() explicitly
}
```

**CommonJS:**

```js
const api = require('chrome-location2');
const locateChrome = api.default || api;

// Strict (Stable only)
console.log(locateChrome());

// With fallback enabled
console.log(locateChrome(true));

// Helper that throws with guidance
try {
  const p = (api.locateChromeOrExplain || ((o) => locateChrome(o?.allowFallback)) )({ allowFallback: true });
  console.log(p);
} catch (e) {
  console.error(String(e));
}
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
```

Exit behavior:
- Prints the resolved path on success
- Exits with code 1 and prints a guidance message if nothing suitable is found

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

Then re-run your command , we'll detect it automatically.

Alternatively, install Chromium via your system's package manager and re-run.
```

## API

- `default export locateChrome(allowFallback?: boolean): string | null`
  - Returns the first existing path among the selected channels or `null`.
  - When `allowFallback` is `true`, checks Stable → Beta → Dev → Canary. May also consider Chromium depending on platform.

- `locateChromeOrExplain(options?: boolean | { allowFallback?: boolean }): string`
  - Returns a path if found, otherwise throws an `Error` with a friendly installation guide.
  - Rejects official Google Chrome builds that removed `--load-extension` support (Chrome ≥137); prefers Chrome for Testing or Chromium.

- `getInstallGuidance(): string`
  - Returns the same guidance text used by `locateChromeOrExplain()`.

### Environment overrides

If any of these environment variables are set and point to an existing binary, they take precedence:

- `CHROME_FOR_TESTING_PATH`
- `CHROMIUM_BINARY`
- `CHROME_BINARY`

## Related projects

* [brave-location](https://github.com/cezaraugusto/brave-location)
* [edge-location](https://github.com/cezaraugusto/edge-location)
* [firefox-location2](https://github.com/cezaraugusto/firefox-location2)
* [opera-location2](https://github.com/cezaraugusto/opera-location2)
* [vivaldi-location2](https://github.com/cezaraugusto/vivaldi-location2)
* [yandex-location2](https://github.com/cezaraugusto/yandex-location2)

## License

MIT (c) Cezar Augusto.
