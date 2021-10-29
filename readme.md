# remark-github

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**remark**][remark] plugin to link references to commits, issues, and users,
in the same way that GitHub does in comments, issues, PRs, and releases (see
[Writing on GitHub][writing-on-github]).

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkGithub[, options])`](#unifieduseremarkgithub-options)
*   [Examples](#examples)
    *   [Example: `buildUrl`](#example-buildurl)
*   [Syntax](#syntax)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin to link references to commits,
issues, and users: `@wooorm` -> `[**@wooorm**](https://github.com/wooorm)`.

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**remark** adds support for markdown to unified.
**mdast** is the markdown AST that remark uses.
This is a remark plugin that transforms mdast.

## When should I use this?

This project is useful if you want to emulate how markdown would work in GitHub
comments, issues, PRs, or releases, but it’s actually displayed somewhere else
(on a website, or in other places on GitHub which don’t link references, such as
markdown in a repo or Gist).
This plugin does not support other platforms such as GitLab or Bitbucket and
their custom features.

A different plugin, [`remark-gfm`][remark-gfm], adds support for GFM (GitHub
Flavored Markdown).
GFM is a set of extensions (autolink literals, footnotes, strikethrough, tables,
and tasklists) to markdown that are supported everywhere on GitHub.

Another plugin, [`remark-breaks`][remark-breaks], turns soft line endings
(enters) into hard breaks (`<br>`s).
GitHub does this in a few places (comments, issues, PRs, and releases), but it’s
not semantic according to HTML and not compliant to markdown.

Yet another plugin, [`remark-frontmatter`][remark-frontmatter], adds support
for YAML frontmatter.
GitHub supports frontmatter for files in Gists and repos.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-github
```

In Deno with [Skypack][]:

```js
import remarkGithub from 'https://cdn.skypack.dev/remark-github@11?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkGithub from 'https://cdn.skypack.dev/remark-github@11?min'
</script>
```

## Use

Say we have the following file, `example.md`:

```markdown
Some references:

*   Commit: f8083175fe890cbf14f41d0a06e7aa35d4989587
*   Commit (fork): foo@f8083175fe890cbf14f41d0a06e7aa35d4989587
*   Commit (repo): remarkjs/remark@e1aa9f6c02de18b9459b7d269712bcb50183ce89
*   Issue or PR (`#`): #1
*   Issue or PR (`GH-`): GH-1
*   Issue or PR (fork): foo#1
*   Issue or PR (project): remarkjs/remark#1
*   Mention: @wooorm

Some links:

*   Commit: <https://github.com/remarkjs/remark/commit/e1aa9f6c02de18b9459b7d269712bcb50183ce89>
*   Commit comment: <https://github.com/remarkjs/remark/commit/ac63bc3abacf14cf08ca5e2d8f1f8e88a7b9015c#commitcomment-16372693>
*   Issue or PR: <https://github.com/remarkjs/remark/issues/182>
*   Issue or PR comment: <https://github.com/remarkjs/remark-github/issues/3#issue-151160339>
*   Mention: <https://github.com/ben-eb>
```

And our module, `example.js`, looks as follows:

```js
import {read} from 'to-vfile'
import {remark} from 'remark'
import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'

main()

async function main() {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkGithub)
    .process(await read('example.md'))

  console.log(String(file))
}
```

Now, running `node example` yields:

```markdown
Some references:

