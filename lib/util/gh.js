'use strict'

module.exports = gh

const {URL} = require('url')

// Return a URL to GitHub, relative to an optional `repo` object, or `user` and
// `project`.
function gh(base, repo, project) {
  if (project) {
    repo = {user: repo, project: project}
  }

  if (repo) {
    return new URL('/' + repo.user + '/' + repo.project, base) + '/'
  }

  return base + '/'
}
