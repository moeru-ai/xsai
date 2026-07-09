import type { Event } from '@xsai/shared-chat'

import { clean } from '@xsai/shared'
import { tool } from '@xsai/tool'
import { description, object, pipe, string } from 'valibot'
import { describe, expect, it } from 'vitest'

import { streamText } from '../src'
import { stepCountAtLeast } from '../src/shared-chat'

describe('@xsai/stream-text tool', async () => {
  it('basic tool calls', async () => {
    const add = await tool({
      description: 'Adds two numbers',
      execute: ({ a, b }) => (Number.parseInt(a) + Number.parseInt(b)).toString(),
      name: 'add',
      parameters: object({
        a: pipe(
          string(),
          description('First number'),
        ),
        b: pipe(
          string(),
          description('Second number'),
        ),
      }),
    })

    const { eventStream, steps } = streamText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'How many times does 114514 plus 1919810 equal? Please try to call the `add` tool with { "a": "114514", "b": "1919810" } args to solve the problem.',
          role: 'user',
        },
      ],
      model: 'qwen3.5:2b',
      seed: 1145141919810,
      stopWhen: stepCountAtLeast(2),
      toolChoice: 'required',
      tools: [add],
    })

    const events: Event[] = []
    for await (const event of eventStream) {
      // eslint-disable-next-line @masknet/type-no-force-cast-via-top-type
      events.push(clean({
        ...event,
        toolCallId: undefined,
      }) as unknown as Event)
    }

    expect(events.find(e => e.type === 'tool-call.start')).toStrictEqual({
      toolName: 'add',
      type: 'tool-call.start',
    })

    const toolCallEvent = events.find(e => e.type === 'tool-call.done')

    expect(toolCallEvent).toMatchObject({
      toolCallType: 'function',
      toolName: 'add',
      type: 'tool-call.done',
    })
    expect(JSON.parse(toolCallEvent!.args)).toStrictEqual({
      a: '114514',
      b: '1919810',
    })

    expect(events.find(e => e.type === 'tool-result.done')).toStrictEqual({
      args: {
        a: '114514',
        b: '1919810',
      },
      result: '2034324',
      toolName: 'add',
      type: 'tool-result.done',
    })

    const allSteps = await steps

    const cleanToolCallId = (obj: object) => clean({
      ...obj,
      toolCallId: undefined,
    })

    expect(allSteps.length).toBe(2)
    expect(allSteps[0].toolCalls.map(cleanToolCallId)).toMatchObject([{
      toolCallType: 'function',
      toolName: 'add',
    }])
    expect(JSON.parse(allSteps[0].toolCalls[0].args)).toStrictEqual({
      a: '114514',
      b: '1919810',
    })
    expect(allSteps[0].toolResults.map(cleanToolCallId)).toStrictEqual([
      {
        args: {
          a: '114514',
          b: '1919810',
        },
        result: '2034324',
        toolName: 'add',
      },
    ])
  })

  it('emits a synthetic tool result when preToolCall returns one', async () => {
    const body = [
      'data: {"choices":[{"delta":{"role":"assistant","tool_calls":[{"index":0,"id":"call_1","type":"function","function":{"name":"runCommand","arguments":""}}]},"index":0}],"created":1,"id":"chunk_1","model":"test-model","object":"chat.completion.chunk","system_fingerprint":"fingerprint"}\n\n',
      'data: {"choices":[{"delta":{"role":"assistant","tool_calls":[{"index":0,"id":"call_1","type":"function","function":{"arguments":"{\\"command\\":\\"git status\\"}"}}]},"index":0}],"created":1,"id":"chunk_2","model":"test-model","object":"chat.completion.chunk","system_fingerprint":"fingerprint"}\n\n',
      'data: {"choices":[{"delta":{"role":"assistant"},"finish_reason":"tool_calls","index":0}],"created":1,"id":"chunk_3","model":"test-model","object":"chat.completion.chunk","system_fingerprint":"fingerprint","usage":{"completion_tokens":1,"prompt_tokens":1,"total_tokens":2}}\n\n',
    ].join('')
    const fetch: typeof globalThis.fetch = async () => new Response(body, {
      headers: {
        'content-type': 'text/event-stream',
      },
    })
    let executed = false
    const runCommand = await tool({
      execute: () => {
        executed = true
        return 'ran command'
      },
      name: 'runCommand',
      parameters: object({
        command: string(),
      }),
    })

    const { eventStream, steps } = streamText({
      baseURL: 'https://example.com/v1/',
      fetch,
      messages: [{ content: 'check repo', role: 'user' }],
      model: 'test-model',
      preToolCall: toolCall => ({
        args: { command: 'git status' },
        result: 'TOOL_HITL_REJECTED: denied by reviewer',
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
      }),
      tools: [runCommand],
    })

    const events: Event[] = []
    for await (const event of eventStream) {
      events.push(event)
    }

    expect(executed).toBe(false)
    expect(events.find(event => event.type === 'tool-result.done')).toMatchObject({
      result: 'TOOL_HITL_REJECTED: denied by reviewer',
      toolCallId: 'call_1',
      toolName: 'runCommand',
      type: 'tool-result.done',
    })
    expect((await steps)[0].finishReason).toBe('tool_calls')
  })
})
