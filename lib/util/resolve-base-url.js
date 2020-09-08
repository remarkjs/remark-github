'use strict'

var {URL} = require('url')

module.exports = resolveBaseUrl

function resolveBaseUrl(repository) {
  try {
    var parsed = new URL(repository)

    return 'https://' + parsed.host
  } catch (_) {
    // If provided repository is simply "owner/repo" new URL() will throw TypeError[ERR_INVALID_URL]
    return 'https://github.com'
  }
}
