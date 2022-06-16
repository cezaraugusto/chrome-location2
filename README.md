[action-image]: https://github.com/cezaraugusto/chrome-location2/workflows/CI/badge.svg
[action-url]: https://github.com/cezaraugusto/chrome-location2/actions?query=workflow%3ACI
[npm-image]: https://img.shields.io/npm/v/chrome-location2.svg
[npm-url]: https://npmjs.org/package/chrome-location2

# chrome-location2 [![workflow][action-image]][action-url] [![npm][npm-image]][npm-url]

> Approximates the current location of the chrome browser across platforms. Will fallback to Chromium if location not found.

# Usage

**Via Node.js:**

```js
// Returns the path to chrome as a string.
const chromeLocation = require('chrome-location2')

console.log(chromeLocation())
// /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

**Via CLI:**

```bash
> chrome-location2
# /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

Open Chrome (remember to use quotes as Chrome's path usually has spaces in it):

```bash
> "`chrome-location2`"
```

## Acknowledgements

This project is adapted from [chrome-location](http://github.com/hughsk/chrome-location).

## License

MIT (c) Cezar Augusto.
