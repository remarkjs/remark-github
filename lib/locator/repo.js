'use strict'

module.exports = locateRepoReference

var hexadecimal = require('is-hexadecimal')
var decimal = require('is-decimal')
var repoCharacter = require('../util/repo-character')

// Find a possible reference.
function locateRepoReference(value, fromIndex) {
  var commitMarker = value.indexOf('@', fromIndex)
  var issueMarker = value.indexOf('#', fromIndex)
  var index
  var start
  var test

  if (commitMarker === -1) {
    index = issueMarker
  } else if (issueMarker === -1) {
    index = commitMarker
  } else {
    index = commitMarker > issueMarker ? issueMarker : commitMarker
  }

  start = index

  if (start === -1) {
    return -1
  }

  while (index >= fromIndex) {
    if (!repoCharacter(value.charCodeAt(index - 1))) {
      break
    }

    index--
  }

  if (index < start && index >= fromIndex) {
    test = start === commitMarker ? hexadecimal : decimal

    if (
      test(value.charCodeAt(start + 1)) &&
      !repoCharacter(value.charCodeAt(index - 1))
    ) {
      return index
    }
  }

  // Find the next possible value.
  return locateRepoReference(value, start + 1)
}
