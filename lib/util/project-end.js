'use strict'

var projectCharacter = require('./project-character')

module.exports = project

var gitSuffix = '.git'
var maxProjectLength = 100

// Get the end of a project that starts at character `fromIndex` in `value`.
function project(value, fromIndex) {
  var index = fromIndex
  var length = value.length
  var size

  while (index < length) {
    if (!projectCharacter(value.charCodeAt(index))) {
      break
    }

    index++
  }

  size = fromIndex - index

  if (
    !size ||
    size > maxProjectLength ||
    value.slice(index - gitSuffix.length, index) === gitSuffix
  ) {
    return -1
  }

  return index
}
