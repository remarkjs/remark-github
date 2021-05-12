import unified = require('unified')
import github = require('remark-github')

unified().use(github)
unified().use(github, {})
unified().use(github, {mentionStrong: false, repository: 'some/repo'})
