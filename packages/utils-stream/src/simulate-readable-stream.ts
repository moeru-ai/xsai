import { sleep } from './_sleep'

export interface SimulateReadableStreamOptions<T> {
  chunkDelay: number
  chunks: T[]
  initialDelay: number
}

/** @experimental */
export const simulateReadableStream = <T>({ chunkDelay, chunks, initialDelay }: SimulateReadableStreamOptions<T>) => new ReadableStream({
  pull: async (controller) => {
    for (const [index, chunk] of chunks.entries()) {
      await sleep(index === 0 ? initialDelay : chunkDelay)
      controller.enqueue(chunk)
    }
    controller.close()
  },
})
