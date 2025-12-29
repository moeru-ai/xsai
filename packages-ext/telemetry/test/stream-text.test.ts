import { LangfuseSpanProcessor } from '@langfuse/otel'
import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { describe, expect, it } from 'vitest'

import { streamText } from '../src'

describe.sequential('streamText', () => {
  const memoryExporter = new InMemorySpanExporter()
  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [
      new SimpleSpanProcessor(memoryExporter),
      new LangfuseSpanProcessor(),
    ],
  })
  tracerProvider.register()

  it('basic', async () => {
    let text = ''

    const { textStream } = streamText({
      baseURL: 'http://localhost:11434/v1',
      messages: [{
        content: 'Why is the sky blue?',
        role: 'user',
      }],
      model: 'granite4:350m-h',
      onFinish: async () => {
        const spans = memoryExporter.getFinishedSpans()
        const names = spans.map(s => s.name)
        const attributes = spans.map(s => s.attributes)

        expect(text).toMatchSnapshot()
        expect(names).toMatchSnapshot()
        expect(attributes).toMatchSnapshot()
      },
      seed: 114514,
      streamOptions: {
        includeUsage: true,
      },
      // telemetry: {
      //   metadata: {
      //     agentId: 'weather-assistant',
      //     instructions: 'You are a helpful weather assistant',
      //   },
      // },
    })

    for await (const textDelta of textStream) {
      text += textDelta
    }
  }, 120_000)
})
