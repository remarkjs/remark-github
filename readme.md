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
var file = remark.process(input);
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

### `remark.use(commentConfig[, options])`

Adds references to commits, issues, pull-requests, and users similar to how
[GitHub][writing-on-github]
renders these in issues, comments, and pull request descriptions.

*   SHA commits references: `1f2a4fb` — [`1f2a4fb`][sha]
*   User@SHA: `wooorm@1f2a4fb` — [wooorm@`1f2a4fb`][user-sha]
*   User/Repository@SHA: `wooorm/remark-github@1f2a4fb`
    — [wooorm/remark-github@`1f2a4fb`][project-sha]
*   Hash-Num: `#1` — [#1][issue]
*   GH-Num: `GH-1` — [GH-1][issue]
*   User#Num: `wooorm#1` — [wooorm#1][user-issue]
*   User/Repository#Num: `wooorm/remark-github#1`
    — [wooorm/remark-github#1][project-issue]
*   At-mentions: `@mention` and `@wooorm`
    — [**@mention**][mentions] and [**@wooorm**][mention]

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
