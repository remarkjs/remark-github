/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:util:repo-character
 * @fileoverview Check if a character can be in a repo.
 */

'use strict';

/* Dependencies. */
var decimal = require('is-decimal');
var alphabetical = require('is-alphabetical');

/* Expose. */
module.exports = repoCharacter;

/* Character codes. */
var CC_DASH = '-'.charCodeAt(0);
var CC_SLASH = '/'.charCodeAt(0);
var CC_DOT = '.'.charCodeAt(0);

/**
 * Check whether `code` is a repo character.
 *
 * @param {number} code - Single character code to check.
 * @return {boolean} - Whether or not `code` is a valid
 *   repo character.
 */
function repoCharacter(code) {
  return code === CC_SLASH ||
    code === CC_DOT ||
    code === CC_DASH ||
    decimal(code) ||
    alphabetical(code);
}
