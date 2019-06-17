'use strict'

var decimal = require('is-decimal')
var alphabetical = require('is-alphabetical')

module.exports = repoCharacter

var dash = 45 //  '-'
var dot = 46 //  '.'
var slash = 47 //  '/'

// Check whether `code` is a repo character.
function repoCharacter(code) {
  return (
    code === dash ||
    code === dot ||
    code === slash ||
    decimal(code) ||
    alphabetical(code)
  )
}
