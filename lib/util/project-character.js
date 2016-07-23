/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:util:project-character
 * @fileoverview Check if a character can be in a project.
 */

'use strict';

/* Dependencies. */
var decimal = require('is-decimal');
var alphabetical = require('is-alphabetical');

/* Expose. */
module.exports = projectCharacter;

/* Character codes. */
var CC_DOT = '.'.charCodeAt(0);
var CC_DASH = '-'.charCodeAt(0);

/**
 * Check whether `code` is a valid project name character.
 *
 * @param {number} code - Single character code to check.
 * @return {boolean} - Whether or not `code` is a valid
 *   project name character.
 */
function projectCharacter(code) {
  return code === CC_DOT ||
    code === CC_DASH ||
    decimal(code) ||
    alphabetical(code);
}
