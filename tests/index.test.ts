import {describe, expect, test} from 'vitest'

import chromeLocation from '../src/index'

describe('chrome-location2 module', () => {
  it('returns a string or null without forcing fallbacks', () => {
    const result = chromeLocation()

    expect(typeof result === 'string' || result === null).toBe(true)
  })
})
