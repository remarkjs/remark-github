/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:github
 * @fileoverview
 *   Auto-link references like in GitHub issues, PRs,
 *   and comments.
 */

'use strict';

/* global global */

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');
var toString = require('mdast-util-to-string');

/*
 * Constants.
 */

var GIT_SUFFIX = '.git';
var GH_ISSUE_PREFIX = 'gh-';
var GH_URL_PREFIX = 'https://github.com/';
var MESSAGE_COMMENT = ' (comment)';
var EMPTY = '';
var GH_URL_PREFIX_LENGTH = GH_URL_PREFIX.length;
var MAX_SHA_LENGTH = 40;
var MINUSCULE_SHA_LENGTH = 4;
var MIN_SHA_LENGTH = 7;
var MAX_USER_LENGTH = 39;
var MAX_PROJECT_LENGTH = 100;

/*
 * Characters.
 */

var C_SLASH = '/';
var C_HASH = '#';
var C_AT = '@';

/*
 * Character codes.
 */

var CC_0 = '0'.charCodeAt(0);
var CC_9 = '9'.charCodeAt(0);
var CC_A_LOWER = 'a'.charCodeAt(0);
var CC_F_LOWER = 'f'.charCodeAt(0);
var CC_Z_LOWER = 'z'.charCodeAt(0);
var CC_A_UPPER = 'A'.charCodeAt(0);
var CC_F_UPPER = 'F'.charCodeAt(0);
var CC_Z_UPPER = 'Z'.charCodeAt(0);
var CC_SLASH = C_SLASH.charCodeAt(0);
var CC_DOT = '.'.charCodeAt(0);
var CC_DASH = '-'.charCodeAt(0);
var CC_HASH = C_HASH.charCodeAt(0);
var CC_AT = C_AT.charCodeAt(0);

/*
 * Enum of known pages.
 */

var COMMIT = 'commit';
var ISSUE = 'issues';
var PULL = 'pull';

/*
 * Node types.
 */

var T_INLINE_CODE = 'inlineCode';
var T_TEXT = 'text';
var T_STRONG = 'strong';
var T_LINK = 'link';

/*
 * Blacklist of SHAs which are also valid words.
 *
 * GitHub allows abbreviating SHAs up to 7 characters.
 * These are ignored in text because they might just be
 * ment as normal words.  If you’d like these to link to
 * their SHAs, just use more than 7 characters.
 *
 * Generated by:
 *
 *     egrep -i "^[a-f0-9]{7,}$" /usr/share/dict/words
 */

var BLACKLIST = [
    'deedeed',
    'fabaceae'
];

/*
 * Map of overwrites for at-mentions.
 * GitHub does some fancy stuff with `@mention`, by linking
 * it to their blog-post introducing the feature.
 * To my knowledge, there are no other magical usernames.
 */

var OVERWRITES = {};

OVERWRITES.mentions = OVERWRITES.mention = 'blog/821';

/*
 * Cached method.
 */

var has = Object.prototype.hasOwnProperty;

/*
 * Hide process use from browserify.
 */

var proc = typeof global !== 'undefined' && global.process;

/**
 * Check if a value is a SHA.
 *
 * @param {string} sha - Commit hash.
 * @return {boolean} - Whether `sha` is not blacklisted.
 */
function isBlacklisted(sha) {
    return BLACKLIST.indexOf(sha.toLowerCase()) !== -1;
}

/**
 * Abbreviate a SHA.
 *
 * @param {string} sha - Commit hash.
 * @return {string} - Abbreviated sha.
 */
function abbr(sha) {
    return sha.slice(0, MIN_SHA_LENGTH);
}

/**
 * Return a URL to GitHub, relative to an optional
 * `repo` object, or `user` and `project`.
 *
 * @param {Object|string?} repo - Repository.
 * @param {string?} project - Project.
 * @return {string} - URL.
 */
