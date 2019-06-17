'use strict'

var decimal = require('is-decimal')
var alphabetical = require('is-alphabetical')

module.exports = projectCharacter

var dash = 45 //  '-'
var dot = 46 //  '.'

// Check whether `code` is a valid project name character.
function projectCharacter(code) {
  return code === dot || code === dash || decimal(code) || alphabetical(code)
}
