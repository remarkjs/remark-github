'use strict'

/* eslint-disable import/no-extraneous-dependencies */

var fs = require('fs')
var path = require('path')
var test = require('tape')
var remark = require('remark')
var remarkGitHub = require('..')

var join = path.join
var read = fs.readFileSync
var readdir = fs.readdirSync

var ROOT = join(__dirname, 'fixtures')

var fixtures = readdir(ROOT)

test('remark-github()', function(t) {
  t.equal(typeof remarkGitHub, 'function', 'should be a function')

  t.doesNotThrow(function() {
    remark()
      .use(remarkGitHub)
      .freeze()
  }, 'should not throw if not passed options')

  t.equal(
    github('@mention'),
    '[**@mention**](https://github.com/blog/821)\n',
    'should wrap mentions in `strong` by default'
  )

  t.equal(
    github('@mention', {mentionStrong: false}),
    '[@mention](https://github.com/blog/821)\n',
    'should support `mentionStrong: false`'
  )

  t.end()
})

test('Fixtures', function(t) {
  fixtures
    .filter(function(filepath) {
      return filepath.indexOf('.') !== 0
    })
    .forEach(function(fixture) {
      var filepath = join(ROOT, fixture)
      var output = read(join(filepath, 'output.md'), 'utf-8')
      var input = read(join(filepath, 'input.md'), 'utf-8')
      var result = github(input, 'wooorm/remark')

      t.equal(result, output, 'should work on `' + fixture + '`')
    })

  t.end()
})

/* List of repo references possible in `package.json`s.
 * From repo-utils/parse-github-repo-url, with some
 * tiny additions. */
var repositories = [
  ['component/emitter', 'component', 'emitter'],
  ['https://github.com/component/emitter', 'component', 'emitter'],
  ['git://github.com/component/emitter.git', 'component', 'emitter'],
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
  ['component/emitter#1', 'component', 'emitter'],
  ['component/emitter@1', 'component', 'emitter'],
  ['component/emitter#"1"', 'component', 'emitter'],
  ['component/emitter@"1"', 'component', 'emitter'],
  ['git://github.com/component/emitter.git#1', 'component', 'emitter'],
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
  ['mame/_', 'mame', '_'],
  ['github/.gitignore', 'github', '.gitignore'],
  ['github/.gitc', 'github', '.gitc'],
  ['Qix-/color-convert', 'Qix-', 'color-convert'],
  ['wooorm/wooorm.github.io', 'wooorm', 'wooorm.github.io']
]

test('Repositories', function(t) {
  repositories.forEach(function(repo) {
    var user = repo[1]
    var project = repo[2]

    repo = repo[0]

    t.equal(
      github(
        [
          '-   SHA: a5c3785ed8d6a35868bc169f07e40e889087fd2e',
          '-   User@SHA: wooorm@a5c3785ed8d6a35868bc169f07e40e889087fd2e',
          '-   # Num: #26',
          '-   GH-Num: GH-26',
          '-   User#Num: wooorm#26',
          ''
        ].join('\n'),
        repo
      ),
      [
        '-   SHA: [`a5c3785`](https://github.com/' +
          user +
          '/' +
          project +
          '/commit/a5c3785ed8d6a35868bc169f07e40e' +
          '889087fd2e)',
        '-   User@SHA: [wooorm@`a5c3785`](https://github.com/wooorm/' +
          project +
          '/commit/a5c3785ed8d6a35868bc169f07e40e' +
          '889087fd2e)',
        '-   # Num: [#26](https://github.com/' +
          user +
          '/' +
          project +
          '/issues/26)',
        '-   GH-Num: [GH-26](https://github.com/' +
          user +
          '/' +
          project +
          '/issues/26)',
        '-   User#Num: [wooorm#26](https://github.com/wooorm/' +
          project +
          '/issues/26)',
        ''
      ].join('\n'),
      'should work on `' + repo + '`'
    )
  })

  t.end()
})

/* Miscellaneous. */
test('Miscellaneous', function(t) {
  var original = process.cwd()

  t.equal(
    github('test@12345678', null),
    '[test@`1234567`](https://github.com/' +
      'test/remark-github/commit/12345678)\n',
    'should load a `package.json` when available'
  )

  process.chdir(__dirname)

  t.equal(
    github('12345678', null),
    '[`1234567`](https://github.com/wooorm/remark/commit/12345678)\n',
    'should accept a `repository.url` in a `package.json`'
  )

  process.chdir(join(__dirname, 'fixtures'))

  t.throws(
    function() {
      github('1234567', null)
    },
    /Missing `repository`/,
    'should throw without `repository`'
  )

  process.chdir(original)

  t.end()
})

/* Shortcut to process. */
function github(value, repo) {
  var options

  if (typeof repo === 'string' || !repo) {
    options = {repository: repo || null}
  } else {
    options = repo
  }

  return remark()
    .use(remarkGitHub, options)
    .processSync(value)
    .toString()
}
