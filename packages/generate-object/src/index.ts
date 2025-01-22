import { type Infer, type Schema, toJSONSchema, validate } from '@typeschema/main'
import { generateText, type GenerateTextOptions, type GenerateTextResult } from '@xsai/generate-text'
import { clean } from '@xsai/shared'

export interface GenerateObjectOptions<T extends Schema> extends GenerateTextOptions {
  schema: T
  schemaDescription?: string
  schemaName?: string
}

// TODO: toolCalls, toolResults
export interface GenerateObjectResult<T extends Schema> extends Omit<GenerateTextResult, 'text' | 'toolCalls' | 'toolResults'> {
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
        schema: await toJSONSchema(options.schema)
          .then(json => clean({
            ...json,
            $schema: undefined,
          })),
        strict: true,
      },
      type: 'json_schema',
    },
    schema: undefined,
    schemaDescription: undefined,
    schemaName: undefined,
  })
    .then(async ({ finishReason, steps, text, usage }) => {
      const result = await validate(options.schema, JSON.parse(text!))

      if (result.success) {
        return {
          finishReason,
          object: result.data,
          steps,
          usage,
        }
      }
      else {
        throw new Error([
          'Schema validation failed:',
          ...result.issues.map(issue => `- ${issue.message}`),
        ].join('\n'))
      }
    })

export default generateObject
