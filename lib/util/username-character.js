'use strict'

var decimal = require('is-decimal')
var alphabetical = require('is-alphabetical')

module.exports = usernameCharacter

var dash = 45 //  '-'

// Check whether `code` is a valid username character.
function usernameCharacter(code) {
  return code === dash || decimal(code) || alphabetical(code)
}
