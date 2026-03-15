import type { StandardJSONSchemaV1 } from '@standard-schema/spec'

import type { AnthropicTextBlockParam } from './anthropic-message'

export interface AnthropicCacheControl {
  type: 'ephemeral'
}

export interface AnthropicTool {
  description?: string
  input_schema: Record<string, unknown>
  name: string
  strict?: boolean
}

export type AnthropicToolChoice = AnthropicToolChoiceAny | AnthropicToolChoiceAuto | AnthropicToolChoiceNone | AnthropicToolChoiceTool

export interface AnthropicToolChoiceAny {
  disable_parallel_tool_use?: boolean
  type: 'any'
}

export interface AnthropicToolChoiceAuto {
  disable_parallel_tool_use?: boolean
  type: 'auto'
}

export interface AnthropicToolChoiceNone {
  type: 'none'
}

export interface AnthropicToolChoiceTool {
  disable_parallel_tool_use?: boolean
  name: string
  type: 'tool'
}

export interface ExecutableTool extends AnthropicTool {
  execute: (input: unknown) => Promise<ToolExecuteResult> | ToolExecuteResult
}

export type ToolExecuteResult = AnthropicTextBlockParam[] | object | string | unknown[]

export interface ToolOptions<T extends StandardJSONSchemaV1> {
  description?: string
  execute: (input: StandardJSONSchemaV1.InferInput<T>) => Promise<ToolExecuteResult> | ToolExecuteResult
  inputSchema: T
  name: string
  strict?: boolean
}