function gh(repo, project) {
    var base = GH_URL_PREFIX;

    if (project) {
        repo = {
            'user': repo,
            'project': project
        };
    }

    if (repo) {
        base += repo.user + C_SLASH + repo.project + C_SLASH;
    }

    return base;
}

/*
 * Username may only contain alphanumeric characters or
 * single hyphens, and cannot begin or end with a hyphen.
 *
 * `PERSON` is either a user or an organization, but also
 * matches a team:
 *
 *   https://github.com/blog/1121-introducing-team-mentions
 */

var NAME = '(?:[a-z0-9]{1,2}|[a-z0-9][a-z0-9-]{1,37}[a-z0-9])';
var USER = '(' + NAME + ')';
var PROJECT = '((?:[a-z0-9-]|\\.git[a-z0-9-]|\\.(?!git))+)';
var REPO = USER + '\\/' + PROJECT;

/*
 * Match a repo from a git / github URL.
 */

var REPOSITORY = new RegExp(
    '(?:^|/(?:repos/)?)' + REPO + '(?=\\.git|[\\/#@]|$)', 'i'
);

/**
 * Check whether `code` is a hexadecimal character.
 *
 * @param {number} code - Single character code to check.
 * @return {boolean} - Whether or not `code` is a valid
 *   hexadecimal character.
 */
function isHexadecimal(code) {
    return (code >= CC_0 && code <= CC_9) ||
        (code >= CC_A_LOWER && code <= CC_F_LOWER) ||
        (code >= CC_A_UPPER && code <= CC_F_UPPER);
}

/**
 * Check whether `code` is a decimal character.
 *
 * @param {number} code - Single character code to check.
 * @return {boolean} - Whether or not `code` is a valid
 *   decimal character.
 */
function isDecimal(code) {
    return code >= CC_0 && code <= CC_9;
}

/**
 * Check whether `code` is a repo character.
 *
 * @param {number} code - Single character code to check.
 * @return {boolean} - Whether or not `code` is a valid
 *   repo character.
 */
function isValidRepoCharacter(code) {
    return code === CC_SLASH ||
        code === CC_DOT ||
        code === CC_DASH ||
        (code >= CC_0 && code <= CC_9) ||
        (code >= CC_A_LOWER && code <= CC_Z_LOWER) ||
        (code >= CC_A_UPPER && code <= CC_Z_UPPER);
}

/**
 * Check whether `code` is a valid project name character.
 *
 * @param {number} code - Single character code to check.
 * @return {boolean} - Whether or not `code` is a valid
 *   project name character.
 */
function isValidProjectNameCharacter(code) {
    return code === CC_DOT ||
        code === CC_DASH ||
        (code >= CC_0 && code <= CC_9) ||
        (code >= CC_A_LOWER && code <= CC_Z_LOWER) ||
        (code >= CC_A_UPPER && code <= CC_Z_UPPER);
}

/**
 * Check whether `code` is a valid username character.
 *
 * @param {number} code - Single character code to check.
 * @return {boolean} - Whether or not `code` is a valid
 *   username character.
 */
function isValidUserNameCharacter(code) {
    return code === CC_DASH ||
        (code >= CC_0 && code <= CC_9) ||
        (code >= CC_A_LOWER && code <= CC_Z_LOWER) ||
        (code >= CC_A_UPPER && code <= CC_Z_UPPER);
}

/**
 * Get the end of a username which starts at character
 * `fromIndex` in `value`.
 *
 * @param {string} value - Value to check.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - End position of username, or `-1`.
 */
function getUserNameEndPosition(value, fromIndex) {
    var index = fromIndex;
    var length = value.length;
    var size;

    /* First character of username cannot be a dash. */
    if (value.charCodeAt(index) === CC_DASH) {
        return -1;
    }

    while (index < length) {
        if (!isValidUserNameCharacter(value.charCodeAt(index))) {
            break;
        }

        index++;
    }

    size = index - fromIndex;

    /* Last character of username cannot be a dash. */
    if (
        !size ||
        size > MAX_USER_LENGTH ||
        value.charCodeAt(index - 1) === CC_DASH
    ) {
        return -1;
    }

    return index;
}

