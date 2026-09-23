/** Chat Completions wire metadata captured on content parts. */
export interface ChatPartMetadata {
  /** Which assistant-message field carried reasoning on this wire. */
  reasoning_field?: 'reasoning' | 'reasoning_content'
}