*   Commit: [`f808317`](https://github.com/remarkjs/remark-github/commit/f8083175fe890cbf14f41d0a06e7aa35d4989587)
*   Commit (fork): [foo@`f808317`](https://github.com/foo/remark-github/commit/f8083175fe890cbf14f41d0a06e7aa35d4989587)
*   Commit (repo): [remarkjs/remark@`e1aa9f6`](https://github.com/remarkjs/remark/commit/e1aa9f6c02de18b9459b7d269712bcb50183ce89)
*   Issue or PR (`#`): [#1](https://github.com/remarkjs/remark-github/issues/1)
*   Issue or PR (`GH-`): [GH-1](https://github.com/remarkjs/remark-github/issues/1)
*   Issue or PR (fork): [foo#1](https://github.com/foo/remark-github/issues/1)
*   Issue or PR (project): [remarkjs/remark#1](https://github.com/remarkjs/remark/issues/1)
*   Mention: [**@wooorm**](https://github.com/wooorm)

Some links:

*   Commit: [remarkjs/remark@`e1aa9f6`](https://github.com/remarkjs/remark/commit/e1aa9f6c02de18b9459b7d269712bcb50183ce89)
*   Commit comment: [remarkjs/remark@`ac63bc3` (comment)](https://github.com/remarkjs/remark/commit/ac63bc3abacf14cf08ca5e2d8f1f8e88a7b9015c#commitcomment-16372693)
*   Issue or PR: [remarkjs/remark#182](https://github.com/remarkjs/remark/issues/182)
*   Issue or PR comment: [#3 (comment)](https://github.com/remarkjs/remark-github/issues/3#issue-151160339)
*   Mention: <https://github.com/ben-eb>
```

## API

This package exports no identifiers.
The default export is `remarkGithub`.

### `unified().use(remarkGithub[, options])`

Link references to users, commits, and issues, in the same way that GitHub does
in comments, issues, PRs, and releases (see
[Writing on GitHub][writing-on-github]).

##### `options`

Configuration (optional).

###### `options.repository`

Repository to link against (`string`, optional).
Detected in Node.js from the `repository` field in `package.json` if not given.
Should point to a GitHub repository, such as
`'https://github.com/user/project.git'` or `'user/project'`.

###### `options.mentionStrong`

Wrap mentions in `strong` (`boolean`, default: `true`).
This makes them render more like how GitHub styles them.
But GitHub itself uses CSS instead of strong.

###### `options.buildUrl`

Change how (and whether) things are linked (`Function`, optional).
This can be used to point links to GitHub Enterprise or other places.
It’s called with the following parameters:

*   `values` (`BuildUrlValues`)
    — info on the link to build
*   `defaultBuildUrl` (`(values: BuildUrlValues) => string`)
    — function that can be called to perform normal behavior

It should return the URL to use (`string`) or `false` to not create a link.

The following schemas are passed as `BuildUrlValues`:

*   `{type: 'commit', user, project, hash}`
*   `{type: 'compare', user, project, base, compare}`
*   `{type: 'issue', user, project, no}`
*   `{type: 'mention', user}`

## Examples

### Example: `buildUrl`

A `buildUrl` can be passed to not link mentions.
For example, by changing `example.js` from before like so:

```diff
@@ -8,7 +8,11 @@ main()
 async function main() {
   const file = await remark()
     .use(remarkGfm)
-    .use(remarkGithub)
+    .use(remarkGithub, {
+      buildUrl(values, defaultBuildUrl) {
+        return values.type === 'mention' ? false : defaultBuildUrl(values)
+      }
+    })
     .process(await read('example.md'))

   console.log(String(file))
```

To instead point mentions to a different place, change `example.js` like so:

```diff
@@ -8,7 +8,13 @@ main()
 async function main() {
   const file = await remark()
     .use(remarkGfm)
-    .use(remarkGithub)
+    .use(remarkGithub, {
+      buildUrl(values, defaultBuildUrl) {
+        return values.type === 'mention'
+          ? `https://yourwebsite.com/${values.user}/`
+          : defaultBuildUrl(values)
+      }
+    })
     .process(await read('example.md'))

   console.log(String(file))
```

## Syntax

The following references are supported:

*   Commits:
    `1f2a4fb` → [`1f2a4fb`][sha]
*   Commits across forks:
    `remarkjs@1f2a4fb` → [remarkjs@`1f2a4fb`][sha]
*   Commits across projects:
    `remarkjs/remark-github@1f2a4fb` → [remarkjs/remark-github@`1f2a4fb`][sha]
*   Compare ranges:
    `e2acebc...2aa9311` →
    [`e2acebc...2aa9311`][sha-range]
*   Compare ranges across forks:
    `remarkjs@e2acebc...2aa9311` →
    [remarkjs/remark-github@`e2acebc...2aa9311`][sha-range]
*   Compare ranges across projects:
    `remarkjs/remark-github@e2acebc...2aa9311` →
    [remarkjs/remark-github@`e2acebc...2aa9311`][sha-range]
*   Prefix issues:
    `GH-1` → [GH-1][issue]
*   Hash issues:
    `#1` → [#1][issue]
*   Issues across forks:
    `remarkjs#1` → [remarkjs#1][issue]
*   Issues across projects:
    `remarkjs/remark-github#1` → [remarkjs/remark-github#1][issue]
*   At-mentions:
    `@wooorm` → [**@wooorm**][mention]

Autolinks to these references are also transformed:
`https://github.com/wooorm` -> `[**@wooorm**](https://github.com/wooorm)`

## Types

This package is fully typed with [TypeScript][].
It exports an `Options` type, which specifies the interface of the accepted
options.
There are also `BuildUrl`, `BuildUrlValues`, `BuildUrlCommitValues`,
`BuildUrlCompareValues`, `BuildUrlIssueValues`, `BuildUrlMentionValues`,
and `DefaultBuildUrl` types exported.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

This plugin works with `unified` version 6+ and `remark` version 7+.

## Security

Use of `remark-github` does not involve [**rehype**][rehype] ([**hast**][hast]).
It does inject links based on user content, but those links only go to GitHub.
There are no openings for [cross-site scripting (XSS)][xss] attacks.

## Related

*   [`remark-gfm`][remark-gfm]
    — support GFM (autolink literals, footnotes, strikethrough, tables,
    tasklists)
*   [`remark-breaks`][remark-breaks]
    — support breaks without needing spaces or escapes (enters to `<br>`)
*   [`remark-frontmatter`][remark-frontmatter]
    — support frontmatter (YAML, TOML, and more)

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/remarkjs/remark-github/workflows/main/badge.svg

[build]: https://github.com/remarkjs/remark-github/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-github.svg

[coverage]: https://codecov.io/github/remarkjs/remark-github

[downloads-badge]: https://img.shields.io/npm/dm/remark-github.svg

[downloads]: https://www.npmjs.com/package/remark-github

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-github.svg

[size]: https://bundlephobia.com/result?p=remark-github

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[npm]: https://docs.npmjs.com/cli/install

[skypack]: https://www.skypack.dev

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[remark]: https://github.com/remarkjs/remark

[unified]: https://github.com/unifiedjs/unified

[writing-on-github]: https://docs.github.com/en/github/writing-on-github#references

[sha]: https://github.com/remarkjs/remark-github/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921

[sha-range]: https://github.com/wooorm/remark/compare/e2acebc...2aa9311

[issue]: https://github.com/remarkjs/remark-github/issues/1

[mention]: https://github.com/wooorm

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[typescript]: https://www.typescriptlang.org

[rehype]: https://github.com/rehypejs/rehype

[hast]: https://github.com/syntax-tree/hast

[remark-gfm]: https://github.com/remarkjs/remark-gfm

[remark-breaks]: https://github.com/remarkjs/remark-breaks

[remark-frontmatter]: https://github.com/remarkjs/remark-frontmatter
