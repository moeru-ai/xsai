import type { AttributeValue } from '@opentelemetry/api'
import type { ReadableSpan } from '@opentelemetry/sdk-trace-base'

import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { streamText as aiStreamText } from 'ai'
import { ollama } from 'ollama-ai-provider-v2'
import { describe, expect, it } from 'vitest'

import { streamText } from '../src'

describe.sequential('streamText', () => {
  const memoryExporter = new InMemorySpanExporter()
  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [new SimpleSpanProcessor(memoryExporter)],
  })
  tracerProvider.register()

  const trimmedAttributes = new Set<string>([
    // Not using the following because we are testing with --update
    // 'ai.response.id', // reason: id
    // 'ai.response.msToFinish', // reason: time
    // 'ai.response.msToFirstChunk', // reason: time
    // 'ai.response.timestamp', // reason: time
    // 'gen_ai.response.id', // reason: id
  ])

  const getAttributes = (span: ReadableSpan) => Object.fromEntries(
    Object.entries(span.attributes)
      .reduce<[string, AttributeValue | undefined][]>((entries, [k, v]) => {
        if (k === 'ai.response.text') {
          entries.push([k, (v as string).replaceAll('\n', ' ').slice(0, 50)])
        }
        else if (!trimmedAttributes.has(k)) {
          entries.push([k, v])
        }
        return entries
      }, []),
  )

  it('basic', async () => {
    let text = ''

    const { textStream } = streamText({
      baseURL: 'http://localhost:11434/v1',
      messages: [{
        content: 'Why is the sky blue?',
        role: 'user',
      }],
      model: 'qwen3:0.6b',
      onFinish: async () => {
        const spans = memoryExporter.getFinishedSpans().map(getAttributes)

        expect(text).toMatchSnapshot()
        expect(spans).toMatchSnapshot()
      },
      seed: 114514,
      streamOptions: {
        includeUsage: true,
      },
    })

    for await (const textDelta of textStream) {
      text += textDelta
    }
  }, 120_000)

  it('basic/ai', async () => {
    const { text } = aiStreamText({
      experimental_telemetry: { isEnabled: true },
      model: ollama('qwen3:0.6b'),
      prompt: 'Why is the sky blue?',
      seed: 114514,
    })

    const fullText = await text
    const spans = memoryExporter.getFinishedSpans().slice(2).map(getAttributes)

    expect(fullText).toMatchSnapshot()
    expect(spans).toMatchSnapshot()
  }, 120_000)

  it('basic/compare', () => {
    const extractAttributeKeys = (span: ReadableSpan) => Object.keys(span.attributes)
      // eslint-disable-next-line sonarjs/no-nested-functions
      .filter(key => ['ai.settings'].every(prefix => !key.startsWith(prefix)))
      .sort((a, b) => a.localeCompare(b))

    const spans = memoryExporter.getFinishedSpans()
    const xsai = spans.slice(0, 2).map(extractAttributeKeys)
    const ai = spans.slice(2).map(extractAttributeKeys)

    xsai.forEach((attributes, i) => {
      expect(attributes).toStrictEqual(ai[i])
    })
  })
})