/**
 * Get the end of a project which starts at character
 * `fromIndex` in `value`.
 *
 * @param {string} value - Value to check.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - End position of project, or `-1`.
 */
function getProjectEndPosition(value, fromIndex) {
    var index = fromIndex;
    var length = value.length;
    var size;

    while (index < length) {
        if (!isValidProjectNameCharacter(value.charCodeAt(index))) {
            break;
        }

        index++;
    }

    size = fromIndex - index;

    if (
        !size ||
        size > MAX_PROJECT_LENGTH ||
        (value.slice(index - GIT_SUFFIX.length, index) === GIT_SUFFIX)
    ) {
        return -1;
    }

    return index;
}

/**
 * Get the end of a SHA which starts at character
 * `fromIndex` in `value`.
 *
 * @param {string} value - Value to check.
 * @param {number} fromIndex - Index to start searching at.
 * @param {boolean} [allowShort=false] - Whether to allow
 *   extra short SHAs (4 characters instead of 7).
 * @return {number} - End position of SHA, or `-1`.
 */
function getSHAEndPosition(value, fromIndex, allowShort) {
    var index = fromIndex;
    var length = value.length;
    var size;

    /* No reason walking too far. */

    if (length > index + MAX_SHA_LENGTH) {
        length = index + MAX_SHA_LENGTH;
    }

    while (index < length) {
        if (!isHexadecimal(value.charCodeAt(index))) {
            break;
        }

        index++;
    }

    size = index - fromIndex;

    if (
        size < (allowShort ? MINUSCULE_SHA_LENGTH : MIN_SHA_LENGTH) ||
        (size === MAX_SHA_LENGTH && isHexadecimal(value.charCodeAt(index)))
    ) {
        return -1;
    }

    return index;
}

/**
 * Get the end of an issue which starts at character
 * `fromIndex` in `value`.
 *
 * @param {string} value - Value to check.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - End position of issue, or `-1`.
 */
function getIssueEndPosition(value, fromIndex) {
    var index = fromIndex;
    var length = value.length;

    while (index < length) {
        if (!isDecimal(value.charCodeAt(index))) {
            break;
        }

        index++;
    }

    if (index - fromIndex === 0) {
        return -1;
    }

    return index;
}

/**
 * Create a bound regex locator.
 *
 * @example
 *   regexLocatorFactory(/-/g);
 *
 * @param {RegExp} regex - Expressions to bind to.
 * @return {Function} - Locator.
 */
function regexLocatorFactory(regex) {
    /**
     * Find the place where a regex begins.
     *
     * @example
     *   regexLocatorFactory(/-/g)('foo - bar'); // 4
     *
     * @param {string} value - Value to search.
     * @param {number} fromIndex - Index to start searching at.
     * @return {number} - Location of match.
     */
    function locator(value, fromIndex) {
        var result;
        var prev;

        regex.lastIndex = fromIndex;

        result = regex.exec(value);

        if (result) {
            result = regex.lastIndex - result[0].length;
            prev = value.charCodeAt(result - 1);

            if (
                isValidUserNameCharacter(prev) ||
                prev === CC_HASH ||
                prev === CC_AT
            ) {
                /* Find the next possible value. */
                return locator(value, regex.lastIndex);
            }

            return result;
        }

        return -1;
    }

    return locator;
}

/**
 * Tokenise a hash.
 *
 * @example
 *   tokenizeHash(eat, 'bada555');
 *
 * @property {boolean} notInLink - Disable nested links.
 * @property {Function} locator - Hash locator.
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `link` node.
 */
