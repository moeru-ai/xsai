import type { StreamTextOptions, StreamTextResult } from '@xsai/stream-text'
import type { PartialDeep } from 'type-fest'
import type { Infer, Schema } from 'xsschema'

import { streamText } from '@xsai/stream-text'
import { parse } from 'best-effort-json-parser'
import { strictJsonSchema, toJsonSchema } from 'xsschema'

import { wrap } from '../../generate-object/src/_wrap'

export interface StreamObjectOnFinishResult<T extends Schema> {
  object?: Infer<T>
}

export interface StreamObjectOptions<T extends Schema> extends StreamTextOptions {
  schema: T
  schemaDescription?: string
  schemaName?: string
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
  const { schema: schemaValidator } = options

  let schema = await toJsonSchema(schemaValidator)
    .then(schema => strictJsonSchema(schema))

  if (options.output === 'array')
    schema = wrap(schema)

  return streamText({
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
    schema: undefined,
    schemaDescription: undefined,
    schemaName: undefined,
  }).then(({ chunkStream, stepStream, textStream }) => {
    let elementStream: ReadableStream<Infer<T>> | undefined
    let partialObjectStream: ReadableStream<PartialDeep<Infer<T>>> | undefined
    let index = 0

    if (options.output === 'array') {
      let rawElementStream
      ;[rawElementStream, textStream] = textStream.tee()

      let partialData = ''
      elementStream = rawElementStream.pipeThrough(new TransformStream({
        flush: (controller) => {
          const data = parse(partialData) as PartialDeep<Infer<T>>
          controller.enqueue((data as { elements: Infer<T>[] }).elements.at(-1))
        },
        transform: (chunk, controller) => {
          partialData += chunk
          try {
            const data = parse(partialData) as PartialDeep<Infer<T>>
            if (
              Array.isArray(Object.getOwnPropertyDescriptor(data, 'elements')?.value)
              && (data as { elements: Infer<T>[] }).elements.length > index + 1
            ) {
              controller.enqueue((data as { elements: Infer<T>[] }).elements[index++])
            }
          }
          catch {}
        },
      }))
    }
    else {
      let rawPartialObjectStream
      ;[textStream, rawPartialObjectStream] = textStream.tee()

      let partialObjectData = ''
      let partialObjectSnapshot = {} as PartialDeep<Infer<T>>
      partialObjectStream = rawPartialObjectStream.pipeThrough(new TransformStream({
        transform: (chunk, controller) => {
          partialObjectData += chunk
          try {
            const data = parse(partialObjectData) as PartialDeep<Infer<T>>

            if (JSON.stringify(partialObjectSnapshot) !== JSON.stringify(data)) {
              partialObjectSnapshot = data
              controller.enqueue(data)
            }
          }
          catch {}
        },
      }))
    }

    return {
      chunkStream,
      elementStream,
      partialObjectStream,
      stepStream,
      textStream,
    }
  })
}
