export interface MessagesCitation {
  cited_text?: string
  document_index?: number
  document_title?: null | string
  encrypted_index?: string
  end_block_index?: number
  end_char_index?: number
  end_page_number?: number
  search_result_index?: number
  source?: string
  start_block_index?: number
  start_char_index?: number
  start_page_number?: number
  title?: string
  type: 'char_location' | 'content_block_location' | 'page_location' | 'search_result_location' | 'web_search_result_location'
  url?: string
}

/** Anthropic Messages wire fields captured on content parts. */
export interface MessagesPartMetadata {
  // TODO: Move citations to a first-class TextPart field.
  citations?: MessagesCitation[]
  signature?: string
}
