import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import process from 'node:process'
import test from 'node:test'
import {remark} from 'remark'
import remarkGfm from 'remark-gfm'
import {VFile} from 'vfile'
import remarkGithub, {defaultBuildUrl} from '../index.js'

test('remarkGithub', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('../index.js')).sort(), [
      'default',
      'defaultBuildUrl'
    ])
  })

  await t.test('should not throw if not passed options', async function () {
    assert.doesNotThrow(function () {
      remark().use(remarkGithub).freeze()
    })
  })

  await t.test(
    'should wrap mentions in `strong` by default',
    async function () {
      const file = await remark()
        .use(remarkGfm)
        .use(remarkGithub)
        .process('@wooorm')

      assert.equal(String(file), '[**@wooorm**](https://github.com/wooorm)\n')
    }
  )

  await t.test('should support `mentionStrong: false`', async function () {
    const file = await remark()
      .use(remarkGfm)
      .use(remarkGithub, {mentionStrong: false})
      .process('@wooorm')

    assert.equal(String(file), '[@wooorm](https://github.com/wooorm)\n')
  })

  await t.test(
    'should load a `package.json` when available',
    async function () {
      const file = await remark()
        .use(remarkGfm)
        .use(remarkGithub)
        .process(
          new VFile({
            cwd: new URL('..', import.meta.url).pathname,
            value: 'test@12345678'
          })
        )

      assert.equal(
        String(file),
        '[test@`1234567`](https://github.com/' +
          'test/remark-github/commit/12345678)\n'
      )
    }
  )

  await t.test(
    'should accept a `repository.url` in a `package.json`',
    async function () {
      const file = await remark()
        .use(remarkGfm)
        .use(remarkGithub)
        .process(
          new VFile({
            cwd: new URL('.', import.meta.url).pathname,
            value: '12345678'
          })
        )

      assert.equal(
        String(file),
        '[`1234567`](https://github.com/wooorm/remark/commit/12345678)\n'
      )
    }
  )

  await t.test('should throw without `repository`', async function () {
    try {
      await remark()
        .use(remarkGfm)
        .use(remarkGithub)
        .process(
          new VFile({
            cwd: new URL('fixtures', import.meta.url).pathname,
            value: '12345678'
          })
        )
      assert.fail()
    } catch (error) {
      assert.match(
        String(error),
        /Unexpected missing `repository` in `options`/
      )
    }
  })

  await t.test('should throw w/ incorrect `repository`', async function () {
    try {
      await remark()
        .use(remarkGfm)
        .use(remarkGithub, {repository: 'a'})
        .process('@wooorm')
      assert.fail()
    } catch (error) {
      assert.match(
        String(error),
        /Unexpected invalid `repository`, expected for example `user\/project`/
      )
    }
  })

  await t.test('should support `buildUrl` for mentions', async function () {
    const file = await remark()
      .use(remarkGfm)
      .use(remarkGithub, {
        buildUrl(values) {
          return values.type === 'mention'
            ? `https://github.yourcompany.com/${values.user}/`
            : defaultBuildUrl(values)
        }
      })
      .process('@wooorm')

    assert.equal(
      String(file),
      '[**@wooorm**](https://github.yourcompany.com/wooorm/)\n'
    )
  })

  await t.test('should support `buildUrl` for issues', async function () {
    const file = await remark()
      .use(remarkGfm)
      .use(remarkGithub, {
        buildUrl(values) {
          return values.type === 'issue'
            ? `https://github.yourcompany.com/${values.user}/${values.project}/issues/${values.no}`
            : defaultBuildUrl(values)
        }
      })
      .process('#123')

    assert.equal(
      String(file),
      '[#123](https://github.yourcompany.com/remarkjs/remark-github/issues/123)\n'
    )
  })

  await t.test('should support `buildUrl` for `GH-` issues', async function () {
    const file = await remark()
      .use(remarkGfm)
      .use(remarkGithub, {
        buildUrl(values) {
          return values.type === 'issue'
            ? `https://github.yourcompany.com/${values.user}/${values.project}/issues/${values.no}`
            : defaultBuildUrl(values)
        }
      })
      .process('GH-1')

    assert.equal(
      String(file),
      '[GH-1](https://github.yourcompany.com/remarkjs/remark-github/issues/1)\n'
    )
  })

  await t.test(
    'should support `buildUrl` for compare ranges',
    async function () {
      const file = await remark()
        .use(remarkGfm)
        .use(remarkGithub, {
          buildUrl(values) {
            return values.type === 'compare'
              ? `https://github.yourcompany.com/${values.user}/${values.project}/compare/${values.base}...${values.compare}`
              : defaultBuildUrl(values)
          }
        })
        .process('e2acebc...2aa9311')

      assert.equal(
        String(file),
        '[`e2acebc...2aa9311`](https://github.yourcompany.com/remarkjs/remark-github/compare/e2acebc...2aa9311)\n'
      )
    }
  )

  await t.test('should support `buildUrl` for commits', async function () {
    const file = await remark()
      .use(remarkGfm)
      .use(remarkGithub, {
        buildUrl(values) {
          return values.type === 'commit'
            ? `https://github.yourcompany.com/${values.user}/${values.project}/commit/${values.hash}`
            : defaultBuildUrl(values)
        }
      })
      .process('1f2a4fb')

    assert.equal(
      String(file),
      '[`1f2a4fb`](https://github.yourcompany.com/remarkjs/remark-github/commit/1f2a4fb)\n'
    )
  })

  await t.test(
    'should support `buildUrl` for cross-repo issues',
    async function () {
      const file = await remark()
        .use(remarkGfm)
        .use(remarkGithub, {
          buildUrl(values) {
            return values.type === 'issue'
              ? `https://github.yourcompany.com/${values.user}/${values.project}/issues/${values.no}`
              : defaultBuildUrl(values)
          }
        })
        .process('remarkjs/remark-github#1')

      assert.equal(
        String(file),
        '[#1](https://github.yourcompany.com/remarkjs/remark-github/issues/1)\n'
      )
    }
  )

  await t.test(
    'should support `buildUrl` for cross-repo commits',
    async function () {
      const file = await remark()
        .use(remarkGfm)
        .use(remarkGithub, {
          buildUrl(values) {
            return values.type === 'commit'
              ? `https://github.yourcompany.com/${values.user}/${values.project}/commit/${values.hash}`
              : defaultBuildUrl(values)
          }
        })
        .process('remarkjs/remark-github@1f2a4fb')

      assert.equal(
        String(file),
        '[@`1f2a4fb`](https://github.yourcompany.com/remarkjs/remark-github/commit/1f2a4fb)\n'
      )
    }
  )

  await t.test(
    'should support `buildUrl` returning `false` to not link something',
    async function () {
      const file = await remark()
        .use(remarkGfm)
        .use(remarkGithub, {
          buildUrl() {
            return false
          }
        })
        .process(
          '@user, #1, 1f2a4fb, e2acebc...2aa9311, remarkjs/remark-github#1, remarkjs/remark-github@1f2a4fb'
        )

      assert.equal(
        String(file),
        '@user, #1, 1f2a4fb, e2acebc...2aa9311, remarkjs/remark-github#1, remarkjs/remark-github\\@1f2a4fb\n'
      )
    }
  )
})

