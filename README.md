[npm-image]: https://img.shields.io/npm/v/chrome-location2.svg
[npm-url]: https://npmjs.org/package/chrome-location2
[action-image]: https://github.com/cezaraugusto/chrome-location2/workflows/CI/badge.svg
[action-url]: https://github.com/cezaraugusto/chrome-location2/actions?query=workflow%3ACI
[downloads-image]: https://img.shields.io/npm/dm/chrome-location2.svg
[downloads-url]: https://npmjs.org/package/chrome-location2

# chrome-location2 [![npm][npm-image]][npm-url] [![workflow][action-image]][action-url] [![downloads][downloads-image]][downloads-url] 

> Approximates the current location of the Chrome browser across platforms.

# Usage

**Via Node.js:**

```js
// ESM
import chromeLocation from 'chrome-location2'

// Returns the path to Chrome as a string
console.log(chromeLocation())
// /Applications/Google Chrome.app/Contents/MacOS/Google Chrome


// CommonJS
const chromeLocation = require('chrome-location')
```

## Supported Platforms

- macOS (darwin)
- Windows (win32)
- Linux (default fallback)

## Related projects

* [chrome-location](https://github.com/hughsk/chrome-location)
* [edge-location](https://github.com/cezaraugusto/edge-location)
* [firefox-location](https://github.com/hughsk/firefox-location)
* [brave-location](https://github.com/cezaraugusto/brave-location)
* [vivaldi-location](https://github.com/jandrey/vivaldi-location)
* [opera-location](https://github.com/jandrey/opera-location)

## License

MIT (c) Cezar Augusto.