function tokenizeHash(eat, value, silent) {
    var self = this;
    var index = getSHAEndPosition(value, 0);
    var subvalue;
    var href;
    var now;
    var node;

    if (index === -1) {
        return;
    }

    subvalue = value.slice(0, index);

    if (isBlacklisted(subvalue)) {
        return;
    }

    /* istanbul ignore if - maybe used by plug-ins */
    if (silent) {
        return true;
    }

    href = gh(self.github) + COMMIT + C_SLASH + subvalue;
    now = eat.now();

    node = eat(subvalue)(
        self.renderLink(true, href, subvalue, null, now, eat)
    );

    node.children = [{
        'type': T_INLINE_CODE,
        'value': abbr(subvalue),
        'position': node.children[0].position
    }];

    return node;
}

tokenizeHash.locator = regexLocatorFactory(/\b[a-f0-9]{7,40}\b/gi);
tokenizeHash.notInLink = true;

/**
 * Find a possible mention.
 *
 * @example
 *   locateMention('foo @bar'); // 4
 *
 * @param {string} value - Value to search.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - Location of possible mention.
 */
function locateMention(value, fromIndex) {
    var index = value.indexOf(C_AT, fromIndex);

    if (
        index !== -1 &&
        isValidRepoCharacter(value.charCodeAt(index - 1))
    ) {
        return locateMention(value, index + 1);
    }

    return index;
}

/**
 * Tokenise a mention.
 *
 * @example
 *   tokenizeMention(eat, '@baz');
 *
 * @property {boolean} notInLink - Disable nested links.
 * @property {Function} locator - Mention locator.
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `link` node.
 */
function tokenizeMention(eat, value, silent) {
    var self = this;
    var index;
    var subvalue;
    var handle;
    var href;
    var node;
    var now;

    if (value.charCodeAt(0) !== CC_AT) {
        return;
    }

    index = getUserNameEndPosition(value, 1);

    if (index === -1) {
        return;
    }

    /*
     * Support teams.
     */

    if (value.charCodeAt(index) === CC_SLASH) {
        index = getUserNameEndPosition(value, index + 1);

        if (index === -1) {
            return;
        }
    }

    /* istanbul ignore if - maybe used by plug-ins */
    if (silent) {
        return true;
    }

    now = eat.now();
    handle = value.slice(1, index);
    subvalue = C_AT + handle;

    href = gh();
    href += has.call(OVERWRITES, handle) ? OVERWRITES[handle] : handle;

    now.column++;

    node = eat(subvalue)(self.renderLink(
        true, href, subvalue, null, now, eat
    ));

    node.children = [{
        'type': T_STRONG,
        'children': node.children
    }];

    return node;
}

tokenizeMention.locator = locateMention;
tokenizeMention.notInLink = true;

/**
 * Tokenise an issue.
 *
 * @example
 *   tokenizeIssue(eat, 'GH-1');
 *   tokenizeIssue(eat, '#3');
 *
 * @property {boolean} notInLink - Disable nested links.
 * @property {Function} locator - Issue locator.
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `link` node.
 */
function tokenizeIssue(eat, value, silent) {
    var self = this;
    var index;
    var start;
    var subvalue;
    var href;
    var now;

    if (value.charCodeAt(0) === CC_HASH) {
        index = 1;
    } else if (
        value.slice(0, GH_ISSUE_PREFIX.length).toLowerCase() ===
        GH_ISSUE_PREFIX
    ) {
        index = GH_ISSUE_PREFIX.length;
    } else {
        return;
    }

    start = index;
    index = getIssueEndPosition(value, index);

    if (index === -1) {
        return;
    }

    /* istanbul ignore if - maybe used by plug-ins */
    if (silent) {
        return true;
    }

    now = eat.now();
    href = gh(self.github) + ISSUE + C_SLASH + value.slice(start, index);
    subvalue = value.slice(0, index);

    now.column += start;

    return eat(subvalue)(
        self.renderLink(true, href, subvalue, null, now, eat)
    );
}

