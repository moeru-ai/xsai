import type { Tool, ToolExecuteOptions, ToolExecuteResult } from '@xsai/shared-chat'
import type { JsonSchema } from 'xsschema'

export interface RawToolOptions<T = unknown> {
  execute: (input: T, options: ToolExecuteOptions) => Promise<ToolExecuteResult> | ToolExecuteResult
  parameters: JsonSchema
  name: string
  description?: string
}

export const rawTool = <T = unknown>({ execute, description, name, parameters }: RawToolOptions<T>): Tool => ({
  execute: execute as Tool['execute'],
  function: {
    name,
    description,
    parameters: {
      ...parameters,
      additionalProperties: false,
    },
    strict: true,
  },
  type: 'function'
})
