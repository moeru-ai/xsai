import { describe, expect, it, vi } from 'vitest'

import { streamText } from '../src'
import { stepCountAtLeast } from '../src/shared-chat'

const createChatCompletionStreamResponse = (chunks: unknown[]): Response => {
  const encoder = new TextEncoder()

  return new Response(new ReadableStream<Uint8Array>({
    start: (controller) => {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n`))
      }

      controller.enqueue(encoder.encode('data: [DONE]\n'))
      controller.close()
    },
  }))
}

describe('@xsai/stream-text prepareStep', () => {
  it('applies step-local overrides without mutating canonical loop state', async () => {
    const requestBodies: Record<string, unknown>[] = []
    const fetch = vi.fn(async (_input, init) => {
      requestBodies.push(JSON.parse(init!.body as string) as Record<string, unknown>)

      if (requestBodies.length === 1) {
        return createChatCompletionStreamResponse([{
          choices: [{
            delta: {
              role: 'assistant',
              tool_calls: [{
                function: {
                  arguments: '{"a":"1","b":"2"}',
                  name: 'add',
                },
                id: 'call_1',
                index: 0,
                type: 'function',
              }],
            },
            finish_reason: 'tool_calls',
            index: 0,
          }],
          created: 0,
          id: 'chatcmpl_1',
          model: 'model-step-0',
          object: 'chat.completion.chunk',
          system_fingerprint: 'fp_1',
        }])
      }

      return createChatCompletionStreamResponse([
        {
          choices: [{
            delta: {
              content: '3',
              role: 'assistant',
            },
            index: 0,
          }],
          created: 0,
          id: 'chatcmpl_2',
          model: 'model-step-1',
          object: 'chat.completion.chunk',
          system_fingerprint: 'fp_2',
        },
        {
          choices: [{
            delta: {
              role: 'assistant',
            },
            finish_reason: 'stop',
            index: 0,
          }],
          created: 0,
          id: 'chatcmpl_2',
          model: 'model-step-1',
          object: 'chat.completion.chunk',
          system_fingerprint: 'fp_2',
        },
      ])
    }) as typeof globalThis.fetch

    const prepareCalls: {
      messages: string[]
      model: string
      stepNumber: number
      stepsLength: number
    }[] = []

    const add = {
      execute: () => '3',
      function: {
        name: 'add',
        parameters: {
          properties: {},
          type: 'object',
        },
      },
      type: 'function',
    } as const

    const { steps, textStream } = streamText({
      baseURL: 'https://example.com/v1/',
      fetch,
      messages: [
        { content: 'base system', role: 'system' },
        { content: 'base user', role: 'user' },
      ],
      model: 'base-model',
      prepareStep: ({ messages, model, stepNumber, steps }) => {
        prepareCalls.push({
          messages: messages.map(message => typeof message.content === 'string' ? message.content : JSON.stringify(message.content)),
          model,
          stepNumber,
          stepsLength: steps.length,
        })

        if (stepNumber === 0) {
          return {
            messages: [
              { content: 'override system', role: 'system' },
              { content: 'override user', role: 'user' },
            ],
            model: 'prepared-model-0',
            toolChoice: 'required',
          }
        }

        return {
          model: 'prepared-model-1',
        }
      },
      stopWhen: stepCountAtLeast(2),
      toolChoice: 'auto',
      tools: [add],
    })

    let text = ''
    for await (const chunk of textStream) {
      text += chunk
    }

    const allSteps = await steps

    expect(text).toBe('3')
    expect(allSteps).toHaveLength(2)
    expect(prepareCalls).toEqual([
      {
        messages: ['base system', 'base user'],
        model: 'base-model',
        stepNumber: 0,
        stepsLength: 0,
      },
      {
        messages: ['base system', 'base user', '', '3'],
        model: 'base-model',
        stepNumber: 1,
        stepsLength: 1,
      },
    ])
    expect(requestBodies[0]).toMatchObject({
      messages: [
        { content: 'override system', role: 'system' },
        { content: 'override user', role: 'user' },
      ],
      model: 'prepared-model-0',
      tool_choice: 'required',
    })
    expect(requestBodies[1]).toMatchObject({
      model: 'prepared-model-1',
      tool_choice: 'auto',
    })
    expect(requestBodies[1].messages).toMatchObject([
      { content: 'base system', role: 'system' },
      { content: 'base user', role: 'user' },
      {
        content: '',
        role: 'assistant',
      },
      {
        content: '3',
        role: 'tool',
      },
    ])
  })
})
