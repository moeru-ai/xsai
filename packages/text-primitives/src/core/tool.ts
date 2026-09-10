import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'

import type { ToolResultPartContent } from './types/content'

export interface Tool {
  description?: string
  execute?: (input: unknown) => Promise<string | ToolResultPartContent[]> | string | ToolResultPartContent[]
  inputSchema: Record<string, unknown>
  name: string
  outputSchema?: Record<string, unknown>
  // validate?: (input: unknown) => Promise<ToolValidateResult> | ToolValidateResult
}

export interface ToolOptions<TInput extends StandardJSONSchemaV1, TOutput extends StandardJSONSchemaV1 | undefined = undefined> {
  description?: string
  execute: (input: StandardSchemaV1.InferInput<TInput>) => TOutput extends StandardJSONSchemaV1
    ? Promise<StandardSchemaV1.InferInput<TOutput>> | StandardSchemaV1.InferInput<TOutput>
    : Promise<string | ToolResultPartContent[]> | string | ToolResultPartContent[]
  inputSchema: TInput
  name: string
  outputSchema?: TOutput
}

export const tool = <TInput extends StandardJSONSchemaV1, TOutput extends StandardJSONSchemaV1 | undefined = undefined>(options: ToolOptions<TInput, TOutput>): Tool => ({
  description: options.description,
  execute: options.execute != null
    ? async (input) => {
      // TODO: validate
      // eslint-disable-next-line ts/await-thenable
      const result = await options.execute(input)
      if (options.outputSchema) // TODO: validate
        return JSON.stringify(result)
      else
        return result as string | ToolResultPartContent[]
    }
    : undefined,
  inputSchema: options.inputSchema['~standard'].jsonSchema.input({ target: 'draft-07' }),
  name: options.name,
  outputSchema: options.outputSchema?.['~standard'].jsonSchema.input({ target: 'draft-07' }),
})
