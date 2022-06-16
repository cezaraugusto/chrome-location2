const scanOsxPath = require('./scan/scanOsxPath')
const scanWindowsPath = require('./scan/scanWindowsPath')
const scanUnknownPlatformPath = require('./scan/scanUnknownPlatformPath')

module.exports = function locateChrome () {
  switch (process.platform) {
    case 'darwin':
      return scanOsxPath()
    case 'win32':
      return scanWindowsPath()
    default:
      return scanUnknownPlatformPath()
  }
}
