import type { ExecutableTool } from '../src'
import type { FunctionCall } from '../src/generated'

import { InvalidToolCallError, InvalidToolInputError, ToolExecutionError } from '@xsai/shared'
import { describe, expect, it } from 'vitest'

import { executeTool } from '../src/utils/execute-tool'

const createFunctionCall = (overrides: Partial<FunctionCall> = {}): FunctionCall => ({
  arguments: '{"city":"Taipei"}',
  call_id: 'call_1',
  id: 'fc_1',
  name: 'weather',
  status: 'completed',
  type: 'function_call',
  ...overrides,
})

const createTool = (overrides: Partial<ExecutableTool> = {}): ExecutableTool => ({
  description: null,
  execute: () => 'ok',
  name: 'weather',
  parameters: {},
  strict: true,
  type: 'function',
  ...overrides,
})

describe('@xsai-ext/responses executeTool errors', () => {
  it('throws InvalidToolCallError when the model selects an unavailable tool', async () => {
    await expect(executeTool({
      functionCall: createFunctionCall(),
      tools: [],
    })).rejects.toMatchObject({
      code: 'invalid_tool_call',
      reason: 'unknown_tool',
      toolName: 'weather',
    })
  })

  it('throws InvalidToolInputError when tool arguments are invalid JSON', async () => {
    try {
      await executeTool({
        functionCall: createFunctionCall({
          arguments: '{"city"',
        }),
        tools: [createTool()],
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
    try {
      await executeTool({
        functionCall: createFunctionCall(),
        tools: [createTool({
          execute: () => {
            throw new TypeError('boom')
          },
        })],
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
