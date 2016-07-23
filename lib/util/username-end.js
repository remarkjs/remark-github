/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:util:username-end
 * @fileoverview Get the end position of a username.
 */

'use strict';

/* Dependencies. */
var usernameCharacter = require('./username-character');

/* Expose. */
module.exports = username;

/* Constants */
var MAX_USER_LENGTH = 39;

/* Character codes */
var CC_DASH = '-'.charCodeAt(0);

/**
 * Get the end of a username which starts at character
 * `fromIndex` in `value`.
 *
 * @param {string} value - Value to check.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - End position of username, or `-1`.
 */
function username(value, fromIndex) {
  var index = fromIndex;
  var length = value.length;
  var size;

  /* First character of username cannot be a dash. */
  if (value.charCodeAt(index) === CC_DASH) {
    return -1;
  }

  while (index < length) {
    if (!usernameCharacter(value.charCodeAt(index))) {
      break;
    }

    index++;
  }

  size = index - fromIndex;

  /* Last character of username cannot be a dash. */
  if (
    !size ||
    size > MAX_USER_LENGTH ||
    value.charCodeAt(index - 1) === CC_DASH
  ) {
    return -1;
  }

  return index;
}
