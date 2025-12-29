import { LangfuseSpanProcessor } from '@langfuse/otel'
import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { describe, expect, it } from 'vitest'

import { generateText } from '../src'

describe.sequential('generateText', () => {
  const memoryExporter = new InMemorySpanExporter()
  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [
      new SimpleSpanProcessor(memoryExporter),
      new LangfuseSpanProcessor(),
    ],
  })
  tracerProvider.register()

  it('basic', async () => {
    const { text } = await generateText({
      baseURL: 'http://localhost:11434/v1',
      messages: [{
        content: 'Why is the sky blue?',
        role: 'user',
      }],
      model: 'granite4:350m-h',
      seed: 114514,
      // telemetry: {
      //   metadata: {
      //     agentId: 'weather-assistant',
      //     instructions: 'You are a helpful weather assistant',
      //   },
      // },
    })

    const spans = memoryExporter.getFinishedSpans()
    const names = spans.map(s => s.name)
    const attributes = spans.map(s => s.attributes)

    expect(text).toMatchSnapshot()
    expect(names).toMatchSnapshot()
    expect(attributes).toMatchSnapshot()
  }, 120_000)
})
