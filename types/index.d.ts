// TypeScript Version: 3.4

import {Plugin} from 'unified'

declare namespace remarkGithub {
  type Github = Plugin<[RemarkGithubOptions?]>

  interface RemarkGithubOptions {
    /**
     * Wrap mentions in `<strong>`, true by default.
     * @defaultValue true
     */
    mentionStrong?: boolean

    /**
     * Repository to link against.
     */
    repository?: string
  }
}

declare const remarkGithub: remarkGithub.Github

export = remarkGithub
