import type { StreamTextEvent } from '../src/types/event'

import { describe, expect, it } from 'vitest'

import { streamText } from '../src'

describe('@xsai/stream-text basic', async () => {
  it('basic', async () => {
    const { fullStream, steps, textStream } = streamText({
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
      model: 'granite4:1b-h',
      seed: 114514,
    })

    let text = ''
    for await (const t of textStream) {
      text += t
    }
    expect(text.toUpperCase()).toBe('YES')

    const events: StreamTextEvent[] = []
    for await (const event of fullStream) {
      events.push(event.type === 'text-delta'
        ? {
            ...event,
            // Yes => YES
            text: event.text.toUpperCase(),
          }
        : event,
      )
    }
    expect(events).toMatchSnapshot()

    await expect(steps).resolves.toMatchSnapshot()
  })

  it('stream', async () => {
    const { fullStream, steps, textStream } = streamText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'tell me a joke',
          role: 'user',
        },
      ],
      model: 'granite4:350m-h',
      seed: 114514,
    })

    const text = []
    for await (const t of textStream) {
      text.push(t)
    }
    expect(text.length).toBeGreaterThan(1)

    const events: StreamTextEvent[] = []
    for await (const event of fullStream) {
      events.push(event)
    }
    expect(events).toMatchSnapshot()

    await expect(steps).resolves.toMatchSnapshot()
  })

  it('includes usage', async () => {
    const { fullStream, steps, textStream } = streamText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'Please tell a short joke',
          role: 'user',
        },
      ],
      model: 'granite4:350m-h',
      seed: 114514,
      streamOptions: {
        includeUsage: true,
      },
    })

    const text = []
    for await (const t of textStream) {
      text.push(t)
    }
    expect(text.length).toBeGreaterThan(1)

    const events: StreamTextEvent[] = []
    for await (const event of fullStream) {
      events.push(event)
    }
    expect(events).toMatchSnapshot()

    await expect(steps).resolves.toMatchSnapshot()
  })

  it('reasoning', async () => {
    const { reasoningTextStream } = streamText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [{
        content: 'How many letter r are in strawberry?',
        role: 'user',
      }],
      model: 'qwen3:0.6b',
      seed: 114514,
    })

    const reasoningText = []
    for await (const t of reasoningTextStream) {
      reasoningText.push(t)
    }
    expect(reasoningText.length).toBeGreaterThan(1)
  })
})
