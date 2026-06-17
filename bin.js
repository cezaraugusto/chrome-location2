
import locateChrome, {
  getInstallGuidance,
  getChromeVersion
} from './dist/index.js'

const argv = process.argv.slice(2)
const allowFallback = argv.includes('--fallback') || argv.includes('-f')
const printBrowserVersion =
  argv.includes('--chrome-version') || argv.includes('--browser-version')

const allowExec = argv.includes('--allow-exec')

try {
  const chromePath = locateChrome(allowFallback) || locateChrome(true)

  if (!chromePath) {
    throw new Error(
      (typeof getInstallGuidance === 'function' && getInstallGuidance()) ||
        'No suitable Chrome/Chromium binary found.'
    )
  }

  if (printBrowserVersion) {
    const v =
      typeof getChromeVersion === 'function'
        ? getChromeVersion(chromePath, {allowExec})
        : null

    if (!v) {
      console.log('')
      process.exit(2)
    }

    console.log(String(v))
    process.exit(0)
  }

  console.log(String(chromePath))
} catch (e) {
  console.error(String(e))
  process.exit(1)
}
