import type { InferIn, Schema } from 'xsschema'

import { clean } from '@xsai/shared'
import { toJSONSchema } from 'xsschema'

export interface ToolOptions<T extends Schema = Schema> {
  description?: string
  execute: (input: InferIn<T>) => Promise<string> | string
  name: string
  parameters: T
  strict?: boolean
}

export interface ToolResult {
  execute: (input: unknown) => Promise<string> | string
  function: {
    description?: string
    name: string
    parameters: Record<string, unknown>
    strict?: boolean
  }
  type: 'function'
}

export const tool = async <T extends Schema>(options: ToolOptions<T>): Promise<ToolResult> => ({
  execute: options.execute,
  function: {
    description: options.description,
    name: options.name,
    parameters: await toJSONSchema(options.parameters)
      .then(json => clean({
        ...json,
        $schema: undefined,
      })),
    strict: options.strict,
  },
  type: 'function',
})
