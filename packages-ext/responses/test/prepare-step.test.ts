import type { ItemParam } from '../src/generated'

import { describe, expect, it, vi } from 'vitest'

import { responses, stepCountAtLeast } from '../src'
import { createEventStreamResponse } from './utils'

const parseRequestBody = (init: unknown): Record<string, unknown> => {
  if (init == null || typeof init !== 'object' || !('body' in init) || typeof init.body !== 'string')
    throw new TypeError('Expected RequestInit.body to be a JSON string')

  return JSON.parse(init.body) as Record<string, unknown>
}

describe('@xsai-ext/responses prepareStep', () => {
  it('applies step-local overrides without mutating canonical loop state', async () => {
    const requestBodies: Record<string, unknown>[] = []
    const fetch = vi.fn(async (_input, init) => {
      requestBodies.push(parseRequestBody(init))

      if (requestBodies.length === 1) {
        return createEventStreamResponse([
          {
            response: {
              id: 'resp_step_1',
              object: 'response',
              output: [],
              status: 'in_progress',
            },
            sequence_number: 0,
            type: 'response.created',
          },
          {
            item: {
              arguments: '{"a":"1","b":"2"}',
              call_id: 'call_1',
              id: 'fc_1',
              name: 'add',
              status: 'completed',
              type: 'function_call',
            },
            output_index: 0,
            sequence_number: 1,
            type: 'response.output_item.done',
          },
          {
            response: {
              id: 'resp_step_1',
              object: 'response',
              output: [],
              status: 'completed',
              usage: {
                input_tokens: 7,
                output_tokens: 3,
                total_tokens: 10,
              },
            },
            sequence_number: 2,
            type: 'response.completed',
          },
        ])
      }

      return createEventStreamResponse([
        {
          response: {
            id: 'resp_step_2',
            object: 'response',
            output: [],
            status: 'in_progress',
          },
          sequence_number: 0,
          type: 'response.created',
        },
        {
          content_index: 0,
          delta: '3',
          item_id: 'msg_1',
          output_index: 0,
          sequence_number: 1,
          type: 'response.output_text.delta',
        },
        {
          item: {
            content: [
              {
                text: '3',
                type: 'output_text',
              },
            ],
            id: 'msg_1',
            role: 'assistant',
            status: 'completed',
            type: 'message',
          },
          output_index: 0,
          sequence_number: 2,
          type: 'response.output_item.done',
        },
        {
          response: {
            id: 'resp_step_2',
            object: 'response',
            output: [],
            status: 'completed',
            usage: {
              input_tokens: 11,
              output_tokens: 1,
              total_tokens: 12,
            },
          },
          sequence_number: 3,
          type: 'response.completed',
        },
      ])
    }) as typeof globalThis.fetch

    const add = {
      description: 'Adds two numbers',
      execute: () => '3',
      name: 'add',
      parameters: {
        additionalProperties: false,
        properties: {
          a: { type: 'string' },
          b: { type: 'string' },
        },
        required: ['a', 'b'],
        type: 'object',
      },
      strict: true,
      type: 'function',
    } as const

    const prepareCalls: {
      input: string[]
      model?: string
      stepNumber: number
      stepsLength: number
    }[] = []

    const { eventStream, steps } = responses({
      baseURL: 'https://example.com/v1/',
      fetch,
      input: 'base input',
      model: 'base-model',
      prepareStep: ({ input, model, stepNumber, steps }) => {
        prepareCalls.push({
          input: input.map(item => item.type === 'message'
            ? typeof item.content === 'string' ? item.content : JSON.stringify(item.content ?? null)
            : item.type ?? ''),
          model: model ?? undefined,
          stepNumber,
          stepsLength: steps.length,
        })

        if (stepNumber === 0) {
          return {
            input: [{
              content: 'override input',
              role: 'user',
              type: 'message',
            }] as ItemParam[],
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

    const events = []
    for await (const event of eventStream) {
      events.push(event.type)
    }

    const allSteps = await steps

    expect(events).toEqual([
      'response.created',
      'response.output_item.done',
      'response.completed',
      'response.created',
      'response.output_text.delta',
      'response.output_item.done',
      'response.completed',
    ])
    expect(allSteps).toHaveLength(2)
    expect(prepareCalls).toEqual([
      {
        input: ['base input'],
        model: 'base-model',
        stepNumber: 0,
        stepsLength: 0,
      },
      {
        input: ['base input', 'function_call', 'function_call_output'],
        model: 'base-model',
        stepNumber: 1,
        stepsLength: 1,
      },
    ])
    expect(requestBodies[0]).toMatchObject({
      input: [{
        content: 'override input',
        role: 'user',
        type: 'message',
      }],
      model: 'prepared-model-0',
      tool_choice: 'required',
    })
    expect(requestBodies[1]).toMatchObject({
      model: 'prepared-model-1',
      tool_choice: 'auto',
    })
    expect(requestBodies[1].input).toMatchObject([
      {
        content: 'base input',
        role: 'user',
        type: 'message',
      },
      {
        arguments: '{"a":"1","b":"2"}',
        call_id: 'call_1',
        name: 'add',
        type: 'function_call',
      },
      {
        output: '3',
        type: 'function_call_output',
      },
    ])
  })

  it('accepts camelCase request and prepareStep options', async () => {
    const requestBodies: Record<string, unknown>[] = []
    const fetch = vi.fn(async (_input, init) => {
      requestBodies.push(parseRequestBody(init))

      return createEventStreamResponse([
        {
          response: {
            id: 'resp_step_1',
            object: 'response',
            output: [],
            status: 'completed',
            usage: {
              input_tokens: 7,
              output_tokens: 3,
              total_tokens: 10,
            },
          },
          sequence_number: 0,
          type: 'response.completed',
        },
      ])
    }) as typeof globalThis.fetch

    const { eventStream } = responses({
      baseURL: 'https://example.com/v1/',
      fetch,
      input: 'base input',
      maxOutputTokens: 100,
      model: 'base-model',
      prepareStep: () => ({
        toolChoice: 'required',
      }),
      streamOptions: {
        includeObfuscation: false,
      },
      toolChoice: 'auto',
    })

    const events = []
    for await (const event of eventStream) {
      events.push(event.type)
    }

    expect(events).toEqual(['response.completed'])
    expect(requestBodies).toHaveLength(1)
    expect(requestBodies[0]).toMatchObject({
      max_output_tokens: 100,
      stream_options: {
        include_obfuscation: false,
      },
      tool_choice: 'required',
    })
    expect(requestBodies[0]).not.toHaveProperty('maxOutputTokens')
    expect(requestBodies[0]).not.toHaveProperty('streamOptions')
    expect(requestBodies[0]).not.toHaveProperty('toolChoice')
  })
})
