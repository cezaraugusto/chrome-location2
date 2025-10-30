import scanOsxPath from './scan-osx-path';
import scanWindowsPath from './scan-windows-path';
import scanUnknownPlatformPath from './scan-unknown-platform-path';

export default function locateChrome(allowFallback = false) {
  switch (process.platform) {
    case 'darwin':
      return scanOsxPath(allowFallback);
    case 'win32':
      return scanWindowsPath(allowFallback);
    default:
      return scanUnknownPlatformPath(allowFallback);
  }
}
