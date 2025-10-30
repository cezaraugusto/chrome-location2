#!/usr/bin/env node

const locateChrome =
  require('./dist/index.cjs').default || require('./dist/index.cjs');

const argv = process.argv.slice(2);
const allowFallback = argv.includes('--fallback') || argv.includes('-f');

console.log(locateChrome(allowFallback));
