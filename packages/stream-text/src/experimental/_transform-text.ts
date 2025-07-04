import type { StreamTextChunkResult } from './_transform-chunk'

export const transformText = () => new TransformStream<StreamTextChunkResult, string>({
  transform: (chunk, controller) => controller.enqueue(chunk.choices[0].delta.content),
})
