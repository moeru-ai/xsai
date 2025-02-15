import type { StreamTextChunkResult } from './const'

import { chunkHeaderPrefix } from './const'

export const parseChunk = (text: string): [StreamTextChunkResult | undefined, boolean] | never => {
  if (!text || !text.startsWith(chunkHeaderPrefix))
    return [undefined, false]

  // Extract content after "data:" prefix
  const content = text.slice(chunkHeaderPrefix.length)
  // Remove leading single space if present
  const data = content.startsWith(' ') ? content.slice(1) : content

  // Handle special cases
  if (data === '[DONE]') {
    return [undefined, true]
  }

  // TODO: should we use JSON.parse?
  if (data.startsWith('{') && data.includes('"error":')) {
    throw new Error(`Error from server: ${data}`)
  }

  // Process normal chunk
  const chunk = JSON.parse(data) as StreamTextChunkResult

  return [chunk, false]
}
