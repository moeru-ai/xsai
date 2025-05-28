import type { Tool, ToolExecuteOptions, ToolExecuteResult } from '@xsai/shared-chat'
import type { InferIn, JsonSchema, Schema } from 'xsschema'

import { toJsonSchema } from 'xsschema'

export interface ToolOptions<T extends Schema> {
  description?: string
  execute: (input: InferIn<T>, options: ToolExecuteOptions) => Promise<ToolExecuteResult> | ToolExecuteResult
  name: string
  parameters: T
}

export interface ToolResult extends Tool {}

export const tool = async <T extends Schema>({ execute, description, name, parameters }: ToolOptions<T>): Promise<ToolResult> => {
  const schema = await toJsonSchema(parameters)

  return {
    execute,
    function: {
      description,
      name,
      parameters: {
        ...schema,
        additionalProperties: false,
      } satisfies JsonSchema,
      strict: true,
    },
    type: 'function',
  }
}
