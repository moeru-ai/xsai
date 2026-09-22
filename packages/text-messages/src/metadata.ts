/** Anthropic Messages wire fields captured on content parts. */
export interface MessagesPartMetadata {
  signature?: string
}

declare module '@xsai/text-primitives' {
  interface ProviderPartMetadata {
    messages?: MessagesPartMetadata
  }
}
