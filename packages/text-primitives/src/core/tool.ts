import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'

import type { ToolResultPartContent } from './types/content'

export interface ExecutableTool extends Tool {
  execute: (input: unknown) => Promise<string | ToolResultPartContent[]> | string | ToolResultPartContent[]
}

export interface Tool {
  description?: string
  inputSchema: Record<string, unknown>
  name: string
  outputSchema?: Record<string, unknown>
  // validate?: (input: unknown) => Promise<ToolValidateResult> | ToolValidateResult
}

export interface ToolOptions<TInput extends StandardJSONSchemaV1, TOutput extends StandardJSONSchemaV1 | undefined = undefined> {
  description?: string
  execute?: (input: StandardSchemaV1.InferInput<TInput>) => TOutput extends StandardJSONSchemaV1
    ? Promise<StandardSchemaV1.InferInput<TOutput>> | StandardSchemaV1.InferInput<TOutput>
    : Promise<string | ToolResultPartContent[]> | string | ToolResultPartContent[]
  inputSchema: TInput
  name: string
  outputSchema?: TOutput
}

interface ToolFactory {
  <TInput extends StandardJSONSchemaV1, TOutput extends StandardJSONSchemaV1 | undefined = undefined>(
    options: Required<Pick<ToolOptions<TInput, TOutput>, 'execute'>> & ToolOptions<TInput, TOutput>,
  ): ExecutableTool
  <TInput extends StandardJSONSchemaV1, TOutput extends StandardJSONSchemaV1 | undefined = undefined>(
    options: ToolOptions<TInput, TOutput>,
  ): Tool
}

export const tool = ((options: ToolOptions<StandardJSONSchemaV1, StandardJSONSchemaV1 | undefined>): ExecutableTool | Tool => {
  const tool: Tool = {
    description: options.description,
    inputSchema: options.inputSchema['~standard'].jsonSchema.input({ target: 'draft-07' }),
    name: options.name,
    outputSchema: options.outputSchema?.['~standard'].jsonSchema.input({ target: 'draft-07' }),
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
