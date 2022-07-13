/**
 * @typedef {import('type-fest').PackageJson} PackageJson
 */

import fs from 'fs'
import path from 'path'

/**
 * Get the repository from `package.json`.
 *
 * @param {string} cwd
 * @returns {string|undefined}
 */
export function getRepoFromPackage(cwd) {
  /** @type {PackageJson|undefined} */
  let pkg

  try {
    pkg = JSON.parse(String(fs.readFileSync(path.join(cwd, 'package.json'))))
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
