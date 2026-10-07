import type { AssistantMessage, CollectResult, LanguageModel, LoopOptions, TextEvent } from '@xsai/text'

import { maxSteps, TextEventTarget, toCustomEvent, tool, XSAIError } from '@xsai/text'
import { describe, expect, it } from 'vitest'

import { generateText } from '../src'

const eventStream = (events: TextEvent[], target?: EventTarget): ReadableStream<TextEvent> => new ReadableStream<TextEvent>({
  start: (controller) => {
    for (const event of events) {
      target?.dispatchEvent(toCustomEvent(event))
      controller.enqueue(event)
    }
    controller.close()
  },
})

describe('generateText', () => {
  it('returns the collected result directly and preserves reasoning and refusal parts', async () => {
    const message: AssistantMessage = {
      content: [
        { content: [{ text: 'Thinking', type: 'text' }], type: 'reasoning' },
        { text: 'Hello', type: 'text' },
        { refusal: 'Cannot share private data.', type: 'refusal' },
      ],
      role: 'assistant',
    }
    const target = new TextEventTarget()
    const observed: AssistantMessage[] = []
    target.addEventListener('step.end', event => observed.push(event.detail.message))
    const model: LanguageModel = ({ events }) => eventStream([
      { message, reason: 'stop', status: 'completed', type: 'step.end' },
    ], events)
    const options: LoopOptions = { events: target, input: 'hi' }

    const result: CollectResult = await generateText(model, options)

    expect(result).toMatchObject({
      message,
      reason: 'stop',
      status: 'completed',
      steps: [{ text: 'Hello', toolCalls: [], toolResults: [] }],
      text: 'Hello',
      toolCalls: [],
      toolResults: [],
    })
    expect(result.totalUsage).toBeUndefined()
    expect(observed).toEqual([message])
  })

  it('executes tools by default and returns the last step with total usage', async () => {
    let stepNumber = 0
    const model: LanguageModel = () => eventStream(stepNumber++ === 0
      ? [{
          message: {
            content: [
              { text: 'Checking the weather.', type: 'text' },
              { arguments: '{}', callId: 'call-1', id: 'tool-1', name: 'weather', type: 'tool-call' },
            ],
            role: 'assistant',
          },
          reason: 'tool-calls',
          status: 'completed',
          type: 'step.end',
          usage: { inputTokens: 2, outputTokens: 3, totalTokens: 5 },
        }]
      : [{
          message: { content: 'sunny', role: 'assistant' },
          reason: 'stop',
          status: 'completed',
          type: 'step.end',
          usage: { inputTokens: 4, outputTokens: 1, totalTokens: 5 },
        }])

    const result = await generateText(model, {
      input: 'weather',
      tools: [tool({ execute: () => 'sunny', inputSchema: { type: 'object' }, name: 'weather' })],
    })

    expect(result).toMatchObject({
      steps: [
        {
          text: 'Checking the weather.',
          toolCalls: [{ callId: 'call-1', name: 'weather' }],
          toolResults: [{ callId: 'call-1', output: 'sunny', type: 'tool-result' }],
        },
        { text: 'sunny', toolCalls: [], toolResults: [] },
      ],
      text: 'sunny',
      toolCalls: [],
      toolResults: [],
      totalUsage: { inputTokens: 6, outputTokens: 4, totalTokens: 10 },
      usage: { inputTokens: 4, outputTokens: 1, totalTokens: 5 },
    })
  })

  it('returns tool calls without executing tools when stopped after one step', async () => {
    const toolCall = { arguments: '{}', callId: 'call-1', id: 'tool-1', name: 'weather', type: 'tool-call' as const }
    const model: LanguageModel = () => eventStream([
      { message: { content: [toolCall], role: 'assistant' }, reason: 'tool-calls', status: 'completed', type: 'step.end' },
    ])
    let executed = false

    const result = await generateText(model, {
      input: 'weather',
      stopWhen: maxSteps(1),
      tools: [tool({
        execute: () => {
          executed = true
          return 'sunny'
        },
        inputSchema: { type: 'object' },
        name: 'weather',
      })],
    })

    expect(result.steps).toHaveLength(1)
    expect(result.toolCalls).toEqual([toolCall])
    expect(result.toolResults).toEqual([])
    expect(executed).toBe(false)
  })

  it.each(['incomplete', 'cancelled'] as const)('returns a result for a model-declared %s status', async (status) => {
    const model: LanguageModel = () => eventStream([
      { message: { content: 'Partial', role: 'assistant' }, status, type: 'step.end' },
    ])

    await expect(generateText(model, { input: 'hi' })).resolves.toMatchObject({ status, text: 'Partial' })
  })

  it('keeps tool failures as results and continues the loop', async () => {
    let stepNumber = 0
    const model: LanguageModel = () => eventStream(stepNumber++ === 0
      ? [{
          message: {
            content: [{ arguments: '{}', callId: 'call-1', id: 'tool-1', name: 'weather', type: 'tool-call' }],
            role: 'assistant',
          },
          reason: 'tool-calls',
          status: 'completed',
          type: 'step.end',
        }]
      : [{ message: { content: 'Weather unavailable.', role: 'assistant' }, status: 'completed', type: 'step.end' }])

    await expect(generateText(model, {
      input: 'weather',
      tools: [tool({
        execute: () => { throw new Error('offline') },
        inputSchema: { type: 'object' },
        name: 'weather',
      })],
    })).resolves.toMatchObject({
      steps: [
        { toolResults: [{ callId: 'call-1', isError: true, type: 'tool-result' }] },
        { text: 'Weather unavailable.' },
      ],
      text: 'Weather unavailable.',
    })
  })

  it('rejects with the model failure', async () => {
    const error = new XSAIError('model-error', 'model failed')
    const model: LanguageModel = () => eventStream([
      { error, message: { content: '', role: 'assistant' }, status: 'failed', type: 'step.end' },
    ])

    await expect(generateText(model, { input: 'hi' })).rejects.toBe(error)
  })

  it('rejects a stream without a terminal event', async () => {
    const model: LanguageModel = () => eventStream([
      { delta: 'Partial', index: 0, type: 'text.delta' },
    ])

    await expect(generateText(model, { input: 'hi' })).rejects.toMatchObject({ code: 'truncated-stream' })
  })

  it('rejects with the abort reason before starting the model', async () => {
    const reason = new Error('stop')
    const model: LanguageModel = () => {
      throw new Error('The model must not start.')
    }

    await expect(generateText(model, { input: 'hi', signal: AbortSignal.abort(reason) })).rejects.toBe(reason)
  })
})
