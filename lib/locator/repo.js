/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:locator:repo
 * @fileoverview Locate a repo.
 */

'use strict';

/* Expose. */
module.exports = locateRepoReference;

/* Dependencies. */
var hexadecimal = require('is-hexadecimal');
var decimal = require('is-decimal');
var repoCharacter = require('../util/repo-character');

/**
 * Find a possible reference.
 *
 * @example
 *   locateRepoReference('foo bar/baz#1'); // 4
 *
 * @param {string} value - Value to search.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - Location of possible reference.
 */
function locateRepoReference(value, fromIndex) {
  var hash = value.indexOf('@', fromIndex);
  var issue = value.indexOf('#', fromIndex);
  var index;
  var start;
  var test;

  if (hash === -1) {
    index = issue;
  } else if (issue === -1) {
    index = hash;
  } else {
    index = (hash > issue ? issue : hash);
  }

  start = index;

  if (start === -1) {
    return index;
  }

  while (index >= fromIndex) {
    if (!repoCharacter(value.charCodeAt(index - 1))) {
      break;
    }

    index--;
  }

  if (index < start && index >= fromIndex) {
    test = start === hash ? hexadecimal : decimal;

    if (
      test(value.charCodeAt(start + 1)) &&
      !repoCharacter(value.charCodeAt(index - 1))
    ) {
      return index;
    }
  }

  /* Find the next possible value. */
  return locateRepoReference(value, start + 1);
}
