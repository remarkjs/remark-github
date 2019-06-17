'use strict'

var toString = require('mdast-util-to-string')
var usernameEnd = require('./username-end')
var projectEnd = require('./project-end')
var issueEnd = require('./issue-end')
var shaEnd = require('./sha-end')

module.exports = parse

parse.COMMIT = 'commit'
parse.ISSUE = 'issues'
parse.PULL = 'pull'

var ghUrlPrefix = 'https://github.com/'
var ghUrlPrefixLength = ghUrlPrefix.length

var numberSign = 35 //  '#'
var slash = 47 //  '/'

// Parse a link and determine whether it links to GitHub.
function parse(node) {
  var link = {}
  var url = node.url || node.href || ''
  var start
  var end
  var page

  if (
    url.slice(0, ghUrlPrefixLength) !== ghUrlPrefix ||
    node.children.length !== 1 ||
    node.children[0].type !== 'text' ||
    toString(node).slice(0, ghUrlPrefixLength) !== ghUrlPrefix
  ) {
    return
  }

  start = ghUrlPrefixLength
  end = usernameEnd(url, ghUrlPrefixLength)

  if (end === -1 || url.charCodeAt(end) !== slash) {
    return
  }

  link.user = url.slice(start, end)

  start = end + 1
  end = projectEnd(url, start)

  if (end === -1 || url.charCodeAt(end) !== slash) {
    return
  }

  link.project = url.slice(start, end)

  start = end + 1
  end = url.indexOf('/', start)

  if (end === -1) {
    return
  }

  page = url.slice(start, end)

  if (page !== parse.COMMIT && page !== parse.ISSUE && page !== parse.PULL) {
    return
  }

  link.page = page
  start = end + 1

  if (page === parse.COMMIT) {
    end = shaEnd(url, start, true)
  } else {
    end = issueEnd(url, start)
  }

  if (end === -1) {
    return
  }

  link.reference = url.slice(start, end)
  link.comment = url.charCodeAt(end) === numberSign && url.length > end + 1

  return link
}
