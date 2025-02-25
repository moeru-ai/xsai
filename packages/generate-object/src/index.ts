import type { GenerateTextOptions, GenerateTextResult } from '@xsai/generate-text'
import type { Infer, InferIn, Schema } from 'xsschema'

import { generateText } from '@xsai/generate-text'
import { toJSONSchema, validate } from 'xsschema'

import { wrap } from './wrap'

export interface GenerateObjectOptions<T extends Schema> extends GenerateTextOptions {
  schema: T
  schemaDescription?: string
  schemaName?: string
}

type GenerateResult<O> = GenerateTextResult & { object: O }

type OptionOutput = 'array' | 'object'

export async function generateObject<T extends Schema>(options: GenerateObjectOptions<T> & { output: 'array' }): Promise<GenerateResult<Array<Infer<T>>>>
export async function generateObject<T extends Schema>(options: GenerateObjectOptions<T> & { output: 'object' }): Promise<GenerateResult<Infer<T>>>
export async function generateObject<T extends Schema>(options: GenerateObjectOptions<T>): Promise<GenerateResult<Infer<T>>>
export async function generateObject<T extends Schema>(options: GenerateObjectOptions<T> & { output?: OptionOutput }) {
  const { schema: schemaValidator } = options

  let schema = await toJSONSchema(schemaValidator)
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
    const object = JSON.parse(text!) as Infer<T>

    if (options.output === 'array') {
      const elements = (object as { elements: Array<Infer<T>> }).elements
      for (const element of elements) {
        await validate(schemaValidator, element as InferIn<T>)
      }

      return {
        finishReason,
        messages,
        object: elements,
        steps,
        text,
        toolCalls,
        toolResults,
        usage,
      }
    }

    return {
      finishReason,
      messages,
      object,
      steps,
      text,
      toolCalls,
      toolResults,
      usage,
    }
  })
}
