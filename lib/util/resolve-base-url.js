'use strict'

var url = require('url')

module.exports = resolveBaseUrl

function resolveBaseUrl(repository) {
  var parsed = url.parse(repository)

  if (parsed.host) {
    return 'https://' + parsed.host + '/'
  }

  return 'https://github.com/'
}
