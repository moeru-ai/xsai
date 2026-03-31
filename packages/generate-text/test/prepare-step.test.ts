import { describe, expect, it, vi } from 'vitest'

import { generateText } from '../src'
import { stepCountAtLeast } from '../src/shared-chat'

describe('@xsai/generate-text prepareStep', () => {
  it('applies step-local overrides without mutating canonical loop state', async () => {
    const requestBodies: Record<string, unknown>[] = []
    const fetch = vi.fn(async (_input, init) => {
      requestBodies.push(JSON.parse(init!.body as string) as Record<string, unknown>)

      if (requestBodies.length === 1) {
        return new Response(JSON.stringify({
          choices: [{
            finish_reason: 'tool_calls',
            index: 0,
            message: {
              content: '',
              role: 'assistant',
              tool_calls: [{
                function: {
                  arguments: '{"a":"1","b":"2"}',
                  name: 'add',
                },
                id: 'call_1',
                type: 'function',
              }],
            },
          }],
          created: 0,
          id: 'chatcmpl_1',
          model: 'model-step-0',
          object: 'chat.completion',
          system_fingerprint: 'fp_1',
          usage: {
            completion_tokens: 5,
            prompt_tokens: 10,
            total_tokens: 15,
          },
        }))
      }

      return new Response(JSON.stringify({
        choices: [{
          finish_reason: 'stop',
          index: 0,
          message: {
            content: '3',
            role: 'assistant',
          },
        }],
        created: 0,
        id: 'chatcmpl_2',
        model: 'model-step-1',
        object: 'chat.completion',
        system_fingerprint: 'fp_2',
        usage: {
          completion_tokens: 3,
          prompt_tokens: 12,
          total_tokens: 15,
        },
      }))
    }) as typeof globalThis.fetch

    const prepareCalls: {
      messages: string[]
      model: string
      stepNumber: number
      stepsLength: number
      toolChoice: string
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

    const result = await generateText({
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
          toolChoice: stepNumber === 0 ? 'required' : 'auto',
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

    expect(result.text).toBe('3')
    expect(prepareCalls).toEqual([
      {
        messages: ['base system', 'base user'],
        model: 'base-model',
        stepNumber: 0,
        stepsLength: 0,
        toolChoice: 'required',
      },
      {
        messages: ['base system', 'base user', '', '3'],
        model: 'base-model',
        stepNumber: 1,
        stepsLength: 1,
        toolChoice: 'auto',
      },
    ])

    expect(requestBodies).toHaveLength(2)
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
