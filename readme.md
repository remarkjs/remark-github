# remark-github [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Auto-link references to commits, issues, pull-requests, and users like
GitHub: [Writing on GitHub][writing-on-github].

## Installation

[npm][npm-install]:

```bash
npm install remark-github
```

**remark-github** is also available for [duo][duo-install], and as an
AMD, CommonJS, and globals module, [uncompressed and compressed][releases].

## Usage

Dependencies:

```javascript
var github = require('remark-github');
var remark = require('remark').use(github);
```

Input:

```javascript
var input = [
    '* SHA: 1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921',
    '* User@SHA: jlord@1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921',
    '* User/Repository@SHA: jlord/sheetsee.js@1f2a4fb',
    '* #Num: #1',
    '* GH-Num: GH-1',
    '* User#Num: jlord#1',
    '* User/Repository#Num: jlord/sheetsee.js#1',
    '* @mention',
    '* And @mentioning someone else',
    '* And nothing'
].join('\n');
```

Process:

```javascript
var doc = remark.process(input);
```

Yields:

```markdown
-   SHA: [`1f2a4fb`](https://github.com/wooorm/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921)
-   User@SHA: [jlord@`1f2a4fb`](https://github.com/jlord/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921)
-   User/Repository@SHA: [jlord/sheetsee.js@`1f2a4fb`](https://github.com/jlord/sheetsee.js/commit/1f2a4fb)
-   \#Num: [#1](https://github.com/wooorm/remark-github/issues/1)
-   GH-Num: [GH-1](https://github.com/wooorm/remark-github/issues/1)
-   User#Num: [jlord#1](https://github.com/jlord/remark-github/issues/1)
-   User/Repository#Num: [jlord/sheetsee.js#1](https://github.com/jlord/sheetsee.js/issues/1)
-   [**@mention**](https://github.com/blog/821)
-   And [**@mentioning**](https://github.com/mentioning) someone else
-   And nothing
```

## API

### `remark.use(github[, options])`

Adds references to commits, issues, pull-requests, and users similar to how
[GitHub][writing-on-github]
renders these in issues, comments, and pull request descriptions.

*   SHA commits references: `1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921`
    — [`1f2a4fb`][sha]

*   User@SHA: `wooorm@1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921`
    — [wooorm@`1f2a4fb`][user-sha]

*   User/Repository@SHA:
    `wooorm/remark-github@1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921`
    — [wooorm/remark-github@`1f2a4fb`][project-sha]

*   Hash-Num: `#1`
    — [#1][issue]

*   GH-Num: `GH-1`
    — [GH-1][issue]

*   User#Num: `wooorm#1`
    — [wooorm#1][user-issue]

*   User/Repository#Num: `wooorm/remark-github#1`
    — [wooorm/remark-github#1][project-issue]

*   At-mentions: `@mention` and `@wooorm`
    — [**@mention**][mentions] and [**@wooorm**][mention]

These links are generated relative to a project. In Node this is auto-detected
by loading `package.json` and looking for a `repository` field.
In the browser, or when overwriting this, you can pass a `repository` to
[`remark.use`](https://github.com/wooorm/remark#remarkuseplugin-options).

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/remark-github.svg

[travis]: https://travis-ci.org/wooorm/remark-github

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/remark-github.svg

[codecov]: https://codecov.io/github/wooorm/remark-github

[npm-install]: https://docs.npmjs.com/cli/install

[duo-install]: http://duojs.org/#getting-started

[releases]: https://github.com/wooorm/remark-github/releases

[license]: LICENSE

[author]: http://wooorm.com

[writing-on-github]: https://help.github.com/articles/writing-on-github/#references

[sha]: https://github.com/wooorm/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921

[user-sha]: https://github.com/wooorm/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921

[project-sha]: https://github.com/wooorm/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921

[issue]: https://github.com/wooorm/remark-github/issues/1

[user-issue]: https://github.com/wooorm/remark-github/issues/1

[project-issue]: https://github.com/wooorm/remark-github/issues/1

[mentions]: https://github.com/blog/821

[mention]: https://github.com/wooorm
