#!/usr/bin/env node

'use strict'

const fs = require('node:fs')

let api

try {
  api = require('./dist/index.cjs')
} catch {
  // If dist is not present (e.g., running tests before build), provide a graceful fallback:
  // 1) Honor env override if present and exists
  const e = process.env || {}
  const envPath =
    e.CHROME_FOR_TESTING_PATH || e.CHROMIUM_BINARY || e.CHROME_BINARY

  if (envPath && fs.existsSync(envPath)) {
    console.log(String(envPath))
    process.exit(0)
  }

  // 2) Print guidance and exit with code 1 (match normal error behavior)
  const guidance = [
    "We couldn't find a Chrome/Chromium browser on this machine.",
    '',
    "Here's the fastest way to get set up:",
    '',
    '1) Install Chrome for Testing (recommended)',
    '   npx @puppeteer/browsers install chrome@stable',
    '',
    "Then re-run your command, and we'll detect it automatically.",
    '',
    "Alternatively, install Chromium via your system's package manager and re-run."
  ].join('\n')

  console.error(guidance)
  process.exit(1)
}

const locateChrome = api.default || api
const {getChromeVersion} = api
const {getInstallGuidance} = api

const argv = process.argv.slice(2)
const allowFallback = argv.includes('--fallback') || argv.includes('-f')
const printBrowserVersion =
  argv.includes('--chrome-version') || argv.includes('--browser-version')

const allowExec = argv.includes('--allow-exec')

try {
  const chromePath =
    (typeof locateChrome === 'function' && locateChrome(allowFallback)) ||
    (typeof locateChrome === 'function' && locateChrome(true)) ||
    null

  if (!chromePath) {
    const guidance =
      (typeof getInstallGuidance === 'function' && getInstallGuidance()) ||
      'No suitable Chrome/Chromium binary found.'

    console.error(guidance)
    process.exit(1)
  }

  if (printBrowserVersion && typeof getChromeVersion === 'function') {
    const v = getChromeVersion(chromePath, {allowExec})

    if (!v) {
      console.log('')
      process.exit(2)
    }

    console.log(String(v))
    process.exit(0)
  }

  console.log(String(chromePath))
} catch (e) {
  console.error(String(e?.message ? e.message : e))
  process.exit(1)
}
