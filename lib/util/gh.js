/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github:util:gh
 * @fileoverview Create a link base to GitHub.
 */

'use strict';

/* Expose. */
module.exports = gh;

/**
 * Return a URL to GitHub, relative to an optional
 * `repo` object, or `user` and `project`.
 *
 * @param {Object|string?} repo - Repository.
 * @param {string?} project - Project.
 * @return {string} - URL.
 */
function gh(repo, project) {
  var base = 'https://github.com/';

  if (project) {
    repo = {user: repo, project: project};
  }

  if (repo) {
    base += repo.user + '/' + repo.project + '/';
  }

  return base;
}
