/**
 * @typedef {import('type-fest').PackageJson} PackageJson
 * @typedef {import('../index.js').Options} Options
 */

import fs from 'fs'
import path from 'path'
import test from 'tape'
import {remark} from 'remark'
import remarkGfm from 'remark-gfm'
import {VFile} from 'vfile'
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
    const expected = read(join(filepath, 'output.md'), 'utf8')
    const input = read(join(filepath, 'input.md'), 'utf8')
    const actual = github(input, 'wooorm/remark')

    t.equal(actual, expected, 'should work on `' + fixture + '`')
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
    const project = repo[2]
    const value = repo[0]

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

test('Custom URL builder option', (t) => {
  t.equal(
    github('@wooorm', {
      buildUrl(values, defaultBuildUrl) {
        return values.type === 'mention'
          ? `https://github.yourcompany.com/${values.user}/`
          : defaultBuildUrl(values)
      }
    }),
    '[**@wooorm**](https://github.yourcompany.com/wooorm/)\n',
    'should support `buildUrl` for mentions'
  )

  t.equal(
    github('#123', {
      buildUrl(values, defaultBuildUrl) {
        return values.type === 'issue'
          ? `https://github.yourcompany.com/${values.user}/${values.project}/issues/${values.no}`
          : defaultBuildUrl(values)
      }
    }),
    '[#123](https://github.yourcompany.com/remarkjs/remark-github/issues/123)\n',
    'should support `buildUrl` for issues'
  )

  t.equal(
    github('GH-1', {
      buildUrl(values, defaultBuildUrl) {
        return values.type === 'issue'
          ? `https://github.yourcompany.com/${values.user}/${values.project}/issues/${values.no}`
          : defaultBuildUrl(values)
      }
    }),
    '[GH-1](https://github.yourcompany.com/remarkjs/remark-github/issues/1)\n',
    'should support `buildUrl` for `GH-` issues'
  )

  t.equal(
    github('e2acebc...2aa9311', {
      buildUrl(values, defaultBuildUrl) {
        return values.type === 'compare'
          ? `https://github.yourcompany.com/${values.user}/${values.project}/compare/${values.base}...${values.compare}`
          : defaultBuildUrl(values)
      }
    }),
    '[`e2acebc...2aa9311`](https://github.yourcompany.com/remarkjs/remark-github/compare/e2acebc...2aa9311)\n',
    'should support `buildUrl` for compare ranges'
  )

  t.equal(
    github('1f2a4fb', {
      buildUrl(values, defaultBuildUrl) {
        return values.type === 'commit'
          ? `https://github.yourcompany.com/${values.user}/${values.project}/commit/${values.hash}`
          : defaultBuildUrl(values)
      }
    }),
    '[`1f2a4fb`](https://github.yourcompany.com/remarkjs/remark-github/commit/1f2a4fb)\n',
    'should support `buildUrl` for commits'
  )

  t.equal(
    github('remarkjs/remark-github#1', {
      buildUrl(values, defaultBuildUrl) {
        return values.type === 'issue'
          ? `https://github.yourcompany.com/${values.user}/${values.project}/issues/${values.no}`
          : defaultBuildUrl(values)
      }
    }),
    '[#1](https://github.yourcompany.com/remarkjs/remark-github/issues/1)\n',
    'should support `buildUrl` for cross-repo issues'
  )

  t.equal(
    github('remarkjs/remark-github@1f2a4fb', {
      buildUrl(values, defaultBuildUrl) {
        return values.type === 'commit'
          ? `https://github.yourcompany.com/${values.user}/${values.project}/commit/${values.hash}`
          : defaultBuildUrl(values)
      }
    }),
    '[@`1f2a4fb`](https://github.yourcompany.com/remarkjs/remark-github/commit/1f2a4fb)\n',
    'should support `buildUrl` for cross-repo commits'
  )

  t.equal(
    github(
      '@user, #1, 1f2a4fb, e2acebc...2aa9311, remarkjs/remark-github#1, remarkjs/remark-github@1f2a4fb',
      {
        buildUrl() {
          return false
        }
      }
    ),
    '@user, #1, 1f2a4fb, e2acebc...2aa9311, remarkjs/remark-github#1, remarkjs/remark-github\\@1f2a4fb\n',
    'should support `buildUrl` returning `false` to not link something'
  )

  t.end()
})

test('Miscellaneous', (t) => {
  t.equal(
    github(
      new VFile({
        value: 'test@12345678',
        cwd: new URL('..', import.meta.url).pathname
      }),
      null
    ),
    '[test@`1234567`](https://github.com/' +
      'test/remark-github/commit/12345678)\n',
    'should load a `package.json` when available'
  )

  t.equal(
    github(
      new VFile({
        value: '12345678',
        cwd: new URL('.', import.meta.url).pathname
      }),
      null
    ),
    '[`1234567`](https://github.com/wooorm/remark/commit/12345678)\n',
    'should accept a `repository.url` in a `package.json`'
  )

  t.throws(
    () => {
      github(
        new VFile({
          value: '12345678',
          cwd: new URL('./fixtures', import.meta.url).pathname
        }),
        null
      )
    },
    /Missing or invalid `repository`/,
    'should throw without `repository`'
  )

  t.end()
})

/***
 * Shortcut to process.
 *
 * @param {string|VFile} value
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
