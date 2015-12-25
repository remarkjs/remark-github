# remark-github [![Build Status](https://img.shields.io/travis/wooorm/remark-github.svg)](https://travis-ci.org/wooorm/remark-github) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/remark-github.svg)](https://codecov.io/github/wooorm/remark-github)

Auto-link references to commits, issues, pull-requests, and users like GitHub: [Writing on GitHub](https://help.github.com/articles/writing-on-github/#references).

## Installation

[npm](https://docs.npmjs.com/cli/install)

```bash
npm install remark-github
```

[Component.js](https://github.com/componentjs/component)

```bash
component install wooorm/remark-github
```

[Duo](http://duojs.org/#getting-started)

```javascript
var github = require('wooorm/remark-github');
```

UMD: globals, AMD, and CommonJS ([uncompressed](remark-github.js) and [compressed](remark-github.min.js)):

```html
<script src="path/to/remark.js"></script>
<script src="path/to/remark-github.js"></script>
<script>
  remark.use(remarkGitHub);
</script>
```

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
    '* SHA: a5c3785ed8d6a35868bc169f07e40e889087fd2e',
    '* User@SHA: jlord@a5c3785ed8d6a35868bc169f07e40e889087fd2e',
    '* User/Repository@SHA: jlord/sheetsee.js@a5c3785e',
    '* #Num: #26',
    '* GH-Num: GH-26',
    '* User#Num: jlord#26',
    '* User/Repository#Num: jlord/sheetsee.js#26',
    '* @mention',
    '* And @mentioning someone else',
    '* And nothing.'
].join('\n');
```

Process:

```javascript
var doc = remark.process(input);
```

Yields:

```markdown
-   SHA: [a5c3785](https://github.com/wooorm/remark-github/commit/a5c3785ed8d6a35868bc169f07e40e889087fd2e)
-   User@SHA: [jlord@a5c3785](https://github.com/jlord/remark-github/commit/a5c3785ed8d6a35868bc169f07e40e889087fd2e)
-   User/Repository@SHA: [jlord/sheetsee.js@a5c3785](https://github.com/jlord/sheetsee.js/commit/a5c3785e)
-   #Num: [#26](https://github.com/wooorm/remark-github/issues/26)
-   GH-Num: [GH-26](https://github.com/wooorm/remark-github/issues/26)
-   User#Num: [jlord#26](https://github.com/jlord/remark-github/issues/26)
-   User/Repository#Num: [jlord/sheetsee.js#26](https://github.com/jlord/sheetsee.js/issues/26)
-   [@mention](https://github.com/blog/821)
-   And [@mentioning](https://github.com/mentioning) someone else
-   And nothing.
```

## API

### [remark](https://github.com/wooorm/remark#api).[use](https://github.com/wooorm/remark#remarkuseplugin-options)(github, options)

Adds references to commits, issues, pull-requests, and users similar to how
[GitHub](https://help.github.com/articles/writing-on-github/#references)
renders these in issues, comments, and pull request descriptions.

*   SHA commits references: `e2c1dc7690932b0cef900fa4e7355df093448341`
    — [e2c1dc7](https://github.com/wooorm/remark-github/commit/e2c1dc7690932b0cef900fa4e7355df093448341)

*   User@SHA: `wooorm@e2c1dc7690932b0cef900fa4e7355df093448341`
    — [wooorm@e2c1dc7](https://github.com/wooorm/remark-github/commit/e2c1dc7690932b0cef900fa4e7355df093448341)

*   User/Repository@SHA:
    `wooorm/remark-github@e2c1dc7690932b0cef900fa4e7355df093448341`
    — [wooorm/remark-github@e2c1dc7](https://github.com/wooorm/remark-github/commit/e2c1dc7690932b0cef900fa4e7355df093448341)

*   Hash-Num: `#1`
    — [#1](https://github.com/wooorm/remark-github/issues/1)

*   GH-Num: `GH-1`
    — [GH-1](https://github.com/wooorm/remark-github/issues/1)

*   User#Num: `wooorm#1`
    — [wooorm#1](https://github.com/wooorm/remark-github/issues/1)

*   User/Repository#Num: `wooorm/remark-github#1`
    — [wooorm/remark-github#1](https://github.com/wooorm/remark-github/issues/1)

*   At-mentions: `@mention` and `@wooorm`
    — [@mention](https://github.com/blog/821) and [@wooorm](https://github.com/wooorm)

These links are generated relative to a project. In Node this is auto-detected
by loading `package.json` and looking for a `repository` field.
In the browser, or when overwriting this, you can pass a `repository` to
[`remark.use`](https://github.com/wooorm/remark#remarkuseplugin-options).

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
