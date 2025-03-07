import type { Tool, ToolExecuteOptions } from '@xsai/shared-chat'
import type { InferIn, Schema } from 'xsschema'

import { toJSONSchema } from 'xsschema'

export interface ToolOptions<T extends Schema = Schema> {
  description?: string
  execute: (input: InferIn<T>, options: ToolExecuteOptions) => (object | string | unknown[]) | Promise<object | string | unknown[]>
  name: string
  parameters: T
  strict?: boolean
}

export interface ToolResult extends Tool {}

export const tool = async <T extends Schema>(options: ToolOptions<T>): Promise<ToolResult> => ({
  execute: options.execute,
  function: {
    description: options.description,
    name: options.name,
    parameters: await toJSONSchema(options.parameters) as Record<string, unknown>,
    strict: options.strict,
  },
  type: 'function',
})
