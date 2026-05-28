import type { CompletionToolResult, Tool, ToolCall } from '../src'

import { InvalidToolCallError, InvalidToolInputError, ToolExecutionError } from '@xsai/shared'
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
  it('throws InvalidToolCallError when the model selects an unavailable tool', async () => {
    await expect(executeTool({
      messages: [...messages],
      toolCall: createToolCall(),
      tools: [],
    })).rejects.toMatchObject({
      code: 'invalid_tool_call',
      reason: 'unknown_tool',
      toolName: 'weather',
    })
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

  it('throws InvalidToolInputError when tool arguments are invalid JSON', async () => {
    const tool = createWeatherTool(() => 'ok')

    try {
      await executeTool({
        messages: [...messages],
        toolCall: createToolCall({
          function: {
            arguments: '{"city"',
            name: 'weather',
          },
        }),
        tools: [tool],
      })
    }
    catch (error) {
      expect(InvalidToolCallError.isInstance(error)).toBe(false)

      if (!InvalidToolInputError.isInstance(error))
        throw error

      expect(error.toolName).toBe('weather')
      expect(error.toolInput).toBe('{"city"')
      expect(error.cause).toBeInstanceOf(SyntaxError)
    }
  })

  it('throws ToolExecutionError and keeps the original cause', async () => {
    const tool = createWeatherTool(() => {
      throw new TypeError('boom')
    })

    try {
      await executeTool({
        messages: [...messages],
        toolCall: createToolCall(),
        tools: [tool],
      })
    }
    catch (error) {
      if (!ToolExecutionError.isInstance(error))
        throw error

      expect(error.toolName).toBe('weather')
      expect(error.toolInput).toStrictEqual({ city: 'Taipei' })
      expect(error.toolCallId).toBe('call_1')
      expect(error.cause).toBeInstanceOf(TypeError)
    }
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
    const tool = createWeatherTool(() => {
      executed = true
      return 'sunny'
    })
    const syntheticResult: CompletionToolResult = {
      args: { city: 'Taipei' },
      result: 'not allowed',
      toolCallId: 'call_1',
      toolName: 'weather',
    }

    const result = await executeTool({
      messages: [...messages],
      postToolCall: toolResult => ({
        ...toolResult,
        result: `${String(toolResult.result)} after post`,
      }),
      preToolCall: () => syntheticResult,
      toolCall: createToolCall(),
      tools: [tool],
    })

    expect(executed).toBe(false)
    expect(result.result).toBe('not allowed after post')
    expect(result.completionToolResult.result).toBe('not allowed after post')
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
