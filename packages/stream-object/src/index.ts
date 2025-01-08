import type { PartialDeep } from 'type-fest'

import { type Infer, type Schema, toJSONSchema } from '@typeschema/main'
import { clean } from '@xsai/shared'
import { streamText, type StreamTextOptions, type StreamTextResult } from '@xsai/stream-text'
import { parse } from 'best-effort-json-parser'

export interface GenerateObjectOptions<T extends Schema> extends StreamTextOptions {
  schema: T
  schemaDescription?: string
  schemaName?: string
}

export interface GenerateObjectResult<T extends Schema> extends StreamTextResult {
  partialObjectStream: ReadableStream<PartialDeep<Infer<T>>>
}

/** @experimental WIP */
export const streamObject = async <T extends Schema>(options: GenerateObjectOptions<T>): Promise<GenerateObjectResult<T>> =>
  await streamText({
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
  }).then(({ chunkStream, finishReason, textStream: rawTextStream, usage }) => {
    const [textStream, rawPartialObjectStream] = rawTextStream.tee()

    let partialObjectData = ''
    let partialObject = {}
    const partialObjectStream = rawPartialObjectStream.pipeThrough(new TransformStream({
      transform: (chunk, controller) => {
        partialObjectData += chunk
        try {
          const data = parse(partialObjectData)

          if (JSON.stringify(partialObject) !== JSON.stringify(data)) {
            partialObject = data
            controller.enqueue(data)
          }
        }
        // TODO: maybe handle
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