tokenizeIssue.locator = regexLocatorFactory(/\bgh-|#/gi);
tokenizeIssue.notInLink = true;

/**
 * Find a possible reference.
 *
 * @example
 *   locateRepoReference('foo bar/baz#1'); // 4
 *
 * @param {string} value - Value to search.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - Location of possible reference.
 */
function locateRepoReference(value, fromIndex) {
    var hash = value.indexOf(C_AT, fromIndex);
    var issue = value.indexOf(C_HASH, fromIndex);
    var index;
    var start;
    var test;

    if (hash === -1) {
        index = issue;
    } else if (issue === -1) {
        index = hash;
    } else {
        index = (hash > issue ? issue : hash);
    }

    start = index;

    if (start === -1) {
        return index;
    }

    while (index >= fromIndex) {
        if (!isValidRepoCharacter(value.charCodeAt(index - 1))) {
            break;
        }

        index--;
    }

    if (index < start && index >= fromIndex) {
        test = start === hash ? isHexadecimal : isDecimal;

        if (
            test(value.charCodeAt(start + 1)) &&
            !isValidRepoCharacter(value.charCodeAt(index - 1))
        ) {
            return index;
        }
    }

    /* Find the next possible value. */
    return locateRepoReference(value, start + 1);
}

/**
 * Tokenise a reference.
 *
 * @example
 *   tokenizeRepoReference(eat, 'foo@bada555');
 *
 * @property {boolean} notInLink - Disable nested links.
 * @property {Function} locator - Reference locator.
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `link` node.
 */
function tokenizeRepoReference(eat, value, silent) {
    var self = this;
    var delimiter;
    var href;
    var index = 0;
    var code;
    var handle;
    var handleEnd;
    var project;
    var projectStart;
    var projectEnd;
    var referenceStart;
    var reference;
    var subvalue;
    var test;
    var suffix;
    var now;
    var content;
    var node;
    var add;

    index = getUserNameEndPosition(value, index);

    if (index === -1) {
        return;
    }

    handleEnd = index;
    code = value.charCodeAt(index);

    if (code === CC_SLASH) {
        index++;
        projectStart = index;
        index = getProjectEndPosition(value, projectStart);

        if (index === -1) {
            return;
        }

        projectEnd = index;
        code = value.charCodeAt(projectEnd);
    }

    if (code === CC_HASH) {
        suffix = ISSUE;
        test = getIssueEndPosition;
    } else if (code === CC_AT) {
        suffix = COMMIT;
        test = getSHAEndPosition;
    } else {
        return;
    }

    delimiter = value.charAt(index);
    index++;
    referenceStart = index;

    index = test(value, referenceStart);

    if (index === -1 || isValidUserNameCharacter(value.charCodeAt(index))) {
        return;
    }

    content = reference = value.slice(referenceStart, index);

    /* istanbul ignore if - maybe used by plug-ins */
    if (silent) {
        return true;
    }

    handle = value.slice(0, handleEnd);
    project = projectEnd && value.slice(projectStart, projectEnd);
    href = gh(handle, project || self.github.project);
    subvalue = value.slice(0, index);
    handle += (project ? C_SLASH + project : EMPTY) + delimiter;
    add = eat(subvalue);
    href += suffix + C_SLASH + reference;

    if (suffix === COMMIT) {
        node = add(self.renderLink(true, href, handle, null, now, eat));

        node.children.push({
            'type': T_INLINE_CODE,
            'value': abbr(content)
        });

        return node;
    }

    return add(self.renderLink(true, href, handle + content, null, now, eat));
}

tokenizeRepoReference.locator = locateRepoReference;
tokenizeRepoReference.notInLink = true;

/**
 * Parse a link and determine whether it links to GitHub.
 *
 * @param {LinkNode} node - Link node.
 * @return {Object?} - Information.
 */
function parseLink(node) {
    var link = {};
    var url = node.url || /* istanbul ignore next - remark@<4.0.0 */ node.href;
    var start;
    var end;
    var page;

    if (
        url.slice(0, GH_URL_PREFIX_LENGTH) !== GH_URL_PREFIX ||
        node.children.length !== 1 ||
        node.children[0].type !== T_TEXT ||
        toString(node).slice(0, GH_URL_PREFIX_LENGTH) !== GH_URL_PREFIX
    ) {
        return;
    }

    start = GH_URL_PREFIX_LENGTH;
    end = getUserNameEndPosition(url, GH_URL_PREFIX_LENGTH);

    if (end === -1 || url.charCodeAt(end) !== CC_SLASH) {
        return;
    }

    link.user = url.slice(start, end);

    start = end + 1;
    end = getUserNameEndPosition(url, start);

    if (end === -1 || url.charCodeAt(end) !== CC_SLASH) {
        return;
    }

    link.project = url.slice(start, end);

    start = end + 1;
    end = url.indexOf(C_SLASH, start);

    if (end === -1) {
        return;
    }

    page = url.slice(start, end);

    if (page !== COMMIT && page !== ISSUE && page !== PULL) {
        return;
    }

    link.page = page;
    start = end + 1;

    if (page === COMMIT) {
        end = getSHAEndPosition(url, start, true);
    } else {
        end = getIssueEndPosition(url, start);
    }

    if (end === -1) {
        return;
    }

    link.reference = url.slice(start, end);
    link.comment = url.charCodeAt(end) === CC_HASH &&
        url.length > end + 1;

    return link;
}

/**
 * Attacher.
 *
 * @param {Remark} remark - Instance.
 * @param {Object?} [options] - Configuration.
 * @return {Function} - Transformer.
 */
function attacher(remark, options) {
    var repo = (options || {}).repository;
    var proto = remark.Parser.prototype;
    var scope = proto.inlineTokenizers;
    var methods = proto.inlineMethods;
    var pack;

    /*
     * Get the repo from `package.json`.
     */

    if (!repo) {
        try {
            pack = require(require('path').resolve(
                proc.cwd(), 'package.json'
            ));
        } catch (exception) {
            pack = {};
        }

        if (pack.repository) {
            repo = pack.repository.url || pack.repository;
        } else {
            repo = EMPTY;
        }
    }

    /*
     * Parse the URL.
     * See the tests for all possible URL kinds.
     */

    repo = REPOSITORY.exec(repo);

    REPOSITORY.lastIndex = 0;

    if (!repo) {
        throw new Error('Missing `repository` field in `options`');
    }

    repo = {
        'user': repo[1],
        'project': repo[2]
    };

    /*
     * Add tokenizers to the `Parser`.
     */

    scope.mention = tokenizeMention;
    scope.issue = tokenizeIssue;
    scope.hash = tokenizeHash;
    scope.repoReference = tokenizeRepoReference;

    proto.github = repo;

    /*
     * Specify order (just before `inlineText`).
     */

    methods.splice(methods.indexOf('inlineText'), 0,
        'mention',
        'issue',
        'hash',
        'repoReference'
    );

    /**
     * Transformer.
     *
     * @param {Node} tree - Root node.
     */
    function transformer(tree) {
        visit(tree, T_LINK, function (node) {
            var link = parseLink(node);
            var children;
            var base;
            var comment;

            if (!link) {
                return;
            }

            comment = link.comment ? MESSAGE_COMMENT : EMPTY;

            if (link.project !== repo.project) {
                base = link.user + C_SLASH + link.project;
            } else if (link.user !== repo.user) {
                base = link.user;
            } else {
                base = EMPTY;
            }

            if (link.page !== COMMIT) {
                base += C_HASH;

                children = [
                    {
                        'type': T_TEXT,
                        'value': base + abbr(link.reference) + comment
                    }
                ];
            } else {
                children = [];

                if (base) {
                    children.push({
                        'type': T_TEXT,
                        'value': base + C_AT
                    });
                }

                children.push({
                    'type': T_INLINE_CODE,
                    'value': abbr(link.reference)
                });

                if (link.comment) {
                    children.push({
                        'type': T_TEXT,
                        'value': comment
                    });
                }
            }

            node.children = children;
        });
    }

    return transformer;
}

/*
 * Expose.
 */

module.exports = attacher;
