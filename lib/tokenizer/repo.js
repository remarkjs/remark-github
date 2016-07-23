/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:tokenizer:repo
 * @fileoverview Tokenize a repo.
 */

'use strict';

/* Dependencies. */
var locator = require('../locator/repo');
var abbr = require('../util/abbreviate');
var gh = require('../util/gh');
var usernameEnd = require('../util/username-end');
var projectEndPos = require('../util/project-end');
var shaEnd = require('../util/sha-end');
var issueEnd = require('../util/issue-end');
var usernameCharacter = require('../util/username-character');

/* Expose. */
module.exports = exports = repoReference;

exports.locator = locator;
exports.notInLink = true;

/* Characters. */
var C_SLASH = '/';

/* Character codes. */
var CC_SLASH = C_SLASH.charCodeAt(0);
var CC_HASH = '#'.charCodeAt(0);
var CC_AT = '@'.charCodeAt(0);

/**
 * Tokenise a reference.
 *
 * @example
 *   repoReference(eat, 'foo@bada555');
 *
 * @property {boolean} notInLink - Disable nested links.
 * @property {Function} locator - Reference locator.
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `link` node.
 */
function repoReference(eat, value, silent) {
  var self = this;
  var delimiter;
  var href;
  var index = 0;
  var code;
  var handle;
  var handleEnd;
  var project;
  var projectStart;
  var projectEnd;
  var referenceStart;
  var reference;
  var subvalue;
  var test;
  var suffix;
  var content;
  var node;
  var add;

  index = usernameEnd(value, index);

  if (index === -1) {
    return;
  }

  handleEnd = index;
  code = value.charCodeAt(index);

  if (code === CC_SLASH) {
    index++;
    projectStart = index;
    index = projectEndPos(value, projectStart);

    if (index === -1) {
      return;
    }

    projectEnd = index;
    code = value.charCodeAt(projectEnd);
  }

  if (code === CC_HASH) {
    suffix = 'issues';
    test = issueEnd;
  } else if (code === CC_AT) {
    suffix = 'commit';
    test = shaEnd;
  } else {
    return;
  }

  delimiter = value.charAt(index);
  index++;
  referenceStart = index;

  index = test(value, referenceStart);

  if (index === -1 || usernameCharacter(value.charCodeAt(index))) {
    return;
  }

  content = reference = value.slice(referenceStart, index);

  /* istanbul ignore if - maybe used by plug-ins */
  if (silent) {
    return true;
  }

  handle = value.slice(0, handleEnd);
  project = projectEnd && value.slice(projectStart, projectEnd);
  href = gh(handle, project || self.github.project);
  subvalue = value.slice(0, index);
  handle += (project ? C_SLASH + project : '') + delimiter;
  add = eat(subvalue);
  href += suffix + C_SLASH + reference;

  if (suffix === 'commit') {
    node = add(
      self.renderLink(true, href, handle, null, eat.now())
    );

    node.children.push({type: 'inlineCode', value: abbr(content)});

    return node;
  }

  return add(self.renderLink(true, href, handle + content, null, eat.now()));
}
