# User@Project

A project-SHA is not relative to the current project.

GitHub’s project names can include alphabetical characters, dashes, and full-stops. They may end in a TLD (such as `.com`), but may not end in `.git` (for obvious reasons).

-   This is a valid issue: [wooorm/mdast#1](https://github.com/wooorm/mdast/issues/1);
-   So is this: [wooorm/mdast#123456789](https://github.com/wooorm/mdast/issues/123456789).

They work here
[wooorm/mdast#1](https://github.com/wooorm/mdast/issues/1)

and here
    [wooorm/mdast#1](https://github.com/wooorm/mdast/issues/1)

Usernames: this is not a valid, -wooorm/mdast#1; nor is this wooorm-/mdast#1; but this is [w-w/mdast#1](https://github.com/w-w/mdast/issues/1), and so is [w/mdast#1](https://github.com/w/mdast/issues/1) and [ww/mdast#1](https://github.com/ww/mdast/issues/1).

Project names: this is not a valid, wooorm/c.git#1; but this is [wooorm/c#1](https://github.com/wooorm/c/issues/1), so is [w/w#1](https://github.com/w/w/issues/1), and [ww/.gitconfig#1](https://github.com/ww/.gitconfig/issues/1).

This is too long: wooormwooormwooormwooormwooormwooormwooo/c#1 (40 character username).
