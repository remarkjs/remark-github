# remark-github [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status] [![Chat][chat-badge]][chat]

<!--lint disable list-item-spacing-->

Auto-link references to commits, issues, pull-requests, and users like
GitHub: [Writing on GitHub][writing-on-github].

## Installation

[npm][]:

```bash
npm install remark-github
```

**remark-github** is also available as an AMD, CommonJS, and
globals module, [uncompressed and compressed][releases].

## Usage

Dependencies:

```javascript
var github = require('remark-github');
var remark = require('remark')().use(github);
```

Input:

```javascript
var input = [
    'References:',
    '',
    '* Commit: f8083175fe890cbf14f41d0a06e7aa35d4989587',
    '* Commit (fork): foo@f8083175fe890cbf14f41d0a06e7aa35d4989587.',
    '* Commit (repo): wooorm/remark@e1aa9f6c02de18b9459b7d269712bcb50183ce89.',
    '* Issue or PR (`#`): #1.',
    '* Issue or PR (`GH-`): GH-1.',
    '* Issue or PR (fork): foo#1.',
    '* Issue or PR (project): wooorm/remark#1.',
    '* Mention: @wooorm.',
    '',
    'Normalising of links:',
    '',
    '* Commit: https://github.com/wooorm/remark/commit/e1aa9f6c02de18b9459b7d269712bcb50183ce89.',
    '* Commit comment: https://github.com/wooorm/remark/commit/ac63bc3abacf14cf08ca5e2d8f1f8e88a7b9015c#commitcomment-16372693.',
    '* Issue or PR: https://github.com/wooorm/remark/issues/182',
    '* Issue or PR comment: https://github.com/wooorm/remark-github/issues/3#issue-151160339',
    '* Mention: @ben-eb.'
].join('\n');
```

Process:

```javascript
var doc = remark.process(input).toString();
```

Yields:

```markdown
References:

-   Commit: [`f808317`](https://github.com/wooorm/remark-github/commit/f8083175fe890cbf14f41d0a06e7aa35d4989587)
-   Commit (fork): [foo@`f808317`](https://github.com/foo/remark-github/commit/f8083175fe890cbf14f41d0a06e7aa35d4989587).
-   Commit (repo): [wooorm/remark@`e1aa9f6`](https://github.com/wooorm/remark/commit/e1aa9f6c02de18b9459b7d269712bcb50183ce89).
-   Issue or PR (`#`): [#1](https://github.com/wooorm/remark-github/issues/1).
-   Issue or PR (`GH-`): [GH-1](https://github.com/wooorm/remark-github/issues/1).
-   Issue or PR (fork): [foo#1](https://github.com/foo/remark-github/issues/1).
-   Issue or PR (project): [wooorm/remark#1](https://github.com/wooorm/remark/issues/1).
-   Mention: [**@wooorm**](https://github.com/wooorm).

Normalising of links:

-   Commit: [wooorm/remark@`e1aa9f6`](https://github.com/wooorm/remark/commit/e1aa9f6c02de18b9459b7d269712bcb50183ce89).
-   Commit comment: [wooorm/remark@`ac63bc3` (comment)](https://github.com/wooorm/remark/commit/ac63bc3abacf14cf08ca5e2d8f1f8e88a7b9015c#commitcomment-16372693).
-   Issue or PR: [wooorm/remark#182](https://github.com/wooorm/remark/issues/182)
-   Issue or PR comment: [#3 (comment)](https://github.com/wooorm/remark-github/issues/3#issue-151160339)
-   Mention: [**@ben-eb**](https://github.com/ben-eb).
```

## API

### `remark.use(github[, options])`

Adds references to commits, issues, pull-requests, and users similar to how
[GitHub][writing-on-github]
renders these in issues, comments, and pull request descriptions.

*   Commits: `1f2a4fb` — [`1f2a4fb`][sha].
*   Commits across forks: `wooorm@1f2a4fb` — [wooorm@`1f2a4fb`][user-sha].
*   Commits across projects: `wooorm/remark-github@1f2a4fb`
    — [wooorm/remark-github@`1f2a4fb`][project-sha].
*   Prefix issues: `GH-1` — [GH-1][issue].
*   Hash issues: `#1` — [#1][issue].
*   Issues across forks: `wooorm#1` — [wooorm#1][user-issue].
*   Issues across projects: `wooorm/remark-github#1`
    — [wooorm/remark-github#1][project-issue].
*   At-mentions: `@mention` and `@wooorm`.
    — [**@mention**][mentions] and [**@wooorm**][mention].

These links are generated relative to a project.  In Node this is
auto-detected by loading `package.json` and looking for a `repository`
field.  In the browser, or when overwriting this, you can pass a
`repository` in `options`.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/remark-github.svg

[build-status]: https://travis-ci.org/wooorm/remark-github

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/remark-github.svg

[coverage-status]: https://codecov.io/github/wooorm/remark-github

[chat-badge]: https://img.shields.io/gitter/room/wooorm/remark.svg

[chat]: https://gitter.im/wooorm/remark

[releases]: https://github.com/wooorm/remark-github/releases

[license]: LICENSE

[author]: http://wooorm.com

[npm]: https://docs.npmjs.com/cli/install

[writing-on-github]: https://help.github.com/articles/writing-on-github/#references

[sha]: https://github.com/wooorm/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921

[user-sha]: https://github.com/wooorm/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921

[project-sha]: https://github.com/wooorm/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921

[issue]: https://github.com/wooorm/remark-github/issues/1

[user-issue]: https://github.com/wooorm/remark-github/issues/1

[project-issue]: https://github.com/wooorm/remark-github/issues/1

[mentions]: https://github.com/blog/821

[mention]: https://github.com/wooorm
