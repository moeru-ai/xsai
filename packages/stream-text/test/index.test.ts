import type { Event } from '@xsai/shared-chat'

import type { StreamTextChunkResult } from '../src/types/chunk'

import { describe, expect, it } from 'vitest'

import { streamText } from '../src'

describe('@xsai/stream-text basic', async () => {
  it('basic', async () => {
    const { eventStream, fullStream, reasoningTextStream, steps, textStream } = streamText({
      baseURL: 'http://localhost:11434/v1/',
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
      model: 'qwen3.5:2b',
      seed: 114514,
      streamOptions: {
        includeUsage: true,
      },
    })

    const reasoningText = []
    for await (const t of reasoningTextStream) {
      reasoningText.push(t)
    }
    expect(reasoningText.length).toBeGreaterThan(1)

    let text = ''
    for await (const t of textStream) {
      text += t
    }
    expect(text.toUpperCase()).toBe('YES')

    const events: Event[] = []
    for await (const event of eventStream) {
      events.push(event.type === 'text.delta' || event.type === 'text.done'
        ? {
            ...event,
            // Yes => YES
            ...(event.type === 'text.delta'
              ? { delta: event.delta.toUpperCase() }
              : { content: event.content.toUpperCase() }),
          }
        : event,
      )
    }
    expect(events).toMatchSnapshot()

    const chunks: StreamTextChunkResult[] = []
    for await (const chunk of fullStream) {
      chunks.push(chunk)
    }
    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks.every(chunk => chunk.object === 'chat.completion.chunk')).toBe(true)
    expect(chunks.some(chunk => chunk.usage != null)).toBe(true)

    await expect(steps).resolves.toMatchSnapshot()
  })
})
