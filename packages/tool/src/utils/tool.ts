import type { Tool, ToolExecuteOptions, ToolExecuteResult } from '@xsai/shared-chat'
import type { InferIn, Schema } from 'xsschema'

import { strictJsonSchema, toJsonSchema } from 'xsschema'

export interface ToolOptions<T extends Schema> {
  description?: string
  execute: (input: InferIn<T>, options: ToolExecuteOptions) => Promise<ToolExecuteResult> | ToolExecuteResult
  name: string
  parameters: T
}

export const tool = async <T extends Schema>({ description, execute, name, parameters }: ToolOptions<T>): Promise<Tool> => {
  const schema = await toJsonSchema(parameters)

  return {
    execute,
    function: {
      description,
      name,
      parameters: strictJsonSchema(schema) as Record<string, unknown>,
      strict: true,
    },
    type: 'function',
  }
}
