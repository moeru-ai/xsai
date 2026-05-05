import type { StreamingEvent } from '../src/types/streaming-event'

import { tool } from '@xsai/tool'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { responses } from '../src'

describe('@xsai-ext/responses basic', async () => {
  it('basic', async () => {
    const { fullStream, textStream, totalUsage, usage } = responses({
      baseURL: 'http://localhost:11434/v1/',
      input: 'Hello!',
      instructions: 'You are a helpful assistant.',
      model: 'qwen3.5:0.8b',
    })

    let text = ''
    for await (const t of textStream) {
      text += t
    }

    const chunks: StreamingEvent[] = []
    for await (const chunk of fullStream) {
      chunks.push(chunk)
    }

    expect(text.length).toBeGreaterThan(1)
    expect(text).toMatchSnapshot()

    expect(chunks).toMatchSnapshot()
    expect(await usage).toMatchSnapshot()
    expect(await totalUsage).toMatchSnapshot()
  })

  it('tool calls', async () => {
    const add = await tool({
      description: 'Adds two numbers',
      execute: ({ a, b }) => (Number.parseInt(a) + Number.parseInt(b)).toString(),
      name: 'add',
      parameters: z.object({
        a: z.string().describe('First number'),
        b: z.string().describe('Second number'),
      }),
    })

    const { fullStream, totalUsage, usage } = responses({
      baseURL: 'http://localhost:11434/v1/',
      input: 'How many times does 114514 plus 1919810 equal? Please try to call the `add` tool to solve the problem.',
      instructions: 'You are a helpful assistant.',
      model: 'qwen3.5:0.8b',
      toolChoice: 'required',
      tools: [add],
    })

    const chunks: StreamingEvent[] = []
    for await (const chunk of fullStream) {
      chunks.push(chunk)
    }

    expect(chunks).toMatchSnapshot()
    expect(await usage).toMatchSnapshot()
    expect(await totalUsage).toMatchSnapshot()
  })
})
