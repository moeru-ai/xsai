import { ollama } from '@xsai/providers'
import { clean } from '@xsai/shared'
import { tool } from '@xsai/tool'
import { description, object, pipe, string } from 'valibot'
import { beforeAll, describe, expect, it } from 'vitest'

import type { StreamTextChunkResult } from '../src'

import { streamText } from '../src'

// make TS happy
// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#browser_compatibility
declare global {
  interface ReadableStream<R = any> {
    // eslint-disable-next-line ts/method-signature-style
    [Symbol.asyncIterator](): AsyncIterableIterator<R>
  }
}

describe('@xsai/stream-text', () => {
  it('basic', async () => {
    const { textStream } = await streamText({
      ...ollama.chat('llama3.2'),
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, so please answer \'YES\' and nothing else.',
          role: 'user',
        },
      ],
      // streamOptions: { usage: true },
    })

    const result: string[] = []

    for await (const textPart of textStream) {
      result.push(textPart)
    }

    expect(result.join('')).toStrictEqual('YES')
  })

  it('the-quick-brown-fox', async () => {
    let onChunkCount = 0
    let chunkCount = 0

    const { chunkStream, textStream } = await streamText({
      ...ollama.chat('llama3.2'),
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, so please answer \'The quick brown fox jumps over the lazy dog.\' and nothing else.',
          role: 'user',
        },
      ],
      onChunk: () => { onChunkCount++ },
    })

    const chunk: StreamTextChunkResult[] = []
    const text: string[] = []

    for await (const chunkPart of chunkStream) {
      chunk.push(clean({
        ...chunkPart,
        created: undefined,
        id: undefined,
      }))
      chunkCount++
    }

    for await (const textPart of textStream) {
      text.push(textPart)
    }

    expect(text.join('')).toBe('The quick brown fox jumps over the lazy dog.')
    expect(text).toMatchSnapshot()
    expect(chunk).toMatchSnapshot()

    expect(onChunkCount).toMatchSnapshot(chunkCount)
  })

  describe('with tool', () => {
    let weather: Awaited<ReturnType<typeof tool>>

    beforeAll(async () => {
      weather = await tool({
        description: 'Get the weather in a location',
        execute: ({ location }) => JSON.stringify({
          location,
          temperature: 10,
        }),
        name: 'weather',
        parameters: object({
          location: pipe(
            string(),
            description('The location to get the weather for'),
          ),
        }),
      })
    })

    it('stream chunk', async () => {
      const { chunkStream } = await streamText({
        ...ollama.chat('mistral-nemo'),
        maxSteps: 2,
        messages: [
          {
            content: 'You are a helpful assistant.',
            role: 'system',
          },
          {
            content: 'What is the weather in San Francisco? do not answer anything else.',
            role: 'user',
          },
        ],
        seed: 42,
        toolChoice: 'required',
        tools: [weather],
      })

      const textResult = []
      for await (const chunk of chunkStream) {
        textResult.push(chunk)
      }

      expect(textResult.join('').length).greaterThan(0)
    }, 20000)

    it('stream step', async () => {
      const { stepStream } = await streamText({
        ...ollama.chat('mistral-nemo'),
        maxSteps: 2,
        messages: [
          {
            content: 'You are a helpful assistant.',
            role: 'system',
          },
          {
            content: 'What is the weather in San Francisco? do not answer anything else.',
            role: 'user',
          },
        ],
        seed: 42,
        toolChoice: 'required',
        tools: [weather],
      })

      const stepResult = []
      for await (const step of stepStream) {
        stepResult.push(step)
      }

      expect(stepResult).toHaveLength(2)
    }, 20000)

    it('stream text', async () => {
      const { textStream } = await streamText({
        ...ollama.chat('mistral-nemo'),
        maxSteps: 2,
        messages: [
          {
            content: 'You are a helpful assistant.',
            role: 'system',
          },
          {
            content: 'What is the weather in San Francisco? do not answer anything else.',
            role: 'user',
          },
        ],
        seed: 42,
        toolChoice: 'required',
        tools: [weather],
      })

      const textResult = []
      for await (const text of textStream) {
        textResult.push(text)
      }

      expect(textResult.join('').length).greaterThan(0)
    }, 20000)

    it('onChunk', async () => {
      const chunks = []

      const { textStream } = await streamText({
        ...ollama.chat('mistral-nemo'),
        maxSteps: 2,
        messages: [
          {
            content: 'You are a helpful assistant.',
            role: 'system',
          },
          {
            content: 'What is the weather in San Francisco? do not answer anything else.',
            role: 'user',
          },
        ],
        onChunk: chunk => chunks.push(chunk),
        seed: 42,
        toolChoice: 'required',
        tools: [weather],
      })

      for await (const _ of textStream) { ; }

      expect(chunks.length).greaterThan(0)
    }, 20000)

    it('onStepFinish', async () => {
      const steps = []

      const { textStream } = await streamText({
        ...ollama.chat('mistral-nemo'),
        maxSteps: 2,
        messages: [
          {
            content: 'You are a helpful assistant.',
            role: 'system',
          },
          {
            content: 'What is the weather in San Francisco? do not answer anything else.',
            role: 'user',
          },
        ],
        onStepFinish: step => steps.push(step),
        seed: 42,
        toolChoice: 'required',
        tools: [weather],
      })

      for await (const _ of textStream) { ; }

      expect(steps.length).greaterThan(0)
    }, 20000)

    it('onFinsh', async () => {
      let steps = []

      const { textStream } = await streamText({
        ...ollama.chat('mistral-nemo'),
        maxSteps: 2,
        messages: [
          {
            content: 'You are a helpful assistant.',
            role: 'system',
          },
          {
            content: 'What is the weather in San Francisco? do not answer anything else.',
            role: 'user',
          },
        ],
        onFinish: s => (steps = s),
        seed: 42,
        toolChoice: 'required',
        tools: [weather],
      })

      for await (const _ of textStream) { ; }

      expect(steps.length).greaterThan(0)
    }, 20000)
  })
})
