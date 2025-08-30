import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { describe, expect, it } from 'vitest'

import { generateText } from '../src'

describe('generateText', () => {
  it('basic', async () => {
    const memoryExporter = new InMemorySpanExporter()
    const tracerProvider = new NodeTracerProvider({
      spanProcessors: [new SimpleSpanProcessor(memoryExporter)],
    })
    tracerProvider.register()

    const { text } = await generateText({
      baseURL: 'http://localhost:11434/v1',
      messages: [{
        content: 'Why is the sky blue?',
        role: 'user',
      }],
      model: 'qwen3:0.6b',
      seed: 114514,
    })

    const spans = memoryExporter.getFinishedSpans()

    expect(text).toMatchSnapshot()
    expect(spans).toMatchSnapshot()
  })
})
