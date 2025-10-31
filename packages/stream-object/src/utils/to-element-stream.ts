import type { PartialDeep } from 'type-fest/source/partial-deep'

import { parse } from 'best-effort-json-parser'

export const toElementStream = <T>(stream: ReadableStream<string>): ReadableStream<T> => {
  let partialObjectData = ''
  let index = 0

  return stream.pipeThrough(new TransformStream<string, T>({
    flush: (controller) => {
      const data = parse(partialObjectData) as PartialDeep<T>
      controller.enqueue((data as { elements: T[] }).elements.at(-1))
    },
    transform: (chunk, controller) => {
      partialObjectData += chunk
      try {
        const data = parse(partialObjectData) as PartialDeep<T>
        if (
          Array.isArray(Object.getOwnPropertyDescriptor(data, 'elements')?.value)
          && (data as { elements: T[] }).elements.length > index + 1
        ) {
          controller.enqueue((data as { elements: T[] }).elements[index++])
        }
      }
      catch {}
    },
  }))
}
