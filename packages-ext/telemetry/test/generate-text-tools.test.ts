import type { ReadableSpan } from '@opentelemetry/sdk-trace-base'

import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { generateText as aiGenerateText, tool as aiTool, stepCountIs } from 'ai'
import { ollama } from 'ollama-ai-provider-v2'
import { describe, expect, it } from 'vitest'
import { tool } from 'xsai'
import { z } from 'zod/v4'

import { generateText } from '../src'

describe.sequential('generateText with tools', () => {
  const memoryExporter = new InMemorySpanExporter()
  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [new SimpleSpanProcessor(memoryExporter)],
  })
  tracerProvider.register()

  const getAttributes = (span: ReadableSpan) => Object.fromEntries(
    Object.entries(span.attributes)
      .map(([k, v]) => k === 'ai.response.text'
        ? [k, (v as string).replaceAll('\n', ' ').slice(0, 50)]
        : [k, v],
      ),
  )

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

    const { text } = await generateText({
      baseURL: 'http://localhost:11434/v1',
      messages: [{
        content: 'How many times does 114514 plus 1919810 equal? Please try to call the `add` tool to solve the problem.',
        role: 'user',
      }],
      model: 'qwen3:0.6b',
      seed: 114514,
      tools: [add],
    })

    const spans = memoryExporter.getFinishedSpans().map(getAttributes)

    expect(text).toMatchSnapshot()
    expect(spans).toMatchSnapshot()
  })

  it('basic/ai', async () => {
    const add = aiTool({
      description: 'Adds two numbers',
      // @ts-expect-error wrong types
      execute: ({ a, b }) => (Number.parseInt(a) + Number.parseInt(b)).toString(),
      // @ts-expect-error wrong types
      inputSchema: z.object({
        a: z.string()
          .describe('First number'),
        b: z.string()
          .describe('Second number'),
      }),
      name: 'add',
    })

    const { text } = await aiGenerateText({
      experimental_telemetry: { isEnabled: true },
      model: ollama('qwen3:0.6b'),
      prompt: 'How many times does 114514 plus 1919810 equal? Please try to call the `add` tool to solve the problem.',
      seed: 114514,
      stopWhen: stepCountIs(5),
      tools: { add },
    })

    const spans = memoryExporter.getFinishedSpans().slice(4).map(getAttributes)

    expect(text).toMatchSnapshot()
    expect(spans).toMatchSnapshot()
  })

  it('basic/compare', () => {
    const extractAttributeKeys = (span: ReadableSpan) => Object.keys(span.attributes)
      // eslint-disable-next-line sonarjs/no-nested-functions
      .filter(key => ['ai.settings'].every(prefix => !key.startsWith(prefix)))
      .sort((a, b) => a.localeCompare(b))

    const spans = memoryExporter.getFinishedSpans()
    const xsaiSpans = spans.slice(0, 4)
    const aiSpans = spans.slice(4)

    const xsaiIds = xsaiSpans.map(span => span.attributes['ai.operationId'])
    const aiIds = aiSpans.map(span => span.attributes['ai.operationId'])

    expect(xsaiIds).toStrictEqual(aiIds)

    const xsaiKeys = xsaiSpans.map(extractAttributeKeys)
    const aiKeys = aiSpans.map(extractAttributeKeys)

    xsaiKeys.forEach((attributes, i) => {
      expect(attributes).toStrictEqual(aiKeys[i])
    })
  })
})
