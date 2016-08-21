/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:tokenizer:issue
 * @fileoverview Tokenize an issue.
 */

'use strict';

/* Dependencies. */
var gh = require('../util/gh');
var issueEnd = require('../util/issue-end');
var locator = require('../util/regex-locator');

/* Expose. */
module.exports = exports = issue;

exports.locator = locator(/\bgh-|#/gi);
exports.notInLink = true;

/* Characters. */
var C_SLASH = '/';
var C_HASH = '#';

/* Character codes. */
var CC_HASH = C_HASH.charCodeAt(0);

/* Constants. */
var PREFIX = 'gh-';

/**
 * Tokenise an issue.
 *
 * @example
 *   tokenizeIssue(eat, 'GH-1');
 *   tokenizeIssue(eat, '#3');
 *
 * @property {boolean} notInLink - Disable nested links.
 * @property {Function} locator - Issue locator.
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `link` node.
 */
function issue(eat, value, silent) {
  var self = this;
  var index;
  var start;
  var subvalue;
  var href;
  var now;
  var exit;
  var node;

  if (value.charCodeAt(0) === CC_HASH) {
    index = 1;
  } else if (value.slice(0, PREFIX.length).toLowerCase() === PREFIX) {
    index = PREFIX.length;
  } else {
    return;
  }

  start = index;
  index = issueEnd(value, index);

  if (index === -1) {
    return;
  }

  /* istanbul ignore if - maybe used by plug-ins */
  if (silent) {
    return true;
  }

  now = eat.now();
  href = gh(self.githubRepo) + 'issues' + C_SLASH + value.slice(start, index);
  subvalue = value.slice(0, index);

  now.column += start;

  exit = self.enterLink();

  node = eat(subvalue)({
    type: 'link',
    title: null,
    url: href,
    children: self.tokenizeInline(subvalue, now)
  });

  exit();

  return node;
}
