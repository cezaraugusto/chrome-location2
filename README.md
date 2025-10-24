[npm-version-image]: https://img.shields.io/npm/v/chrome-location2.svg?color=0971fe
[npm-version-url]: https://www.npmjs.com/package/chrome-location2
[npm-downloads-image]: https://img.shields.io/npm/dm/chrome-location2.svg?color=2ecc40
[npm-downloads-url]: https://www.npmjs.com/package/chrome-location2
[action-image]: https://github.com/cezaraugusto/chrome-location2/actions/workflows/ci.yml/badge.svg?branch=main
[action-url]: https://github.com/cezaraugusto/chrome-location2/actions

> Approximates the current location of the Chrome browser across platforms.

# chrome-location2 [![Version][npm-version-image]][npm-version-url] [![Downloads][npm-downloads-image]][npm-downloads-url] [![workflow][action-image]][action-url]

<img alt="Chrome" align="right" src="https://cdn.jsdelivr.net/gh/extension-js/media@db5deb23fbfa85530f8146718812972998e13a4d/browser_logos/svg/chrome.svg" width="10.5%" />

* Finds Chrome in the following channel order: `stable` / `beta` / `dev` / `canary`.
* Supports macOS / Windows / Linux
* Works both as an ES module or CommonJS

## Support table

This table lists the default locations where Chrome is typically installed for each supported platform and channel. The package checks these paths (in order) and returns the first one found. 

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

Returns the first existing path found, or <code>null</code> if none are found.

## Usage

**Via Node.js:**

```js
import chromeLocation from "chrome-location2";

console.log(chromeLocation());
// /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

**Via CLI:**

```bash
npx chrome-location2
# /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

## Related projects

* [chrome-location](https://github.com/hughsk/chrome-location)
* [edge-location](https://github.com/cezaraugusto/edge-location)
* [firefox-location](https://github.com/hughsk/firefox-location)
* [brave-location](https://github.com/cezaraugusto/brave-location)
* [vivaldi-location](https://github.com/jandrey/vivaldi-location)
* [opera-location](https://github.com/jandrey/opera-location)

## License

MIT (c) Cezar Augusto.
