/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:util:abbreviate
 * @fileoverview Abbreviate a SHA.
 */

'use strict';

/* Expose. */
module.exports = abbreviate;

/* Constants. */
var MIN_SHA_LENGTH = 7;

/**
 * Abbreviate a SHA.
 *
 * @param {string} sha - Commit hash.
 * @return {string} - Abbreviated sha.
 */
function abbreviate(sha) {
  return sha.slice(0, MIN_SHA_LENGTH);
}
