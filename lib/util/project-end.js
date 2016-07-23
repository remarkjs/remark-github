/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:util:project-end
 * @fileoverview Get the end position of a project.
 */

'use strict';

/* Dependencies. */
var projectCharacter = require('./project-character');

/* Expose. */
module.exports = project;

/* Constants. */
var GIT_SUFFIX = '.git';
var MAX_PROJECT_LENGTH = 100;

/**
 * Get the end of a project which starts at character
 * `fromIndex` in `value`.
 *
 * @param {string} value - Value to check.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - End position of project, or `-1`.
 */
function project(value, fromIndex) {
  var index = fromIndex;
  var length = value.length;
  var size;

  while (index < length) {
    if (!projectCharacter(value.charCodeAt(index))) {
      break;
    }

    index++;
  }

  size = fromIndex - index;

  if (
    !size ||
    size > MAX_PROJECT_LENGTH ||
    (value.slice(index - GIT_SUFFIX.length, index) === GIT_SUFFIX)
  ) {
    return -1;
  }

  return index;
}
