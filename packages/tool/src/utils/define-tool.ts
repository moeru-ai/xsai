import type { Tool, ToolExecuteOptions, ToolExecuteResult } from '@xsai/shared-chat'
import type { Schema, SchemaWithJson } from 'xsschema'

import { strictJsonSchema } from 'xsschema'

export interface DefineToolOptions<T extends Schema & SchemaWithJson> {
  description?: string
  execute: (input: Schema.InferOutput<T>, options: ToolExecuteOptions) => Promise<ToolExecuteResult> | ToolExecuteResult
  name: string
  parameters: T
  /** @default true */
  strict?: boolean
}

export const defineTool = <T extends Schema & SchemaWithJson>({ description, execute, name, parameters, strict }: DefineToolOptions<T>): Tool => {
  const schema = parameters['~standard'].jsonSchema.input({ target: 'draft-07' })

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
    validate: async input => parameters['~standard'].validate(input),
  }
}
