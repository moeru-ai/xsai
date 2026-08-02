import type { CompletionToolResult, Tool, ToolCall } from '../src'

import { describe, expect, it } from 'vitest'

import { executeTool } from '../src/utils/execute-tool'

const messages = [{ content: 'hello', role: 'user' }] as const

const createToolCall = (overrides: Partial<ToolCall> = {}): ToolCall => ({
  function: {
    arguments: '{"city":"Taipei"}',
    name: 'weather',
  },
  id: 'call_1',
  type: 'function',
  ...overrides,
})

const createWeatherTool = (execute: Tool['execute']): Tool => ({
  execute,
  function: {
    name: 'weather',
    parameters: {},
  },
  type: 'function',
})

describe('@xsai/shared-chat executeTool errors', () => {
  it('returns an error result when the model selects an unavailable tool', async () => {
    const result = await executeTool({
      messages: [...messages],
      toolCall: createToolCall(),
      tools: [],
    })

    expect(result.completionToolResult).toStrictEqual({
      args: '{"city":"Taipei"}',
      isError: true,
      result: 'Tool "weather" execution failed: Model tried to call unavailable tool "weather", No tools are available.',
      toolCallId: 'call_1',
      toolName: 'weather',
    })
    expect(result.result).toBe(result.completionToolResult.result)
  })

  it('throws InvalidToolCallError when tool name is missing', async () => {
    await expect(executeTool({
      messages: [...messages],
      toolCall: {
        function: {
          arguments: '{}',
        },
        id: 'call_1',
        type: 'function',
      } as ToolCall,
      tools: [],
    })).rejects.toMatchObject({
      code: 'invalid_tool_call',
      reason: 'missing_name',
    })
  })

  it('throws InvalidToolCallError when tool arguments are missing', async () => {
    await expect(executeTool({
      messages: [...messages],
      toolCall: {
        function: {
          name: 'weather',
        },
        id: 'call_1',
        type: 'function',
      } as ToolCall,
      tools: [],
    })).rejects.toMatchObject({
      code: 'invalid_tool_call',
      reason: 'missing_arguments',
    })
  })

  it('returns an error result when tool arguments are invalid JSON', async () => {
    const tool = createWeatherTool(() => 'ok')

    const result = await executeTool({
      messages: [...messages],
      toolCall: createToolCall({
        function: {
          arguments: '{"city"',
          name: 'weather',
        },
      }),
      tools: [tool],
    })

    expect(result.completionToolResult).toStrictEqual({
      args: '{"city"',
      isError: true,
      result: 'Tool "weather" execution failed: Failed to parse tool input for "weather".',
      toolCallId: 'call_1',
      toolName: 'weather',
    })
  })

  it('returns an error result when tool input validation fails', async () => {
    let executed = false
    const tool = {
      ...createWeatherTool(() => {
        executed = true
        return 'ok'
      }),
      validate: () => ({
        issues: [{ message: 'city is required' }],
      }),
    } satisfies Tool

    const result = await executeTool({
      messages: [...messages],
      toolCall: createToolCall(),
      tools: [tool],
    })

    expect(result.completionToolResult).toStrictEqual({
      args: { city: 'Taipei' },
      isError: true,
      result: 'Tool "weather" execution failed: Tool input validation failed for "weather".',
      toolCallId: 'call_1',
      toolName: 'weather',
    })
    expect(executed).toBe(false)
  })

  it('executes tools with validated input values', async () => {
    const seen: unknown[] = []
    const tool = {
      ...createWeatherTool((input) => {
        seen.push(input)
        return `weather:${(input as { city: string }).city}`
      }),
      validate: () => ({
        value: { city: 'Validated Taipei' },
      }),
    } satisfies Tool

    const result = await executeTool({
      messages: [...messages],
      toolCall: createToolCall(),
      tools: [tool],
    })

    expect(result.result).toBe('weather:Validated Taipei')
    expect(result.completionToolResult.args).toStrictEqual({ city: 'Validated Taipei' })
    expect(seen).toStrictEqual([{ city: 'Validated Taipei' }])
  })

  it('returns an error result when tool execution fails', async () => {
    const tool = createWeatherTool(() => {
      throw new TypeError('boom')
    })

    const result = await executeTool({
      messages: [...messages],
      toolCall: createToolCall(),
      tools: [tool],
    })

    expect(result.completionToolResult).toStrictEqual({
      args: { city: 'Taipei' },
      isError: true,
      result: 'Tool "weather" execution failed: boom',
      toolCallId: 'call_1',
      toolName: 'weather',
    })
  })

  it('returns an abort error result when the tool aborts', async () => {
    const controller = new AbortController()
    const tool = createWeatherTool(() => {
      controller.abort()
      throw new Error('cancelled')
    })

    const result = await executeTool({
      abortSignal: controller.signal,
      messages: [...messages],
      toolCall: createToolCall(),
      tools: [tool],
    })

    expect(result.completionToolResult).toMatchObject({
      isError: true,
      result: 'Tool "weather" execution failed: This operation was aborted',
    })
  })

  it('returns an error result when preToolCall fails', async () => {
    let postCalled = false
    const result = await executeTool({
      messages: [...messages],
      postToolCall: () => {
        postCalled = true
      },
      preToolCall: () => {
        throw new Error('pre boom')
      },
      toolCall: createToolCall(),
      tools: [createWeatherTool(() => 'sunny')],
    })

    expect(postCalled).toBe(false)
    expect(result.completionToolResult).toStrictEqual({
      args: '{"city":"Taipei"}',
      isError: true,
      result: 'Tool "weather" execution failed: pre boom',
      toolCallId: 'call_1',
      toolName: 'weather',
    })
  })
})

