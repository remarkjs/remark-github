'use strict'

var URL = require('url').URL

module.exports = resolveBaseUrl

function resolveBaseUrl(repository) {
  try {
    return 'https://' + new URL(repository).host
  } catch (_) {
    // If provided repository is simply "owner/repo" new URL() will throw TypeError[ERR_INVALID_URL]
  }
  
  return 'https://github.com'
}
