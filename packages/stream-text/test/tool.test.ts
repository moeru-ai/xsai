import { ollama } from '@xsai/providers'
import * as sharedChat from '@xsai/shared-chat'
import { tool } from '@xsai/tool'
import { description, object, pipe, string } from 'valibot'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

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

      const chunkResult = []
      for await (const chunk of chunkStream) {
        chunkResult.push(chunk)
      }

      expect(chunkResult.length).toBeGreaterThan(0)
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

      await expect(textStream.pipeTo(new WritableStream({ write() {} }))).resolves.toBeUndefined()

      expect(chunks.length).toBeGreaterThan(0)
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

      await expect(textStream.pipeTo(new WritableStream({ write() {} }))).resolves.toBeUndefined()

      expect(steps.length).toBeGreaterThan(0)
    }, 20000)

    it('onFinish', async () => {
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

      await expect(textStream.pipeTo(new WritableStream({ write() {} }))).resolves.toBeUndefined()

      expect(steps.length).toBeGreaterThan(0)
    }, 20000)

    it('tool result', async () => {
      const date = await tool({
        description: 'Get the date in a location',
        execute: ({ location }) => JSON.stringify({
          day: 10,
          location,
          month: 10,
          year: 2024,
        }),
        name: 'date',
        parameters: object({
          location: pipe(
            string(),
            description('The location to get the date for'),
          ),
        }),
      })

      const { stepStream } = await streamText({
        ...ollama.chat('mistral-nemo'),
        maxSteps: 2,
        messages: [
          {
            content: 'You are a helpful assistant.',
            role: 'system',
          },
          {
            content: 'What is the weather and date in San Francisco? do not answer anything else.',
            role: 'user',
          },
        ],
        seed: 42,
        toolChoice: 'required',
        tools: [weather, date],
      })

      const steps = []
      for await (const step of stepStream) {
        steps.push(step)
      }

      expect(steps).toHaveLength(2)
      expect(steps[0].toolCalls).toHaveLength(2)
      expect(steps[0].toolResults).toHaveLength(2)
    })
  }, 20_000)

  describe('with tool error', () => {
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

    afterEach(() => {
      vi.resetAllMocks()
    })

    it('should throw error when network error', async () => {
      vi.mock('@xsai/shared', async (importOriginal) => {
        return {
          ...(await importOriginal<typeof import('@xsai/shared')>()),
          // eslint-disable-next-line sonarjs/no-nested-functions
          chat: async () => { throw new Error('Network error') },
        }
      })

      vi.spyOn(sharedChat, 'chat')
        .mockImplementation(async () => { throw new Error('Network error') })

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

      await expect(
        textStream.pipeTo(new WritableStream({ write() {} })),
      ).rejects.toThrow()
    }, 20000)

    it('should output empty text stream when max steps reached', async () => {
      const { chunkStream, stepStream, textStream } = await streamText({
        ...ollama.chat('mistral-nemo'),
        maxSteps: 1, // Set very low max steps
        messages: [
          {
            content: 'You are a helpful assistant.',
            role: 'system',
          },
          {
            content: 'What is the weather in San Francisco?',
            role: 'user',
          },
        ],
        seed: 42,
        toolChoice: 'required',
        tools: [weather],
      })

      const chunks = []
      for await (const chunk of chunkStream) {
        chunks.push(chunk)
      }

      const steps = []
      for await (const step of stepStream) {
        steps.push(step)
      }

      const texts = []
      for await (const text of textStream) {
        texts.push(text)
      }

      expect(chunks.length).toBeGreaterThan(0)
      expect(steps.length).toBe(1)
      expect(texts.length).toBe(0)
    }, 20000)
  })
})
