#!/usr/bin/env node

const api = require('./dist/index.cjs')
const locateChrome = api.default || api
const locateChromeOrExplain = api.locateChromeOrExplain || null
const pintor = require('pintor')

const argv = process.argv.slice(2)
const allowFallback = argv.includes('--fallback') || argv.includes('-f')

try {
  const result = locateChromeOrExplain
    ? locateChromeOrExplain({allowFallback})
    : locateChrome(allowFallback)

  if (!result)
    throw new Error(
      api.getInstallGuidance?.() || 'No suitable Chrome/Chromium binary found.'
    )
  console.log(pintor.green(String(result)))
} catch (e) {
  console.error(pintor.red(String(e)))
  process.exit(1)
}
