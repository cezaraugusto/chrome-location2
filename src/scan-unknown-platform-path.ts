import which from 'which';

export default function scanUnknownPlatform() {
  let browserPath = null;

  try {
    browserPath = which.sync('google-chrome');
  } catch (err) {
    try {
      browserPath = which.sync('chromium-browser');
    } catch (err) {
      browserPath = null;
    }
  }

  return browserPath;
}
