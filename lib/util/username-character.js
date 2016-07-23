/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:util:username-character
 * @fileoverview Check if a character can be in a username.
 */

'use strict';

/* Dependencies. */
var decimal = require('is-decimal');
var alphabetical = require('is-alphabetical');

/* Expose. */
module.exports = usernameCharacter;

/* Character codes. */
var CC_DASH = '-'.charCodeAt(0);

/**
 * Check whether `code` is a valid username character.
 *
 * @param {number} code - Single character code to check.
 * @return {boolean} - Whether or not `code` is a valid
 *   username character.
 */
function usernameCharacter(code) {
  return code === CC_DASH || decimal(code) || alphabetical(code);
}
