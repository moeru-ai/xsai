import type { StandardJSONSchemaV1 } from '@standard-schema/spec'

import type { FunctionCallOutput, FunctionTool } from '../generated'

export interface ExecutableTool extends FunctionTool {
  execute: (input: unknown) => Promise<ToolExecuteResult> | ToolExecuteResult
}

export type ToolExecuteResult = FunctionCallOutput['output']

export interface ToolOptions<T extends StandardJSONSchemaV1> {
  description?: string
  execute: (input: StandardJSONSchemaV1.InferInput<T>) => Promise<ToolExecuteResult> | ToolExecuteResult
  inputSchema: T
  name: string
  strict?: boolean
}

export const tool = <T extends StandardJSONSchemaV1>({ description, execute, inputSchema, name, strict }: ToolOptions<T>): ExecutableTool => ({
  description: description ?? null,
  execute,
  name,
  parameters: inputSchema['~standard'].jsonSchema.input({ target: 'draft-07' }),
  strict: strict ?? true,
  type: 'function',
})
