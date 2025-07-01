// License for this File only:
//
// Copyright Vercel, Inc. (https://vercel.com)
// Copyright Moeru AI (https://github.com/moeru-ai)
// SPDX-License-Identifier: Apache-2.0

import { sleep } from '@moeru/std/sleep'

export interface SimulateReadableStreamOptions<T> {
  chunkDelay: number
  chunks: T[]
  initialDelay: number
}

/** @experimental */
export const simulateReadableStream = <T>({ chunkDelay, chunks, initialDelay }: SimulateReadableStreamOptions<T>) => new ReadableStream<T>({
  pull: async (controller) => {
    for (const [index, chunk] of chunks.entries()) {
      await sleep(index === 0 ? initialDelay : chunkDelay)
      controller.enqueue(chunk)
    }
    controller.close()
  },
})
