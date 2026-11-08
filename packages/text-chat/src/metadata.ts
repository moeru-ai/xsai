import type { ChatReasoningDetail } from './types'

export interface ChatPartMetadata {
  /** Structured reasoning from OpenRouter-style wires, replayed unchanged. */
  reasoning_details?: ChatReasoningDetail[]
  /** Which assistant-message field carried reasoning on this wire. */
  reasoning_field?: 'reasoning' | 'reasoning_content'
}
