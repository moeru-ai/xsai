import type { Tool, ToolCall } from '../src'

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
    const tool: Tool = {
      execute: () => 'ok',
      function: {
        name: 'weather',
        parameters: {},
      },
      type: 'function',
    }

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
    const tool: Tool = {
      execute: () => {
        throw new TypeError('boom')
      },
      function: {
        name: 'weather',
        parameters: {},
      },
      type: 'function',
    }

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
