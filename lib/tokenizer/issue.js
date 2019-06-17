'use strict'

var gh = require('../util/gh')
var issueEnd = require('../util/issue-end')
var locator = require('../util/regex-locator')

module.exports = issue

issue.locator = locator(/\bgh-|#/gi)
issue.notInLink = true

var slash = '/'
var numberSign = 35 // '#'

var issuePrefix = 'gh-'

var issuePage = 'issues'

// Tokenise an issue.
function issue(eat, value, silent) {
  var self = this
  var index
  var start
  var subvalue
  var now
  var exit
  var node

  if (value.charCodeAt(0) === numberSign) {
    index = 1
  } else if (value.slice(0, issuePrefix.length).toLowerCase() === issuePrefix) {
    index = issuePrefix.length
  } else {
    return
  }

  start = index
  index = issueEnd(value, index)

  if (index === -1) {
    return
  }

  /* istanbul ignore if - Maybe used by plugins? */
  if (silent) {
    return true
  }

  now = eat.now()
  subvalue = value.slice(0, index)

  now.column += start

  exit = self.enterLink()

  node = eat(subvalue)({
    type: 'link',
    title: null,
    url: gh(self.githubRepo) + issuePage + slash + value.slice(start, index),
    children: self.tokenizeInline(subvalue, now)
  })

  exit()

  return node
}
