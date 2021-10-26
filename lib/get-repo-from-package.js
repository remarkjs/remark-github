/**
 * @typedef {import('type-fest').PackageJson} PackageJson
 */

import fs from 'fs'
import process from 'process'
import path from 'path'

/**
 * Get the repository from `package.json`.
 *
 * @returns {string|undefined}
 */
export function getRepoFromPackage() {
  /** @type {PackageJson|undefined} */
  let pkg

  try {
    pkg = JSON.parse(
      String(fs.readFileSync(path.join(process.cwd(), 'package.json')))
    )
  } catch {}

  const repository =
    pkg && pkg.repository
      ? // Object form.
        /* c8 ignore next 2 */
        typeof pkg.repository === 'object'
        ? pkg.repository.url
        : pkg.repository
      : ''

  return repository
}
