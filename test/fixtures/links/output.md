# GitHub Links

This document tests transformation of links into references.
The behaviour used on GitHub is very lacking. E.g., commit comments
are not actually rendered “properly”, the hash of the URL is literally
shown next to the reference. Another by GitHub unsupported feature is
references for issues, pull requests, or commits on different projects.

remark-github does support all these systems and makes things look
pretty.

## Non-references

An empty link: [this and that](<>).

A link to GH:
<https://github.com>

A link to a user:
<https://github.com/foo>

A link to a project:
<https://github.com/foo/bar>

A link to a graphs:
<https://github.com/foo/bar/graphs>

A link to a traffic:
<https://github.com/foo/bar/graphs/traffic>

## Commit

Commits (should not render):
<https://github.com/wooorm/remark/commit/>

A too long commit (should not render):
<https://github.com/wooorm/remark/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921a>

A valid commit:
[`1f2a4fb`](https://github.com/wooorm/remark/commit/1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921)

A valid abbreviated commit:
[`1f2a`](https://github.com/wooorm/remark/commit/1f2a)

A too short commit (should not render):
<https://github.com/wooorm/remark/commit/1f2>

Across users:
[foo@`1f2a`](https://github.com/foo/remark/commit/1f2a)

Across repositories:
[foo/bar@`1f2a`](https://github.com/foo/bar/commit/1f2a)

Same user, different repository:
[wooorm/bar@`1f2a`](https://github.com/wooorm/bar/commit/1f2a)

With dots ([GH-14](https://github.com/wooorm/remark/issues/14))
[wooorm/wooorm.github.io@`e5bd`](https://github.com/wooorm/wooorm.github.io/commit/e5bd)

## Commit comments

A commit comment:
[`1f2a` (comment)](https://github.com/wooorm/remark/commit/1f2a#commitcomment-12312312)

Not a comment (should not render comment part):
[`1f2a`](https://github.com/wooorm/remark/commit/1f2a#)

Across users:
[foo@`1f2a` (comment)](https://github.com/foo/remark/commit/1f2a#commitcomment-12312312)

Across repositories:
[foo/bar@`1f2a` (comment)](https://github.com/foo/bar/commit/1f2a#commitcomment-12312312)

Same user, different repository:
[wooorm/bar@`1f2a` (comment)](https://github.com/wooorm/bar/commit/1f2a#commitcomment-12312312)

## Issues

Issues (should not render):
<https://github.com/wooorm/remark/issues/>

Pulls (should not render):
<https://github.com/wooorm/remark/pull/>

An issue:
[#2](https://github.com/wooorm/remark/issues/2)

Not an issue, no HTTPS (should not render):
<http://github.com/wooorm/remark/issues/2>

A pull:
[#2](https://github.com/wooorm/remark/pull/2)

Not a pull, no HTTPS (should not render):
<http://github.com/wooorm/remark/pull/2>

Issues across users:
[foo#2](https://github.com/foo/remark/issues/2)

Issues across repositories:
[foo/bar#2](https://github.com/foo/bar/issues/2)

Issues on same user, different repository:
[wooorm/bar#2](https://github.com/wooorm/bar/issues/2)

Pulls across users:
[foo#2](https://github.com/foo/remark/pull/2)

Pulls across repositories:
[foo/bar#2](https://github.com/foo/bar/pull/2)

Pull on same user, different repository:
[wooorm/bar#2](https://github.com/wooorm/bar/pull/2)

## Issue comments

Not a comment, no HTTPS (should not render):
<http://github.com/wooorm/remark/issues/2#issuecomment-123123>

A commit comment:
[#2 (comment)](https://github.com/wooorm/remark/issues/2#issuecomment-123123)

Not a comment (should not render comment part):
[#2](https://github.com/wooorm/remark/issues/2#)

Issues comment across users:
[foo#2 (comment)](https://github.com/foo/remark/issues/2#issuecomment-123123)

Issues comment across repositories:
[foo/bar#2 (comment)](https://github.com/foo/bar/issues/2#issuecomment-123123)

Issues comment on same user, different repository:
[wooorm/bar#2 (comment)](https://github.com/wooorm/bar/issues/2#issuecomment-123123)

Pull comment across users:
[foo#2 (comment)](https://github.com/foo/remark/pull/2#issuecomment-123123)

Pull comment across repositories:
[foo/bar#2 (comment)](https://github.com/foo/bar/pull/2#issuecomment-123123)

Pull comment on same user, different repository:
[wooorm/bar#2 (comment)](https://github.com/wooorm/bar/issues/2#issuecomment-123123)

## Users

Users (should not render):
<https://github.com/wooorm>
