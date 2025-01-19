import type { InferIn, Schema } from '@typeschema/main'

import { toJSONSchema } from '@typeschema/main'
import { clean } from '@xsai/shared'

export interface Tool<T extends Schema> {
  execute: (input: unknown extends InferIn<T> ? never : InferIn<T>) => Promise<string> | string
  function: {
    description?: string
    name: string
    parameters: InferIn<T>
    strict?: boolean
  }
  type: 'function'
}

export interface ToolCall {
  id: string
  name: string
  parameters: string
  parsedParameters: Record<string, unknown>
  result: string
  type: 'function'
}

export interface ToolOptions<T extends Schema> {
  description?: string
  execute: (input: InferIn<T>) => Promise<string> | string
  name: string
  parameters: T
  strict?: boolean
}

export const tool = async <T extends Schema>(options: ToolOptions<T>): Promise<Tool<T>> => ({
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

export default tool
