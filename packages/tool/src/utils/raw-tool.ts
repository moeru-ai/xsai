import type { Tool, ToolExecuteOptions, ToolExecuteResult } from '@xsai/shared-chat'
import type { JsonSchema } from 'xsschema'

export interface RawToolOptions<T = unknown> {
  description?: string
  execute: (input: T, options: ToolExecuteOptions) => Promise<ToolExecuteResult> | ToolExecuteResult
  name: string
  parameters: JsonSchema
}

export const rawTool = <T = unknown>({ description, execute, name, parameters }: RawToolOptions<T>): Tool => ({
  execute: execute as Tool['execute'],
  function: {
    description,
    name,
    parameters: {
      ...parameters,
      additionalProperties: false,
    },
    strict: true,
  },
  type: 'function',
})
