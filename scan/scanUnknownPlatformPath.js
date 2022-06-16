const which = require('which');

module.exports = function scanUnknownPlatform () {
  let browserPath = null

  try {
    browserPath = which.sync('google-chrome');
  } catch (err) {
    try {
      browserPath = which.sync('chromium-browser');
    } catch (err) {
      browserPath = null;
    }
  }

  return browserPath
}
