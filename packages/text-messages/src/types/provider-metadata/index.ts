import type { WebSearchCitation } from '../index'

/** Anthropic Messages wire fields captured on content parts. */
export interface MessagesPartMetadata {
  // TODO: Move citations to a first-class text field.
  citations?: WebSearchCitation[]
  signature?: string
}
