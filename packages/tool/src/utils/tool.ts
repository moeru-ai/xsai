import type { Tool, ToolExecuteOptions, ToolExecuteResult } from '@xsai/shared-chat'
import type { InferIn, Schema } from 'xsschema'

import { strictJsonSchema, toJsonSchema } from 'xsschema'

export interface ToolOptions<T extends Schema> {
  description?: string
  execute: (input: InferIn<T>, options: ToolExecuteOptions) => Promise<ToolExecuteResult> | ToolExecuteResult
  name: string
  parameters: T
  /** @default true */
  strict?: boolean
}

export const tool = async <T extends Schema>({ description, execute, name, parameters, strict }: ToolOptions<T>): Promise<Tool> => {
  const schema = await toJsonSchema(parameters)

  return {
    execute,
    function: {
      description,
      name,
      parameters: (strict !== false
        ? strictJsonSchema(schema)
        : schema) as Record<string, unknown>,
      strict: strict ?? true,
    },
    type: 'function',
  }
}
