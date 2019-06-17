'use strict'

var hexadecimal = require('is-hexadecimal')

module.exports = sha

var maxShaLength = 40
var minusculeShaLength = 4
var minShaLength = 7

// Get the end of a SHA that starts at character `fromIndex` in `value`.
function sha(value, fromIndex, allowShort) {
  var index = fromIndex
  var length = value.length
  var size

  // No reason walking too far.
  if (length > index + maxShaLength) {
    length = index + maxShaLength
  }

  while (index < length) {
    if (!hexadecimal(value.charCodeAt(index))) {
      break
    }

    index++
  }

  size = index - fromIndex

  if (
    size < (allowShort ? minusculeShaLength : minShaLength) ||
    (size === maxShaLength && hexadecimal(value.charCodeAt(index)))
  ) {
    return -1
  }

  return index
}
