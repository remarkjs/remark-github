'use strict'

var usernameCharacter = require('./username-character')

module.exports = factory

var numberSign = 35 //  '#'
var atSign = 64 //  '@'

// Create a bound regex locator.
function factory(regex) {
  return locator

  // Find the place where a regex begins.
  function locator(value, fromIndex) {
    var result
    var previous

    regex.lastIndex = fromIndex

    result = regex.exec(value)

    if (result) {
      result = regex.lastIndex - result[0].length
      previous = value.charCodeAt(result - 1)

      if (
        usernameCharacter(previous) ||
        previous === numberSign ||
        previous === atSign
      ) {
        // Find the next possible value.
        return locator(value, regex.lastIndex)
      }

      return result
    }

    return -1
  }
}
