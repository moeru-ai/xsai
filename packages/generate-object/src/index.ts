import type { GenerateTextOptions, GenerateTextResult } from '@xsai/generate-text'
import type { Infer, InferIn, Schema } from 'xsschema'

import { generateText } from '@xsai/generate-text'
import { toJSONSchema, validate } from 'xsschema'

export interface GenerateObjectOptions<T extends Schema> extends GenerateTextOptions {
  schema: T
  schemaDescription?: string
  schemaName?: string
}

export interface GenerateObjectResult<T extends Schema> extends Omit<GenerateTextResult, 'text'> {
  object: Infer<T>
}

/** @experimental WIP */
export const generateObject = async <T extends Schema>(options: GenerateObjectOptions<T>): Promise<GenerateObjectResult<T>> =>
  generateText({
    ...options,
    response_format: {
      json_schema: {
        description: options.schemaDescription,
        name: options.schemaName ?? 'json_schema',
        schema: await toJSONSchema(options.schema),
        strict: true,
      },
      type: 'json_schema',
    },
    schema: undefined,
    schemaDescription: undefined,
    schemaName: undefined,
  })
    .then(async ({ finishReason, messages, steps, text, toolCalls, toolResults, usage }) => {
      const object = await validate(options.schema, JSON.parse(text!) as InferIn<T>)

      return {
        finishReason,
        messages,
        object,
        steps,
        toolCalls,
        toolResults,
        usage,
      }
    })