describe('@xsai/shared-chat executeTool control', () => {
  it('passes normalized tool calls through preToolCall and tool results through postToolCall', async () => {
    const seen: unknown[] = []
    const tool = createWeatherTool(input => `weather:${(input as { city: string }).city}`)

    const result = await executeTool({
      messages: [...messages],
      postToolCall: (toolResult, options) => {
        seen.push(['post', toolResult, options.messages.length, options.toolCallId])
        return {
          ...toolResult,
          result: 'patched result',
        }
      },
      preToolCall: (toolCall, options) => {
        seen.push(['pre', toolCall, options.messages.length, options.toolCallId])
      },
      toolCall: createToolCall(),
      tools: [tool],
    })

    expect(result.result).toBe('patched result')
    expect(result.completionToolCall).toMatchObject({
      args: '{"city":"Taipei"}',
      toolCallId: 'call_1',
      toolName: 'weather',
    })
    expect(result.completionToolResult.result).toBe('patched result')
    expect(seen).toMatchObject([
      ['pre', { toolCallId: 'call_1', toolName: 'weather' }, 1, 'call_1'],
      ['post', { result: 'weather:Taipei', toolCallId: 'call_1', toolName: 'weather' }, 1, 'call_1'],
    ])
  })

  it('lets postToolCall observe and override an error result', async () => {
    let observedArgs: unknown
    let observedError: boolean | undefined
    const tool = createWeatherTool(() => {
      throw new Error('boom')
    })

    const result = await executeTool({
      messages: [...messages],
      postToolCall: (toolResult) => {
        observedArgs = toolResult.args
        observedError = toolResult.isError
        return {
          ...toolResult,
          isError: false,
          result: 'recovered',
        }
      },
      toolCall: createToolCall(),
      tools: [tool],
    })

    expect(observedArgs).toStrictEqual({ city: 'Taipei' })
    expect(observedError).toBe(true)
    expect(result.completionToolResult).toMatchObject({
      isError: false,
      result: 'recovered',
    })
  })

  it('returns an error result when postToolCall fails', async () => {
    const result = await executeTool({
      messages: [...messages],
      postToolCall: () => {
        throw new Error('post boom')
      },
      toolCall: createToolCall(),
      tools: [createWeatherTool(() => 'sunny')],
    })

    expect(result.completionToolResult).toMatchObject({
      isError: true,
      result: 'Tool "weather" execution failed: post boom',
    })
  })

  it('lets preToolCall rewrite arguments before execution', async () => {
    const tool = createWeatherTool(input => `weather:${(input as { city: string }).city}`)

    const result = await executeTool({
      messages: [...messages],
      preToolCall: toolCall => ({
        ...toolCall,
        args: '{"city":"Hong Kong"}',
      }),
      toolCall: createToolCall(),
      tools: [tool],
    })

    expect(result.result).toBe('weather:Hong Kong')
    expect(result.completionToolCall.args).toBe('{"city":"Hong Kong"}')
    expect(result.completionToolResult.args).toStrictEqual({ city: 'Hong Kong' })
  })

  it('lets preToolCall provide a tool result without executing the tool', async () => {
    let executed = false
    let postCalled = false
    const tool = createWeatherTool(() => {
      executed = true
      return 'sunny'
    })
    const syntheticResult: CompletionToolResult = {
      args: { city: 'Taipei' },
      isError: true,
      result: 'not allowed',
      toolCallId: 'call_1',
      toolName: 'weather',
    }

    const result = await executeTool({
      messages: [...messages],
      postToolCall: () => {
        postCalled = true
      },
      preToolCall: () => syntheticResult,
      toolCall: createToolCall(),
      tools: [tool],
    })

    expect(executed).toBe(false)
    expect(postCalled).toBe(false)
    expect(result.result).toBe('not allowed')
    expect(result.completionToolResult.result).toBe('not allowed')
    expect(result.completionToolResult.isError).toBe(true)
  })

  it('rejects transformed tool calls/results that change the tool call id', async () => {
    const tool = createWeatherTool(() => 'sunny')

    await expect(executeTool({
      messages: [...messages],
      preToolCall: toolCall => ({
        ...toolCall,
        toolCallId: 'call_2',
      }),
      toolCall: createToolCall(),
      tools: [tool],
    })).rejects.toMatchObject({
      reason: 'tool_call_id_mismatch',
    })

    await expect(executeTool({
      messages: [...messages],
      postToolCall: toolResult => ({
        ...toolResult,
        toolCallId: 'call_2',
      }),
      toolCall: createToolCall(),
      tools: [tool],
    })).rejects.toMatchObject({
      reason: 'tool_call_id_mismatch',
    })
  })
})
