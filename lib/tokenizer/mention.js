/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:tokenizer:mention
 * @fileoverview Tokenize a mention.
 */

'use strict';

/* Dependencies. */
var has = require('has');
var locator = require('../locator/mention');
var gh = require('../util/gh');
var usernameEnd = require('../util/username-end');

/* Expose. */
module.exports = exports = mention;

exports.locator = locator;
exports.notInLink = true;

/* Characters. */
var C_SLASH = '/';
var C_AT = '@';

/* Character codes. */
var CC_SLASH = C_SLASH.charCodeAt(0);
var CC_AT = C_AT.charCodeAt(0);

/* Map of overwrites for at-mentions.
 * GitHub does some fancy stuff with `@mention`, by linking
 * it to their blog-post introducing the feature.
 * To my knowledge, there are no other magical usernames. */
var OVERWRITES = {};

OVERWRITES.mentions = OVERWRITES.mention = 'blog/821';

/**
 * Tokenise a mention.
 *
 * @example
 *   tokenizeMention(eat, '@baz');
 *
 * @property {boolean} notInLink - Disable nested links.
 * @property {Function} locator - Mention locator.
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `link` node.
 */
function mention(eat, value, silent) {
  var self = this;
  var index;
  var subvalue;
  var handle;
  var href;
  var node;
  var now;

  if (value.charCodeAt(0) !== CC_AT) {
    return;
  }

  index = usernameEnd(value, 1);

  if (index === -1) {
    return;
  }

  /* Support teams. */
  if (value.charCodeAt(index) === CC_SLASH) {
    index = usernameEnd(value, index + 1);

    if (index === -1) {
      return;
    }
  }

  /* istanbul ignore if - maybe used by plug-ins */
  if (silent) {
    return true;
  }

  now = eat.now();
  handle = value.slice(1, index);
  subvalue = C_AT + handle;

  href = gh();
  href += has(OVERWRITES, handle) ? OVERWRITES[handle] : handle;

  now.column++;

  node = eat(subvalue)(self.renderLink(
    true, href, subvalue, null, now, eat
  ));

  if (self.githubOptions.mentionStrong !== false) {
    node.children = [{
      type: 'strong',
      children: node.children
    }];
  }

  return node;
}
