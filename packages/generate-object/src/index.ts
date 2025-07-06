import type { GenerateTextOptions, GenerateTextResult } from '@xsai/generate-text'
import type { Infer, InferIn, Schema } from 'xsschema'

import { generateText } from '@xsai/generate-text'
import { toJsonSchema, validate } from 'xsschema'

import { wrap } from './_wrap'

export interface GenerateObjectOptions<T extends Schema> extends GenerateTextOptions {
  schema: T
  schemaDescription?: string
  schemaName?: string
}

export type GenerateObjectResult<O> = GenerateTextResult & { object: O }

type GenerateObjectOutputOption = 'array' | 'object'

export async function generateObject<T extends Schema>(options: GenerateObjectOptions<T> & { output: 'array' }): Promise<GenerateObjectResult<Array<Infer<T>>>>
export async function generateObject<T extends Schema>(options: GenerateObjectOptions<T> & { output: 'object' }): Promise<GenerateObjectResult<Infer<T>>>
export async function generateObject<T extends Schema>(options: GenerateObjectOptions<T>): Promise<GenerateObjectResult<Infer<T>>>
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export async function generateObject<T extends Schema>(options: GenerateObjectOptions<T> & { output?: GenerateObjectOutputOption }) {
  const { schema: schemaValidator } = options

  let schema = await toJsonSchema(schemaValidator)
  if (options.output === 'array')
    schema = wrap(schema)

  return generateText({
    ...options,
    response_format: {
      json_schema: {
        description: options.schemaDescription,
        name: options.schemaName ?? 'json_schema',
        schema,
        strict: true,
      },
      type: 'json_schema',
    },
    schema: undefined, // Remove schema from options
    schemaDescription: undefined, // Remove schemaDescription from options
    schemaName: undefined, // Remove schemaName from options
  }).then(async ({ finishReason, messages, steps, text, toolCalls, toolResults, usage }) => {
    const json: unknown = JSON.parse(text!)

    if (options.output === 'array') {
      return {
        finishReason,
        messages,
        object: await Promise.all((json as { elements: InferIn<T>[] })
          .elements
          .map(async element => validate(schemaValidator, element))),
        steps,
        text,
        toolCalls,
        toolResults,
        usage,
      }
    }
    else {
      return {
        finishReason,
        messages,
        object: await validate(options.schema, json as InferIn<T>),
        steps,
        text,
        toolCalls,
        toolResults,
        usage,
      }
    }
  })
}
