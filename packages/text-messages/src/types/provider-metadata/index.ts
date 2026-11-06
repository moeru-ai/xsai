import type { MessagesCacheControl } from '../provider-options'

export interface MessagesCitation {
  [key: string]: unknown
  type: string
}

export interface MessagesPartMetadata {
  /** Places a cache breakpoint at the end of this text part. */
  cacheControl?: MessagesCacheControl
  // TODO: Move citations to a first-class TextPart field.
  citations?: MessagesCitation[]
  signature?: string
}
