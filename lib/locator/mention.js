/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:locator:mention
 * @fileoverview Locate a mention.
 */

'use strict';

/* Expose. */
module.exports = mention;

/* Dependencies. */
var repo = require('../util/repo-character');

/**
 * Find a possible mention.
 *
 * @example
 *   locateMention('foo @bar'); // 4
 *
 * @param {string} value - Value to search.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - Location of possible mention.
 */
function mention(value, fromIndex) {
  var index = value.indexOf('@', fromIndex);

  if (index !== -1 && repo(value.charCodeAt(index - 1))) {
    return mention(value, index + 1);
  }

  return index;
}
