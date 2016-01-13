# remark-github [![Build Status](https://img.shields.io/travis/wooorm/remark-github.svg)](https://travis-ci.org/wooorm/remark-github) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/remark-github.svg)](https://codecov.io/github/wooorm/remark-github)

Auto-link references to commits, issues, pull-requests, and users like GitHub: [Writing on GitHub](https://help.github.com/articles/writing-on-github/#references).

## Installation

[npm](https://docs.npmjs.com/cli/install)

```bash
npm install remark-github
```

**remark-github** is also available for [duo](http://duojs.org/#getting-started),
and as an AMD, CommonJS, and globals module, [uncompressed and
compressed](https://github.com/wooorm/remark-github/releases).

## Table of Contents

*   [Usage](#usage)

*   [API](#api)

    *   [remark.use(github, options)](#remarkusegithub-options)

*   [License](#license)

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

### [remark](https://github.com/wooorm/remark#api).[use](https://github.com/wooorm/remark#remarkuseplugin-options)(github, options)

Adds references to commits, issues, pull-requests, and users similar to how
[GitHub](https://help.github.com/articles/writing-on-github/#references)
renders these in issues, comments, and pull request descriptions.

*   SHA commits references: `1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921`
    — [`1f2a4fb`](https://github.com/wooorm/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921)

*   User@SHA: `wooorm@1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921`
    — [wooorm@`1f2a4fb`](https://github.com/wooorm/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921)

*   User/Repository@SHA:
    `wooorm/remark-github@1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921`
    — [wooorm/remark-github@`1f2a4fb`](https://github.com/wooorm/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921)

*   Hash-Num: `#1`
    — [#1](https://github.com/wooorm/remark-github/issues/1)

*   GH-Num: `GH-1`
    — [GH-1](https://github.com/wooorm/remark-github/issues/1)

*   User#Num: `wooorm#1`
    — [wooorm#1](https://github.com/wooorm/remark-github/issues/1)

*   User/Repository#Num: `wooorm/remark-github#1`
    — [wooorm/remark-github#1](https://github.com/wooorm/remark-github/issues/1)

*   At-mentions: `@mention` and `@wooorm`
    — [**@mention**](https://github.com/blog/821) and [**@wooorm**](https://github.com/wooorm)

These links are generated relative to a project. In Node this is auto-detected
by loading `package.json` and looking for a `repository` field.
In the browser, or when overwriting this, you can pass a `repository` to
[`remark.use`](https://github.com/wooorm/remark#remarkuseplugin-options).

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
