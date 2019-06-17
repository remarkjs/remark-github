'use strict'

module.exports = abbreviate

var minShaLength = 7

// Abbreviate a SHA.
function abbreviate(sha) {
  return sha.slice(0, minShaLength)
}
