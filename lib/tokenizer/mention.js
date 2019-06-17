'use strict'

var locator = require('../locator/mention')
var gh = require('../util/gh')
var usernameEnd = require('../util/username-end')

module.exports = mention

mention.locator = locator
mention.notInLink = true

var slash = 47 // '/'
var atSign = 64 //  '@'

var atSignCharacter = '@'

// Previously, GitHub linked `@mention` and `@mentions` to their blog post about
// mentions (<https://github.com/blog/821>).
// Since June 2019, and possibly earlier, they stopped linking those references.
var denylist = ['mention', 'mentions']

// Tokenise a mention.
function mention(eat, value, silent) {
  var self = this
  var index
  var subvalue
  var handle
  var href
  var node
  var exit
  var now

  if (value.charCodeAt(0) !== atSign) {
    return
  }

  index = usernameEnd(value, 1)

  if (index === -1) {
    return
  }

  // Support teams.
  if (value.charCodeAt(index) === slash) {
    index = usernameEnd(value, index + 1)

    if (index === -1) {
      return
    }
  }

  handle = value.slice(1, index)

  if (denylist.indexOf(handle) !== -1) {
    return
  }

  /* istanbul ignore if - Maybe used by plugins? */
  if (silent) {
    return true
  }

  now = eat.now()
  subvalue = atSignCharacter + handle

  href = gh() + handle

  now.column++

  exit = self.enterLink()

  node = eat(subvalue)({
    type: 'link',
    title: null,
    url: href,
    children: self.tokenizeInline(subvalue, now)
  })

  exit()

  if (self.githubOptions.mentionStrong !== false) {
    node.children = [{type: 'strong', children: node.children}]
  }

  return node
}
