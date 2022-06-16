const fs = require('fs')
const path = require('path')

module.exports = function scanWindowsPath () {
  let browserPath = null

  const prefixes = [
    process.env.LOCALAPPDATA,
    process.env.PROGRAMFILES,
    process.env['PROGRAMFILES(X86)']
  ]
  const suffix = '\\Google\\Chrome\\Application\\chrome.exe'

  for (const prefix of prefixes) {
    const exe = path.join(prefix, suffix)

    if (fs.existsSync(exe)) {
      browserPath = exe
      break
    }
  }

  return browserPath
}
