/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:github:test
 * @fileoverview Test suite for mdast-github.
 */

'use strict';

/* eslint-env node, mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var mdast = require('mdast');
var mdastGitHub = require('..');

/*
 * Methods.
 */

var read = fs.readFileSync;
var readdir = fs.readdirSync;
var equal = assert.strictEqual;

/*
 * Constants.
 */

var ROOT = path.join(__dirname, 'fixtures');

/*
 * Fixtures.
 */

var fixtures = readdir(ROOT);

/**
 * Shortcut to process.
 *
 * @param {string} value - Value to process.
 * @param {string|Object} repo - Repository.
 * @return {string}
 */
function github(value, repo) {
    var options;

    if (typeof repo === 'string' || !repo) {
        options = {
            'repository': repo || null
        };
    } else {
        options = repo;
    }

    return mdast.use(mdastGitHub, options).process(value);
}

/*
 * Tests.
 */

describe('mdast-github()', function () {
    it('should be a function', function () {
        equal(typeof mdastGitHub, 'function');
    });

    it('should not throw if not passed options', function () {
        assert.doesNotThrow(function () {
            mdast.use(mdastGitHub);
        });
    });
});

/**
 * Describe a fixtures.
 *
 * @param {string} fixture - Name / file-path.
 */
function describeFixture(fixture) {
    it('should work on `' + fixture + '`', function () {
        var filepath = ROOT + '/' + fixture;
        var output = read(filepath + '/output.md', 'utf-8');
        var input = read(filepath + '/input.md', 'utf-8');
        var result = github(input, 'wooorm/mdast');

        equal(result, output);
    });
}

/**
 * Describe a repo URL.
 *
 * @param {Array.<string>} repo - Tuple of user and
 *   project.
 */
function describeRepository(repo) {
    var user = repo[1];
    var project = repo[2];

    repo = repo[0];

    it('should work on `' + repo + '`', function () {
        var input;
        var output;

        input = [
            '-   SHA: a5c3785ed8d6a35868bc169f07e40e889087fd2e',
            '-   User@SHA: wooorm@a5c3785ed8d6a35868bc169f07e40e889087fd2e',
            '-   \# Num: #26',
            '-   GH-Num: GH-26',
            '-   User#Num: wooorm#26'
        ].join('\n') + '\n';

        output = [
            '-   SHA: [a5c3785](https://github.com/' + user + '/' + project +
                '/commit/a5c3785ed8d6a35868bc169f07e40e889087fd2e)',
            '-   User@SHA: [wooorm@a5c3785](https://github.com/wooorm/' +
                project + '/commit/a5c3785ed8d6a35868bc169f07e40e889087fd2e)',
            '-   \# Num: [#26](https://github.com/' + user + '/' + project +
                '/issues/26)',
            '-   GH-Num: [GH-26](https://github.com/' + user + '/' + project +
                '/issues/26)',
            '-   User#Num: [wooorm#26](https://github.com/wooorm/' + project +
                '/issues/26)'
        ].join('\n') + '\n';

        equal(github(input, repo), output);
    });
}

/*
 * Gather fixtures.
 */

fixtures = fixtures.filter(function (filepath) {
    return filepath.indexOf('.') !== 0;
});

describe('Fixtures', function () {
    fixtures.forEach(describeFixture);
});

/*
 * List of repo references possible in `package.json`s.
 *
 * From repo-utils/parse-github-repo-url, with some
 * tiny additions.
 */

var repositories = [
    [
        'component/emitter',
        'component',
        'emitter'
    ],
    [
        'https://github.com/component/emitter',
        'component',
        'emitter'
    ],
    [
        'git://github.com/component/emitter.git',
        'component',
        'emitter'
    ],
    [
        'https://github.com/repos/component/emitter/tarball',
        'component',
        'emitter'
    ],
    [
        'https://github.com/repos/component/emitter/zipball',
        'component',
        'emitter'
    ],
    [
        'https://codeload.github.com/component/emitter/legacy.zip',
        'component',
        'emitter'
    ],
    [
        'https://codeload.github.com/component/emitter/legacy.tar.gz',
        'component',
        'emitter'
    ],
    [
        'component/emitter#1',
        'component',
        'emitter'
    ],
    [
        'component/emitter@1',
        'component',
        'emitter'
    ],
    [
        'component/emitter#"1"',
        'component',
        'emitter'
    ],
    [
        'component/emitter@"1"',
        'component',
        'emitter'
    ],
    [
        'git://github.com/component/emitter.git#1',
        'component',
        'emitter'
    ],
    [
        'https://github.com/repos/component/emitter/tarball/1',
        'component',
        'emitter'
    ],
    [
        'https://github.com/repos/component/emitter/zipball/1',
        'component',
        'emitter'
    ],
    [
        'https://codeload.github.com/component/emitter/legacy.zip/1',
        'component',
        'emitter'
    ],
    [
        'https://codeload.github.com/component/emitter/legacy.tar.gz/1',
        'component',
        'emitter'
    ],
    [
        'https://github.com/component/emitter/archive/1.tar.gz',
        'component',
        'emitter'
    ],
    [
        'github/.gitignore',
        'github',
        '.gitignore'
    ],
    [
        'github/.gitc',
        'github',
        '.gitc'
    ]
];

describe('Repositories', function () {
    repositories.forEach(describeRepository);
});

describe('Miscellaneous', function () {
    it('should load a `package.json` when available', function () {
        equal(
            github('test@12345678', null),
            '[test@1234567](https://github.com/' +
            'test/mdast-github/commit/12345678)\n'
        );
    });

    it('should accept a `repository.url` in a `package.json`', function () {
        var cwd = process.cwd;

        /**
         * Move cwd to a path without another
         * `package.json`.
         */
        function fakeCWD() {
            return cwd() + '/test';
        }

        process.cwd = fakeCWD;

        equal(
            github('12345678', null),
            '[1234567](https://github.com/' +
            'wooorm/mdast/commit/12345678)\n'
        );

        process.cwd = cwd;
    });

    it('should throw without `repository`', function () {
        var cwd = process.cwd;

        /**
         * Move cwd to a path without a `package.json`.
         */
        function fakeCWD() {
            return cwd() + '/test/fixtures';
        }

        process.cwd = fakeCWD;

        assert.throws(function () {
            github('1234567', null);
        }, /Missing `repository`/);

        process.cwd = cwd;
    });
});
