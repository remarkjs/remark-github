/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:util:regex-locator
 * @fileoverview Create a locator from a regex.
 */

'use strict';

/* Dependencies. */
var usernameCharacter = require('./username-character');

/* Expose. */
module.exports = factory;

/* Characters. */
var C_AT = '@';
var C_HASH = '#';

/* Character codes. */
var CC_HASH = C_HASH.charCodeAt(0);
var CC_AT = C_AT.charCodeAt(0);

/**
 * Create a bound regex locator.
 *
 * @example
 *   regexLocatorFactory(/-/g);
 *
 * @param {RegExp} regex - Expressions to bind to.
 * @return {Function} - Locator.
 */
function factory(regex) {
  /**
   * Find the place where a regex begins.
   *
   * @example
   *   regexLocatorFactory(/-/g)('foo - bar'); // 4
   *
   * @param {string} value - Value to search.
   * @param {number} fromIndex - Index to start searching at.
   * @return {number} - Location of match.
   */
  function locator(value, fromIndex) {
    var result;
    var prev;

    regex.lastIndex = fromIndex;

    result = regex.exec(value);

    if (result) {
      result = regex.lastIndex - result[0].length;
      prev = value.charCodeAt(result - 1);

      if (
        usernameCharacter(prev) ||
        prev === CC_HASH ||
        prev === CC_AT
      ) {
        /* Find the next possible value. */
        return locator(value, regex.lastIndex);
      }

      return result;
    }

    return -1;
  }

  return locator;
}
