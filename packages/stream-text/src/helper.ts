import type { StreamTextChunkResult } from './const'

/** @internal */
// eslint-disable-next-line @masknet/string-no-data-url
const CHUNK_HEADER_PREFIX = 'data:'

export const parseChunk = (text: string): [StreamTextChunkResult | undefined, boolean] | never => {
  if (!text || !text.startsWith(CHUNK_HEADER_PREFIX))
    return [undefined, false]

  // Extract content after "data:" prefix
  const content = text.slice(CHUNK_HEADER_PREFIX.length)
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
