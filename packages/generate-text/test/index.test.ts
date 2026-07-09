import type { GenerateTextResult } from '../src'

import { clean } from '@xsai/shared'
import { tool } from '@xsai/tool'
import { description, object, pipe, string } from 'valibot'
import { describe, expect, it } from 'vitest'

import { generateText } from '../src'
import { stepCountAtLeast } from '../src/shared-chat'

describe('@xsai/generate-text', () => {
  it('basic', async () => {
    let step: GenerateTextResult['steps'][number] | undefined

    const { finishReason, steps, text, toolCalls, toolResults, totalUsage, usage } = await generateText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, so please answer \'YES\' and nothing else.',
          role: 'user',
        },
      ],
      model: 'qwen3.5:2b',
      onStepFinish: result => (step = result),
      seed: 114514,
    })

    expect(text!.toUpperCase()).toStrictEqual('YES')
    expect(finishReason).toBe('stop')
    expect(toolCalls.length).toBe(0)
    expect(toolResults.length).toBe(0)
    expect(totalUsage).toStrictEqual(usage)

    expect(steps[0]).toStrictEqual(step)
  })

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

    const { steps, totalUsage, usage } = await generateText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'How many times does 114514 plus 1919810 equal? Please try to call the `add` tool to solve the problem.',
          role: 'user',
        },
      ],
      model: 'qwen3.5:2b',
      seed: 1145141919810,
      stopWhen: stepCountAtLeast(2),
      toolChoice: 'required',
      tools: [add],
    })

    const cleanToolCallId = (obj: object) => clean({
      ...obj,
      toolCallId: undefined,
    })

    expect(steps.length).toBe(2)
    expect(steps[0].toolCalls.map(({ args, ...rest }) => ({
      ...cleanToolCallId(rest),
      args: JSON.parse(args) as Record<string, unknown>,
    }))).toStrictEqual([
      {
        args: {
          a: '114514',
          b: '1919810',
        },
        toolCallType: 'function',
        toolName: 'add',
      },
    ])
    expect(steps[0].toolResults.map(cleanToolCallId)).toStrictEqual([
      {
        args: {
          a: '114514',
          b: '1919810',
        },
        result: '2034324',
        toolName: 'add',
      },
    ])

    expect(totalUsage).toStrictEqual({
      inputTokens: steps.reduce((sum, step) => sum + step.usage.inputTokens, 0),
      outputTokens: steps.reduce((sum, step) => sum + step.usage.outputTokens, 0),
      totalTokens: steps.reduce((sum, step) => sum + step.usage.totalTokens, 0),
    })
    expect(usage).toStrictEqual(steps.at(-1)!.usage)
  })

  it('reasoning', async () => {
    const { reasoningText } = await generateText({
      baseURL: 'http://localhost:11434/v1/',
      maxOutputTokens: 810,
      maxTokens: 810,
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, so please answer \'YES\' and nothing else.',
          role: 'user',
        },
      ],
      model: 'qwen3.5:2b',
      reasoningEffort: 'low' as 'minimal',
      seed: 114514,
    })

    expect(reasoningText?.length).toBeGreaterThan(1)
  })

  it('lets tool hooks provide synthetic results inside the tool loop', async () => {
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
                arguments: '{"command":"git status"}',
                name: 'runCommand',
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
    ]
    const fetch: typeof globalThis.fetch = async () => new Response(JSON.stringify(responses.shift()))
    const calls: string[] = []
    const runCommand = await tool({
      execute: ({ command }) => {
        calls.push(command)
        return `ran ${command}`
      },
      name: 'runCommand',
      parameters: object({
        command: string(),
      }),
    })

    const result = await generateText({
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

    expect(result.finishReason).toBe('tool_calls')
    expect(result.toolResults).toStrictEqual([{
      args: {
        command: 'git status',
      },
      result: 'TOOL_HITL_REJECTED: denied by reviewer',
      toolCallId: 'call_1',
      toolName: 'runCommand',
    }])
    expect(calls).toStrictEqual([])
  })
})
