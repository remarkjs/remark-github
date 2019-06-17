# remark-github

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**remark**][remark] plugin to autolink references to commits, issues,
pull-requests, and users, like in GitHub issues, PRs, and comments (see [Writing
on GitHub][writing-on-github]).

## Install

[npm][]:

```sh
npm install remark-github
```

## Use

Say we have the following file, `example.md`:

```markdown
Some references:

-   Commit: f8083175fe890cbf14f41d0a06e7aa35d4989587
-   Commit (fork): foo@f8083175fe890cbf14f41d0a06e7aa35d4989587
-   Commit (repo): remarkjs/remark@e1aa9f6c02de18b9459b7d269712bcb50183ce89
-   Issue or PR (`#`): #1
-   Issue or PR (`GH-`): GH-1
-   Issue or PR (fork): foo#1
-   Issue or PR (project): remarkjs/remark#1
-   Mention: @wooorm

Some links:

-   Commit: https://github.com/remarkjs/remark/commit/e1aa9f6c02de18b9459b7d269712bcb50183ce89
-   Commit comment: https://github.com/remarkjs/remark/commit/ac63bc3abacf14cf08ca5e2d8f1f8e88a7b9015c#commitcomment-16372693
-   Issue or PR: https://github.com/remarkjs/remark/issues/182
-   Issue or PR comment: https://github.com/remarkjs/remark-github/issues/3#issue-151160339
-   Mention: @ben-eb
```

And our script, `example.js`, looks as follows:

```js
var vfile = require('to-vfile')
var remark = require('remark')
var github = require('remark-github')

remark()
  .use(github)
  .process(vfile.readSync('example.md'), function(err, file) {
    if (err) throw err
    console.log(String(file))
  })
```

Now, running `node example` yields:

```markdown
Some references:

-   Commit: [`f808317`](https://github.com/remarkjs/remark-github/commit/f8083175fe890cbf14f41d0a06e7aa35d4989587)
-   Commit (fork): [foo@`f808317`](https://github.com/foo/remark-github/commit/f8083175fe890cbf14f41d0a06e7aa35d4989587)
-   Commit (repo): [remarkjs/remark@`e1aa9f6`](https://github.com/remarkjs/remark/commit/e1aa9f6c02de18b9459b7d269712bcb50183ce89)
-   Issue or PR (`#`): [#1](https://github.com/remarkjs/remark-github/issues/1)
-   Issue or PR (`GH-`): [GH-1](https://github.com/remarkjs/remark-github/issues/1)
-   Issue or PR (fork): [foo#1](https://github.com/foo/remark-github/issues/1)
-   Issue or PR (project): [remarkjs/remark#1](https://github.com/remarkjs/remark/issues/1)
-   Mention: [**@wooorm**](https://github.com/wooorm)

Some links:

-   Commit: [remarkjs/remark@`e1aa9f6`](https://github.com/remarkjs/remark/commit/e1aa9f6c02de18b9459b7d269712bcb50183ce89)
-   Commit comment: [remarkjs/remark@`ac63bc3` (comment)](https://github.com/remarkjs/remark/commit/ac63bc3abacf14cf08ca5e2d8f1f8e88a7b9015c#commitcomment-16372693)
-   Issue or PR: [remarkjs/remark#182](https://github.com/remarkjs/remark/issues/182)
-   Issue or PR comment: [#3 (comment)](https://github.com/remarkjs/remark-github/issues/3#issue-151160339)
-   Mention: [**@ben-eb**](https://github.com/ben-eb)
```

## API

### `remark.use(github[, options])`

Autolink references to commits, issues, pull-requests, and users, like in GitHub
issues, PRs, and comments (see [Writing on GitHub][writing-on-github]).

###### Conversion

*   Commits:
    `1f2a4fb` → [`1f2a4fb`][sha]
*   Commits across forks:
    `remarkjs@1f2a4fb` → [remarkjs@`1f2a4fb`][user-sha]
*   Commits across projects:
    `remarkjs/remark-github@1f2a4fb` →
    [remarkjs/remark-github@`1f2a4fb`][project-sha]
*   Prefix issues:
    `GH-1` → [GH-1][issue]
*   Hash issues:
    `#1` → [#1][issue]
*   Issues across forks:
    `remarkjs#1` → [remarkjs#1][user-issue]
*   Issues across projects:
    `remarkjs/remark-github#1` → [remarkjs/remark-github#1][project-issue]
*   At-mentions:
    `@wooorm` → [**@wooorm**][mention]

###### Repository

These links are generated relative to a project.
In Node this is detected automatically by loading `package.json` and looking for
a `repository` field.
In the browser, or when overwriting this, you can pass a `repository` in
`options`.

###### Mentions

By default, mentions are wrapped in `strong` nodes (that render to `<strong>` in
HTML), to simulate the look of mentions on GitHub.
However, this creates different HTML markup, as the GitHub site applies these
styles using CSS.
Pass `mentionStrong: false` to turn off this behaviour.

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/remarkjs/remark-github/master.svg

[build]: https://travis-ci.org/remarkjs/remark-github

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-github.svg

[coverage]: https://codecov.io/github/remarkjs/remark-github

[downloads-badge]: https://img.shields.io/npm/dm/remark-github.svg

[downloads]: https://www.npmjs.com/package/remark-github

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-github.svg

[size]: https://bundlephobia.com/result?p=remark-github

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/master/contributing.md

[support]: https://github.com/remarkjs/.github/blob/master/support.md

[coc]: https://github.com/remarkjs/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[remark]: https://github.com/remarkjs/remark

[writing-on-github]: https://help.github.com/articles/writing-on-github/#references

[sha]: https://github.com/remarkjs/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921

[user-sha]: https://github.com/remarkjs/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921

[project-sha]: https://github.com/remarkjs/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921

[issue]: https://github.com/remarkjs/remark-github/issues/1

[user-issue]: https://github.com/remarkjs/remark-github/issues/1

[project-issue]: https://github.com/remarkjs/remark-github/issues/1

[mention]: https://github.com/wooorm
