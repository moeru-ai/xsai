export interface MessagesCitation {
  [key: string]: unknown
  type: string
}

/** Anthropic Messages wire fields captured on content parts. */
export interface MessagesPartMetadata {
  // TODO: Move citations to a first-class TextPart field.
  citations?: MessagesCitation[]
  signature?: string
}
