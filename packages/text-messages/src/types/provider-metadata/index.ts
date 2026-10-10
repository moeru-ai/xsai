export interface MessagesCitation {
  [key: string]: unknown
  type: string
}

export interface MessagesPartMetadata {
  // TODO: Move citations to a first-class TextPart field.
  citations?: MessagesCitation[]
  signature?: string
}
