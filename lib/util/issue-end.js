/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:util:issue-end
 * @fileoverview Get the end position of an issue.
 */

'use strict';

/* Dependencies. */
var decimal = require('is-decimal');

/* Expose. */
module.exports = issue;

/**
 * Get the end of an issue which starts at character
 * `fromIndex` in `value`.
 *
 * @param {string} value - Value to check.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - End position of issue, or `-1`.
 */
function issue(value, fromIndex) {
  var index = fromIndex;
  var length = value.length;

  while (index < length) {
    if (!decimal(value.charCodeAt(index))) {
      break;
    }

    index++;
  }

  if (index - fromIndex === 0) {
    return -1;
  }

  return index;
}
