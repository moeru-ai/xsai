import { LangfuseSpanProcessor } from '@langfuse/otel'
import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { describe, expect, it } from 'vitest'

import { embed } from '../src'
import { cleanAttributes } from './fixtures/clean-attributes'

describe('embed', () => {
  const memoryExporter = new InMemorySpanExporter()
  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [
      new SimpleSpanProcessor(memoryExporter),
      new LangfuseSpanProcessor(),
    ],
  })
  tracerProvider.register()

  it('embed', async () => {
    const { embedding, usage } = await embed({
      baseURL: 'http://localhost:11434/v1/',
      dimensions: 384,
      input: 'sunny day at the beach',
      model: 'all-minilm',
    })

    expect(embedding.length).toBe(384)
    expect(usage.prompt_tokens).toBe(7)
    expect(usage.total_tokens).toBe(7)

    const spans = memoryExporter.getFinishedSpans()
    const names = spans.map(s => s.name)
    const attributes = spans.map(s => cleanAttributes(s.attributes))

    expect(names).toMatchSnapshot()
    expect(attributes).toMatchSnapshot()
    expect(attributes[0]['gen_ai.embeddings.dimension.count']).toBe(384)
    expect(attributes[0]['gen_ai.usage.input_tokens']).toBe(usage.prompt_tokens)
  })
})
