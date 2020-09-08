'use strict'

module.exports = gh

// Return a URL to GitHub, relative to an optional `repo` object, or `user` and
// `project`.
function gh(base, repo, project) {
  if (project) {
    repo = {user: repo, project: project}
  }

  if (repo) {
    return base + '/' + repo.user + '/' + repo.project + '/'
  }

  return base + '/'
}
