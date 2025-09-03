import type { StreamTextOptions, StreamTextResult } from '@xsai/stream-text'
import type { PartialDeep } from 'type-fest'
import type { Infer, Schema } from 'xsschema'

import { streamText } from '@xsai/stream-text'
import { strictJsonSchema, toJsonSchema } from 'xsschema'

import { wrap } from '../../../generate-object/src/_wrap'
import { toElementStream } from './to-element-stream'
import { toPartialObjectStream } from './to-partial-object-stream'

export interface StreamObjectOnFinishResult<T extends Schema> {
  object?: Infer<T>
}

export interface StreamObjectOptions<T extends Schema> extends StreamTextOptions {
  schema: T
  schemaDescription?: string
  schemaName?: string
  /** @default true */
  strict?: boolean
}

export interface StreamObjectResult<T extends Schema> extends StreamTextResult {
  elementStream?: ReadableStream<Infer<T>>
  partialObjectStream?: ReadableStream<PartialDeep<Infer<T>>>
}

export async function streamObject<T extends Schema>(
  options: StreamObjectOptions<T>
    & { output: 'array' }
): Promise<StreamObjectResult<T> & { elementStream: ReadableStream<Infer<T>>, partialObjectStream: undefined }>
export async function streamObject<T extends Schema>(
  options: StreamObjectOptions<T>
    & { output: 'object' }
): Promise<StreamObjectResult<T> & { elementStream: undefined, partialObjectStream: ReadableStream<PartialDeep<Infer<T>>> }>
export async function streamObject<T extends Schema>(
  options: StreamObjectOptions<T>
): Promise<StreamObjectResult<T> & { elementStream: undefined, partialObjectStream: ReadableStream<PartialDeep<Infer<T>>> }>
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export async function streamObject<T extends Schema>(
  options: StreamObjectOptions<T>
    & { output?: 'array' | 'object' },
): Promise<StreamObjectResult<T>> {
  let schema = await toJsonSchema(options.schema)

  if (options.strict !== false)
    schema = strictJsonSchema(schema)

  if (options.output === 'array')
    schema = wrap(schema)

  let { textStream, ...rest } = streamText({
    ...options,
    response_format: {
      json_schema: {
        description: options.schemaDescription,
        name: options.schemaName ?? 'json_schema',
        schema,
        strict: options.strict ?? true,
      },
      type: 'json_schema',
    },
    schema: undefined,
    schemaDescription: undefined,
    schemaName: undefined,
    strict: undefined,
  })

  let elementStream: ReadableStream<Infer<T>> | undefined
  let partialObjectStream: ReadableStream<PartialDeep<Infer<T>>> | undefined

  if (options.output === 'array') {
    let rawElementStream;
    [rawElementStream, textStream] = textStream.tee()

    elementStream = toElementStream<Infer<T>>(rawElementStream)
  }
  else {
    let rawPartialObjectStream;
    [textStream, rawPartialObjectStream] = textStream.tee()

    partialObjectStream = toPartialObjectStream<Infer<T>>(rawPartialObjectStream)
  }

  return {
    elementStream,
    partialObjectStream,
    textStream,
    ...rest,
  }
}
