import { LangfuseSpanProcessor } from '@langfuse/otel'
import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { describe, expect, it } from 'vitest'
import { tool } from 'xsai'
import { z } from 'zod/v4'

import { streamText } from '../src'
import { cleanAttributes } from './fixtures/clean-attributes'

describe.sequential('streamText with tools', () => {
  const memoryExporter = new InMemorySpanExporter()
  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [
      new SimpleSpanProcessor(memoryExporter),
      new LangfuseSpanProcessor(),
    ],
  })
  tracerProvider.register()

  it('basic', async () => {
    const add = await tool({
      description: 'Adds two numbers',
      execute: ({ a, b }) => (Number.parseInt(a) + Number.parseInt(b)).toString(),
      name: 'add',
      parameters: z.object({
        a: z.string()
          .describe('First number'),
        b: z.string()
          .describe('Second number'),
      }),
    })

    let text = ''
    const { textStream } = streamText({
      baseURL: 'http://localhost:11434/v1',
      maxSteps: 5,
      messages: [{
        content: 'How many times does 114514 plus 1919810 equal? Please try to call the `add` tool to solve the problem.',
        role: 'user',
      }],
      model: 'granite4:1b-h',
      onFinish: async () => {
        const spans = memoryExporter.getFinishedSpans()
        const names = spans.map(s => s.name)
        const attributes = spans.map(s => cleanAttributes(s.attributes))

        expect(text).toMatchSnapshot()
        expect(names).toMatchSnapshot()
        expect(attributes).toMatchSnapshot()
      },
      seed: 114514,
      streamOptions: {
        includeUsage: true,
      },
      tools: [add],
    })

    for await (const textDelta of textStream) {
      text += textDelta
    }
  }, 120_000)
})
