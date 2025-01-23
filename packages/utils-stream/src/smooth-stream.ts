// License for this File only:
//
// Copyright Vercel, Inc. (https://vercel.com)
// SPDX-License-Identifier: Apache-2.0

import { sleep } from './_sleep'

export interface SmoothStreamOptions {
  chunking?: 'line' | 'word' | RegExp
  delay?: number
}

const CHUNKING_REGEXPS = {
  // eslint-disable-next-line sonarjs/slow-regex
  line: /[^\n]*\n/,
  // eslint-disable-next-line sonarjs/slow-regex
  word: /\s*\S+\s+/,
}

/**
 * @experimental
 * Smooths text streaming output.
 */
export const smoothStream = ({ chunking = 'word', delay = 10 }: SmoothStreamOptions = {}): TransformStream<string, string> => {
  const chunkingRegexp
    = typeof chunking === 'string' ? CHUNKING_REGEXPS[chunking] : chunking

  let buffer = ''

  return new TransformStream<string, string>({
    transform: async (chunk, controller) => {
      buffer += chunk

      let match = chunkingRegexp.exec(buffer)
      while (match !== null) {
        const result = match[0]
        controller.enqueue(result)
        buffer = buffer.slice(result.length)

        match = chunkingRegexp.exec(buffer)

        await sleep(delay)
      }
    },
  })
}
