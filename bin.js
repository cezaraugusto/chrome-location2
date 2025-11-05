#!/usr/bin/env node

import locateChrome, {
  locateChromeOrExplain,
  getInstallGuidance
} from './dist/index.js'
import pintor from 'pintor'

const argv = process.argv.slice(2)
const allowFallback = argv.includes('--fallback') || argv.includes('-f')

try {
  const result = typeof locateChromeOrExplain === 'function'
    ? locateChromeOrExplain({allowFallback})
    : locateChrome(allowFallback)

  if (!result)
    throw new Error(
      (typeof getInstallGuidance === 'function' && getInstallGuidance()) ||
        'No suitable Chrome/Chromium binary found.'
    )
  console.log(pintor.green(String(result)))
} catch (e) {
  console.error(pintor.red(String(e)))
  process.exit(1)
}
