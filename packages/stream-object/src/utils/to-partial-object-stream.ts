import type { PartialDeep } from 'type-fest'

import { parse } from 'best-effort-json-parser'

export const toPartialObjectStream = <T>(stream: ReadableStream<string>) => {
  let partialObjectData = ''
  let partialObjectSnapshot = {} as PartialDeep<T>

  return stream.pipeThrough(new TransformStream<string, PartialDeep<T>>({
    transform: (chunk, controller) => {
      partialObjectData += chunk
      try {
        const data = parse(partialObjectData) as PartialDeep<T>

        if (JSON.stringify(partialObjectSnapshot) !== JSON.stringify(data)) {
          partialObjectSnapshot = data
          controller.enqueue(data)
        }
      }
      catch {}
    },
  }))
}