test('repositories', async function (t) {
  // List of repo references possible in `package.json`s.
  // From `repo-utils/parse-github-repo-url`, with some tiny additions.
  /** @type {ReadonlyArray<[string, string, string]>} */
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
  let index = -1

  while (++index < repositories.length) {
    const repo = repositories[index]
    const value = repo[0]
    const user = repo[1]
    const project = repo[2]

    await t.test('should work on `' + value + '`', async function () {
      const file = await remark()
        .use(remarkGfm)
        .use(remarkGithub, {repository: value})
        .process(
          [
            '* SHA: a5c3785ed8d6a35868bc169f07e40e889087fd2e',
            '* User@SHA: wooorm@a5c3785ed8d6a35868bc169f07e40e889087fd2e',
            '* # Num: #26',
            '* GH-Num: GH-26',
            '* User#Num: wooorm#26',
            ''
          ].join('\n')
        )

      assert.equal(
        String(file),
        [
          '* SHA: [`a5c3785`](https://github.com/' +
            user +
            '/' +
            project +
            '/commit/a5c3785ed8d6a35868bc169f07e40e' +
            '889087fd2e)',
          '* User\\@SHA: [wooorm@`a5c3785`](https://github.com/wooorm/' +
            project +
            '/commit/a5c3785ed8d6a35868bc169f07e40e' +
            '889087fd2e)',
          '* # Num: [#26](https://github.com/' +
            user +
            '/' +
            project +
            '/issues/26)',
          '* GH-Num: [GH-26](https://github.com/' +
            user +
            '/' +
            project +
            '/issues/26)',
          '* User#Num: [wooorm#26](https://github.com/wooorm/' +
            project +
            '/issues/26)',
          ''
        ].join('\n')
      )
    })
  }
})

test('fixtures', async function (t) {
  const base = new URL('fixtures/', import.meta.url)
  const folders = await fs.readdir(base)

  let index = -1

  while (++index < folders.length) {
    const folder = folders[index]

    if (folder.startsWith('.')) continue

    await t.test(folder, async function () {
      const folderUrl = new URL(folder + '/', base)
      const inputUrl = new URL('input.md', folderUrl)
      const outputUrl = new URL('output.md', folderUrl)

      const input = String(await fs.readFile(inputUrl))

      /** @type {string} */
      let output

      const proc = remark()
        .use(remarkGfm)
        .use(remarkGithub, {repository: 'wooorm/remark'})

      const actual = String(await proc.process(input))

      try {
        if ('UPDATE' in process.env) {
          throw new Error('Updating…')
        }

        output = String(await fs.readFile(outputUrl))
      } catch {
        output = actual
        await fs.writeFile(outputUrl, actual)
      }

      assert.equal(actual, String(output))
    })
  }
})
