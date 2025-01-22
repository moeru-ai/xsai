export interface SmoothStreamOptions {
  chunking?: 'line' | 'word' | RegExp
  delay?: number
}

const sleep = async (delay: number) => delay === 0
  ? Promise.resolve()
  // eslint-disable-next-line @masknet/no-timer, @masknet/prefer-timer-id
  : new Promise(resolve => setTimeout(resolve, delay))

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
