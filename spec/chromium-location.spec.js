/* eslint-env jasmine */
const fs = require('fs')
const mock = require('mock-require');
const chromeLocation = require('../module')

describe('chrome-location', function () {
  // Must have Chrome installed. Commented as GitHub CI doesn't have it.
  // it('outputs chrome path as a node module', function (done) {
  //   const location = chromeLocation()

  //   expect(fs.existsSync(location)).toBe(true)
  //   expect(location).toBeDefined()
  //   done()
  // })

  it('outputs chrome path as a cli', function (done) {
    mock('child_process', {
      spawnSync: (location) => {
        return {stdout: location}
      }
    });

    const location = chromeLocation()

    const { spawnSync } = require( 'child_process' );
    const output = spawnSync(location);

    expect(fs.existsSync(location)).toBe(true)
    expect(output.stdout.toString()).toBe(location)
    done()
  })
})
