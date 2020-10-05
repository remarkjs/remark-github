# User@Project

A project-SHA is not relative to the current project.

GitHub’s project names can include alphabetical characters, dashes, and full-stops. They may end in a TLD (such as `.com`), but may not end in `.git` (for obvious reasons).

*   This is a valid issue: foo/bar#1;
*   So is this: foo/bar#123456789.

They work here
foo/bar#1

and here
    foo/bar#1

Usernames: this is not a valid, -foo/bar#1; but this is w-w/bar#1, and so is w/bar#1 and ww/bar#1.

Note that this is no longer valid, but used to be: w-/bar#1.

Project names: this is not a valid, wooorm/c.git#1; but this is wooorm/c#1, so is w/w#1, and ww/.gitconfig#1.

This is too long: wooormwooormwooormwooormwooormwooormwooo/c#1 (40 character username).
