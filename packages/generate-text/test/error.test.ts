import type { Tool, ToolExecuteOptions } from '@xsai/shared-chat'

import { describe, expect, it } from 'vitest'

import { generateText } from '../src'
import { stepCountAtLeast } from '../src/shared-chat'

describe('@xsai/generate-text errors', () => {
  it('returns tool calls for manual execution by default', async () => {
    const completion = (message: Record<string, unknown>, finish_reason: string, id: string) => ({
      choices: [{ finish_reason, index: 0, message }],
      created: 1,
      id,
      model: 'test-model',
      object: 'chat.completion',
      system_fingerprint: 'fingerprint',
      usage: {
        completion_tokens: 1,
        prompt_tokens: 1,
        total_tokens: 2,
      },
    })
    const responses = [
      completion({
        content: '',
        role: 'assistant',
        tool_calls: [{
          function: {
            arguments: '{"value":"input"}',
            name: 'runCommand',
          },
          id: 'call_1',
          type: 'function',
        }],
      }, 'tool_calls', 'chatcmpl_1'),
      completion({ content: 'done', role: 'assistant' }, 'stop', 'chatcmpl_2'),
    ]
    const fetch: typeof globalThis.fetch = async () => new Response(JSON.stringify(responses.shift()))
    let executed = false
    let preToolCallCalls = 0
    const runCommand = {
      execute: (input: unknown, _options: ToolExecuteOptions) => {
        executed = true
        return `ran ${(input as { value: string }).value}`
      },
      function: {
        name: 'runCommand',
        parameters: {},
      },
      type: 'function',
    } satisfies Tool

    const options = {
      baseURL: 'https://example.com/v1/',
      fetch,
      messages: [{ content: 'run it', role: 'user' as const }],
      model: 'test-model',
      preToolCall: () => {
        preToolCallCalls++
      },
      stopWhen: stepCountAtLeast(1),
      tools: [runCommand],
    }
    const pending = await generateText(options)

    expect(pending.toolCalls).toStrictEqual([{
      args: '{"value":"input"}',
      toolCallId: 'call_1',
      toolCallType: 'function',
      toolName: 'runCommand',
    }])
    expect(pending.toolResults).toStrictEqual([])
    expect(executed).toBe(false)
    expect(preToolCallCalls).toBe(0)

    const call = pending.toolCalls[0]
    const result = runCommand.execute(JSON.parse(call.args), {
      messages: pending.messages,
      toolCallId: call.toolCallId,
    })
    pending.messages.push({
      content: result,
      role: 'tool',
      tool_call_id: call.toolCallId,
    })

    const final = await generateText({ ...options, messages: pending.messages })
    expect(executed).toBe(true)
    expect(final.text).toBe('done')
  })

  it('throws InvalidResponseError when the provider returns no choices', async () => {
    const fetch: typeof globalThis.fetch = async () => new Response(JSON.stringify({
      choices: [],
      created: 1,
      id: 'chatcmpl_1',
      model: 'test-model',
      object: 'chat.completion',
      system_fingerprint: 'fingerprint',
      usage: {
        completion_tokens: 0,
        prompt_tokens: 0,
        total_tokens: 0,
      },
    }))

    await expect(generateText({
      baseURL: 'https://example.com/v1/',
      fetch,
      messages: [{ content: 'hello', role: 'user' }],
      model: 'test-model',
    })).rejects.toMatchObject({
      code: 'invalid_response',
      reason: 'no_choices',
    })
  })

  it('passes tool errors to the next model request', async () => {
    const requestBodies: Record<string, unknown>[] = []
    const responses = [
      {
        choices: [{
          finish_reason: 'tool_calls',
          index: 0,
          message: {
            content: '',
            role: 'assistant',
            tool_calls: [{
              function: {
                arguments: '{"value":"input"}',
                name: 'fail',
              },
              id: 'call_1',
              type: 'function',
            }],
          },
        }],
        created: 1,
        id: 'chatcmpl_1',
        model: 'test-model',
        object: 'chat.completion',
        system_fingerprint: 'fingerprint',
        usage: {
          completion_tokens: 1,
          prompt_tokens: 1,
          total_tokens: 2,
        },
      },
      {
        choices: [{
          finish_reason: 'stop',
          index: 0,
          message: {
            content: 'done',
            role: 'assistant',
          },
        }],
        created: 1,
        id: 'chatcmpl_2',
        model: 'test-model',
        object: 'chat.completion',
        system_fingerprint: 'fingerprint',
        usage: {
          completion_tokens: 1,
          prompt_tokens: 1,
          total_tokens: 2,
        },
      },
    ]
    const fetch: typeof globalThis.fetch = async (_input, init) => {
      if (init?.body == null || typeof init.body !== 'string')
        throw new TypeError('Expected a JSON request body')

      requestBodies.push(JSON.parse(init.body) as Record<string, unknown>)
      return new Response(JSON.stringify(responses.shift()))
    }
    const fail = {
      execute: () => {
        throw new Error('boom')
      },
      function: {
        name: 'fail',
        parameters: {},
      },
      type: 'function',
    } satisfies Tool

    const result = await generateText({
      baseURL: 'https://example.com/v1/',
      fetch,
      messages: [{ content: 'hello', role: 'user' }],
      model: 'test-model',
      stopWhen: stepCountAtLeast(2),
      tools: [fail],
    })

    expect(requestBodies).toHaveLength(2)
    expect(requestBodies[1].messages).toEqual(expect.arrayContaining([{
      content: 'Tool "fail" execution failed: boom',
      role: 'tool',
      tool_call_id: 'call_1',
    }]))
    expect(result.steps[0].toolResults[0]).toMatchObject({
      isError: true,
      result: 'Tool "fail" execution failed: boom',
    })
    expect(result.text).toBe('done')
  })
})
