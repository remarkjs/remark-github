'use strict'

var locator = require('../locator/mention')
var gh = require('../util/gh')
var usernameEnd = require('../util/username-end')

module.exports = mention

mention.locator = locator
mention.notInLink = true

var own = {}.hasOwnProperty

var slash = 47 // '/'
var atSign = 64 //  '@'

var atSignCharacter = '@'

// Map of overwrites for at-mentions.
// GitHub does some fancy stuff with `@mention`, by linking it to their blog
// post introducing the feature.
// To my knowledge, there are no other magical usernames.
var overwrites = {
  mention: 'blog/821',
  mentions: 'blog/821'
}

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

  /* istanbul ignore if - Maybe used by plugins? */
  if (silent) {
    return true
  }

  now = eat.now()
  handle = value.slice(1, index)
  subvalue = atSignCharacter + handle

  href = gh()
  href += own.call(overwrites, handle) ? overwrites[handle] : handle

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
