import type { StreamTextOptions, StreamTextResult } from '@xsai/stream-text'
import type { PartialDeep } from 'type-fest'
import type { Infer, Schema } from 'xsschema'

import { streamText } from '@xsai/stream-text'
import { parse } from 'best-effort-json-parser'
import { toJSONSchema } from 'xsschema'

export interface StreamObjectOptions<T extends Schema> extends StreamTextOptions {
  schema: T
  schemaDescription?: string
  schemaName?: string
}

export interface StreamObjectResult<T extends Schema> extends StreamTextResult {
  partialObjectStream: ReadableStream<PartialDeep<Infer<T>>>
}

/** @experimental WIP */
export const streamObject = async <T extends Schema>(options: StreamObjectOptions<T>): Promise<StreamObjectResult<T>> =>
  streamText({
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
  }).then(({ chunkStream, finishReason, textStream: rawTextStream, usage }) => {
    const [textStream, rawPartialObjectStream] = rawTextStream.tee()

    let partialObjectData = ''
    let partialObjectSnapshot = {} as PartialDeep<Infer<T>>
    const partialObjectStream = rawPartialObjectStream.pipeThrough(new TransformStream({
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

    return {
      chunkStream,
      finishReason,
      partialObjectStream,
      textStream,
      usage,
    }
  })

export default streamObject
