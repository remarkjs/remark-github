/**
 * @typedef {import('type-fest').PackageJson} PackageJson
 * @typedef {import('../index.js').Options} Options
 */

import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import test from 'tape'
import {remark} from 'remark'
import remarkGfm from 'remark-gfm'
import remarkGitHub from '../index.js'

const join = path.join
const read = fs.readFileSync
const readdir = fs.readdirSync

const root = join('test', 'fixtures')

const fixtures = readdir(root)

test('remark-github()', (t) => {
  t.equal(typeof remarkGitHub, 'function', 'should be a function')

  t.doesNotThrow(() => {
    remark().use(remarkGitHub).freeze()
  }, 'should not throw if not passed options')

  t.equal(
    github('@wooorm'),
    '[**@wooorm**](https://github.com/wooorm)\n',
    'should wrap mentions in `strong` by default'
  )

  t.equal(
    github('@wooorm', {mentionStrong: false}),
    '[@wooorm](https://github.com/wooorm)\n',
    'should support `mentionStrong: false`'
  )

  t.end()
})

test('Fixtures', (t) => {
  let index = -1

  while (++index < fixtures.length) {
    const fixture = fixtures[index]
    if (fixture.charAt(0) === '.') continue
    const filepath = join(root, fixture)
    const output = read(join(filepath, 'output.md'), 'utf-8')
    const input = read(join(filepath, 'input.md'), 'utf-8')
    const result = github(input, 'wooorm/remark')

    t.doesNotThrow(() => {
      const results = result.split('\n')
      const outputs = output.split('\n')
      let index = -1

      assert.strictEqual(
        results.length,
        outputs.length,
        'should be same length'
      )

      while (++index < results.length) {
        const resultLine = results[index]
        if (resultLine !== '') {
          assert.strictEqual(resultLine, outputs[index], resultLine)
        }
      }
    }, 'should work on `' + fixture + '`')
  }

  t.end()
})

// List of repo references possible in `package.json`s.
// From repo-utils/parse-github-repo-url, with some tiny additions.
const repositories = [
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
  ['example/example.github.io', 'example', 'example.github.io']
]

test('Repositories', (t) => {
  let index = -1

  while (++index < repositories.length) {
    const repo = repositories[index]
    const user = repo[1]
    let project = repo[2]
    const value = repo[0]

    if (project === '_') project = '\\_'

    t.equal(
      github(
        [
          '*   SHA: a5c3785ed8d6a35868bc169f07e40e889087fd2e',
          '*   User@SHA: wooorm@a5c3785ed8d6a35868bc169f07e40e889087fd2e',
          '*   # Num: #26',
          '*   GH-Num: GH-26',
          '*   User#Num: wooorm#26',
          ''
        ].join('\n'),
        value
      ),
      [
        '*   SHA: [`a5c3785`](https://github.com/' +
          user +
          '/' +
          project +
          '/commit/a5c3785ed8d6a35868bc169f07e40e' +
          '889087fd2e)',
        '*   User\\@SHA: [wooorm@`a5c3785`](https://github.com/wooorm/' +
          project +
          '/commit/a5c3785ed8d6a35868bc169f07e40e' +
          '889087fd2e)',
        '*   # Num: [#26](https://github.com/' +
          user +
          '/' +
          project +
          '/issues/26)',
        '*   GH-Num: [GH-26](https://github.com/' +
          user +
          '/' +
          project +
          '/issues/26)',
        '*   User#Num: [wooorm#26](https://github.com/wooorm/' +
          project +
          '/issues/26)',
        ''
      ].join('\n'),
      'should work on `' + value + '`'
    )
  }

  t.end()
})

test('Miscellaneous', (t) => {
  const original = process.cwd()

  t.equal(
    github('test@12345678', null),
    '[test@`1234567`](https://github.com/' +
      'test/remark-github/commit/12345678)\n',
    'should load a `package.json` when available'
  )

  process.chdir(path.join(process.cwd(), 'test'))

  t.equal(
    github('12345678', null),
    '[`1234567`](https://github.com/wooorm/remark/commit/12345678)\n',
    'should accept a `repository.url` in a `package.json`'
  )

  process.chdir(join(process.cwd(), 'fixtures'))

  t.throws(
    () => {
      github('1234567', null)
    },
    /Missing `repository`/,
    'should throw without `repository`'
  )

  process.chdir(original)

  t.end()
})

/***
 * Shortcut to process.
 *
 * @param {string} value
 * @param {string|Options|null} [repo]
 */
function github(value, repo) {
  const options =
    typeof repo === 'string' || !repo ? {repository: repo || undefined} : repo

  return remark()
    .use(remarkGfm)
    .use(remarkGitHub, options)
    .processSync(value)
    .toString()
}
