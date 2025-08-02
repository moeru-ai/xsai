import type { Tool, ToolExecuteOptions, ToolExecuteResult } from '@xsai/shared-chat'
import type { JsonSchema } from 'xsschema'

import { strictJsonSchema } from 'xsschema'

export interface RawToolOptions<T = unknown> {
  description?: string
  execute: (input: T, options: ToolExecuteOptions) => Promise<ToolExecuteResult> | ToolExecuteResult
  name: string
  parameters: JsonSchema
  strict?: boolean
}

export const rawTool = <T = unknown>({ description, execute, name, parameters, strict }: RawToolOptions<T>): Tool => ({
  execute: execute as Tool['execute'],
  function: {
    description,
    name,
    parameters: (strict !== false
      ? strictJsonSchema(parameters)
      : parameters) as Record<string, unknown>,
    strict: strict ?? true,
  },
  type: 'function',
})
