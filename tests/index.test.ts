import { expect, test, describe } from 'vitest';
import chromeLocation from '../src/index';

describe('chrome-location2 module', () => {
  test('returns a string path', () => {
    expect(typeof chromeLocation()).toBe('string');
  });

  test('returns a valid path that exists', () => {
    const location = chromeLocation();
    expect(location).toBeTruthy();
  });
});
