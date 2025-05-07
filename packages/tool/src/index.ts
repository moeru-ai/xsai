import type { Tool, ToolExecuteOptions, ToolExecuteResult } from '@xsai/shared-chat'
import type { Infer, InferIn, JsonSchema, Schema } from 'xsschema'

import { toJsonSchema } from 'xsschema'

export interface ToolOptions<T1 extends Schema, T2 extends Schema | undefined = undefined> {
  description?: string
  execute: (input: InferIn<T1>, options: ToolExecuteOptions) => T2 extends Schema
    ? Infer<T2> extends object
      ? Infer<T2> | Promise<Infer<T2>>
      : Promise<ToolExecuteResult> | ToolExecuteResult
    : Promise<ToolExecuteResult> | ToolExecuteResult
  name: string
  parameters: T1
  returns?: T2
}

export interface ToolResult extends Tool {}

export const tool = async <T1 extends Schema, T2 extends Schema | undefined = undefined>(options: ToolOptions<T1, T2>): Promise<ToolResult> => {
  const schema = await toJsonSchema(options.parameters)

  return {
    execute: options.execute,
    function: {
      description: options.description,
      name: options.name,
      parameters: {
        ...schema,
        additionalProperties: false,
      } satisfies JsonSchema,
      returns: options.returns ? (await toJsonSchema(options.returns)) as Record<string, unknown> : undefined,
      strict: true,
    },
    type: 'function',
  }
}
