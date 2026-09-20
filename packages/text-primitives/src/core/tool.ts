import type { Promisable } from '@xsai/shared'

import type { InferSchemaOutput, ResolvedSchema, UnresolvedSchema } from '../utils/schema'
import type { ToolResultPartContent } from './types/content'

import { resolveSchema } from '../utils/schema'

export interface ExecutableTool extends Tool {
  execute: (input: unknown, options?: ToolExecuteOptions) => Promisable<string | ToolResultPartContent[]>
}

export interface Tool {
  description?: string
  inputSchema: ResolvedSchema
  name: string
  outputSchema?: ResolvedSchema
}

export interface ToolExecuteOptions {
  signal?: AbortSignal
}

export interface ToolOptions<TInput extends UnresolvedSchema, TOutput extends undefined | UnresolvedSchema = undefined> {
  description?: string
  execute?: (input: InferSchemaOutput<TInput>, options?: ToolExecuteOptions) => TOutput extends UnresolvedSchema
    ? Promisable<InferSchemaOutput<TOutput>>
    : Promisable<string | ToolResultPartContent[]>
  inputSchema: TInput
  name: string
  outputSchema?: TOutput
}

interface ToolFactory {
  <TInput extends UnresolvedSchema, TOutput extends undefined | UnresolvedSchema = undefined>(
    options: Required<Pick<ToolOptions<TInput, TOutput>, 'execute'>> & ToolOptions<TInput, TOutput>,
  ): ExecutableTool
  <TInput extends UnresolvedSchema, TOutput extends undefined | UnresolvedSchema = undefined>(
    options: ToolOptions<TInput, TOutput>,
  ): Tool
}

export const tool = ((options: ToolOptions<UnresolvedSchema, undefined | UnresolvedSchema>): ExecutableTool | Tool => {
  const inputSchema = resolveSchema(options.inputSchema)
  const outputSchema = options.outputSchema == null ? undefined : resolveSchema(options.outputSchema)
  const tool: Tool = {
    description: options.description,
    inputSchema,
    name: options.name,
    outputSchema,
  }

  if (options.execute == null) {
    return tool
  }
  else {
    return {
      ...tool,
      execute: async (input: unknown, executeOptions?: ToolExecuteOptions) => {
        const result = await options.execute!(input, executeOptions)
        if (outputSchema) // Output validation is intentionally deferred.
          return JSON.stringify(result)
        else
          return result as string | ToolResultPartContent[]
      },
    }
  }
}) as ToolFactory
