import { clean } from '@xsai/shared'
import { tool } from '@xsai/tool'
import { description, number, object, pipe } from 'valibot'
import { describe, expect, it } from 'vitest'

import type { StreamTextChunkResult } from '../src/_transform-chunk'

import { streamText } from '../src'

// make TS happy
// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#browser_compatibility
declare global {
  interface ReadableStream<R = any> {
    // eslint-disable-next-line ts/method-signature-style
    [Symbol.asyncIterator](): AsyncIterableIterator<R>
  }
}

describe('@xsai/stream-text-new', async () => {
  const add = await tool({
    description: 'Adds two numbers',
    execute: ({ a, b }) => (a + b).toString(),
    name: 'weather',
    parameters: object({
      a: pipe(
        number(),
        description('First number'),
      ),
      b: pipe(
        number(),
        description('Second number'),
      ),
    }),
  })

  const cleanChunk = (chunk: StreamTextChunkResult) => clean({
    ...chunk,
    created: undefined,
    id: undefined,
  })

  it('chunkStream', async () => {
    const { chunkStream, textStream } = await streamText({
      baseURL: 'http://localhost:11434/v1/',
      maxSteps: 2,
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'How many times does 114514 plus 1919810 equal? Please try to call the tool to solve the problem.',
          role: 'user',
        },
      ],
      model: 'PetrosStav/gemma3-tools:4b',
      seed: 114514,
      toolChoice: 'required',
      tools: [add],
    })

    const chunkResult = []
    for await (const chunk of chunkStream) {
      chunkResult.push(cleanChunk(chunk))
    }

    let textResult = ''
    for await (const text of textStream) {
      textResult += text
    }

    expect(chunkResult).toMatchSnapshot()
    expect(textResult).toMatchSnapshot()
  }, 30000)
})
