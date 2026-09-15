import type { Promisable } from '@xsai/shared'

import type { InferSchemaInput, UnresolvedSchema } from '../utils/schema'
import type { ToolResultPartContent } from './types/content'

import { resolveSchema } from '../utils/schema'

export interface ExecutableTool extends Tool {
  execute: (input: unknown) => Promisable<string | ToolResultPartContent[]>
}

export interface Tool {
  description?: string
  inputSchema: Record<string, unknown>
  name: string
  outputSchema?: Record<string, unknown>
}

export interface ToolOptions<TInput extends UnresolvedSchema, TOutput extends undefined | UnresolvedSchema = undefined> {
  description?: string
  execute?: (input: InferSchemaInput<TInput>) => TOutput extends UnresolvedSchema
    ? Promisable<InferSchemaInput<TOutput>>
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
  const tool: Tool = {
    description: options.description,
    inputSchema: resolveSchema(options.inputSchema).schema as Record<string, unknown>,
    name: options.name,
    outputSchema: options.outputSchema == null ? undefined : resolveSchema(options.outputSchema).schema as Record<string, unknown>,
  }

  if (options.execute == null) {
    return tool
  }
  else {
    return {
      ...tool,
      execute: async (input: unknown) => {
        // TODO: validate
        const result = await options.execute!(input)
        if (options.outputSchema) // TODO: validate
          return JSON.stringify(result)
        else
          return result as string | ToolResultPartContent[]
      },
    }
  }
}) as ToolFactory
