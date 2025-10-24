#!/usr/bin/env node

const locateChrome =
  require('./dist/index.cjs').default || require('./dist/index.cjs');

console.log(locateChrome());
